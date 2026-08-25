import { GalleryItem, Pengurus, MosqueProfile, AdArtDocument } from '../types';

export const mosqueProfile: MosqueProfile = {
  name: "IRMAS Masjid Jami'e Al-Ikhlas",
  subName: "Ikatan Remaja Masjid Jamie Al-Ikhlas",
  organizationName: "IKATAN REMAJA MASJID (IRMAS) MASJID JAMIE AL-IKHLAS",
  tagline: "Membina Generasi Muda Menjalankan Syari'at Islam, Memperkokoh Ukhuwah & Memakmurkan Masjid",
  shortDesc: "Wadah persatuan, pembinaan aqidah, akhlak, dan pengembangan potensi pemuda-pemudi di lingkungan Perumahan Graha Bhakti Kodam Jaya, Jatibaru, Cikarang Timur demi memakmurkan Masjid Jamie Al-Ikhlas.",
  fullHistory: "Ikatan Remaja Masjid Jamie Al-Ikhlas (IRMAS) resmi dibentuk dan ditetapkan melalui Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) pada tanggal 20 Desember 2024 di Masjid Jamie Al-Ikhlas, Perum Graha Bhakti Kodam Jaya RT 04/05, Desa Jatibaru, Kecamatan Cikarang Timur, Kabupaten Bekasi. IRMAS berfungsi sebagai sarana pembinaan aqidah, akhlak serta memperkokoh ukhuwah Islamiyah dan aktif dalam syiar serta kegiatan sosial kemasyarakatan.",
  address: "Perumahan Graha Bhakti Kodam Jaya RT 04 / RW 05, Desa Jatibaru, Kec. Cikarang Timur, Kab. Bekasi, Jawa Barat",
  housing: "Perumahan Graha Bhakti Kodam Jaya",
  neighborhood: "RT 04 / RW 05",
  village: "Desa Jatibaru",
  district: "Kecamatan Cikarang Timur",
  regency: "Kabupaten Bekasi",
  city: "Cikarang Timur, Kab. Bekasi",
  mapsUrl: "https://maps.google.com/?q=Perumahan+Graha+Bhakti+Kodam+Jaya+Jatibaru+Cikarang+Timur",
  establishedDate: "20 Desember 2024",
  establishedYear: "2024",
  activePeriod: "2025/2027",
  email: "jekb66475@gmail.com",
  whatsapp: "+62 838-6481-993",
  instagram: "@irmas_al.ikhlashu",
  instagramUrl: "https://www.instagram.com/irmas_al.ikhlashu?igsh=MWpwOGx4bDZieDZkag%3D%3D",
  tiktokUrl: "https://www.tiktok.com/@irmas_al.ikhlashu?_t=ZS-907IGkxa19G&_r=1",
  youtubeUrl: "https://www.youtube.com/@irmas_jamieal-ikhlas",
  facebookUrl: "https://www.facebook.com/people/Irmas-Al-Ikhlas/61578161860278/?rdid=9ak5W1NbRFt6rLcP&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16n38DAjTz%2F",
  youtube: "@irmas_jamieal-ikhlas",
  ketuaIrmas: "M. Addym Jaka Anugrah",
  sekretarisIrmas: "Dio Surya Pratama",
  ketuaDkm: "Ust. Rosadi"
};

