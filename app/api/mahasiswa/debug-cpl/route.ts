// app/api/mahasiswa/debug-cpl/route.ts
// TEMPORARY — endpoint diagnostik untuk mengecek data CPL di database.
// Hapus file ini setelah selesai debugging.

import { NextRequest, NextResponse } from 'next/server'
import { requireRole, handleAuthError } from '@/app/lib/auth'
import { createSupabaseAdminClient } from '@/app/lib/supabase/admin'
import { resolveKurikulumId } from '@/app/lib/kurikulum'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, ['mahasiswa'])
    const idMahasiswa = session.id_mahasiswa
    if (!idMahasiswa) {
      return NextResponse.json({ error: 'no id_mahasiswa in session' }, { status: 400 })
    }

    const admin = createSupabaseAdminClient()

    // 1. Data mahasiswa
    const { data: mhs } = await admin
      .from('mahasiswa')
      .select('id_mahasiswa, nim, nama_mahasiswa, angkatan')
      .eq('id_mahasiswa', idMahasiswa)
      .maybeSingle()

    // 2. Kurikulum
    const idKurikulum = await resolveKurikulumId(admin, mhs?.angkatan ?? null)
    const { data: kurikulumList } = await admin
      .from('kurikulum')
      .select('id_kurikulum, tahun_mulai, tahun_selesai, is_active')

    // 3. CPL rows
    const { data: cplRows, error: cplErr } = idKurikulum
      ? await admin
          .from('cpl')
          .select('id_cpl, kode_cpl, target_minimal')
          .eq('id_kurikulum', idKurikulum)
          .order('urutan')
      : { data: [], error: null }

    const cplIds = (cplRows ?? []).map((c: { id_cpl: number }) => c.id_cpl)

    // 4. Nilai CPL dari view
    const { data: nilaiCplRows, error: nilaiCplErr } = cplIds.length
      ? await admin
          .from('v_nilai_cpl_per_mhs')
          .select('id_cpl, nilai_cpl')
          .eq('id_mahasiswa', idMahasiswa)
          .in('id_cpl', cplIds)
      : { data: [], error: null }

    // 5. IK mapping
    const { data: ikRows } = cplIds.length
      ? await admin
          .from('mapping_ik_cpl')
          .select('id_ik, id_cpl, bobot_persen')
          .in('id_cpl', cplIds)
      : { data: [] }

    const ikIds = (ikRows ?? []).map((r: { id_ik: number }) => r.id_ik)

    // 6. Nilai IK dari view
    const { data: nilaiIkRows, error: nilaiIkErr } = ikIds.length
      ? await admin
          .from('v_nilai_ik_per_mhs')
          .select('id_ik, nilai_ik')
          .eq('id_mahasiswa', idMahasiswa)
          .in('id_ik', ikIds)
      : { data: [], error: null }

    // 7. CPMK mapping
    const { data: cpmkRows } = ikIds.length
      ? await admin
          .from('mapping_cpmk_ik')
          .select('id_cpmk, id_ik, bobot_persen')
          .in('id_ik', ikIds)
      : { data: [] }

    const cpmkIds = (cpmkRows ?? []).map((r: { id_cpmk: number }) => r.id_cpmk)

    // 8. Nilai CPMK dari view
    const { data: nilaiCpmkRows, error: nilaiCpmkErr } = cpmkIds.length
      ? await admin
          .from('v_nilai_cpmk_per_mhs')
          .select('id_cpmk, nilai_cpmk')
          .eq('id_mahasiswa', idMahasiswa)
          .in('id_cpmk', cpmkIds)
      : { data: [], error: null }

    // 9. Nilai detail mentah
    const { data: nilaiDetailRows, error: nilaiDetailErr } = await admin
      .from('nilai_detail')
      .select('id_nilai, id_mahasiswa, id_komponen, nilai_asli, nilai_remedi')
      .eq('id_mahasiswa', idMahasiswa)
      .limit(10)

    // 10. Tahun akademik aktif
    const { data: taAktif } = await admin
      .from('tahun_akademik')
      .select('id_tahun_akademik, kode, tahun_mulai, semester, is_active')
      .eq('is_active', true)
      .maybeSingle()

    return NextResponse.json({
      session: { id_mahasiswa: idMahasiswa, id_user: session.id_user, role: session.role },
      mahasiswa: mhs,
      kurikulum: { resolved_id: idKurikulum, all: kurikulumList },
      tahun_akademik_aktif: taAktif,
      cpl: { count: cplRows?.length ?? 0, rows: cplRows, error: cplErr?.message },
      nilai_cpl_view: { count: nilaiCplRows?.length ?? 0, rows: nilaiCplRows, error: nilaiCplErr?.message },
      ik_mapping: { count: ikRows?.length ?? 0 },
      nilai_ik_view: { count: nilaiIkRows?.length ?? 0, rows: nilaiIkRows, error: nilaiIkErr?.message },
      cpmk_mapping: { count: cpmkRows?.length ?? 0 },
      nilai_cpmk_view: { count: nilaiCpmkRows?.length ?? 0, rows: nilaiCpmkRows, error: nilaiCpmkErr?.message },
      nilai_detail_raw: { count: nilaiDetailRows?.length ?? 0, sample: nilaiDetailRows, error: nilaiDetailErr?.message },
      diagnosis: {
        has_mahasiswa: !!mhs,
        has_angkatan: !!mhs?.angkatan,
        has_kurikulum: !!idKurikulum,
        has_cpl_rows: (cplRows?.length ?? 0) > 0,
        has_nilai_cpl: (nilaiCplRows?.length ?? 0) > 0,
        has_nilai_cpmk: (nilaiCpmkRows?.length ?? 0) > 0,
        has_nilai_detail: (nilaiDetailRows?.length ?? 0) > 0,
        likely_cause:
          !mhs ? 'mahasiswa tidak ditemukan di tabel mahasiswa' :
          !mhs.angkatan ? 'kolom angkatan NULL di tabel mahasiswa' :
          !idKurikulum ? 'kurikulum tidak ditemukan untuk angkatan ini' :
          (cplRows?.length ?? 0) === 0 ? 'tidak ada CPL di tabel cpl untuk kurikulum ini' :
          (nilaiCplRows?.length ?? 0) === 0 && (nilaiDetailRows?.length ?? 0) === 0 ? 'belum ada data nilai_detail untuk mahasiswa ini' :
          (nilaiCplRows?.length ?? 0) === 0 ? 'nilai_detail ada tapi view v_nilai_cpl_per_mhs kosong — cek migration/view definition' :
          'data ada, periksa logika kalkulasi',
      },
    })
  } catch (err) {
    const authRes = handleAuthError(err)
    if (authRes) return authRes
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
