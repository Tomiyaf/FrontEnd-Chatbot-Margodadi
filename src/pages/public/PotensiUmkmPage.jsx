import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const umkmData = [
  {
    id: 'kopi-supardi',
    name: 'Kopi Robusta Lereng Margodadi',
    subTitle: 'Usaha Pengolahan Kopi Rakyat Berkelanjutan Sejak 2017',
    regNumber: 'MKD-UMKM-001',
    category: ['pertanian', 'kuliner'],
    categoryBadge: 'Pertanian & Kuliner',
    owner: 'Bapak Supardi',
    phone: '0812-7890-1234',
    waNumber: '6281278901234',
    address: 'Dusun 02 RT 04, Pekon Margodadi',
    description:
      'Biji kopi robusta petik merah asli lereng perkebunan Margodadi, diproses natural dan honey process dengan aroma cokelat karamel khas pegunungan Tanggamus.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvgNR0og9Y-3RyovTKv9qZJqGfZ3iHvvTo4DycV3xkmNfOdqokFqco3tSlqfRtExPG2Lq30TEYCe0jy3AEE8HzMgw-E2z-Pso3Q2fn4Wy_WNurNc3r5CCpVfYa5v_ypkYE3oPq3gOaizZfVS8AVgabm3zoZyDDgfJX-xC2wI771ciBw3JBxhG4fz_s5uJgb0-FJjoKF1l_xDYdj2QfkBp1_arMGQYRZgROBMK0vpHh4AyL8ITsVLE',
    featuredProducts: [
      { name: 'Kopi Bubuk 250gr', price: 'Rp 35.000' },
      { name: 'Roasted Beans 500gr', price: 'Rp 65.000' },
      { name: 'Green Bean Grade 1 1kg', price: 'Rp 85.000' },
    ],
    history:
      "Berawal dari tradisi turun-temurun mengelola kebun kopi seluas 2,5 hektar di lereng perbukitan Tanggamus, Bapak Supardi merintis 'Kopi Robusta Lereng Margodadi' guna memutus ketergantungan tengkulak mentah. Dengan menerapkan sistem petik merah selektif 100%, biji kopi dijemur di atas raised bed berventilasi untuk menghasilkan rasa manis alami (honey note) yang tebal dan aftertaste cokelat murni tanpa cacat rasa.",
    legalCertification: 'P-IRT Dinas Kesehatan',
    legalNumber: 'No. 2101806010042-26',
    capacity: '400 kg/bln',
    capacityNote: 'Petik Merah Optimal',
    group: 'Gapoktan Pekon',
    groupLocation: 'Sumberejo, Tanggamus',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9WqiAEU2zS254PJ3sD6IFlayETpaX1n7QRhEgYbK0-ZkYl_zZJPS3r30nXee8I7bogwxUpQwDmGb7Bi3M4K8vhR-wpkdnuph9BVCedZJmD7BfKRKDRQi_C5lj8V1FL9GAqIYtpwF3njqT9yMo2yygizaQYvMYjgbhSdalGQo42pNAAXUUbAFXOdErGUqL0VkQy6fNP4baL2Q7RwmG0MUpPLDYWXFPk_ErxFfFfcxEMdtZ-YvFoVk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhdw3VbnsfX2tjyMXCpDPiUJOzz8-sMCp8Tlg_Lvu9f2J5giipVSdsln2mnejpj-VKZmOv-4tuXxpm0Hy-ToohNvNHHo0AmF8Xj9egnae1eBmYuC6-WmVdJaXTYrq5Uua3afIWO16sZzU21AK8NS7VIGBoQm6cUp9HSRJCDeVt2UIYlGX3WGhlcZL9TpK-WZG4U8FeteSYmLfXc2TH2kEnPYUC6Ywx85XnZn30KBwIqvgSrXAaNhs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6EidJ3qiF1gOITZ81MJLN8WfvzIX8geN4PNXZfB9RDmZtSsplFy0VbPa1n1fMw53twBqBShp-5Mkoz2AMFauI70wWpBOv4povv1AzqDhJaszD8SDVRx5xJI2R8-QyC46a3DOlQjWQ4ZKUOon20Z_shfccUeyOcUK-30unqhSNwqdUnDcITKIq4uYXTBZz-CIwGMWcbJ9wuqhe5H05IAhZrjEEMwfmGbIYL4KF2i_QDONn4nS_LA',
    ],
    mapTitle: 'Rumah Produksi Kopi Pak Supardi',
    mapAddress: 'Dusun 02 RT 04, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '12 Januari 2025',
  },
  {
    id: 'anyaman-lestari',
    name: 'Anyaman Bambu Lestari',
    subTitle: 'Sentra Kerajinan Ramah Lingkungan & Pemberdayaan Perempuan',
    regNumber: 'MKD-UMKM-002',
    category: ['kerajinan'],
    categoryBadge: 'Kerajinan & Kriya',
    owner: 'Ibu Sri Utami',
    phone: '0853-2211-4321',
    waNumber: '6285322114321',
    address: 'Dusun 01 RT 02, Pekon Margodadi',
    description:
      'Produk kerajinan tangan ramah lingkungan dari bambu apus lokal. Halus, tahan rayap, dan cocok untuk cinderamata hajatan serta suvenir khas desa.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD68MzkIwpsjk6UuMIY8PZXKmHatTFVp0ws1f2qKgYeWTmmkQfIJFf1ZiPoBTlr0yW5cphvKztaMsTdz4md7CpMZW0znmCOLranNCnsjDe7VNyyD73sbjw72IPRb-_Qypu6H0Le3kVIJZzbnbb_AeUFkPoY4hs058jvfHQrehfQ7t4-g4cP_53VLF1qOzIPrcFugYvnwglZ4nLtv2Ukb5OPPXyHPV5Fsu83ISw0dKwv-MbhzAL97Xw',
    featuredProducts: [
      { name: 'Besek Bambu', price: 'Rp 8.000' },
      { name: 'Tudung Saji Etnik', price: 'Rp 45.000' },
      { name: 'Tas Anyam', price: 'Rp 30.000' },
    ],
    history:
      'Kelompok pengrajin anyaman bambu yang dibina untuk memberdayakan ibu-ibu rumah tangga Dusun 01 Pekon Margodadi. Memanfaatkan rumpun bambu apus lokal dengan proses pengawetan tradisional asap alami tanpa bahan kimia berbahaya sehingga ramah lingkungan dan tahan lama puluhan tahun.',
    legalCertification: 'SKU & NIB Terdaftar',
    legalNumber: 'No. NIB-0819230018821',
    capacity: '300 pcs/bln',
    capacityNote: 'Anyaman Halus Handmade',
    group: 'KWT Anyam Lestari',
    groupLocation: 'Dusun 01, Margodadi',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD68MzkIwpsjk6UuMIY8PZXKmHatTFVp0ws1f2qKgYeWTmmkQfIJFf1ZiPoBTlr0yW5cphvKztaMsTdz4md7CpMZW0znmCOLranNCnsjDe7VNyyD73sbjw72IPRb-_Qypu6H0Le3kVIJZzbnbb_AeUFkPoY4hs058jvfHQrehfQ7t4-g4cP_53VLF1qOzIPrcFugYvnwglZ4nLtv2Ukb5OPPXyHPV5Fsu83ISw0dKwv-MbhzAL97Xw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCc4ChZXPKMb8wcwRXMZYqTwUvOqunj4WKT87DmofCm8iluO7NtLme6d4UN4pIrm0C4ut25hfreJflFdO-BsQyrZjHsMgwInwqxkTzCt4nGVJKBB3WtV4IBPyXIF17rPAIp1Y_9W1teYjlr_Gw21WObIrxF-3na-R-OAX058ITD_6SprbUQL9swoqgp3WbczTVBiJrgEWKXOak5VCcuCItLAFJEtY3WgPyhS-5helc3SBewxC6dKiA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLin53tuR6zxbtcY2W4MKlK2qiI0WDTU5ZklX2fiDsWm6VwgSn4Lm1NVt3BGTmbO9fgt6vytiFvng4SM4v44fcH4Yw0sgXzcYoLXfDw0O-rzoaCYBCFFqLq2Y_hLklYUvbwLe43oG3anKbbiA7ganKdP4H_LugqUoxRyrsfrFGcBLkwTmiXt5tNXyNAzIVeurULL2z7ziHq08bw8ucURqZdRbRFRT6XKLmEyBU4xpFYMxuiQT_PMg',
    ],
    mapTitle: 'Workshop Kriya Anyaman Bambu Lestari',
    mapAddress: 'Dusun 01 RT 02, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '15 Januari 2025',
  },
  {
    id: 'keripik-barokah',
    name: 'Keripik Pisang Tanduk "Barokah Rasa"',
    subTitle: 'Oleh-oleh Gurih & Manis Renyah Khas Perkebunan Margodadi',
    regNumber: 'MKD-UMKM-003',
    category: ['kuliner'],
    categoryBadge: 'Kuliner & Olahan',
    owner: 'Ibu Siti Rahayu',
    phone: '0821-9988-7766',
    waNumber: '6282199887766',
    address: 'Dusun 03 RT 06, Pekon Margodadi',
    description:
      'Oleh-oleh khas Lampung dari pisang tanduk kebun petani binaan. Renyah tanpa pengawet dengan baluran cokelat pekat dan racikan bumbu gurih.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLin53tuR6zxbtcY2W4MKlK2qiI0WDTU5ZklX2fiDsWm6VwgSn4Lm1NVt3BGTmbO9fgt6vytiFvng4SM4v44fcH4Yw0sgXzcYoLXfDw0O-rzoaCYBCFFqLq2Y_hLklYUvbwLe43oG3anKbbiA7ganKdP4H_LugqUoxRyrsfrFGcBLkwTmiXt5tNXyNAzIVeurULL2z7ziHq08bw8ucURqZdRbRFRT6XKLmEyBU4xpFYMxuiQT_PMg',
    featuredProducts: [
      { name: 'Cokelat Lumer 200g', price: 'Rp 18.000' },
      { name: 'Manis Gurih 200g', price: 'Rp 15.000' },
      { name: 'Balado Pedas Manis 200g', price: 'Rp 16.000' },
    ],
    history:
      'Mengolah komoditas pisang tanduk lokal yang melimpah di kebun pekon menjadi aneka camilan bernilai tambah tinggi. Melalui proses penggorengan minyak kelapa berkualitas dan pengeringan sentrifugal (spinner), keripik tetap renyah hingga 6 bulan tanpa bahan kimia pengawet.',
    legalCertification: 'P-IRT & Halal Kemenag',
    legalNumber: 'ID18110002981023',
    capacity: '600 pouch/bln',
    capacityNote: 'Kemasan Zipper Stand Pouch',
    group: 'Koperasi Warga Margodadi',
    groupLocation: 'Dusun 03, Margodadi',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLin53tuR6zxbtcY2W4MKlK2qiI0WDTU5ZklX2fiDsWm6VwgSn4Lm1NVt3BGTmbO9fgt6vytiFvng4SM4v44fcH4Yw0sgXzcYoLXfDw0O-rzoaCYBCFFqLq2Y_hLklYUvbwLe43oG3anKbbiA7ganKdP4H_LugqUoxRyrsfrFGcBLkwTmiXt5tNXyNAzIVeurULL2z7ziHq08bw8ucURqZdRbRFRT6XKLmEyBU4xpFYMxuiQT_PMg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvgNR0og9Y-3RyovTKv9qZJqGfZ3iHvvTo4DycV3xkmNfOdqokFqco3tSlqfRtExPG2Lq30TEYCe0jy3AEE8HzMgw-E2z-Pso3Q2fn4Wy_WNurNc3r5CCpVfYa5v_ypkYE3oPq3gOaizZfVS8AVgabm3zoZyDDgfJX-xC2wI771ciBw3JBxhG4fz_s5uJgb0-FJjoKF1l_xDYdj2QfkBp1_arMGQYRZgROBMK0vpHh4AyL8ITsVLE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTQhtOTsN8KebCjuFXt0TbyojwdrzZBMXeIZU0UXc6puQdNaPdXKfp0QQcc6uMJ6lQvpPqHWQyYk1VNn2vS2L7CPuDMwxj3EPj02bbXQuO4DwYqd6-qiuW5y89QmDSRdr1eI54w9bnsj0jR0MO9HKU_4OlfjO2rJ94Bg5O_0sNGrwtLx6fuFxMshshiP-febbV1MdnewvF4atJI3ebJE0aPFIJZL6ca6L-iMvtHsQfbGc_SWuQIok',
    ],
    mapTitle: 'Dapur Produksi Barokah Rasa',
    mapAddress: 'Dusun 03 RT 06, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '10 Februari 2025',
  },
  {
    id: 'madu-sari-lebah',
    name: 'Madu Alami Hutan "Sari Lebah"',
    subTitle: 'Madu Hutan Liar Murni & Klanceng Trigona Bebas Campuran',
    regNumber: 'MKD-UMKM-004',
    category: ['pertanian', 'kuliner'],
    categoryBadge: 'Pertanian & Agribisnis',
    owner: 'Kang Asep Sunandar',
    phone: '0813-4455-8899',
    waNumber: '6281344558899',
    address: 'Dusun 04 RT 08, Pekon Margodadi',
    description:
      'Madu murni lebah liar (Apis dorsata) dan klanceng dari vegetasi pohon perkebunan Margodadi. Alami tanpa pasteurisasi dan kaya enzim alami.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTQhtOTsN8KebCjuFXt0TbyojwdrzZBMXeIZU0UXc6puQdNaPdXKfp0QQcc6uMJ6lQvpPqHWQyYk1VNn2vS2L7CPuDMwxj3EPj02bbXQuO4DwYqd6-qiuW5y89QmDSRdr1eI54w9bnsj0jR0MO9HKU_4OlfjO2rJ94Bg5O_0sNGrwtLx6fuFxMshshiP-febbV1MdnewvF4atJI3ebJE0aPFIJZL6ca6L-iMvtHsQfbGc_SWuQIok',
    featuredProducts: [
      { name: 'Madu Hutan 350ml', price: 'Rp 85.000' },
      { name: 'Madu Klanceng 250ml', price: 'Rp 95.000' },
      { name: 'Sarang Madu Sisir 250g', price: 'Rp 70.000' },
    ],
    history:
      'Budidaya lebah klanceng (Trigona sp.) dan pemanenan lestari madu lebah liar lereng pekon dengan memperhatikan siklus nektar bunga kopi dan randu. Menjamin kadar air alami di bawah 20% tanpa proses pemanasan kimiawi sehingga kandungan propolis dan antioksidan tetap utuh.',
    legalCertification: 'Uji Lab & NIB Pertanian',
    legalNumber: 'No. NIB-1102948192837',
    capacity: '150 botol/bln',
    capacityNote: 'Panen Alami Bersiklus',
    group: 'Komunitas Peternak Lebah Pekon',
    groupLocation: 'Dusun 04, Margodadi',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTQhtOTsN8KebCjuFXt0TbyojwdrzZBMXeIZU0UXc6puQdNaPdXKfp0QQcc6uMJ6lQvpPqHWQyYk1VNn2vS2L7CPuDMwxj3EPj02bbXQuO4DwYqd6-qiuW5y89QmDSRdr1eI54w9bnsj0jR0MO9HKU_4OlfjO2rJ94Bg5O_0sNGrwtLx6fuFxMshshiP-febbV1MdnewvF4atJI3ebJE0aPFIJZL6ca6L-iMvtHsQfbGc_SWuQIok',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0XhG5qjdBzpJJ9CswTyzm_0oB7kgIS6ISuG58SQDZXdhqSJXwH3juSybJKg60yUnEyoPJb_P_E4zyxGyyZXFOHHiaC_TPSr3Q-u-xNYLwP0ed4qrvIjvF6l-PVqbs6hM3-GSeux1SmKRRekoc-VYAI_pGzwcFVuABbEIk6XARYnFDbSjIT6s7F3e9k6xTS3a6ezJqPiGUWeMAcwJW_N4Y1s04GOnZ4KcIbLGaZHD_4h9-JCq3dXg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvgNR0og9Y-3RyovTKv9qZJqGfZ3iHvvTo4DycV3xkmNfOdqokFqco3tSlqfRtExPG2Lq30TEYCe0jy3AEE8HzMgw-E2z-Pso3Q2fn4Wy_WNurNc3r5CCpVfYa5v_ypkYE3oPq3gOaizZfVS8AVgabm3zoZyDDgfJX-xC2wI771ciBw3JBxhG4fz_s5uJgb0-FJjoKF1l_xDYdj2QfkBp1_arMGQYRZgROBMK0vpHh4AyL8ITsVLE',
    ],
    mapTitle: 'Peternakan & Koloni Lebah Sari Lebah',
    mapAddress: 'Dusun 04 RT 08, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '18 Januari 2025',
  },
  {
    id: 'batik-margodadi',
    name: 'Batik Tulis Kopi & Lada',
    subTitle: 'Kain Etnik Kontemporer Pewarna Alami & Corak Agrikultur',
    regNumber: 'MKD-UMKM-005',
    category: ['kerajinan'],
    categoryBadge: 'Kerajinan & Kriya',
    owner: 'Paguyuban Putri Margodadi',
    phone: '0852-7311-6655',
    waNumber: '6285273116655',
    address: 'Balai Kreatif Dusun 01, Pekon Margodadi',
    description:
      'Kain batik tulis kontemporer dengan motif khas kekayaan bumi Sumberejo seperti biji kopi dan tangkai lada hitam berpadu ornamen tapis tradisional.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCc4ChZXPKMb8wcwRXMZYqTwUvOqunj4WKT87DmofCm8iluO7NtLme6d4UN4pIrm0C4ut25hfreJflFdO-BsQyrZjHsMgwInwqxkTzCt4nGVJKBB3WtV4IBPyXIF17rPAIp1Y_9W1teYjlr_Gw21WObIrxF-3na-R-OAX058ITD_6SprbUQL9swoqgp3WbczTVBiJrgEWKXOak5VCcuCItLAFJEtY3WgPyhS-5helc3SBewxC6dKiA',
    featuredProducts: [
      { name: 'Kain Panjang 2.2m', price: 'Rp 175.000' },
      { name: 'Syal Batik Sutra', price: 'Rp 65.000' },
      { name: 'Kemeja Batik Pria Siap Pakai', price: 'Rp 220.000' },
    ],
    history:
      'Inisiatif pemberdayaan sanggar kreasi perempuan pekon Margodadi untuk mengangkat identitas agraris setempat melalui seni canting batik. Pewarnaan menggunakan ekstrak kulit pohon mahoni, daun mangga, dan serbuk limbah kopi pekon yang ramah alam.',
    legalCertification: 'Hak Cipta Motif Kemenkumham',
    legalNumber: 'No. HKI-EC00202419082',
    capacity: '80 lembar/bln',
    capacityNote: 'Batik Tulis & Cap Eksklusif',
    group: 'Paguyuban Kreatif Putri Pekon',
    groupLocation: 'Dusun 01, Margodadi',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCc4ChZXPKMb8wcwRXMZYqTwUvOqunj4WKT87DmofCm8iluO7NtLme6d4UN4pIrm0C4ut25hfreJflFdO-BsQyrZjHsMgwInwqxkTzCt4nGVJKBB3WtV4IBPyXIF17rPAIp1Y_9W1teYjlr_Gw21WObIrxF-3na-R-OAX058ITD_6SprbUQL9swoqgp3WbczTVBiJrgEWKXOak5VCcuCItLAFJEtY3WgPyhS-5helc3SBewxC6dKiA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD68MzkIwpsjk6UuMIY8PZXKmHatTFVp0ws1f2qKgYeWTmmkQfIJFf1ZiPoBTlr0yW5cphvKztaMsTdz4md7CpMZW0znmCOLranNCnsjDe7VNyyD73sbjw72IPRb-_Qypu6H0Le3kVIJZzbnbb_AeUFkPoY4hs058jvfHQrehfQ7t4-g4cP_53VLF1qOzIPrcFugYvnwglZ4nLtv2Ukb5OPPXyHPV5Fsu83ISw0dKwv-MbhzAL97Xw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0XhG5qjdBzpJJ9CswTyzm_0oB7kgIS6ISuG58SQDZXdhqSJXwH3juSybJKg60yUnEyoPJb_P_E4zyxGyyZXFOHHiaC_TPSr3Q-u-xNYLwP0ed4qrvIjvF6l-PVqbs6hM3-GSeux1SmKRRekoc-VYAI_pGzwcFVuABbEIk6XARYnFDbSjIT6s7F3e9k6xTS3a6ezJqPiGUWeMAcwJW_N4Y1s04GOnZ4KcIbLGaZHD_4h9-JCq3dXg',
    ],
    mapTitle: 'Balai Sanggar Batik Paguyuban Putri',
    mapAddress: 'Balai Kreatif Dusun 01, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '20 Januari 2025',
  },
  {
    id: 'bibit-tani-makmur',
    name: 'Bibit Buah Unggul "Tani Makmur"',
    subTitle: 'Nursery Okulasi Bibit Alpukat Aligator & Durian Unggulan',
    regNumber: 'MKD-UMKM-006',
    category: ['pertanian'],
    categoryBadge: 'Pertanian & Agribisnis',
    owner: 'Pak Joko Prayitno',
    phone: '0823-1122-3344',
    waNumber: '6282311223344',
    address: 'Jalur Kebun Induk RT 05, Pekon Margodadi',
    description:
      'Pusat pembibitan vegetatif hasil okulasi bersertifikat. Menyediakan bibit alpukat aligator, durian bawor, dan mangga berbuah lebat cocok tanah lokal.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0XhG5qjdBzpJJ9CswTyzm_0oB7kgIS6ISuG58SQDZXdhqSJXwH3juSybJKg60yUnEyoPJb_P_E4zyxGyyZXFOHHiaC_TPSr3Q-u-xNYLwP0ed4qrvIjvF6l-PVqbs6hM3-GSeux1SmKRRekoc-VYAI_pGzwcFVuABbEIk6XARYnFDbSjIT6s7F3e9k6xTS3a6ezJqPiGUWeMAcwJW_N4Y1s04GOnZ4KcIbLGaZHD_4h9-JCq3dXg',
    featuredProducts: [
      { name: 'Bibit Alpukat Aligator', price: 'Rp 35.000' },
      { name: 'Durian Bawor Okulasi', price: 'Rp 60.000' },
      { name: 'Bibit Mangga Kiojay', price: 'Rp 40.000' },
    ],
    history:
      'Pengembangan nursery tanaman buah tropis dengan teknik sambung pucuk dan okulasi mata tunas indukan unggul teruji. Memberikan garansi keaslian varietas dan konsultasi gratis pemupukan organik bagi para pekebun lokal maupun pehobi tanaman.',
    legalCertification: 'Sertifikasi BPSB Tanaman Pangan',
    legalNumber: 'No. BPSB-TPH/18/2024',
    capacity: '2.500 bibit/bln',
    capacityNote: 'Polybag Siap Tanam',
    group: 'Kelompok Tani Makmur Margodadi',
    groupLocation: 'Kebun Induk RT 05, Margodadi',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0XhG5qjdBzpJJ9CswTyzm_0oB7kgIS6ISuG58SQDZXdhqSJXwH3juSybJKg60yUnEyoPJb_P_E4zyxGyyZXFOHHiaC_TPSr3Q-u-xNYLwP0ed4qrvIjvF6l-PVqbs6hM3-GSeux1SmKRRekoc-VYAI_pGzwcFVuABbEIk6XARYnFDbSjIT6s7F3e9k6xTS3a6ezJqPiGUWeMAcwJW_N4Y1s04GOnZ4KcIbLGaZHD_4h9-JCq3dXg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvgNR0og9Y-3RyovTKv9qZJqGfZ3iHvvTo4DycV3xkmNfOdqokFqco3tSlqfRtExPG2Lq30TEYCe0jy3AEE8HzMgw-E2z-Pso3Q2fn4Wy_WNurNc3r5CCpVfYa5v_ypkYE3oPq3gOaizZfVS8AVgabm3zoZyDDgfJX-xC2wI771ciBw3JBxhG4fz_s5uJgb0-FJjoKF1l_xDYdj2QfkBp1_arMGQYRZgROBMK0vpHh4AyL8ITsVLE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD68MzkIwpsjk6UuMIY8PZXKmHatTFVp0ws1f2qKgYeWTmmkQfIJFf1ZiPoBTlr0yW5cphvKztaMsTdz4md7CpMZW0znmCOLranNCnsjDe7VNyyD73sbjw72IPRb-_Qypu6H0Le3kVIJZzbnbb_AeUFkPoY4hs058jvfHQrehfQ7t4-g4cP_53VLF1qOzIPrcFugYvnwglZ4nLtv2Ukb5OPPXyHPV5Fsu83ISw0dKwv-MbhzAL97Xw',
    ],
    mapTitle: 'Nursery Kebun Bibit Tani Makmur',
    mapAddress: 'Jalur Kebun Induk RT 05, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '25 Januari 2025',
  },
  {
    id: 'bengkel-karya-mandiri',
    name: 'Bengkel Las & Mesin Pertanian "Karya Mandiri"',
    subTitle: 'Jasa Fabrikasi Alat Perkebunan, Pompa & Konstruksi Besi',
    regNumber: 'MKD-UMKM-007',
    category: ['jasa'],
    categoryBadge: 'Jasa & Perdagangan',
    owner: 'Mas Budi Santoso',
    phone: '0812-6543-9876',
    waNumber: '6281265439876',
    address: 'Dusun 02 RT 03, Pekon Margodadi',
    description:
      'Jasa perbaikan dan perakitan mesin pertanian (traktor, mesin perontok padi, pompa air) serta pengerjaan kanopi dan pagar besi berkualitas kokoh.',
    image:
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    featuredProducts: [
      { name: 'Servis Mesin Pompa & Traktor', price: 'Mulai Rp 50.000' },
      { name: 'Kanopi & Pagar Minimalis', price: 'Rp 275.000/m²' },
      { name: 'Gerobak Angkut Sawit/Kopi', price: 'Rp 650.000' },
    ],
    history:
      'Menyediakan jasa teknik terpadu untuk mendukung produktivitas para petani Pekon Margodadi. Memiliki peralatan las argon dan suku cadang mesin pertanian lengkap dengan jaminan pengerjaan rapi dan cepat.',
    legalCertification: 'Surat Izin Usaha Perdagangan & Jasa',
    legalNumber: 'No. SIUP-1982039120',
    capacity: '30 proyek/bln',
    capacityNote: 'Panggilan Lapangan & Workshop',
    group: 'Asosiasi Usaha Bengkel Pekon',
    groupLocation: 'Dusun 02, Margodadi',
    gallery: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    ],
    mapTitle: 'Bengkel Teknik Karya Mandiri',
    mapAddress: 'Dusun 02 RT 03, Margodadi',
    mapImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCggn7q2y8c6oRj7jcGM3liyMwvg6rl8Rmgl8r0P3ZIWvod2SyCMlwA_V-sjLGihtbeGcbTtV1AeTOamn9bRSN5sHVxG2M-EFqEylBB-ub68O0Ah8If55vX0v-bzPN09BTSp0ruIhgtpM23E1JBnsZ4V4Uh6unHo90gdotMMlrLjTq0c4Q-_J5iDLz8hus7bwgIsLcUPd_ldhoBQnTS7h5ml3nFWnHaWZ27NxIFPRf9K3SfGecPD3I',
    mapUrl: 'https://maps.google.com/?q=Margodadi+Sumberejo+Tanggamus',
    lastVerified: '28 Januari 2025',
  },
]