export const visionMission = {
  visi: "Terwujudnya pemuda-pemudi muslim yang bertakwa, berakhlak mulia, berilmu, dan istiqomah dalam menjalankan syari'at Islam serta menjadi garda terdepan dalam memakmurkan Masjid Jamie Al-Ikhlas.",
  misi: [
    "Membina Remaja Masjid Jamie Al-Ikhlas untuk menjalankan syari’at Islam yang baik dan benar sehingga terwujud masyarakat Islam yang sebenar-benarnya.",
    "Memupuk dan memelihara silaturahmi dan rasa ukhuwah Islamiah serta kekeluargaan dan mewujudkan kerja sama yang utuh dan jiwa pengabdian kepada masyarakat.",
    "Membina anggotanya didasari oleh hubungan emosional sehingga terwujud kesatuan sudut pandang, pola pikir yang luas, ucapan, dan tindakan yang selaras.",
    "Membina dan memelihara serta menumbuhsuburkan kualitas keimanan dan ketaqwaan kepada Allah SWT.",
    "Menghimpun dan mempersatukan remaja putra-putri di lingkungan Masjid Jamie Al-Ikhlas dan sekitarnya.",
    "Mendidik para anggota dalam tata cara berorganisasi yang sehat dan sejalan dengan pedoman AD/ART."
  ],
  azas: [
    {
      title: "Al-Qur'an dan Sunnah Rasulullah SAW",
      desc: "Sebagai sumber hukum dan pedoman hidup utama dalam seluruh nafas gerak dakwah dan pembinaan remaja."
    },
    {
      title: "Pancasila dan UUD 1945",
      desc: "Menumbuhsuburkan kesetiaan kepada konstitusi dan kebangsaan dalam wadah Negara Kesatuan Republik Indonesia."
    }
  ],
  pillars: [
    { title: "Aqidah & Syari'at Islam", desc: "Membina remaja menjalankan syari'at Islam yang murni, benar, dan berlandaskan Al-Qur'an & Sunnah." },
    { title: "Ukhuwah & Kekeluargaan", desc: "Mempererat tali persaudaraan sesama pemuda masjid dan saling tolong menolong saat tertimpa musibah." },
    { title: "Karakter & Organisasi", desc: "Mendidik kepemimpinan, tata kelola administrasi transparan, dan kesatuan pola pikir yang luas." },
    { title: "Pengabdian Sosial", desc: "Aktif dalam bakti sosial dan kemasyarakatan di lingkungan Graha Bhakti Kodam Jaya Jatibaru." }
  ]
};

export const pengurusList: Pengurus[] = [
  {
    id: "p-ketua",
    name: "M. Addym Jaka Anugrah",
    role: "Ketua IRMAS",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Bertanggung jawab terhadap kesinambungan dan keberlangsungan organisasi baik internal maupun eksternal demi ridho Allah SWT.",
    whatsapp: "+62 838-6481-993",
    phone: "0838-6481-993"
  },
  {
    id: "p-wakil",
    name: "Danish Alfisyahri P. S.",
    role: "Wakil Ketua",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Mengkoordinir kelancaran program kerja dan siap menyokong kepemimpinan organisasi.",
    whatsapp: "+62 878-4753-3981",
    phone: "0878-4753-3981"
  },
  {
    id: "p-sekretaris-1",
    name: "Dio Surya Pratama",
    role: "Sekretaris 1",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Bertanggung jawab terhadap penataan administrasi, surat-menyurat, dan dokumentasi resmi organisasi sesuai AD/ART.",
    whatsapp: "+62 857-1545-8316",
    phone: "0857-1545-8316"
  },
  {
    id: "p-sekretaris-2",
    name: "Reihana Hanno M",
    role: "Sekretaris 2",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Mendukung kelancaran tata kelola arsip, notulensi rapat, dan ketertiban administrasi persyarikatan.",
    whatsapp: "+62 822-4665-7095",
    phone: "0822-4665-7095"
  },
  {
    id: "p-bendahara-1",
    name: "Sabrina Zakiyyah Amani",
    role: "Bendahara 1",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Bertanggung jawab terhadap pengelolaan keuangan kas dan inventarisasi persyarikatan secara amanah dan transparan.",
    whatsapp: "+62 813-1513-0521",
    phone: "0813-1513-0521"
  },
  {
    id: "p-bendahara-2",
    name: "Alifah Huwaida",
    role: "Bendahara 2",
    division: "BPH",
    avatar: "/WhatsApp Image 2026-08-25 at 02.52.46.jpeg",
    quote: "Mencatat sirkulasi uang kas iuran anggota, sumbangan masyarakat, dan pertanggungjawaban dana kegiatan.",
    whatsapp: "+62 831-9865-9462",
    phone: "0831-9865-9462"
  }
];

