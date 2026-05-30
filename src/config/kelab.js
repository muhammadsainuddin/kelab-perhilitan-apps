// ============================================================
// Maklumat Rasmi Pertubuhan — Kelab PERHILITAN
// Satu sumber kebenaran untuk resit, slip, laporan & paparan.
// Kemas kini di sini sahaja jika butiran berubah.
// ============================================================

export const KELAB = {
  nama: 'Kelab Sukan dan Kebajikan Jabatan Perlindungan Hidupan Liar dan Taman Negara (Kelab PERHILITAN)',
  namaPendek: 'Kelab PERHILITAN',
  noPertubuhan: 'PPM-006-14-27071985',
  alamat: 'Ibu Pejabat Jabatan Perlindungan Hidupan Liar dan Taman Negara (PERHILITAN), KM.10 Jalan Cheras, 56100 Cheras Kuala Lumpur.',
  emel: 'kelabperhilitan@gmail.com',
};

// Blok header HTML untuk dokumen cetakan (resit/slip/laporan).
// Guna dalam window.open(...).document.write(`... ${headerResitHTML(subtajuk)} ...`)
export const headerResitHTML = (subtajuk = '') => `
  <div class="kp-header" style="text-align:center;border-bottom:2px solid #0F4C3A;padding-bottom:14px;margin-bottom:18px">
    <h1 style="font-size:15px;color:#0F4C3A;letter-spacing:.5px;margin:0;line-height:1.35">${KELAB.nama}</h1>
    <p style="font-size:10px;color:#555;margin:4px 0 0">No. Pendaftaran: ${KELAB.noPertubuhan}</p>
    <p style="font-size:10px;color:#777;margin:2px 0 0;line-height:1.4">${KELAB.alamat}</p>
    <p style="font-size:10px;color:#777;margin:2px 0 0">E-mel: ${KELAB.emel}</p>
    ${subtajuk ? `<p style="font-size:11px;color:#0F4C3A;font-weight:bold;margin:8px 0 0">${subtajuk}</p>` : ''}
  </div>
`;

// Blok footer HTML untuk dokumen cetakan.
export const footerResitHTML = () => `
  <div class="kp-footer" style="text-align:center;margin-top:28px;padding-top:12px;border-top:1px solid #eee;font-size:9px;color:#999;line-height:1.5">
    <p style="margin:0">${KELAB.namaPendek} &bull; No. Pendaftaran ${KELAB.noPertubuhan}</p>
    <p style="margin:2px 0 0">Dokumen ini dijana secara automatik oleh sistem. Sah tanpa tandatangan.</p>
  </div>
`;

