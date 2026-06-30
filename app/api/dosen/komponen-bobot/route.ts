// app/api/dosen/komponen-bobot/route.ts
//
// PATCH /api/dosen/komponen-bobot
// Update bobot_terhadap_mk satu atau beberapa komponen_nilai sekaligus.
// Hanya dosen pengampu kelas (koordinator/anggota) yang boleh update.
//
// Body: { id_kelas: number, bobotList: Array<{ id_komponen: number; bobot: number }> }

import { NextRequest, NextResponse } from 'next/server'
import { requireRole, handleAuthError, serverError } from '@/app/lib/auth'
import { createSupabaseAdminClient } from '@/app/lib/supabase/admin'

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(req, ['dosen'])
    if (!user.id_staff) {
      return NextResponse.json(
        { success: false, error: 'INVALID_SESSION', message: 'Sesi dosen tidak memiliki id_staff.' },
        { status: 401 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const idKelas = Number(body.id_kelas)
    const bobotList = body.bobotList as Array<{ id_komponen: number; bobot: number }> | undefined

    if (!Number.isInteger(idKelas) || idKelas <= 0) {
      return NextResponse.json(
        { success: false, error: 'BAD_REQUEST', message: 'id_kelas tidak valid.' },
        { status: 400 },
      )
    }
    if (!Array.isArray(bobotList) || bobotList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'BAD_REQUEST', message: 'bobotList harus array berisi minimal 1 item.' },
        { status: 400 },
      )
    }

    // Validasi nilai bobot (0–100 masing-masing, total 0–100)
    for (const item of bobotList) {
      if (!Number.isInteger(item.id_komponen) || item.id_komponen <= 0) {
        return NextResponse.json(
          { success: false, error: 'BAD_REQUEST', message: `id_komponen ${item.id_komponen} tidak valid.` },
          { status: 400 },
        )
      }
      if (typeof item.bobot !== 'number' || item.bobot < 0 || item.bobot > 100) {
        return NextResponse.json(
          { success: false, error: 'BAD_REQUEST', message: `Bobot untuk komponen ${item.id_komponen} harus 0–100.` },
          { status: 400 },
        )
      }
    }
    const totalBobot = bobotList.reduce((s, i) => s + i.bobot, 0)
    if (Math.abs(totalBobot - 100) > 0.1) {
      return NextResponse.json(
        {
          success: false,
          error: 'BAD_REQUEST',
          message: `Total bobot semua komponen harus 100% (sekarang ${totalBobot.toFixed(1)}%).`,
        },
        { status: 400 },
      )
    }

    const admin = createSupabaseAdminClient()

    // Verifikasi dosen adalah pengampu kelas ini
    const { data: ownership } = await admin
      .from('mapping_dosen_kelas')
      .select('id_staff')
      .eq('id_kelas', idKelas)
      .eq('id_staff', user.id_staff)
      .maybeSingle()
    if (!ownership) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Anda tidak terdaftar sebagai pengampu kelas ini.' },
        { status: 403 },
      )
    }

    // Ambil id_mata_kuliah kelas untuk verifikasi komponen milik MK yang benar
    const { data: kelasInfo } = await admin
      .from('kelas_mk')
      .select('id_mata_kuliah')
      .eq('id_kelas', idKelas)
      .maybeSingle<{ id_mata_kuliah: number }>()
    if (!kelasInfo) {
      return NextResponse.json(
        { success: false, error: 'NOT_FOUND', message: 'Kelas tidak ditemukan.' },
        { status: 404 },
      )
    }

    // Verifikasi semua id_komponen benar-benar milik MK ini
    const idKomponenList = bobotList.map((i) => i.id_komponen)
    const { data: komponenRows } = await admin
      .from('komponen_nilai')
      .select('id_komponen')
      .eq('id_mata_kuliah', kelasInfo.id_mata_kuliah)
      .in('id_komponen', idKomponenList)
    const validIds = new Set((komponenRows ?? []).map((k: { id_komponen: number }) => k.id_komponen))
    const invalidIds = idKomponenList.filter((id) => !validIds.has(id))
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'BAD_REQUEST',
          message: `Komponen ${invalidIds.join(', ')} tidak ditemukan di mata kuliah ini.`,
        },
        { status: 400 },
      )
    }

    // Update bobot satu per satu
    for (const item of bobotList) {
      const { error: updErr } = await admin
        .from('komponen_nilai')
        .update({ bobot_terhadap_mk: item.bobot })
        .eq('id_komponen', item.id_komponen)
      if (updErr) throw updErr
    }

    return NextResponse.json({
      success: true,
      message: `Bobot ${bobotList.length} komponen berhasil diperbarui.`,
    })
  } catch (err) {
    const authRes = handleAuthError(err)
    if (authRes) return authRes
    console.error('[PATCH /api/dosen/komponen-bobot]', err)
    return serverError('Gagal memperbarui bobot komponen.')
  }
}