export const adArtOfficialDocument: AdArtDocument = {
  title: "ANGGARAN DASAR (AD) & ANGGARAN RUMAH TANGGA (ART)",
  period: "TAHUN 2025/2027",
  locationHeader: "IKATAN REMAJA MASJID (IRMAS) MASJID JAMIE “AL-IKHLAS” JATIBARU KECAMATAN CIKARANG TIMUR KABUPATEN BEKASI",
  kataPengantar: {
    muqaddimah: [
      "Segala puji bagi Allah, Tuhan sekalian alam.",
      "“Dan hendaklah diantara kamu ada (segolongan) umat yang menyeru kepada yang makruf (kebaikan) dan mencegah yang munkar” (QS. Ali Imran 104).",
      "“Demi masa sesungguhnya manusia itu selalu dalam keadaan merugi, kecuali orang-orang yang beriman dan mengerjakan sholat dan saling nasihat-menasehati dalam kebenaran dan saling nasihat-menasihati dalam kesabaran” (QS. Al-Ashr).",
      "“Wahai orang-orang yang beriman, bertaqwalah kamu kepada Allah dengan sebenar-benarnya taqwa dan janganlah kamu mati kecuali dalam keadaan Islam” (QS. Ali Imran 102)."
    ],
    body: [
      "Ikatan Remaja Masjid Al-Ikhlas berfungsi sebagai sarana pembinaan aqidah, akhlak serta berupaya memperkokoh ukhwah Islamiah. Sesungguhnya Ikatan Remaja Masjid Al-Ikhlas bertanggung jawab terhadap keberlangsungan dan kesinambungan aqidah keagamaan dalam masyarakat pada umumnya dan remaja pada khususnya. Ikatan Remaja Masjid Al-Ikhlas tidak menutup diri dari pelaksanaan kegiatan-kegiatan sosial kemasyarakatan yang berkembang di tengah-tengah masyarakat.",
      "Dokumen AD/ART ini merupakan pedoman resmi yang menjadi dasar dalam menjalankan seluruh aktivitas dan pengelolaan organisasi IRMAS. Penyusunannya bertujuan untuk mewujudkan tata kelola organisasi yang transparan, bertanggung jawab, dan berlandaskan nilai-nilai Islam. Melalui dokumen ini, diharapkan seluruh anggota dapat memahami dan melaksanakan tugas serta kewajiban sesuai dengan aturan yang telah ditetapkan.",
      "Akhir kata, kami mengucapkan terima kasih kepada semua pihak yang telah membantu dalam penyusunan AD/ART ini. Semoga Allah SWT senantiasa memberikan petunjuk dan keberkahan kepada kita semua."
    ],
    signatureDate: "Jatibaru, 15 Desember 2024",
    signerRole: "Ketua IRMAS Masjid Jamie Al-Ikhlas",
    signerName: "M. Addym Jaka Anugrah"
  },
  chapters: [
    {
      babNumber: "BAB I",
      title: "Pengertian Umum",
      pasalList: [
        {
          pasalNumber: "Pasal 1",
          title: "Pengertian Umum",
          contents: [
            "Masjid Jamie Al-Ikhlas adalah Masjid Al-Ikhlas yang berlokasi di Perumahan Graha bhakti kodam Jaya RT 04/ 05",
            "Desa Jatibaru Cikarang Timur Kab. Bekasi.",
            "Remaja Masjid Jamie Al-Ikhlas adalah putra-putri jemaah lingkungan Masjid Jamie Al-Ikhlas dan sekitarnya."
          ]
        }
      ]
    },
    {
      babNumber: "BAB II",
      title: "Nama, Tempat dan Waktu Pendirian",
      pasalList: [
        {
          pasalNumber: "Pasal 2",
          title: "Nama",
          contents: [
            "Perkumpulan ini bernama “IKATAN REMAJA MASJID, MASJID JAMIE AL-IKHLAS”."
          ]
        },
        {
          pasalNumber: "Pasal 3",
          title: "Tempat",
          contents: [
            "Ikatan Remaja Masjid Jamie Al-Ikhlas bertempat dan bersekretariat di Masjid Jamie Al-Ikhlas Perum Graha Bhakti kodam Jaya Rt 04/ 05 Desa Jatibaru Cikarang timur Kab. Bekasi."
          ]
        },
        {
          pasalNumber: "Pasal 4",
          title: "Waktu Pendirian",
          contents: [
            "Ikatan Remaja Masjid Jamie Al-Ikhlas di bentuk pada tanggal 20 Desember 2024 di Masjid Jamie Al-Ikhlas Perum Graha Bhakti Kodam Jaya RT 004/005 Desa Jatibaru Cikarang Timur Kab. Bekasi sampai dengan waktu yang tidak ditentukan."
          ]
        }
      ]
    },
    {
      babNumber: "BAB III",
      title: "Azas dan Tujuan",
      pasalList: [
        {
          pasalNumber: "Pasal 5",
          title: "Azas",
          contents: [
            "Ikatan Remaja Masjid Al-Ikhlas berazaskan Al-Qur’an dan Sunnah Rasulullah SAW.",
            "Ikatan Remaja Masjid Al-Ikhlas berazaskan Pancasila dan UUD 1945."
          ]
        },
        {
          pasalNumber: "Pasal 6",
          title: "Tujuan",
          contents: [
            "Membina Remaja Masjid Jamie Al-Ikhlas untuk menjalankan syari’at Islam yang baik dan benar sehingga terwujud masyarakat Islam yang sebenar-benarnya.",
            "Memupuk dan memelihara silaturahmi dan rasa ukhwah Islamiah serta kekeluargaan dan mewujudkan kerja sama yang utuh dan jiwa pengabdian kepada masyarakat dan menumbuh suburkan kesetiaan kepada Pancasila dan UUD 1945 dalam wadah Negara Kesatuan Republik Indonesia.",
            "Membina anggotanya didasari oleh hubungan emosional sehingga terwujud kesatuan sudut pandang dan pola fikir yang luas, ucapan dan tindakan yang sama.",
            "Membina dan memelihara serta menumbuh suburkan kualitas keimanan dan ketaqwaan sehingga terwujud masyarakat Islam yang sebenar-benarnya.",
            "Menghimpun dan mempersatukan Remaja di lingkungan Masjid Jamie Al-Ikhlas.",
            "Mendidik para anggota dalam tata cara berorganisasi dalam ikatan yang sejalan dengan tujuan Ikatan Remaja."
          ]
        }
      ]
    },
    {
      babNumber: "BAB IV",
      title: "Keanggotaaan dan Umur serta Kewajiban",
      pasalList: [
        {
          pasalNumber: "Pasal 7",
          title: "Anggota dan Umur Anggota",
          contents: [
            "Putra-putri Remaja Jama’ah lingkungan Masjid Jamie Al-Ikhlas.",
            "Mendaftarkan diri sebagai anggota Ikatan Remaja Masjid Jamie Al-Ikhlas pada sekretariat Masjid Jamie Al-Ikhlas.",
            "Umur anggota Ikatan Remaja Masjid Jamie Al-Ikhlas setinggi-tingginya berumur 40 (empat puluh) tahun."
          ]
        },
        {
          pasalNumber: "Pasal 8",
          title: "Kewajiban Anggota",
          contents: [
            "Patuh dan taat pada Anggaran Dasar dan Anggaran Rumah Tangga.",
            "Melaksanakan semua keputusan dan peraturan yang diambil dalam rapat-rapat.",
            "Membayar uang iuran bulanan anggota dan sumbangan-sumbangan khusus yang telah menjadi keputusan dan kesepakatan bersama anggota.",
            "Mengikuti secara aktif kegiatan demi perkembangan dan kemajuan remaja.",
            "Menjaga keutuhan dan persatuan serta saling harga menghargai satu sama lain.",
            "Memberikan bantuan sesama anggota yang sedang mendapat musibah."
          ]
        }
      ]
    },
    {
      babNumber: "BAB V",
      title: "Hak-Hak Anggota",
      pasalList: [
        {
          pasalNumber: "Pasal 9",
          title: "Hak Anggota",
          contents: [
            "Mengajukan saran dan pendapat serta usul yang sifatnya membangun demi kemajuan remaja baik secara lisan ataupun tertulis.",
            "Memilih dan dipilih menjadi pengurus Ikatan Remaja."
          ]
        }
      ]
    },
    {
      babNumber: "BAB VI",
      title: "Kepengurusan dan Pemilihan Pengurus",
      pasalList: [
        {
          pasalNumber: "Pasal 10",
          title: "Pengurus",
          contents: [
            "Pembina",
            "Ketua, Wakil Ketua",
            "Sekretaris 1 dan Sekretaris 2",
            "Bendahara 1 dan Bendahara 2",
            "Bidang-bidang sesuai dengan kebutuhan"
          ]
        },
        {
          pasalNumber: "Pasal 11",
          title: "Pemilihan Pengurus",
          contents: [
            "Pengurus Ikatan Remaja Masjid Al-Ikhlas dipilih oleh dan dari anggota dalam rapat pemilihan pengurus.",
            "Pengurus terpilih mempunyai masa kerja selama 2 (dua) tahun."
          ]
        }
      ]
    },
    {
      babNumber: "BAB VII",
      title: "Kewajiban Pengurus",
      pasalList: [
        {
          pasalNumber: "Pasal 12",
          title: "Kewajiban Pengurus",
          contents: [
            "Pembina berkewajiban memberikan nasihat kepada pengurus.",
            "Ketua bertanggung jawab terhadap kesinambungan dan keberlangsungan yang dilaksanakan baik yang sifatnya internal maupun eksternal.",
            "Ketua menandatangani surat keluar dan bertanggung jawab keluar dan kedalam dan dapat mengalihkan wewenang dan tugasnya kepada Wakil apabila Ketua berhalangan.",
            "Wakil Ketua bertanggung jawab mengkoordinir seksi-seksi bidang kegiatan yang berada dibawahnya serta siap menggantikan Ketua apabila berhalangan.",
            "Sekretaris 1 / Sekretaris 2 menandatangani surat-surat keluar dan bertanggung jawab terhadap penataan administrasi dan dokumen.",
            "Bendahara 1 dan Bendahara 2 bertanggung jawab terhadap pengelolaan keuangan dan peralatan/inventarisasi persyarikatan baik yang baru maupun yang lama.",
            "Bidang-bidang bertugas sesuai ketentuan dan keputusan yang telah ditetapkan oleh Ketua.",
            "Pengurus harus membuat laporan kegiatan dan melaporkannya kepada DKM Masjid Jamie Al-Ikhlas.",
            "Pengurus Ikatan Remaja Masjid Jamie Al-Ikhlas berkoordinasi dengan DKM Masjid Jamie Al-Ikhlas dalam setiap kegiatan.",
            "Pengurus DKM Masjid Jamie Al-Ikhlas mempunyai hak Prerogatif untuk menunjuk Pengurus Ikatan Remaja Masjid Jamie Al-Ikhlas jika dalam keadaan darurat, yang mana keberadaannya sangat dibutuhkan."
          ]
        }
      ]
    },
    {
      babNumber: "BAB VIII",
      title: "Sumber Keuangan",
      pasalList: [
        {
          pasalNumber: "Pasal 13",
          title: "Sumber Keuangan",
          contents: [
            "1. Dari kas anggota yang telah ditetapkan dan disepakati bersama.",
            "2. Sumbangan sukarela dari masyarakat.",
            "3. Penghasilan lainnya yang baik dan halal dan tidak mengikat.",
            "4. Pengajuan proposal kepada DKM Masjid Jamie Al-Ikhlas."
          ]
        }
      ]
    },
    {
      babNumber: "BAB IX",
      title: "Rapat-Rapat",
      pasalList: [
        {
          pasalNumber: "Pasal 14",
          title: "Jenis Rapat",
          contents: [
            "1. Rapat anggota.",
            "2. Rapat kegiatan.",
            "3. Rapat tahunan anggota.",
            "4. Rapat pengurus khusus.",
            "5. Rapat luar biasa."
          ]
        }
      ]
    },
    {
      babNumber: "BAB X",
      title: "Peraturan",
      pasalList: [
        {
          pasalNumber: "Pasal 15",
          title: "Peraturan Perkumpulan",
          contents: [
            "Anggaran Dasar dan Anggaran Rumah Tangga: Peraturan-peraturan yang ditetapkan oleh rapat-rapat BAB IX Pasal 14.",
            "Sesuatu yang sifatnya mendadak untuk diputuskan demi kepentingan Ikatan Remaja harus dihadiri minimal oleh pengurus harian yaitu Ketua, Wakil Ketua, Sekretaris, Bendahara dan Pembina."
          ]
        }
      ]
    },
    {
      babNumber: "BAB XI",
      title: "Perubahan dan Pembubaran",
      pasalList: [
        {
          pasalNumber: "Pasal 16",
          title: "Perubahan",
          contents: [
            "Perubahan Anggaran Dasar dan atau perubahan perkumpulan ini dapat dilaksanakan oleh rapat anggota yang dihadiri sekurang-kurangnya dua pertiga dari jumlah anggota dan atau pengurus yang berwenang."
          ]
        },
        {
          pasalNumber: "Pasal 17",
          title: "Pembubaran",
          contents: [
            "Apabila persyarikatan Ikatan Remaja Masjid Jamie Al-Ikhlas dibubarkan, maka semua asset kekayaan perserikatan diserahkan kepada DKM Masjid Jamie Al-Ikhlas."
          ]
        }
      ]
    },
    {
      babNumber: "BAB XII",
      title: "Penutup",
      pasalList: [
        {
          pasalNumber: "Pasal 18",
          title: "Ketentuan Penutup",
          contents: [
            "Segala ketentuan Anggaran Dasar & Anggaran Rumah Tangga hanya sah apabila dikeluarkan sesuai ketentuan rapat anggota dan atau rapat luar biasa.",
            "Anggaran Dasar & Anggaran Rumah Tangga ini ditetapkan oleh rapat anggota yang berlangsung di Masjid Jamie Al-Ikhlas.",
            "Anggaran Dasar & Anggaran Rumah Tangga ini mulai berlaku sejak tanggal ditetapkan dan yang bertentangan dengan Anggaran Dasar & Anggaran Rumah Tangga ini dinyatakan tidak berlaku."
          ]
        }
      ]
    }
  ],
  pengesahan: {
    location: "Masjid Jamie Al-Ikhlas",
    date: "20 Desember 2024",
    sekretaris: "Hesti Puspitasari",
    ketuaIrmas: "M. Addym Jaka Anugrah",
    ketuaDkm: "Rosadi"
  }
};

