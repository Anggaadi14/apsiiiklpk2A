<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- commit 2: feat: setup Supabase client dan konfigurasi database awal -->

<!-- commit 3: feat: tambah struktur tabel SQL - users, mahasiswa, dosen -->

<!-- commit 4: feat: implementasi autentikasi login dengan JWT -->

<!-- commit 5: feat: buat halaman login dengan validasi form -->

<!-- commit 6: feat: setup middleware autentikasi dan proteksi route -->

<!-- commit 7: fix: perbaiki konfigurasi next.config.ts untuk environment variables -->

<!-- commit 8: feat: buat layout dashboard dengan Sidebar dan Navbar -->

<!-- commit 9: feat: implementasi halaman signup mahasiswa -->

<!-- commit 10: feat: tambah API endpoint auth/login dan auth/me -->

<!-- commit 11: feat: setup role-based access control (admin, dosen, mahasiswa, kaprodi) -->

<!-- commit 12: refactor: restrukturisasi folder API berdasarkan role -->

<!-- commit 13: feat: tambah Google OAuth provider -->

<!-- commit 14: fix: perbaiki redirect setelah login berdasarkan role user -->

<!-- commit 15: feat: buat dashboard admin - tampilan statistik utama -->

<!-- commit 16: feat: API admin/dashboard-stats untuk data ringkasan -->

<!-- commit 17: feat: implementasi CRUD mata kuliah (matkul) -->

<!-- commit 18: feat: implementasi CRUD kelas dan pengelolaan dosen pengampu -->

<!-- commit 19: feat: buat halaman manajemen CPL (Capaian Pembelajaran Lulusan) -->

<!-- commit 20: feat: API endpoint CRUD untuk CPL dengan validasi -->

<!-- commit 21: feat: implementasi CRUD CPMK (Capaian Pembelajaran Mata Kuliah) -->

<!-- commit 22: feat: mapping CPMK ke CPL di halaman admin -->

<!-- commit 23: feat: tambah IK (Indikator Kinerja) dan bobot IK-CPL -->

<!-- commit 24: feat: halaman kurikulum admin dengan CRUD kurikulum -->

<!-- commit 25: feat: import data mahasiswa via Excel dengan validasi -->

<!-- commit 26: feat: import data dosen via Excel -->

<!-- commit 27: feat: import master data CPMK dari file Excel -->

<!-- commit 28: fix: perbaiki parsing Excel untuk format SIAKAD -->

<!-- commit 29: feat: dashboard dosen - tampilan kelas yang diampu -->

<!-- commit 30: feat: API dosen/kelas untuk mengambil data kelas dosen -->

<!-- commit 31: feat: halaman input nilai mahasiswa per kelas -->

<!-- commit 32: feat: implementasi kalkulasi nilai akhir berdasarkan bobot asesmen -->

<!-- commit 33: feat: grading system - kalkulasi pencapaian CPMK -->

<!-- commit 34: feat: API endpoint dosen untuk input dan update nilai -->

<!-- commit 35: feat: dashboard mahasiswa - tampilan nilai dan status CPMK -->

<!-- commit 36: feat: halaman transkrip mahasiswa dengan detail per matkul -->

<!-- commit 37: feat: API transkrip - generate data capaian per mahasiswa -->

<!-- commit 38: feat: dashboard kaprodi - rekap pencapaian CPL per angkatan -->

<!-- commit 39: feat: visualisasi grafik pencapaian CPL di dashboard kaprodi -->

<!-- commit 40: feat: API kaprodi untuk agregasi data OBE lintas angkatan -->

<!-- commit 41: refactor: pisahkan logika OBE ke lib/obeDashboard.ts -->

<!-- commit 42: feat: notifikasi dosen pengampu saat ada perubahan data nilai -->

<!-- commit 43: feat: halaman change-password dengan validasi password lama -->

<!-- commit 44: feat: halaman profile user - edit data pribadi -->

<!-- commit 45: feat: admin dashboard activity log - riwayat aktivitas sistem -->

<!-- commit 46: fix: perbaiki kalkulasi bobot CPL ketika ada CPMK yang belum dinilai -->

<!-- commit 47: feat: implementasi mapping asesmen ke CPMK -->

<!-- commit 48: feat: API mapping-asesmen-cpmk untuk konfigurasi penilaian -->

<!-- commit 49: fix: bug pada import Excel ketika ada baris kosong di tengah data -->

<!-- commit 50: feat: manajemen tahun akademik di panel admin -->

<!-- commit 51: feat: filter data berdasarkan tahun akademik aktif -->

<!-- commit 52: refactor: optimasi query database dengan join yang lebih efisien -->

<!-- commit 53: feat: admin reset password user dengan generate password otomatis -->

<!-- commit 54: feat: seed helper untuk data dummy testing -->

<!-- commit 55: fix: perbaiki middleware untuk handle token expired dengan benar -->

<!-- commit 56: feat: export data nilai mahasiswa ke format Excel -->

<!-- commit 57: feat: halaman verifikasi email mahasiswa baru -->

<!-- commit 58: fix: perbaiki tampilan responsive sidebar di mobile -->

<!-- commit 59: feat: API health check endpoint untuk monitoring -->

<!-- commit 60: refactor: pindahkan konfigurasi Supabase ke lib/supabase/ -->

<!-- commit 61: fix: perbaiki validasi NIM mahasiswa saat signup -->

<!-- commit 62: feat: complete-mahasiswa API untuk melengkapi profil setelah Google OAuth -->

<!-- commit 63: feat: JAMU role dashboard untuk monitoring dan approval -->

<!-- commit 64: feat: mapping CPL ke kurikulum dengan bobot per matkul -->

<!-- commit 65: fix: perbaiki kalkulasi IPK di halaman transkrip mahasiswa -->

<!-- commit 66: feat: tambah pagination pada tabel mahasiswa dan dosen di admin -->

<!-- commit 67: refactor: cleanup unused imports dan dead code di seluruh komponen -->

<!-- commit 68: fix: perbaiki race condition pada concurrent nilai submission -->

<!-- commit 69: feat: finalisasi dokumentasi API dan README project -->

<!-- commit 70: chore: final cleanup, update .gitignore dan package.json scripts -->