// ============================================================
// Resit / Invois Transaksi FPX (gaya invois kedai) — buka tetingkap cetak.
// Pengguna boleh "Save as PDF" melalui dialog cetak pelayar.
// tx     : { billCode, amaun, status, keterangan, tarikh }
// profil : { nama_penuh, no_kp }
// ============================================================
export const cetakResitTransaksi = (tx, profil = {}) => {
  if (!tx) return;
  const rm = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const status = (tx.status || '').toUpperCase();
  const warnaStatus = status === 'BERJAYA' ? '#047857' : (status === 'PENDING' ? '#b45309' : '#b91c1c');
  const bgStatus    = status === 'BERJAYA' ? '#d1fae5' : (status === 'PENDING' ? '#fef3c7' : '#fee2e2');
  const labelStatus = status === 'BERJAYA' ? 'LUNAS / BERJAYA' : (status === 'PENDING' ? 'BELUM SELESAI' : (status || '—'));
  const isKedai = /kedai|pesanan|pembelian/i.test(tx.keterangan || '');

  const w = window.open('', '_blank', 'width=760,height=720');
  w.document.write(`<html><head><title>Resit ${esc(tx.billCode || '')}</title><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:38px;color:#222;max-width:620px;margin:auto}
    .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:bold;background:${bgStatus};color:${warnaStatus}}
    .meta{display:flex;justify-content:space-between;align-items:flex-start;margin:18px 0}
    .box{background:#f9fafb;border:1px solid #eee;border-radius:10px;padding:14px 16px;margin:10px 0}
    .cap{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.5px;font-weight:bold;margin-bottom:8px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#0F4C3A;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase}
    td{padding:9px 10px;border-bottom:1px solid #eee}
    .tot{display:flex;justify-content:space-between;align-items:center;background:#0F4C3A;color:#fff;border-radius:10px;padding:12px 16px;margin-top:12px}
    .tot .big{font-size:20px;font-weight:bold}
    .r{display:flex;justify-content:space-between;font-size:12px;margin:5px 0}
    .r .l{color:#888}.r .v{font-weight:bold;text-align:right}
    @media print{body{padding:14px}}
  </style></head><body>
  ${headerResitHTML(`Resit Rasmi ${isKedai ? 'Pembelian Kedai' : 'Pembayaran'} &bull; Dicetak: ${tarikhCetak}`)}
  <div class="meta">
    <div>
      <div class="cap">Resit Untuk</div>
      <div style="font-weight:bold;font-size:13px">${esc(profil.nama_penuh || profil.nama || '—')}</div>
      <div style="font-size:11px;color:#666;font-family:monospace">${esc(profil.no_kp || '')}</div>
    </div>
    <div style="text-align:right">
      <div class="cap">No. Resit / BillCode</div>
      <div style="font-weight:bold;font-family:monospace;font-size:12px">${esc(tx.billCode || '—')}</div>
      <div style="margin-top:8px"><span class="badge">${labelStatus}</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>Keterangan</th><th style="text-align:center;width:60px">Kuantiti</th><th style="text-align:right;width:120px">Amaun</th></tr></thead>
    <tbody>
      <tr><td>${esc(tx.keterangan || 'Transaksi')}<div style="font-size:10px;color:#888;margin-top:2px">Tarikh: ${esc(tx.tarikh || '—')}</div></td><td style="text-align:center">1</td><td style="text-align:right">${rm(tx.amaun)}</td></tr>
    </tbody>
  </table>
  <div class="tot"><span style="font-size:12px;text-transform:uppercase;letter-spacing:1px">Jumlah Dibayar</span><span class="big">${rm(tx.amaun)}</span></div>
  <div class="box" style="margin-top:18px">
    <div class="r"><span class="l">Kaedah Pembayaran</span><span class="v">FPX / ToyyibPay</span></div>
    <div class="r"><span class="l">Status Transaksi</span><span class="v" style="color:${warnaStatus}">${labelStatus}</span></div>
  </div>
  ${footerResitHTML()}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};

// ============================================================
// Resit / Invois Pesanan Kedai (dengan senarai item) — buka tetingkap cetak.
// p      : { id, billCode, jumlah_keseluruhan, is_percuma, status_pesanan, tarikh_pesanan,
//           items:[{ nama_produk, saiz, kuantiti, harga_seunit }] }
// profil : { nama_penuh, no_kp }
// ============================================================
export const cetakResitPesananKedai = (p, profil = {}) => {
  if (!p) return;
  const rm = (v) => 'RM ' + parseFloat(v || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const tarikhCetak = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const percuma = !!p.is_percuma;
  const status = (p.status_pesanan || '').toUpperCase();
  const warnaStatus = ['DIBAYAR','DIPROSES','SELESAI'].includes(status) ? '#047857' : (status === 'PENDING' ? '#b45309' : '#b91c1c');
  const bgStatus    = ['DIBAYAR','DIPROSES','SELESAI'].includes(status) ? '#d1fae5' : (status === 'PENDING' ? '#fef3c7' : '#fee2e2');

  const baris = (p.items || []).map(it => {
    const sub = percuma ? 0 : parseFloat(it.harga_seunit || 0) * parseInt(it.kuantiti || 0);
    return `<tr><td>${esc(it.nama_produk)}${it.saiz ? ` <span style="color:#0F4C3A;font-weight:bold">(${esc(it.saiz)})</span>` : ''}</td>
      <td style="text-align:center">${it.kuantiti}</td>
      <td style="text-align:right">${percuma ? 'PERCUMA' : rm(it.harga_seunit)}</td>
      <td style="text-align:right">${percuma ? 'PERCUMA' : rm(sub)}</td></tr>`;
  }).join('');

  const w = window.open('', '_blank', 'width=760,height=760');
  w.document.write(`<html><head><title>Resit Pesanan #${esc(p.id || '')}</title><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:38px;color:#222;max-width:640px;margin:auto}
    .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:11px;font-weight:bold;background:${bgStatus};color:${warnaStatus}}
    .meta{display:flex;justify-content:space-between;align-items:flex-start;margin:18px 0}
    .cap{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.5px;font-weight:bold;margin-bottom:8px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#0F4C3A;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase}
    td{padding:9px 10px;border-bottom:1px solid #eee}
    .tot{display:flex;justify-content:space-between;align-items:center;background:#0F4C3A;color:#fff;border-radius:10px;padding:12px 16px;margin-top:12px}
    .tot .big{font-size:20px;font-weight:bold}
    @media print{body{padding:14px}}
  </style></head><body>
  ${headerResitHTML(`Resit Rasmi Pembelian Kedai &bull; Dicetak: ${tarikhCetak}`)}
  <div class="meta">
    <div>
      <div class="cap">Resit Untuk</div>
      <div style="font-weight:bold;font-size:13px">${esc(profil.nama_penuh || profil.nama || '—')}</div>
      <div style="font-size:11px;color:#666;font-family:monospace">${esc(profil.no_kp || '')}</div>
    </div>
    <div style="text-align:right">
      <div class="cap">No. Pesanan</div>
      <div style="font-weight:bold;font-family:monospace;font-size:12px">#${esc(p.id || '—')}</div>
      ${p.billCode ? `<div style="font-size:10px;color:#666;font-family:monospace">${esc(p.billCode)}</div>` : ''}
      <div style="margin-top:8px"><span class="badge">${esc(p.status_pesanan || '—')}</span></div>
      <div style="font-size:10px;color:#888;margin-top:6px">${esc(p.tarikh_pesanan || '')}</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Produk</th><th style="text-align:center;width:50px">Kuantiti</th><th style="text-align:right;width:90px">Harga</th><th style="text-align:right;width:100px">Subjumlah</th></tr></thead>
    <tbody>${baris}</tbody>
  </table>
  <div class="tot"><span style="font-size:12px;text-transform:uppercase;letter-spacing:1px">Jumlah Keseluruhan</span><span class="big">${percuma ? 'PERCUMA' : rm(p.jumlah_keseluruhan)}</span></div>
  ${footerResitHTML()}
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
};