export const musyawarahPhotos: { id: string; url: string; title: string; desc: string }[] = [
  {
    id: "musyawarah-1",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl.webp",
    title: "Pembukaan & Sambutan Musyawarah AD/ART",
    desc: "Suasana pembukaan musyawarah pembentukan dan pengesahan AD/ART IRMAS bersama jajaran pengurus dan perwakilan DKM."
  },
  {
    id: "musyawarah-2",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (1).webp",
    title: "Pembacaan Draf Bab & Pasal AD/ART",
    desc: "Sesi penelaahan pasal demi pasal anggaran dasar organisasi untuk kesepakatan bersama."
  },
  {
    id: "musyawarah-3",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (2).webp",
    title: "Penyampaian Masukan & Aspirasi Remaja",
    desc: "Para pemuda menyampaikan usulan dan program kerja untuk kemakmuran Masjid Jamie Al-Ikhlas."
  },
  {
    id: "musyawarah-4",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (3).webp",
    title: "Diskusi Struktur & Pembidangan Pengurus",
    desc: "Perumusan tugas pokok dan fungsi (tupoksi) Badan Pengurus Harian dan bidang kegiatan."
  },
  {
    id: "musyawarah-5",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (4).webp",
    title: "Musyawarah Mufakat & Penetapan",
    desc: "Mencapai kata sepakat dan mufakat secara kekeluargaan dan berlandaskan ukhuwah Islamiyah."
  },
  {
    id: "musyawarah-6",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (5).webp",
    title: "Penandatanganan Berita Acara & Pengesahan",
    desc: "Pengesahan resmi dokumen AD/ART IRMAS Periode 2025/2027 oleh Ketua IRMAS dan DKM."
  },
  {
    id: "musyawarah-7",
    url: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (6).webp",
    title: "Foto Dokumentasi Kegiatan Pembentukan IRMAS",
    desc: "Dokumentasi kebersamaan seluruh peserta musyawarah pembentukan IRMAS Masjid Jamie Al-Ikhlas."
  }
];