const categories = [
  { id: 'all', name: 'Semua Kategori' },
  { id: 'kuliner', name: 'Kuliner & Olahan' },
  { id: 'kerajinan', name: 'Kerajinan & Kriya' },
  { id: 'pertanian', name: 'Pertanian & Agribisnis' },
  { id: 'jasa', name: 'Jasa & Perdagangan' },
]

export default function PotensiUmkmPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [selectedProfileModal, setSelectedProfileModal] = useState(null)
  const [showManualModal, setShowManualModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3200)
  }

  // Handle ESC key when any modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProfileModal(null)
        setShowManualModal(false)
      }
    }
    if (selectedProfileModal || showManualModal) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProfileModal, showManualModal])

  // Filter Data
  const filteredUmkm = umkmData.filter((item) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesCategory =
      selectedCategory === 'all' || item.category.includes(selectedCategory)
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.owner.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.address.toLowerCase().includes(query) ||
      item.featuredProducts.some((p) => p.name.toLowerCase().includes(query))

    return matchesCategory && matchesQuery
  })

  // Sort Data
  const sortedUmkm = [...filteredUmkm].sort((a, b) => {
    if (sortBy === 'az') {
      return a.name.localeCompare(b.name)
    }
    if (sortBy === 'newest') {
      return b.regNumber.localeCompare(a.regNumber)
    }
    return 0 // default 'popular' order
  })

  // Dynamic counts for category pills
  const getCategoryCount = (catId) => {
    if (catId === 'all') return umkmData.length
    return umkmData.filter((item) => item.category.includes(catId)).length
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. TOP DECORATIVE HERO ANCHOR */}
      <section className="relative overflow-hidden bg-surface-container-low px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Breadcrumb & Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm leading-none">storefront</span>
              Etalase Mandiri Warga Pekon
            </span>
            <span className="text-on-surface-variant text-xs">•</span>
            <span className="text-on-surface-variant text-xs font-medium">
              Pemerintahan Pekon Margodadi
            </span>
          </div>

          {/* Title Area & Quick Metrics Bento Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary tracking-tight font-extrabold">
                Direktori &amp; Katalog Produk Unggulan UMKM Pekon Margodadi
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
                Mendukung pertumbuhan ekonomi warga pekon melalui etalase digital transparan dan
                terintegrasi asisten virtual. Jelajahi komoditas unggulan kopi lereng, kerajinan ramah
                lingkungan, dan produk lokal otentik.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2. MAIN DIRECTORY CONTAINER */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        {/* Toolbar: Search, Sort & Category Pills */}
        <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-2xl shadow-xs border border-surface-container-high/60 space-y-4">
          {/* Search & Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">
                search
              </span>
              <input
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl bg-surface-container-low text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high/30 transition-all"
                id="umkm-search"
                placeholder="Cari nama usaha, produk, pemilik, atau dusun..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Filter */}
            <div className="md:col-span-4 relative">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-lg pointer-events-none">
                  swap_vert
                </span>
                <select
                  className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-surface-container-low text-xs sm:text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 border border-surface-container-high/30 cursor-pointer"
                  id="umkm-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Urutkan: Rekomendasi Terpopuler</option>
                  <option value="az">Nama A - Z</option>
                  <option value="newest">Terbaru Terdaftar</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-lg pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Categories Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id
              const count = getCategoryCount(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. KATALOG PRODUK & PROFIL UMKM (Responsive Grid 3 Kolom Desktop) */}
        {sortedUmkm.length === 0 ? (
          <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high/60 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">UMKM Tidak Ditemukan</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Tidak ada UMKM atau produk yang cocok dengan pencarian &quot;{searchQuery}&quot;. Coba ubah
              kata kunci atau pilih kategori lain.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                type="button"
              >
                Reset Semua Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="umkm-cards-grid">
            {sortedUmkm.map((item) => (
              <article
                key={item.id}
                className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all border border-surface-container-high/60 group"
              >
                {/* Image Header with Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-primary/90 backdrop-blur-md text-on-primary text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.categoryBadge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Owner & Phone */}
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
                      <span className="material-symbols-outlined text-sm text-primary">person</span>
                      <span>{item.owner}</span>
                      <span className="text-outline-variant">•</span>
                      <span className="material-symbols-outlined text-sm text-secondary">call</span>
                      <span>{item.phone}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-1.5 text-on-surface-variant text-xs">
                      <span className="material-symbols-outlined text-sm text-outline mt-0.5 shrink-0">
                        location_on
                      </span>
                      <span className="line-clamp-1">{item.address}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-on-surface-variant line-clamp-2 pt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Featured Products Pills */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                        Produk Unggulan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.featuredProducts.slice(0, 2).map((prod, pidx) => (
                          <span
                            key={pidx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-xs text-on-surface"
                          >
                            <span>{prod.name}</span>
                            <strong className="text-primary font-bold">{prod.price}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <button
                      className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer"
                      onClick={() => setSelectedProfileModal(item)}
                      type="button"
                    >
                      <span>Lihat Profil Lengkap</span>
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </button>
                    <Link
                      to={`/tanya-virtual-guide?umkm=${encodeURIComponent(item.name)}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">smart_toy</span>
                      <span>Tanya Stok ke Virtual Guide</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 4. AJAKAN MENDAFTARKAN USAHA BARU (Call-To-Action Banner) */}
        <section className="bg-primary text-on-primary rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-md">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                PROGRAM PEMBERDAYAAN EKONOMI PEKON
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Apakah Anda Pelaku Usaha Warga Margodadi?
              </h3>
              <p className="text-xs sm:text-sm text-on-primary/90 max-w-2xl leading-relaxed">
                Daftarkan UMKM Anda secara gratis di kantor balai pekon atau melalui formulir panduan asisten
                virtual. Dapatkan publikasi katalog digital, verifikasi legalitas usaha pekon, dan kemudahan
                pencarian pelanggan daring!
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/tanya-virtual-guide?prompt=Saya%20ingin%20mendaftarkan%20UMKM%20baru%20di%20Pekon%20Margodadi"
                className="inline-flex items-center justify-center gap-2 bg-secondary-container hover:bg-secondary text-on-secondary px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors text-center"
              >
                <span className="material-symbols-outlined text-lg">app_registration</span>
                <span>Daftar Lewat Asisten AI</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-on-primary/10 hover:bg-on-primary/20 text-on-primary px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">contact_support</span>
                <span>Persyaratan Registrasi Manual</span>
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* 5. POP-UP / MODAL DETAIL PROFIL LENGKAP UMKM (RESPONSIVE) */}
      {selectedProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedProfileModal(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-surface-container-high overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Sticky) */}
            <div className="p-5 sm:p-6 pb-4 border-b border-surface-container-high/60 flex items-start justify-between gap-4 bg-surface-container-lowest/95 backdrop-blur-md shrink-0">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    Profil Lengkap Usaha Warga
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    No. Reg: {selectedProfileModal.regNumber}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-primary font-bold truncate">
                  {selectedProfileModal.name}
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 line-clamp-1">
                  {selectedProfileModal.subTitle}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                type="button"
                aria-label="Tutup Profil"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-6 md:p-8 space-y-6">
              {/* Quick Contact & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-on-surface">
                      {selectedProfileModal.owner}
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-sm text-secondary">call</span>
                      <span>{selectedProfileModal.phone}</span>
                      <span className="text-outline-variant">•</span>
                      <span>{selectedProfileModal.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <a
                    className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-on-secondary-container transition-all shadow-xs flex-1 sm:flex-none"
                    href={`https://wa.me/${selectedProfileModal.waNumber}?text=Halo%20${encodeURIComponent(
                      selectedProfileModal.owner
                    )},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
                      selectedProfileModal.name
                    )}%20di%20Virtual%20Guide%20Pekon%20Margodadi`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Hubungi WhatsApp</span>
                  </a>
                  <Link
                    to={`/tanya-virtual-guide?umkm=${encodeURIComponent(selectedProfileModal.name)}`}
                    className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary transition-all shadow-xs flex-1 sm:flex-none"
                    onClick={() => setSelectedProfileModal(null)}
                  >
                    <span className="material-symbols-outlined text-base">smart_toy</span>
                    <span>Tanya AI</span>
                  </Link>
                </div>
              </div>

              {/* Grid 2 Kolom Modal: Sejarah & Metrik + Lokasi & Validasi */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Kolom Kiri */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Sejarah & Komitmen Usaha */}
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
                      Sejarah &amp; Komitmen Usaha
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {selectedProfileModal.history}
                    </p>
                  </div>

                  {/* Metrik Kapasitas & Sertifikasi Bento */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-surface-container rounded-2xl">
                      <span className="text-[11px] text-on-surface-variant block font-medium">
                        Izin Edar / Legalitas
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-primary block mt-1">
                        {selectedProfileModal.legalCertification}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 block mt-0.5 truncate">
                        {selectedProfileModal.legalNumber}
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-container rounded-2xl">
                      <span className="text-[11px] text-on-surface-variant block font-medium">
                        Kapasitas Produksi
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-on-surface block mt-1">
                        {selectedProfileModal.capacity}
                      </span>
                      <span className="text-[10px] text-tertiary font-semibold block mt-0.5 truncate">
                        {selectedProfileModal.capacityNote}
                      </span>
                    </div>

                    <div className="p-3.5 bg-surface-container rounded-2xl col-span-2 sm:col-span-1">
                      <span className="text-[11px] text-on-surface-variant block font-medium">
                        Kelompok Binaan
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-secondary block mt-1">
                        {selectedProfileModal.group}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 block mt-0.5 truncate">
                        {selectedProfileModal.groupLocation}
                      </span>
                    </div>
                  </div>

                  {/* Daftar Produk & Varian Harga */}
                  <div className="space-y-2.5">
                    <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">sell</span>
                      Daftar Produk &amp; Harga
                    </h4>
                    <div className="space-y-2">
                      {selectedProfileModal.featuredProducts.map((prod, pridx) => (
                        <div
                          key={pridx}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 text-xs sm:text-sm"
                        >
                          <span className="font-medium text-on-surface">{prod.name}</span>
                          <span className="font-bold text-primary">{prod.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Galeri Foto Dokumentasi Produksi */}
                  <div className="space-y-2.5">
                    <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">photo_library</span>
                      Dokumentasi Produksi &amp; Kemasan
                    </h4>
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {selectedProfileModal.gallery.map((imgUrl, gidx) => (
                        <div
                          key={gidx}
                          className="h-24 sm:h-28 rounded-xl overflow-hidden bg-surface-container group/img cursor-pointer"
                          onClick={() =>
                            showToast(
                              `Foto dokumentasi ${gidx + 1} ${selectedProfileModal.name} diperbesar.`
                            )
                          }
                        >
                          <img
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            src={imgUrl}
                            alt={`${selectedProfileModal.name} Dokumentasi ${gidx + 1}`}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Peta Lokasi Rumah Produksi */}
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">map</span>
                      Peta Lokasi Rumah Produksi
                    </h4>
                    <div
                      className="w-full h-48 bg-cover bg-center rounded-2xl relative shadow-inner overflow-hidden flex items-end p-3"
                      style={{ backgroundImage: `url('${selectedProfileModal.mapImage}')` }}
                    >
                      <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl w-full flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-on-surface truncate">
                            {selectedProfileModal.mapTitle}
                          </p>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {selectedProfileModal.address}
                          </p>
                        </div>
                        <a
                          className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shrink-0 flex items-center justify-center shadow-xs"
                          href={selectedProfileModal.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka di Google Maps"
                        >
                          <span className="material-symbols-outlined text-base">directions</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Rincian Sertifikat Validasi Digital Pekon */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-surface-container-high/40 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                      <span className="text-xs sm:text-sm font-bold text-primary">
                        Sertifikat Validasi Digital Pekon
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Telah melalui verifikasi lapangan oleh Kasi Kesejahteraan &amp; Pemerintahan Pekon
                      Margodadi untuk keaslian lokasi usaha, mutu produk, dan legalitas kepemilikan warga
                      lokal.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-on-surface-variant text-xs border-t border-surface-container-high/40">
                      <span>Diperbarui: {selectedProfileModal.lastVerified}</span>
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                        Aktif Beroperasi
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Sticky) */}
            <div className="p-4 sm:p-5 border-t border-surface-container-high/60 bg-surface-container-lowest flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                type="button"
              >
                Tutup
              </button>
              <a
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                href={`https://wa.me/${selectedProfileModal.waNumber}?text=Halo%20${encodeURIComponent(
                  selectedProfileModal.owner
                )},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
                  selectedProfileModal.name
                )}%20di%20Virtual%20Guide%20Pekon%20Margodadi`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Pesan Sekarang via WA</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL PERSYARATAN REGISTRASI MANUAL */}
      {showManualModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowManualModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
                <h3 className="text-base sm:text-lg font-bold text-on-surface">
                  Persyaratan Registrasi UMKM Pekon
                </h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-on-surface">
              <p className="text-on-surface-variant text-xs">
                Pelaku usaha warga Pekon Margodadi dapat membawa berkas-berkas berikut ke Loket Kasi Kesejahteraan / Pelayanan di Balai Pekon:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                  <span>Fotokopi KTP &amp; KK Pekon Margodadi (Pemilik Usaha)</span>
                </li>
                <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                  <span>Surat Keterangan Usaha (SKU) dari RT/Pekon Margodadi</span>
                </li>
                <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                  <span>Foto produk fisik &amp; dokumentasi tempat produksi usaha</span>
                </li>
                <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                  <span>Nomor kontak WhatsApp aktif untuk narahubung katalog online</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                Tutup
              </button>
              <Link
                to="/layanan-publik"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
                onClick={() => setShowManualModal(false)}
              >
                <span className="material-symbols-outlined text-sm">description</span>
                <span>Buat SKU di Layanan Publik</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 7. MICRO NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 pointer-events-none">
          <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium pointer-events-auto">
            <span className="material-symbols-outlined text-base text-primary-fixed">info</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
