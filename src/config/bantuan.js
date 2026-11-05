// Satu sumber kebenaran untuk pilihan kategori bantuan kebajikan.
// Digunakan oleh borang ahli, borang bagi pihak waris dan borang sunting admin.
export const KUMPULAN_BANTUAN = [
  {
    label: 'Khairat Kematian',
    pilihan: [
      { nilai: 'Khairat Kematian', label: 'Khairat Kematian', kunciKadar: 'khairat_kematian', amaunDefault: 1000 },
    ],
  },
  {
    label: 'Kemalangan',
    pilihan: [
      { nilai: 'Kemalangan - Rawatan Luar (Tanpa Wad)', label: 'Kemalangan: Rawatan Luar (Tanpa Wad)', kunciKadar: 'kemalangan_rawatan_luar', amaunDefault: 100 },
      { nilai: 'Kemalangan - Dimasukkan Wad', label: 'Kemalangan: Dimasukkan Wad', kunciKadar: 'kemalangan_wad', amaunDefault: 100 },
    ],
  },
  {
    label: 'Bencana',
    pilihan: [
      { nilai: 'Bencana Alam - Banjir', label: 'Bencana: Banjir', kunciKadar: 'bencana_banjir', amaunDefault: 300 },
      { nilai: 'Bencana Alam - Kebakaran', label: 'Bencana: Kebakaran', kunciKadar: 'bencana_kebakaran', amaunDefault: 300 },
      { nilai: 'Bencana Alam - Lain-lain', label: 'Bencana: Lain-lain (nyatakan dalam butiran)' },
    ],
  },
  {
    label: 'Lain-lain',
    pilihan: [
      { nilai: 'Kes Kritikal / Luar Jangka', label: 'Kes Kritikal / Luar Jangka (nyatakan jenis)' },
      { nilai: 'Persaraan', label: 'Persaraan', kunciKadar: 'persaraan', amaunDefault: 400 },
    ],
  },
];

export const PETA_KUNCI_BANTUAN = Object.fromEntries(
  KUMPULAN_BANTUAN.flatMap(kumpulan =>
    kumpulan.pilihan
      .filter(pilihan => pilihan.kunciKadar)
      .map(pilihan => [pilihan.nilai, pilihan.kunciKadar])
  )
);

export const labelPilihanBantuan = (pilihan, kadarMap = {}) => {
  if (!pilihan.kunciKadar) return pilihan.label;

  const amaun = kadarMap[pilihan.kunciKadar] ?? pilihan.amaunDefault;
  const amaunPaparan = Number(amaun).toLocaleString('ms-MY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${pilihan.label} — RM${amaunPaparan}`;
};