export const maulidPhotos: { id: string; url: string; title: string; desc: string }[] = [
  {
    id: "maulid-cover",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se.webp",
    title: "Peringatan Maulid Nabi Muhammad SAW 1447 H",
    desc: "Dokumentasi utama peringatan Maulid Nabi Muhammad SAW 1447 Hijriah di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-1",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (1).webp",
    title: "Pembacaan Rawi & Sholawat Nabi",
    desc: "Lantunan sholawat dan pembacaan kitab maulid bersama jamaah dan remaja masjid."
  },
  {
    id: "maulid-2",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (2).webp",
    title: "Jamaah Menyimak Tausiyah Maulid",
    desc: "Kekhidmatan jamaah dalam mendengarkan tausiyah hikmah peringatan Maulid Nabi SAW."
  },
  {
    id: "maulid-3",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (3).webp",
    title: "Kebersamaan Pemuda IRMAS di Acara Maulid",
    desc: "Semangat gotong royong pemuda IRMAS dalam menyukseskan peringatan hari besar Islam."
  },
  {
    id: "maulid-4",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (4).webp",
    title: "Suasana Ruang Utama Masjid Jamie Al-Ikhlas",
    desc: "Penuhnya jamaah memadati ruang utama masjid dalam rangka syiar maulid."
  },
  {
    id: "maulid-5",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (5).webp",
    title: "Tausiyah Agama Oleh Alim Ulama",
    desc: "Penyampaian pesan-pesan keteladanan akhlak Rasulullah SAW untuk generasi muda."
  },
  {
    id: "maulid-6",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (6).webp",
    title: "Dokumentasi Acara Maulid Nabi SAW",
    desc: "Rangkaian acara peringatan maulid nabi yang tertib, khidmat, dan penuh berkah."
  },
  {
    id: "maulid-7",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (7).webp",
    title: "Partisipasi Jamaah & Remaja Masjid",
    desc: "Antusiasme jamaah bapak-bapak, ibu-ibu, dan pemuda dalam memperingati hari lahir Nabi SAW."
  },
  {
    id: "maulid-8",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (8).webp",
    title: "Gema Sholawat & Doa Bersama",
    desc: "Momen doa bersama memohon keberkahan dan ampunan bagi segenap jamaah masjid."
  },
  {
    id: "maulid-9",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (9).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (9)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-10",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (10).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (10)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-11",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (11).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (11)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-12",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (12).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (12)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-13",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (13).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (13)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-14",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (14).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (14)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-15",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (15).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (15)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-16",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (16).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (16)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-17",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (17).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (17)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  },
  {
    id: "maulid-18",
    url: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (18).webp",
    title: "Dokumentasi Kegiatan Peringatan Maulid (18)",
    desc: "Suasana kegiatan maulid nabi 27 September 2025 di Masjid Jamie Al-Ikhlas."
  }
];

