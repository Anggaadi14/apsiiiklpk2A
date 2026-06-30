-- ============================================================================
-- MIGRATION 012 - Fix bobot_persen = 0 di mapping_media_cpmk
--
-- Masalah: semua baris di mapping_media_cpmk punya bobot_persen = 0
-- karena kode lama hardcode bobot_persen: 0 saat insert.
--
-- Fix: set bobot_persen = 100 untuk semua baris yang masih 0.
-- Reasoning: dalam model OBE ini, tiap CPMK umumnya diukur oleh
-- 1 komponen saja (UK1 atau UK2), sehingga bobot = 100% adalah benar.
-- Jika 1 CPMK diukur oleh >1 komponen, admin perlu update manual.
-- ============================================================================

UPDATE mapping_media_cpmk
SET bobot_persen = 100
WHERE bobot_persen = 0;
