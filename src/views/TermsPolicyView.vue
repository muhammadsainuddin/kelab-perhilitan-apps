<template>
  <div class="min-h-screen flex flex-col font-sans" style="background: #EEF2EE;">

    <!-- Header -->
    <div class="shrink-0 flex items-center justify-between px-5 py-4" style="background: #0F4C3A;">
      <div class="flex items-center gap-3">
        <button @click="router.back()"
          class="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95"
          style="background: rgba(255,255,255,0.1); color: #95D5B2;">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="font-bold text-white text-sm tracking-wide">Terma dan Syarat Keahlian</h1>
          <p class="text-[10px] mt-0.5" style="color: #95D5B2;">Kelab Sukan &amp; Kebajikan PERHILITAN</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[9px] font-bold uppercase tracking-widest" style="color: rgba(255,255,255,0.4);">Versi 1.0</p>
        <p class="text-[9px]" style="color: rgba(255,255,255,0.3);">Kuat kuasa: 1 Jan 2025</p>
      </div>
    </div>

    <!-- Maklumat Pertubuhan -->
    <div class="shrink-0 px-5 py-3 flex items-center gap-3" style="background: #1B4332; border-bottom: 1px solid rgba(255,255,255,0.06);">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background: rgba(255,255,255,0.08);">
        <svg class="w-4 h-4" style="color: #52B788;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>
      <p class="text-[10px] leading-relaxed" style="color: rgba(255,255,255,0.5);">
        <span style="color: #95D5B2; font-weight: 600;">No. Pendaftaran: PPM-006-14-27071985</span> &nbsp;·&nbsp;
        KM.10 Jalan Cheras, 56100 Cheras, Kuala Lumpur
      </p>
    </div>

    <!-- Kandungan -->
    <div class="flex-1 overflow-y-auto px-5 py-6 space-y-0">

      <!-- Mukadimah -->
      <div class="bg-white rounded-2xl p-4 mb-4 text-xs text-slate-600 leading-relaxed"
        style="border: 1px solid #e2e8f0;">
        Dengan mendaftar sebagai ahli <strong class="text-slate-800">Kelab Sukan dan Kebajikan PERHILITAN</strong>,
        anda bersetuju untuk terikat dengan terma dan syarat berikut. Sila baca dengan teliti sebelum meneruskan pendaftaran.
      </div>

      <!-- Fasal 1 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">1</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Perlindungan Data Peribadi</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>Kelab mengumpul dan memproses data peribadi anda selaras dengan <strong class="text-slate-800">Akta Perlindungan Data Peribadi 2010 (Akta 709)</strong>. Data yang dikumpul merangkumi nama, nombor kad pengenalan, jawatan, tempat bertugas, e-mel dan nombor telefon.</p>
          <p class="font-semibold text-slate-700">Data anda digunakan semata-mata untuk tujuan:</p>
          <ul class="space-y-1 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Pengurusan keahlian dan rekod yuran</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Komunikasi berkaitan aktiviti dan kebajikan Kelab</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Penyediaan resit dan dokumen rasmi</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Pematuhan keperluan audit dan pelaporan dalaman</li>
          </ul>
          <p>Data anda <strong class="text-slate-800">tidak akan dikongsi</strong> dengan pihak ketiga tanpa kebenaran bertulis anda, kecuali dikehendaki oleh undang-undang.</p>
        </div>
      </div>

      <!-- Fasal 2 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">2</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Kelayakan Keahlian</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>Keahlian Kelab terbuka kepada semua kakitangan tetap Jabatan Perlindungan Hidupan Liar dan Taman Negara (PERHILITAN). Pemohon mesti:</p>
          <ul class="space-y-1 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Merupakan kakitangan awam Malaysia yang sedang berkhidmat</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Mengisi borang pendaftaran dengan maklumat yang benar dan tepat</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Mendapat kelulusan daripada pentadbir Kelab</li>
          </ul>
        </div>
      </div>

      <!-- Fasal 3 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">3</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Yuran Keahlian</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>Ahli dikehendaki membayar yuran tahunan pada kadar yang ditetapkan oleh Jawatankuasa Kelab dari semasa ke semasa. Pembayaran boleh dilakukan melalui:</p>
          <ul class="space-y-1 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> <span><strong class="text-slate-700">FPX (Perbankan Dalam Talian)</strong> — melalui sistem ini</span></li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> <span><strong class="text-slate-700">Potongan Biro Angkasa</strong> — bagi ahli yang memilih kaedah ini</span></li>
          </ul>
          <p>Nombor ahli hanya akan dikeluarkan setelah yuran pertama berjaya dibayar. Yuran yang telah dibayar <strong class="text-slate-800">tidak boleh dikembalikan</strong> kecuali terdapat kesilapan teknikal yang disahkan oleh pentadbir.</p>
        </div>
      </div>

      <!-- Fasal 4 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">4</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Tanggungjawab Ahli</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed">
          <ul class="space-y-1.5 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Mengemaskini maklumat peribadi apabila berlaku perubahan (pertukaran tempat bertugas, nombor telefon, e-mel)</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Menjaga kerahsiaan kata laluan akaun dan tidak berkongsi dengan pihak lain</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Mematuhi Perlembagaan dan Peraturan Kelab yang berkuat kuasa</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Menghormati ahli-ahli Kelab yang lain dalam semua interaksi</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Melaporkan sebarang aktiviti yang mencurigakan atau penyalahgunaan sistem kepada pentadbir</li>
          </ul>
        </div>
      </div>

      <!-- Fasal 5 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">5</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Keselamatan Akaun</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed">
          <p>Anda bertanggungjawab sepenuhnya ke atas semua aktiviti yang berlaku di bawah akaun anda. Kelab tidak akan bertanggungjawab ke atas sebarang kerugian atau kerosakan yang berpunca daripada kegagalan anda menjaga keselamatan kata laluan. Sekiranya anda mengesyaki akaun anda telah dicerobohi, sila hubungi pentadbir dengan segera.</p>
        </div>
      </div>

      <!-- Fasal 6 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">6</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Penamatan dan Pemberhentian Keahlian</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>Keahlian boleh ditamatkan dalam keadaan berikut:</p>
          <ul class="space-y-1 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Permohonan penamatan secara bertulis oleh ahli kepada Kelab</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Bersara, meletakkan jawatan atau berhenti berkhidmat dengan Kerajaan</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Pelanggaran terma dan syarat keahlian</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Keputusan Mesyuarat Agung Kelab</li>
          </ul>
        </div>
      </div>

      <!-- Fasal 7 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">7</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Hak Kelab</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed">
          <p>Kelab berhak untuk mengubah suai terma dan syarat ini pada bila-bila masa. Sebarang perubahan akan dimaklumkan kepada ahli melalui sistem atau e-mel. Penggunaan berterusan sistem ini selepas pemberitahuan perubahan dianggap sebagai penerimaan terma yang dikemaskini.</p>
        </div>
      </div>

      <!-- Fasal 8 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-3" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">8</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Penafian Liabiliti</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed">
          <p>Sistem ini disediakan atas dasar <em>"sebagaimana adanya"</em>. Kelab tidak memberi jaminan bahawa sistem ini bebas daripada gangguan teknikal. Kelab tidak bertanggungjawab ke atas sebarang kerugian tidak langsung yang timbul daripada penggunaan sistem ini.</p>
        </div>
      </div>

      <!-- Fasal 9 -->
      <div class="bg-white rounded-2xl overflow-hidden mb-4" style="border: 1px solid #e2e8f0;">
        <div class="px-4 py-3 flex items-center gap-3" style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black text-white" style="background: #0F4C3A;">9</div>
          <h2 class="text-xs font-black uppercase tracking-wide text-slate-700">Undang-undang yang Terpakai</h2>
        </div>
        <div class="px-4 py-4 text-xs text-slate-600 leading-relaxed space-y-2">
          <p>Terma dan syarat ini ditadbir dan ditafsirkan mengikut undang-undang <strong class="text-slate-800">Malaysia</strong>, termasuk tetapi tidak terhad kepada:</p>
          <ul class="space-y-1 pl-3">
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Akta Perlindungan Data Peribadi 2010 (Akta 709)</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Akta Pertubuhan 1966 (Akta 335)</li>
            <li class="flex items-start gap-2"><span style="color: #52B788;">→</span> Akta Komunikasi dan Multimedia 1998 (Akta 588)</li>
          </ul>
          <p>Sebarang pertikaian yang timbul hendaklah diselesaikan di bawah bidang kuasa mahkamah Malaysia.</p>
        </div>
      </div>

      <!-- Hubungi -->
      <div class="rounded-2xl p-4 mb-6 text-xs leading-relaxed" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #14532d;">
        <p class="font-bold mb-1" style="color: #0F4C3A;">Hubungi Kami</p>
        <p>Sebarang pertanyaan berkenaan terma ini boleh dikemukakan kepada pentadbir Kelab PERHILITAN:</p>
        <p class="mt-1"><strong>E-mel:</strong> kelabperhilitan@gmail.com</p>
        <p><strong>Tel:</strong> 03-9075 2872</p>
      </div>

    </div>

    <!-- Footer -->
    <div class="shrink-0 px-5 py-4" style="background: #fff; border-top: 1px solid #e2e8f0;">
      <p class="text-center text-[9px] text-slate-400 mb-3">Kuat kuasa: 1 Januari 2025 &nbsp;·&nbsp; Versi 1.0 &nbsp;·&nbsp; PPM-006-14-27071985</p>
      <button @click="router.back()"
        class="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
        style="background: #0F4C3A; color: #95D5B2; box-shadow: 0 4px 14px rgba(15,76,58,0.25);">
        Saya Faham dan Bersetuju
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #0F4C3A; border-radius: 10px; }
</style>