export const galleryData: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Musyawarah Pembentukan & Pembahasan AD/ART IRMAS",
    category: "pelatihan",
    date: "20 Desember 2024",
    location: "Masjid Jamie Al-Ikhlas, Graha Bhakti Kodam Jaya",
    imageUrl: "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl.webp",
    images: [
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl.webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (1).webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (2).webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (3).webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (4).webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (5).webp",
      "/dokumentasi musyawarah/Dokumentasi kegiatan Pembentukan & pengesahan Ikatan Remaja Masjid (IRMAS) Masjid Jamie Al-Ikhl (6).webp"
    ],
    description: "Musyawarah penetapan dan pengesahan Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) Periode 2025/2027 bersama DKM dan remaja masjid di Masjid Jamie Al-Ikhlas RT 04/05 Jatibaru.",
    participants: 45,
    highlight: true
  },
  {
    id: "gal-2",
    title: "Peringatan Maulid Nabi Muhammad SAW 1447 Hijriah",
    category: "phbi",
    date: "27 September 2025 (12 Rabiul Awal 1447 H)",
    location: "Ruang Utama Masjid Jamie Al-Ikhlas",
    imageUrl: "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se.webp",
    images: [
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se.webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (1).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (2).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (3).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (4).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (5).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (6).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (7).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (8).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (9).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (10).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (11).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (12).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (13).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (14).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (15).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (16).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (17).webp",
      "/dokumentasi maulid 1447 H/Dokumentasi kegiatan maulid nabi Muhammad Saw pada tanggal 27 September 2025 kegiatan ini di se (18).webp"
    ],
    description: "Dokumentasi kegiatan peringatan Maulid Nabi Muhammad SAW 1447 Hijriah pada tanggal 27 September 2025 di Masjid Jamie Al-Ikhlas bersama seluruh jamaah, pemuda IRMAS, dan alim ulama.",
    participants: 250,
    highlight: true
  }
];

