<template>
  <div class="space-y-4 pb-6 animate-page-in">

    <!-- Header -->
    <div class="flex items-center gap-3 pt-1 px-1">
      <button @click="$router.back()"
        class="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-90"
        style="background: rgba(15,23,42,0.06);">
        <svg class="w-4.5 h-4.5" style="color: #0F172A;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
      </button>
      <div>
        <h2 class="text-[18px] font-black" style="color: #0F172A;">Kempen Sumbangan</h2>
        <p class="text-[10px] font-bold" style="color: #94A3B8;">{{ kempen.length }} kempen aktif</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="muatan" class="flex justify-center py-16">
      <svg class="animate-spin w-8 h-8" style="color: #CBD5E1;" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>

    <!-- Empty -->
    <div v-else-if="!muatan && !kempen.length" class="text-center py-16">
      <div class="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center"
        style="background: rgba(239,68,68,0.08);">
        <svg class="w-8 h-8" style="color: rgba(220,38,38,0.3);" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
        </svg>
      </div>
      <p class="text-sm font-black" style="color: #94A3B8;">Tiada kempen aktif</p>
    </div>

    <!-- Sumbangan diterima (jika ahli adalah penerima) -->
    <div v-if="kempenSaya.length" class="space-y-2">
      <div class="flex items-center gap-2 px-1">
        <div class="w-5 h-5 rounded-lg flex items-center justify-center" style="background: rgba(16,185,129,0.1);">
          <svg class="w-3 h-3" style="color: #059669;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: #94a3b8;">Sumbangan Untuk Anda</p>
      </div>
      <div v-for="k in kempenSaya" :key="k.id"
        class="rounded-[18px] p-4"
        style="background: linear-gradient(135deg, #ECFDF5, #F0FDF4); border: 1px solid rgba(16,185,129,0.2);">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex-1 min-w-0">
            <p class="text-[8px] font-black uppercase tracking-wide mb-0.5" style="color: #059669;">
              {{ k.status === 'AKTIF' ? 'Kempen Aktif' : 'Kempen Ditutup' }}
            </p>
            <p class="text-[13px] font-black leading-tight" style="color: #064E3B;">{{ k.tajuk }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[8px] font-bold" style="color: #6EE7B7;">Terkumpul</p>
            <p class="text-[20px] font-black leading-none" style="color: #059669;">
              RM {{ parseFloat(k.jumlah_terkumpul || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 text-[9px] font-bold" style="color: #6B7280;">
          <span>{{ k.jumlah_rekod }} rekod disahkan</span>
          <span v-if="k.jumlah_pending > 0" class="px-2 py-0.5 rounded-full" style="background: #FEF3C7; color: #92400E;">
            {{ k.jumlah_pending }} FPX menunggu
          </span>
        </div>
      </div>
    </div>

    <!-- Senarai kad -->
    <div v-if="!muatan && kempen.length" class="space-y-4">
      <div v-for="k in kempen" :key="k.id"
        class="rounded-[22px] overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
        style="border: 1px solid rgba(239,68,68,0.15); background: white; box-shadow: 0 2px 12px rgba(0,0,0,0.04);"
        @click="bukaDetail(k)">

        <!-- Cover gambar -->
        <div v-if="gambarList(k).length" class="flex overflow-x-auto no-scrollbar gap-1.5 p-3 pb-0">
          <img v-for="g in gambarList(k).slice(0,4)" :key="g"
            :src="`${uploadBase}/uploads/images/${g}`"
            class="h-28 w-28 shrink-0 rounded-xl object-cover" />
          <div v-if="gambarList(k).length > 4"
            class="h-28 w-28 shrink-0 rounded-xl flex items-center justify-center font-black text-lg"
            style="background: #F1F5F9; color: #94A3B8;">
            +{{ gambarList(k).length - 4 }}
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-start gap-2 mb-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style="background: rgba(239,68,68,0.08);">
              <svg class="w-4 h-4" style="color: #DC2626;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[8px] font-black uppercase tracking-wide mb-0.5" style="color: #DC2626;">Kempen Sumbangan</p>
              <h3 class="text-[14px] font-black leading-tight" style="color: #0F172A;">{{ k.tajuk }}</h3>
            </div>
          </div>

          <div class="flex items-center gap-1.5 mb-2">
            <svg class="w-3 h-3 shrink-0" style="color: #94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <p class="text-[10px] font-bold" style="color: #475569;">{{ k.nama_penerima }}</p>
            <span v-if="k.penempatan_penerima" class="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
              style="background: #F1F5F9; color: #64748B;">{{ k.penempatan_penerima }}</span>
          </div>

          <p class="text-[10px] leading-relaxed line-clamp-2 mb-3" style="color: #64748B;">{{ k.sebab }}</p>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-medium" style="color: #94A3B8;">
                {{ fmtTarikh(k.tarikh_mula) }}
                <span v-if="k.tarikh_tamat"> — {{ fmtTarikh(k.tarikh_tamat) }}</span>
              </span>
              <span v-if="k.allow_fpx" class="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                style="background: #FEF3C7; color: #92400E;">FPX</span>
            </div>
            <div class="flex items-center gap-1 text-[9px] font-black" style="color: #DC2626;">
              Lihat <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── DETAIL BOTTOM SHEET ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showDetail"
          class="fixed inset-0 z-[9995] flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
          @click.self="showDetail = false">
          <div class="bg-white w-full max-w-sm"
            style="border-radius: 28px 28px 0 0; max-height: 90vh; display: flex; flex-direction: column;">

            <div class="flex justify-center pt-3 shrink-0">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>

            <div class="flex-1 overflow-y-auto">
              <!-- Carousel gambar -->
              <div v-if="kempenDetail && gambarList(kempenDetail).length"
                class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 px-4 pt-3 pb-2">
                <img v-for="g in gambarList(kempenDetail)" :key="g"
                  :src="`${uploadBase}/uploads/images/${g}`"
                  class="snap-start h-44 shrink-0 rounded-2xl object-cover"
                  :class="gambarList(kempenDetail).length === 1 ? 'w-full' : 'w-64'" />
              </div>

              <div class="px-5 pt-4 pb-2">
                <p class="text-[8px] font-black uppercase tracking-[0.2em] mb-1" style="color: #DC2626;">Kempen Sumbangan</p>
                <h3 class="text-[17px] font-black leading-tight mb-1" style="color: #0F172A;">{{ kempenDetail?.tajuk }}</h3>

                <!-- Penerima + penempatan -->
                <div class="flex items-center gap-2 mb-3 p-2.5 rounded-2xl" style="background: #FFF5F5;">
                  <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(239,68,68,0.1);">
                    <svg class="w-3.5 h-3.5" style="color: #DC2626;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-black" style="color: #0F172A;">{{ kempenDetail?.nama_penerima }}</p>
                    <p v-if="kempenDetail?.penempatan_penerima" class="text-[9px] font-bold" style="color: #94A3B8;">{{ kempenDetail?.penempatan_penerima }}</p>
                  </div>
                  <div v-if="kempenDetail?.tarikh_tamat" class="text-right shrink-0">
                    <p class="text-[7px] font-bold" style="color: #94A3B8;">Tamat</p>
                    <p class="text-[9px] font-black" style="color: #0F172A;">{{ fmtTarikh(kempenDetail.tarikh_tamat) }}</p>
                  </div>
                </div>

                <p class="text-[11px] leading-relaxed mb-4" style="color: #475569;">{{ kempenDetail?.sebab }}</p>

                <!-- Bank + QR -->
                <div class="rounded-2xl p-3 mb-2 flex items-center gap-3" style="background: #F8FAFC; border: 1px solid #F1F5F9;">
                  <svg class="w-4 h-4 shrink-0" style="color: #94A3B8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <div class="flex-1">
                    <p class="text-[10px] font-black" style="color: #0F172A;">{{ kempenDetail?.nama_bank }}</p>
                    <p class="text-[10px] font-mono" style="color: #475569;">{{ kempenDetail?.no_akaun }}</p>
                  </div>
                  <button v-if="kempenDetail?.qr_code" @click="downloadQR(kempenDetail)"
                    class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-bold"
                    style="background: #EFF6FF; color: #1D4ED8;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Simpan QR
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-5 pb-8 pt-3 border-t border-gray-50 shrink-0">
              <div v-if="profil.no_kp === kempenDetail?.no_kp_penerima"
                class="w-full py-3 rounded-2xl text-[10px] font-bold text-center"
                style="background: #F1F5F9; color: #94A3B8;">
                Ini adalah kempen sumbangan anda
              </div>
              <button v-else @click="() => { showDetail = false; bukaDonateModal(kempenDetail); }"
                class="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wide"
                style="background: #DC2626; color: white;">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
                Saya Sumbang
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL REKOD SUMBANGAN ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showDonate"
          class="fixed inset-0 z-[9994] flex items-end justify-center"
          style="background: rgba(8,28,21,0.65); backdrop-filter: blur(8px);"
          @click.self="showDonate = false">
          <div class="bg-white w-full max-w-sm pb-10"
            style="border-radius: 32px 32px 0 0;">
            <div class="flex justify-center pt-3 mb-3">
              <div class="w-10 h-1 rounded-full bg-gray-200"></div>
            </div>

            <div class="px-6 mb-3">
              <p class="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style="color: #DC2626;">Rekod Sumbangan</p>
              <h3 class="text-[16px] font-black" style="color: #0F172A;">{{ kempenDonateDipilih?.tajuk }}</h3>
            </div>

            <!-- Tab kaedah (hanya tunjuk FPX jika allow_fpx) -->
            <div v-if="kempenDonateDipilih?.allow_fpx" class="px-6 mb-4">
              <div class="flex gap-1.5 bg-gray-100 rounded-2xl p-1">
                <button @click="donateKaedah = 'MANUAL'"
                  :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                           donateKaedah === 'MANUAL' ? 'bg-white shadow text-gray-900' : 'text-gray-500']">
                  Transfer Bank
                </button>
                <button @click="donateKaedah = 'FPX'"
                  :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all',
                           donateKaedah === 'FPX' ? 'bg-white shadow text-gray-900' : 'text-gray-500']">
                  FPX Online
                </button>
              </div>
            </div>

            <div class="px-6 space-y-3">
              <!-- Info kaedah -->
              <div v-if="donateKaedah === 'MANUAL'"
                class="px-3 py-2 rounded-xl text-[10px] leading-relaxed"
                style="background: #F0FDF4; color: #166534; border: 1px solid rgba(22,101,52,0.12);">
                Transfer ke <strong>{{ kempenDonateDipilih?.nama_bank }}</strong>
                ({{ kempenDonateDipilih?.no_akaun }}), kemudian rekodkan amaun di sini.
              </div>
              <div v-else-if="donateKaedah === 'FPX'"
                class="px-3 py-2 rounded-xl text-[10px] leading-relaxed"
                style="background: #FFF7ED; color: #92400E; border: 1px solid rgba(146,64,14,0.12);">
                Bayar melalui FPX. Caj RM1.00 dikenakan. Amaun RM{{ donateAmaun || '0' }} + RM1 = <strong>RM{{ donateAmaun ? (parseFloat(donateAmaun) + 1).toFixed(2) : '1.00' }}</strong>.
              </div>

              <!-- Amaun -->
              <div>
                <label class="text-[10px] font-black text-gray-600 mb-1 block">Amaun Sumbangan (RM) *</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">RM</span>
                  <input v-model="donateAmaun" type="number" min="1" step="0.01" placeholder="0.00"
                    class="w-full pl-9 pr-4 py-3 rounded-2xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
                    style="border-color: #E2E8F0; color: #0F172A;" />
                </div>
              </div>

              <!-- Catatan -->
              <div>
                <label class="text-[10px] font-black text-gray-600 mb-1 block">Catatan (Sekiranya Perlu)</label>
                <input v-model="donateCatatan" type="text" placeholder="Contoh: Semoga cepat sembuh"
                  class="w-full px-4 py-3 rounded-2xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400"
                  style="border-color: #E2E8F0; color: #0F172A;" />
              </div>

              <!-- Anon -->
              <label class="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" v-model="donateAnon" class="w-4 h-4 rounded accent-red-500" />
                <div>
                  <p class="text-[11px] font-bold" style="color: #0F172A;">Sumbang sebagai Anon</p>
                  <p class="text-[9px]" style="color: #94A3B8;">Nama anda tidak akan dipaparkan</p>
                </div>
              </label>

              <p v-if="donateRalat" class="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl">{{ donateRalat }}</p>

              <button v-if="donateKaedah === 'MANUAL'"
                @click="hantarSumbangan" :disabled="menghantarDonate"
                class="w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:scale-[0.98]"
                style="background: #DC2626; color: white;" :class="menghantarDonate ? 'opacity-60' : ''">
                {{ menghantarDonate ? 'Merekodkan...' : 'Rekod Sumbangan' }}
              </button>
              <button v-else
                @click="hantarSumbanganFPX" :disabled="menghantarDonate"
                class="w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:scale-[0.98]"
                style="background: #0F172A; color: white;" :class="menghantarDonate ? 'opacity-60' : ''">
                {{ menghantarDonate ? 'Memproses...' : `Bayar RM${donateAmaun ? (parseFloat(donateAmaun)+1).toFixed(2) : '—'} via FPX →` }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';

const router     = useRouter();
const uploadBase = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5001';

const kempen      = ref([]);
const kempenSaya  = ref([]); // kempen di mana user adalah penerima
const muatan      = ref(false);
const profil      = ref({});

// ── Detail ──
const showDetail   = ref(false);
const kempenDetail = ref(null);
const bukaDetail   = (k) => { kempenDetail.value = k; showDetail.value = true; };

// ── Helpers ──
const gambarList = (k) => k?.gambar_sokongan ? k.gambar_sokongan.split(',').filter(Boolean) : [];
const fmtTarikh  = (t) => t ? t.substring(0, 10).split('-').reverse().join('/') : '';

// ── Donate ──
const showDonate          = ref(false);
const kempenDonateDipilih = ref(null);
const donateAmaun         = ref('');
const donateCatatan       = ref('');
const donateAnon          = ref(false);
const donateKaedah        = ref('MANUAL');
const donateRalat         = ref('');
const menghantarDonate    = ref(false);

const bukaDonateModal = (k) => {
  kempenDonateDipilih.value = k;
  donateAmaun.value   = '';
  donateCatatan.value = '';
  donateAnon.value    = false;
  donateKaedah.value  = 'MANUAL';
  donateRalat.value   = '';
  showDonate.value    = true;
};

const hantarSumbangan = async () => {
  donateRalat.value = '';
  const amaun = parseFloat(donateAmaun.value);
  if (!amaun || amaun <= 0) { donateRalat.value = 'Sila masukkan amaun yang sah.'; return; }
  menghantarDonate.value = true;
  try {
    await api.post(`/user/kempen-sumbangan/${kempenDonateDipilih.value.id}/rekod`, {
      amaun, catatan: donateCatatan.value, anon: donateAnon.value
    });
    showDonate.value = false;
    await muatKempen();
  } catch (e) {
    donateRalat.value = e.response?.data?.message || 'Ralat sistem.';
  } finally { menghantarDonate.value = false; }
};

const hantarSumbanganFPX = async () => {
  donateRalat.value = '';
  const amaun = parseFloat(donateAmaun.value);
  if (!amaun || amaun <= 0) { donateRalat.value = 'Sila masukkan amaun yang sah.'; return; }
  menghantarDonate.value = true;
  try {
    const res = await api.post(`/user/kempen-sumbangan/${kempenDonateDipilih.value.id}/bayar-fpx`, {
      amaun, catatan: donateCatatan.value, anon: donateAnon.value
    });
    showDonate.value = false;
    window.location.href = res.data.billUrl;
  } catch (e) {
    donateRalat.value = e.response?.data?.message || 'Ralat mencipta bil FPX.';
  } finally { menghantarDonate.value = false; }
};

const downloadQR = async (k) => {
  try {
    const resp = await fetch(`${uploadBase}/uploads/images/${k.qr_code}`);
    const blob = await resp.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `QR-${k.nama_penerima}-${k.nama_bank}.jpg`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  } catch (e) { console.error('Download QR gagal:', e); }
};

const muatKempen = async () => {
  muatan.value = true;
  try {
    const res = await api.get('/user/kempen-sumbangan');
    kempen.value = res.data.data || [];
  } catch (e) { kempen.value = []; }
  finally { muatan.value = false; }
};

const muatKempenPenerima = async () => {
  try {
    const res = await api.get('/user/kempen-sumbangan/saya-penerima');
    kempenSaya.value = res.data.data || [];
  } catch (e) { kempenSaya.value = []; }
};

const muatProfil = async () => {
  try {
    const res = await api.get('/user/profil');
    profil.value = res.data.data || {};
  } catch (e) {}
};

onMounted(() => { muatKempen(); muatKempenPenerima(); muatProfil(); });
</script>

<style scoped>
.animate-page-in { animation: pageIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes pageIn { from { opacity: 0; transform: translateY(10px); } to { opacity:1; transform:translateY(0); } }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.sheet-enter-active { transition: all 0.38s cubic-bezier(0.16,1,0.3,1); }
.sheet-leave-active { transition: all 0.25s cubic-bezier(0.4,0,1,1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div { transform: translateY(100%); }
.sheet-leave-to > div { transform: translateY(100%); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
