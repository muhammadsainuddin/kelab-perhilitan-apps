
<template>
  <div class="w-full space-y-6">

    <!-- TOOLBAR -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Stat kad -->
      <div class="grid grid-cols-3 gap-3 w-full lg:max-w-2xl">
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Jumlah Acara</p>
          <p class="text-2xl font-black text-gray-900 mt-0.5">{{ jumlahAcara }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Aktif</p>
          <p class="text-2xl font-black text-emerald-600 mt-0.5">{{ jumlahAktif }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 shadow-sm">
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Peserta</p>
          <p class="text-2xl font-black text-gray-900 mt-0.5">{{ jumlahPeserta }}</p>
        </div>
      </div>

      <button @click="bukaBorangBaru"
        class="shrink-0 bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-sm">Tambah Acara Baru</span>
      </button>
    </div>

    <div v-if="successMsg" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium flex items-center gap-2">
      <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      {{ successMsg }}
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-16 text-center text-gray-500 font-medium">Memuatkan data dari pelayan...</div>

      <div v-else-if="senaraiAcara.length === 0" class="p-16 flex flex-col items-center text-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-800">Tiada rekod acara</p>
          <p class="text-xs text-gray-400 mt-0.5">Klik "Tambah Acara Baru" untuk mula.</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead class="bg-gray-50/80 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Acara</th>
              <th class="px-6 py-4">Lokasi & Tarikh</th>
              <th class="px-6 py-4">Ketetapan Sukan</th>
              <th class="px-6 py-4 text-center">Peserta</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-700">
            <tr v-for="acara in senaraiAcara" :key="acara.id" class="hover:bg-gray-50/60 transition-colors">
              <!-- Acara -->
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900 leading-snug">{{ acara.nama_acara }}</div>
                <span class="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F4C3A]/8 text-[#0F4C3A] uppercase tracking-wide">{{ acara.jenis_acara }}</span>
              </td>
              <!-- Lokasi & Tarikh -->
              <td class="px-6 py-4">
                <div class="font-semibold text-gray-800">{{ acara.lokasi || 'Tiada Lokasi' }}</div>
                <div class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ formatTarikhPapar(acara.tarikh_acara) }}
                </div>
              </td>
              <!-- Ketetapan Sukan -->
              <td class="px-6 py-4">
                <div v-if="acara.jenis_acara === 'SUKAN'">
                  <div class="flex flex-wrap gap-1 max-w-[260px]">
                    <span v-for="sukan in safeParseJSON(acara.senarai_sukan)" :key="sukan" class="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-medium">
                      {{ sukan }}
                    </span>
                    <span v-if="safeParseJSON(acara.senarai_sukan).length === 0" class="text-xs text-gray-300 italic">Belum ditetapkan</span>
                  </div>
                  <div class="text-[11px] mt-1.5 font-semibold flex items-center gap-1" :class="acara.benarkan_pelbagai_sukan ? 'text-indigo-600' : 'text-gray-400'">
                    {{ acara.benarkan_pelbagai_sukan ? '✓ Pelbagai sukan dibenarkan' : 'Had 1 sukan sahaja' }}
                  </div>
                </div>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
              <!-- Peserta -->
              <td class="px-6 py-4 text-center">
                <button @click="paparkanPeserta(acara)" class="bg-gray-100 hover:bg-emerald-50 text-gray-800 hover:text-emerald-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
                  {{ acara.jumlah_peserta || 0 }} Orang
                </button>
              </td>
              <!-- Status -->
              <td class="px-6 py-4">
                <span v-if="acara.status === 'AKTIF'" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>AKTIF
                </span>
                <span v-else-if="acara.status === 'TUTUP'" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>TUTUP
                </span>
                <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>SELESAI
                </span>
              </td>
              <!-- Tindakan -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <button @click="bukaAnalisis(acara)" title="Analisis Penyertaan"
                    class="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </button>
                  <button @click="bukaBorangEdit(acara)" title="Edit"
                    class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button @click="padamAcaraId(acara.id)" title="Padam"
                    class="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══════════════ MODAL BORANG ═══════════════ -->
    <Transition name="modal-fade">
      <div v-if="paparanModalBorang" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-stretch md:items-center justify-center md:p-6">
        <div class="bg-white w-full md:max-w-3xl md:rounded-2xl shadow-2xl flex flex-col max-h-screen md:max-h-[92vh] overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Pengurusan Acara</p>
              <h3 class="text-lg font-black text-gray-900">{{ modEdit ? 'Kemaskini Maklumat Acara' : 'Cipta Acara Baru' }}</h3>
            </div>
            <button @click="paparanModalBorang = false" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">✕</button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5 overflow-y-auto">
            <div v-if="errorMsg" class="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-medium">{{ errorMsg }}</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nama Acara</label>
                <input type="text" v-model="form.nama_acara" placeholder="cth: Karnival Sukan PERHILITAN" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Kategori Aktiviti</label>
                <select v-model="form.jenis_acara" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
                  <option value="SUKAN">SUKAN & PERTANDINGAN</option>
                  <option value="KEBAJIKAN">SUMBANGAN & KEBAJIKAN</option>
                  <option value="SOSIAL">SOSIAL & KESUKARELAAN</option>
                  <option value="MESYUARAT">MESYUARAT & RAIKAN</option>
                </select>
              </div>
            </div>

            <!-- Konfigurasi Sukan -->
            <div v-if="form.jenis_acara === 'SUKAN'" class="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/70 space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="text-[11px] font-black text-emerald-800 tracking-wider uppercase">Konfigurasi Sukan Dipertandingkan</h4>
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-bold text-gray-600">Benarkan > 1 sukan?</span>
                  <button type="button" @click="form.benarkan_pelbagai_sukan = !form.benarkan_pelbagai_sukan"
                          :class="form.benarkan_pelbagai_sukan ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'"
                          class="w-11 h-6 rounded-full p-0.5 flex items-center transition-colors duration-200">
                    <span class="bg-white w-5 h-5 rounded-full shadow-sm"></span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Klik untuk pilih / buang sukan:</label>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" v-for="sukan in sukanPreset" :key="sukan" @click="toggleSukanPreset(sukan)"
                          :class="form.senarai_sukan.includes(sukan) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'"
                          class="text-xs px-2.5 py-1.5 border rounded-lg font-semibold transition-all">
                    {{ sukan }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">Atau taip sukan lain:</label>
                <div class="flex gap-2">
                  <input type="text" v-model="inputSukanManual" @keyup.enter="tambahSukanKeSenarai" placeholder="cth: Gasing Moden, Tarik Tali" class="w-full border border-gray-200 rounded-xl p-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
                  <button type="button" @click="tambahSukanKeSenarai" class="bg-gray-800 text-white px-4 py-2 text-xs font-bold rounded-xl hover:bg-gray-900 transition-colors shrink-0">Tambah</button>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1.5">Senarai dipilih ({{ form.senarai_sukan.length }}):</label>
                <div v-if="form.senarai_sukan.length === 0" class="text-xs text-gray-400 italic">Sila pilih sekurang-kurangnya satu sukan.</div>
                <div v-else class="flex flex-wrap gap-1.5">
                  <span v-for="sukan in form.senarai_sukan" :key="sukan" class="inline-flex items-center gap-1 text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                    {{ sukan }}
                    <button type="button" @click="padamSukanDariSenarai(sukan)" class="text-rose-500 hover:text-rose-700 font-bold ml-0.5 text-sm leading-none">×</button>
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Lokasi Aktiviti</label>
                <input type="text" v-model="form.lokasi" placeholder="cth: Stadium MSN, Bukit Jalil" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
              <div v-if="modEdit">
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Status Sesi</label>
                <select v-model="form.status" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
                  <option value="AKTIF">AKTIF (Daftar Terbuka)</option>
                  <option value="TUTUP">TUTUP (Pendaftaran Ditutup)</option>
                  <option value="SELESAI">SELESAI (Sesi Tamat)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tarikh Acara Mula</label>
                <input type="date" v-model="form.tarikh_acara" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Tarikh Tutup Pendaftaran</label>
                <input type="date" v-model="form.tarikh_tutup" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">E-mel Urusetia</label>
                <input type="email" v-model="form.emel_urusetia" placeholder="urusetia@kelabperhilitan.my" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">No. Telefon Urusetia</label>
                <input type="text" v-model="form.no_tel_urusetia" placeholder="013X-XXXXXXX" class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500">
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Keterangan / Atur Cara</label>
              <textarea v-model="form.keterangan" rows="3" placeholder="Perincian kelayakan pakaian, syarat peserta, jadual, dsb." class="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"></textarea>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1.5">Muat Naik Poster</label>
              <input type="file" @change="handleFileChange" accept="image/*" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200">
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 shrink-0 bg-gray-50/50">
            <button @click="paparanModalBorang = false" class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">Batal</button>
            <button @click="simpanBorangAcara" class="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-colors">
              {{ modEdit ? 'Kemaskini Sesi' : 'Cipta Acara' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════ MODAL PESERTA ═══════════════ -->
    <Transition name="modal-fade">
      <div v-if="paparanModalPeserta" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-stretch md:items-center justify-center md:p-6">
        <div class="bg-white w-full md:max-w-5xl md:rounded-2xl shadow-2xl flex flex-col max-h-screen md:max-h-[90vh] overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Senarai Pendaftar</p>
              <h3 class="text-lg font-black text-gray-900">{{ namaAcaraDipilih }}</h3>
            </div>
            <button @click="paparanModalPeserta = false" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">✕</button>
          </div>

          <div class="p-6 overflow-y-auto">
            <div v-if="senaraiPeserta.length === 0" class="text-center py-12 text-gray-400 italic">Belum ada penyertaan ahli direkodkan.</div>
            <div v-else class="overflow-x-auto border border-gray-100 rounded-xl">
              <table class="min-w-full text-left text-xs divide-y divide-gray-100">
                <thead class="bg-gray-50 font-bold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th class="px-4 py-3">No. Ahli</th>
                    <th class="px-4 py-3">Nama Pegawai</th>
                    <th class="px-4 py-3">Penempatan / PTJ</th>
                    <th class="px-4 py-3">Sukan Dipilih</th>
                    <th class="px-4 py-3">Catatan</th>
                    <th class="px-4 py-3">Tarikh Daftar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="p in senaraiPeserta" :key="p.id" class="hover:bg-gray-50/50">
                    <td class="px-4 py-3 font-bold text-gray-900">{{ p.no_ahli || 'Bukan Ahli' }}</td>
                    <td class="px-4 py-3">
                      <div class="font-semibold text-gray-800">{{ p.nama_pegawai }}</div>
                      <div class="text-[10px] text-gray-400 mt-0.5">KP: {{ p.no_kp }}</div>
                    </td>
                    <td class="px-4 py-3 text-gray-600">{{ p.penempatan || '—' }}</td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        <span v-for="sukan in safeParseJSON(p.sukan_dipilih)" :key="sukan" class="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded text-[10px]">
                          {{ sukan }}
                        </span>
                        <span v-if="safeParseJSON(p.sukan_dipilih).length === 0" class="text-gray-400 italic">Umum / Semua</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-500 italic max-w-[180px] truncate">{{ p.catatan || '—' }}</td>
                    <td class="px-4 py-3 text-gray-400">{{ formatTarikhPapar(p.tarikh_daftar) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════ PANEL ANALISIS FULLSCREEN ═══════════════ -->
    <Teleport to="body">
      <Transition name="slide-in">
        <div v-if="analisisPanel" class="fixed inset-0 z-[60] bg-[#F8FAFC] flex flex-col overflow-hidden">

          <!-- Top Bar -->
          <div class="shrink-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-4">
              <button @click="analisisPanel = false"
                class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">Analisis Penyertaan</p>
                <h2 class="text-base font-black text-gray-900 leading-tight">{{ analisisData?.acara?.nama_acara || '...' }}</h2>
              </div>
            </div>
            <div class="text-xs text-gray-400 font-medium hidden sm:block">
              {{ analisisData?.acara?.tarikh_acara ? formatTarikhPapar(analisisData.acara.tarikh_acara) : '' }}
            </div>
          </div>

          <!-- Loading -->
          <div v-if="analisisLoading" class="flex-1 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3 text-gray-400">
              <div class="w-8 h-8 rounded-full border-2 border-amber-300 border-t-transparent animate-spin"></div>
              <p class="text-sm font-medium">Memuatkan analisis...</p>
            </div>
          </div>

          <div v-else-if="analisisData" class="flex-1 overflow-y-auto p-6 space-y-6">

            <!-- ── RINGKASAN ATAS ── -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="bg-[#0F4C3A] text-white rounded-2xl px-5 py-4 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider opacity-60">Jumlah Peserta</p>
                <p class="text-3xl font-black mt-1">{{ analisisData.ringkasan.jumlah_peserta }}</p>
              </div>
              <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pegawai</p>
                <p class="text-3xl font-black text-gray-900 mt-1">{{ analisisData.ringkasan.pegawai }}</p>
              </div>
              <div class="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sokongan</p>
                <p class="text-3xl font-black text-gray-900 mt-1">{{ analisisData.ringkasan.sokongan }}</p>
              </div>
              <div class="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 shadow-sm">
                <p class="text-[10px] font-bold uppercase tracking-wider text-amber-600">Bil. Sukan</p>
                <p class="text-3xl font-black text-amber-700 mt-1">{{ analisisData.per_sukan.length }}</p>
              </div>
            </div>

            <!-- ── JADUAL RINGKASAN + SAIZ BAJU ── -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

              <!-- Jadual Per Sukan -->
              <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-gray-100">
                  <h3 class="text-sm font-black text-gray-900">Ringkasan Per Sukan</h3>
                </div>
                <table class="min-w-full text-sm divide-y divide-gray-100">
                  <thead class="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th class="px-4 py-3 text-left">Acara / Sukan</th>
                      <th class="px-4 py-3 text-center">Peserta</th>
                      <th class="px-4 py-3 text-center">Pegawai</th>
                      <th class="px-4 py-3 text-center">Sokongan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="s in analisisData.per_sukan" :key="s.sukan"
                        @click="sukanAktif = s.sukan"
                        :class="sukanAktif === s.sukan ? 'bg-amber-50' : 'hover:bg-gray-50/60 cursor-pointer'"
                        class="transition-colors">
                      <td class="px-4 py-3 font-semibold text-gray-800 flex items-center gap-2">
                        <span v-if="sukanAktif === s.sukan" class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        {{ s.sukan }}
                      </td>
                      <td class="px-4 py-3 text-center font-black text-gray-900">{{ s.jumlah }}</td>
                      <td class="px-4 py-3 text-center text-[#0F4C3A] font-bold">{{ s.pegawai }}</td>
                      <td class="px-4 py-3 text-center text-indigo-600 font-bold">{{ s.sokongan }}</td>
                    </tr>
                    <tr class="bg-gray-50 font-black text-gray-700 text-xs uppercase">
                      <td class="px-4 py-3">JUMLAH</td>
                      <td class="px-4 py-3 text-center">{{ analisisData.ringkasan.jumlah_peserta }}</td>
                      <td class="px-4 py-3 text-center text-[#0F4C3A]">{{ analisisData.ringkasan.pegawai }}</td>
                      <td class="px-4 py-3 text-center text-indigo-600">{{ analisisData.ringkasan.sokongan }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Statistik Saiz Baju -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-gray-100">
                  <h3 class="text-sm font-black text-gray-900">Saiz Baju</h3>
                </div>
                <div class="p-4 space-y-1.5">
                  <div v-for="s in analisisData.statistik_saiz" :key="s.saiz" class="flex items-center gap-3">
                    <span class="w-12 text-[11px] font-black text-gray-600 uppercase">{{ s.saiz }}</span>
                    <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div class="h-2 rounded-full bg-[#0F4C3A] transition-all duration-500"
                        :style="`width: ${analisisData.ringkasan.jumlah_peserta > 0 ? (s.bilangan / analisisData.ringkasan.jumlah_peserta * 100).toFixed(1) : 0}%`">
                      </div>
                    </div>
                    <span class="w-8 text-right text-[11px] font-black text-gray-700">{{ s.bilangan }}</span>
                  </div>
                  <div class="pt-2 border-t border-gray-100 flex justify-between text-[11px] font-black text-gray-600 uppercase mt-2">
                    <span>JUMLAH</span>
                    <span>{{ analisisData.statistik_saiz.reduce((t,s)=>t+s.bilangan,0) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── SENARAI PESERTA PER SUKAN + INPUT JERSI ── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <!-- Tab sukan -->
              <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
                <button v-for="s in analisisData.per_sukan" :key="s.sukan"
                  @click="sukanAktif = s.sukan"
                  :class="sukanAktif === s.sukan
                    ? 'bg-[#0F4C3A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
                  {{ s.sukan }}
                  <span class="ml-1 opacity-70">{{ s.jumlah }}</span>
                </button>
              </div>

              <!-- Header tab aktif -->
              <div v-if="sukanAktifData" class="px-5 py-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                <div class="text-sm font-black text-gray-800">
                  {{ sukanAktifData.sukan }}
                  <span class="text-xs font-semibold text-gray-400 ml-2">{{ sukanAktifData.jumlah }} peserta</span>
                </div>
                <div class="flex gap-3 text-xs font-bold">
                  <span class="text-[#0F4C3A]">Pegawai: {{ sukanAktifData.pegawai }}</span>
                  <span class="text-indigo-600">Sokongan: {{ sukanAktifData.sokongan }}</span>
                </div>
              </div>

              <!-- Jadual peserta + jersi -->
              <div v-if="sukanAktifData" class="overflow-x-auto">
                <table class="min-w-full text-xs divide-y divide-gray-100">
                  <thead class="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th class="px-4 py-3 text-left w-8">#</th>
                      <th class="px-4 py-3 text-left">Nama Pegawai</th>
                      <th class="px-4 py-3 text-left">Gred</th>
                      <th class="px-4 py-3 text-left">Kategori</th>
                      <th class="px-4 py-3 text-left">Penempatan</th>
                      <th class="px-4 py-3 text-left">Saiz Baju</th>
                      <th class="px-4 py-3 text-left">No. Jersi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    <tr v-for="(p, idx) in sukanAktifData.peserta" :key="p.penyertaan_id" class="hover:bg-gray-50/60">
                      <td class="px-4 py-3 text-gray-400 font-bold">{{ idx + 1 }}</td>
                      <td class="px-4 py-3">
                        <div class="font-semibold text-gray-800">{{ p.nama_pegawai }}</div>
                        <div class="text-[10px] text-gray-400 mt-0.5">{{ p.no_ahli !== '—' ? 'Ahli: ' + p.no_ahli : p.no_kp }}</div>
                      </td>
                      <td class="px-4 py-3 font-semibold text-gray-700">{{ p.gred }}</td>
                      <td class="px-4 py-3">
                        <span :class="p.kategori === 'pegawai'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'"
                          class="px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase">
                          {{ p.kategori === 'pegawai' ? 'Pegawai' : 'Sokongan' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-gray-600">{{ p.penempatan }}</td>
                      <td class="px-4 py-3">
                        <span class="font-bold text-gray-700 px-2 py-0.5 bg-gray-100 rounded-md">{{ p.saiz_baju }}</span>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-1.5">
                          <input
                            :value="jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                            @input="jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`] = $event.target.value"
                            type="text" placeholder="—"
                            class="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
                          />
                          <button
                            @click="simpanJersi(p.penyertaan_id, sukanAktifData.sukan, jersiSimpan[`${p.penyertaan_id}_${sukanAktifData.sukan}`])"
                            :disabled="jersiLoading[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#0F4C3A] text-white hover:bg-[#0c3d2e] transition-colors disabled:opacity-50">
                            <span v-if="jersiLoading[`${p.penyertaan_id}_${sukanAktifData.sukan}`]"
                              class="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin">
                            </span>
                            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="p-10 text-center text-gray-400 italic text-sm">Tiada sukan dipilih.</div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../services/api';

// State Utama
const senaraiAcara = ref([]);
const senaraiPeserta = ref([]);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

// State Modul / Dialog
const paparanModalBorang = ref(false);
const paparanModalPeserta = ref(false);
const modEdit = ref(false);
const idAcaraDipilih = ref(null);
const namaAcaraDipilih = ref('');

// State Analisis Penyertaan
const analisisPanel = ref(false);
const analisisData = ref(null);
const analisisLoading = ref(false);
const sukanAktif = ref(null); // tab sukan yang sedang dipapar
const jersiSimpan = ref({}); // { penyertaan_id_sukan: nilai } — tracking input jersi
const jersiLoading = ref({}); // tracking save state

// Pilihan Sukan Preset (Siri Sukan Popular)
const sukanPreset = ['Bola Sepak', 'Futsal', 'Badminton', 'Bola Jaring', 'Dart', 'Sumpit', 'Bola Tampar', 'Tenis Meja'];
const inputSukanManual = ref('');

// Struktur Data Utama Borang Acara
const form = ref({
  nama_acara: '',
  jenis_acara: 'SUKAN',
  keterangan: '',
  lokasi: '',
  tarikh_acara: '',
  tarikh_tutup: '',
  emel_urusetia: '',
  no_tel_urusetia: '',
  status: 'AKTIF',
  senarai_sukan: [],
  benarkan_pelbagai_sukan: false
});

const filePoster = ref(null);

// Statistik ringkas untuk toolbar
const jumlahAcara = computed(() => senaraiAcara.value.length);
const jumlahAktif = computed(() => senaraiAcara.value.filter(a => a.status === 'AKTIF').length);
const jumlahPeserta = computed(() => senaraiAcara.value.reduce((t, a) => t + (Number(a.jumlah_peserta) || 0), 0));

// Header khas untuk muat naik fail (multipart) — auth disuntik oleh interceptor api
const multipartHeaders = { headers: { 'Content-Type': 'multipart/form-data' } };

// Fungsi Parse JSON Selamat untuk data dari Database
const safeParseJSON = (data) => {
  if (!data) return [];
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    return [];
  }
};

const formatTarikhPapar = (t) => t
  ? new Date(t).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

// 1. Tarik Senarai Semua Acara (Admin)
const muatNaikAcara = async () => {
  loading.value = true;
  try {
    const res = await api.get('/acara/admin/semua');
    if (res.data.success) {
      senaraiAcara.value = res.data.data;
    }
  } catch (err) {
    errorMsg.value = 'Gagal memuatkan senarai acara.';
  } finally {
    loading.value = false;
  }
};

// 2. Fungsi Tambah Sukan ke Senarai Pilihan Form
const tambahSukanKeSenarai = () => {
  const sukan = inputSukanManual.value.trim();
  if (sukan && !form.value.senarai_sukan.includes(sukan)) {
    form.value.senarai_sukan.push(sukan);
    inputSukanManual.value = '';
  }
};

const padamSukanDariSenarai = (sukan) => {
  form.value.senarai_sukan = form.value.senarai_sukan.filter(item => item !== sukan);
};

const toggleSukanPreset = (sukan) => {
  if (form.value.senarai_sukan.includes(sukan)) {
    padamSukanDariSenarai(sukan);
  } else {
    form.value.senarai_sukan.push(sukan);
  }
};

// Handle fail poster
const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    filePoster.value = e.target.files[0];
  }
};

// 3. Buka Borang Mod Cipta Baru
const bukaBorangBaru = () => {
  modEdit.value = false;
  idAcaraDipilih.value = null;
  filePoster.value = null;
  errorMsg.value = '';
  form.value = {
    nama_acara: '',
    jenis_acara: 'SUKAN',
    keterangan: '',
    lokasi: '',
    tarikh_acara: '',
    tarikh_tutup: '',
    emel_urusetia: '',
    no_tel_urusetia: '',
    status: 'AKTIF',
    senarai_sukan: [],
    benarkan_pelbagai_sukan: false
  };
  paparanModalBorang.value = true;
};

// 4. Buka Borang Mod Kemaskini (Edit)
const bukaBorangEdit = (acara) => {
  modEdit.value = true;
  idAcaraDipilih.value = acara.id;
  filePoster.value = null;
  errorMsg.value = '';

  // Format tarikh ke YYYY-MM-DD supaya input html dapat baca
  const formatTarikh = (dateStr) => dateStr ? dateStr.substring(0, 10) : '';

  form.value = {
    nama_acara: acara.nama_acara,
    jenis_acara: acara.jenis_acara,
    keterangan: acara.keterangan || '',
    lokasi: acara.lokasi || '',
    tarikh_acara: formatTarikh(acara.tarikh_acara),
    tarikh_tutup: formatTarikh(acara.tarikh_tutup),
    emel_urusetia: acara.emel_urusetia || '',
    no_tel_urusetia: acara.no_tel_urusetia || '',
    status: acara.status,
    senarai_sukan: safeParseJSON(acara.senarai_sukan),
    benarkan_pelbagai_sukan: acara.benarkan_pelbagai_sukan === 1
  };
  paparanModalBorang.value = true;
};

// 5. Simpan / Kemaskini Data via API
const simpanBorangAcara = async () => {
  errorMsg.value = '';
  successMsg.value = '';

  if (!form.value.nama_acara) {
    errorMsg.value = 'Nama acara wajib diisi.';
    return;
  }

  const formData = new FormData();
  formData.append('nama_acara', form.value.nama_acara);
  formData.append('jenis_acara', form.value.jenis_acara);
  formData.append('keterangan', form.value.keterangan);
  formData.append('lokasi', form.value.lokasi);
  formData.append('tarikh_acara', form.value.tarikh_acara);
  formData.append('tarikh_tutup', form.value.tarikh_tutup);
  formData.append('emel_urusetia', form.value.emel_urusetia);
  formData.append('no_tel_urusetia', form.value.no_tel_urusetia);
  formData.append('status', form.value.status);
  formData.append('benarkan_pelbagai_sukan', form.value.benarkan_pelbagai_sukan ? 'true' : 'false');

  // Hantar senarai sukan sebagai SATU JSON string (kukuh untuk 1 atau banyak item).
  // Bukan SUKAN → hantar '' supaya backend kosongkan senarai lama.
  const senaraiSukanPayload =
    form.value.jenis_acara === 'SUKAN' && form.value.senarai_sukan.length > 0
      ? JSON.stringify(form.value.senarai_sukan)
      : '';
  formData.append('senarai_sukan', senaraiSukanPayload);

  if (filePoster.value) {
    formData.append('poster', filePoster.value);
  }

  try {
    let res;
    if (modEdit.value) {
      res = await api.put(`/acara/admin/kemaskini/${idAcaraDipilih.value}`, formData, multipartHeaders);
    } else {
      res = await api.post('/acara/admin/cipta', formData, multipartHeaders);
    }

    if (res.data.success) {
      successMsg.value = res.data.message || 'Rekod acara berjaya disimpan!';
      paparanModalBorang.value = false;
      muatNaikAcara();
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Ralat sistem berlaku semasa menyimpan maklumat.';
  }
};

// 6. Padam Acara
const padamAcaraId = async (id) => {
  if (!confirm('Adakah anda pasti mahu memadam acara ini? Semua data pendaftaran peserta akan terhapus.')) return;
  try {
    const res = await api.delete(`/acara/admin/padam/${id}`);
    if (res.data.success) {
      muatNaikAcara();
      alert('Acara berjaya dipadam.');
    }
  } catch (err) {
    alert('Gagal memadam acara.');
  }
};

// 7. Lihat Senarai Peserta Berdaftar
const paparkanPeserta = async (acara) => {
  namaAcaraDipilih.value = acara.nama_acara;
  try {
    const res = await api.get(`/acara/admin/peserta/${acara.id}`);
    if (res.data.success) {
      senaraiPeserta.value = res.data.data;
      paparanModalPeserta.value = true;
    }
  } catch (err) {
    alert('Gagal mengambil senarai peserta.');
  }
};

// 8. Buka Panel Analisis
const bukaAnalisis = async (acara) => {
  analisisPanel.value = true;
  analisisLoading.value = true;
  analisisData.value = null;
  jersiSimpan.value = {};
  jersiLoading.value = {};
  try {
    const res = await api.get(`/acara/admin/analisis/${acara.id}`);
    if (res.data.success) {
      analisisData.value = res.data.data;
      sukanAktif.value = res.data.data.per_sukan?.[0]?.sukan ?? null;
      // Prefill jersi dari data yang ada
      res.data.data.per_sukan.forEach(s => {
        s.peserta.forEach(p => {
          const key = `${p.penyertaan_id}_${s.sukan}`;
          jersiSimpan.value[key] = p.no_jersi || '';
        });
      });
    }
  } catch (err) {
    alert('Gagal memuatkan analisis.');
    analisisPanel.value = false;
  } finally {
    analisisLoading.value = false;
  }
};

// 9. Simpan nombor jersi
const simpanJersi = async (penyertaan_id, sukan, nilai) => {
  const key = `${penyertaan_id}_${sukan}`;
  jersiLoading.value[key] = true;
  try {
    await api.put('/acara/admin/jersi', { penyertaan_id, sukan, no_jersi: nilai });
    // Kemaskini data lokal
    const blok = analisisData.value.per_sukan.find(s => s.sukan === sukan);
    if (blok) {
      const p = blok.peserta.find(p => p.penyertaan_id === penyertaan_id);
      if (p) p.no_jersi = nilai;
    }
  } catch (err) {
    alert('Gagal menyimpan nombor jersi.');
  } finally {
    jersiLoading.value[key] = false;
  }
};

const sukanAktifData = computed(() =>
  analisisData.value?.per_sukan.find(s => s.sukan === sukanAktif.value) || null
);

onMounted(() => {
  muatNaikAcara();
});
</script>


<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active > div, .modal-fade-leave-active > div { transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from > div, .modal-fade-leave-to > div { transform: translateY(16px) scale(0.98); }

.slide-in-enter-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-in-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 1, 1); }
.slide-in-enter-from, .slide-in-leave-to { opacity: 0; transform: translateX(40px); }
</style>
