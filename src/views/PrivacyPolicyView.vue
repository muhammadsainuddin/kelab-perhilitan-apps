<template>
  <div class="min-h-screen flex flex-col font-sans" style="background: #F8FAFC;">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
      style="background: #081C15; box-shadow: 0 2px 12px rgba(0,0,0,0.3);">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" class="w-7 h-7 object-contain" />
        <div>
          <p class="text-[9px] font-black uppercase tracking-[0.2em]" style="color: rgba(149,213,178,0.5);">Kelab PERHILITAN</p>
          <p class="text-[13px] font-black text-white leading-none">Dasar Privasi</p>
        </div>
      </div>
      <!-- Language Toggle -->
      <div class="flex rounded-xl overflow-hidden" style="border: 1px solid rgba(82,183,136,0.3);">
        <button @click="lang = 'ms'"
          class="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all"
          :style="lang === 'ms'
            ? 'background: #52B788; color: #081C15;'
            : 'background: transparent; color: rgba(149,213,178,0.6);'">
          BM
        </button>
        <button @click="lang = 'en'"
          class="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all"
          :style="lang === 'en'
            ? 'background: #52B788; color: #081C15;'
            : 'background: transparent; color: rgba(149,213,178,0.6);'">
          EN
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-5 py-6 space-y-6 max-w-2xl mx-auto w-full">

      <!-- ── BAHASA MELAYU ── -->
      <template v-if="lang === 'ms'">

        <div class="rounded-2xl p-4" style="background: rgba(82,183,136,0.07); border: 1px solid rgba(82,183,136,0.15);">
          <p class="text-[10px] font-medium leading-relaxed" style="color: #2D6A4F;">
            Tarikh Berkuat Kuasa: <strong>4 Jun 2026</strong><br>
            Dikemaskini terakhir: <strong>4 Jun 2026</strong>
          </p>
        </div>

        <section v-for="s in seksyen_ms" :key="s.tajuk" class="space-y-2">
          <h3 class="text-[13px] font-black" style="color: #0F172A;">{{ s.tajuk }}</h3>
          <p class="text-[11px] leading-relaxed" style="color: #475569;" v-html="s.kandungan"></p>
        </section>

      </template>

      <!-- ── ENGLISH ── -->
      <template v-else>

        <div class="rounded-2xl p-4" style="background: rgba(82,183,136,0.07); border: 1px solid rgba(82,183,136,0.15);">
          <p class="text-[10px] font-medium leading-relaxed" style="color: #2D6A4F;">
            Effective Date: <strong>4 June 2026</strong><br>
            Last Updated: <strong>4 June 2026</strong>
          </p>
        </div>

        <section v-for="s in seksyen_en" :key="s.title" class="space-y-2">
          <h3 class="text-[13px] font-black" style="color: #0F172A;">{{ s.title }}</h3>
          <p class="text-[11px] leading-relaxed" style="color: #475569;" v-html="s.content"></p>
        </section>

      </template>

      <!-- Contact box -->
      <div class="rounded-2xl p-4 space-y-1" style="background: #0F172A; border: 1px solid rgba(82,183,136,0.1);">
        <p class="text-[9px] font-black uppercase tracking-[0.18em]" style="color: rgba(149,213,178,0.5);">
          {{ lang === 'ms' ? 'Hubungi Kami' : 'Contact Us' }}
        </p>
        <p class="text-[11px] font-black text-white">Kelab Sukan dan Kebajikan PERHILITAN</p>
        <p class="text-[10px]" style="color: rgba(149,213,178,0.6);">kelabperhilitan@gmail.com</p>
      </div>

      <div class="h-6"></div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const lang = ref('ms');

const seksyen_ms = [
  {
    tajuk: '1. Pendahuluan',
    kandungan: `Kelab Sukan dan Kebajikan PERHILITAN ("Kelab", "kami") berkomited untuk melindungi privasi ahli kami. Dasar Privasi ini menerangkan bagaimana kami mengumpul, menggunakan, menyimpan, dan melindungi maklumat peribadi anda melalui aplikasi mudah alih Kelab PERHILITAN ("Aplikasi").`
  },
  {
    tajuk: '2. Maklumat Yang Kami Kumpul',
    kandungan: `Kami mengumpul maklumat berikut semasa pendaftaran dan penggunaan Aplikasi:<br><br>
    <strong>Maklumat Peribadi:</strong><br>
    • Nama penuh, nombor kad pengenalan (No. KP)<br>
    • Alamat e-mel dan nombor telefon<br>
    • Gred penyandang dan lokasi penempatan<br>
    • Gambar profil (atas pilihan ahli)<br><br>
    <strong>Maklumat Kewangan:</strong><br>
    • Nombor akaun bank dan nama bank (untuk pembayaran bantuan kebajikan)<br>
    • Rekod pembayaran yuran kelab<br><br>
    <strong>Maklumat Waris:</strong><br>
    • Nama waris, nombor telefon waris, dan akaun bank waris (untuk tujuan kebajikan)<br><br>
    <strong>Maklumat Penggunaan:</strong><br>
    • Rekod permohonan bantuan kebajikan<br>
    • Penyertaan aktiviti dan sukan kelab`
  },
  {
    tajuk: '3. Tujuan Penggunaan Maklumat',
    kandungan: `Maklumat yang dikumpul digunakan untuk tujuan berikut sahaja:<br><br>
    • Pengurusan keahlian dan rekod ahli kelab<br>
    • Pemprosesan pembayaran yuran tahunan<br>
    • Pengurusan permohonan bantuan kebajikan (khairat kematian, kemalangan, bencana alam, persaraan)<br>
    • Pengurusan penyertaan aktiviti dan sukan kelab<br>
    • Komunikasi rasmi berkaitan hal ehwal kelab<br>
    • Pematuhan keperluan undang-undang dan peraturan Jabatan PERHILITAN`
  },
  {
    tajuk: '4. Perkongsian Maklumat',
    kandungan: `Kami <strong>tidak</strong> menjual, menyewa, atau mendedahkan maklumat peribadi anda kepada pihak ketiga kecuali dalam situasi berikut:<br><br>
    • <strong>Kepatuhan undang-undang:</strong> Apabila dikehendaki oleh undang-undang, perintah mahkamah, atau pihak berkuasa yang berwenang.<br>
    • <strong>Pentadbiran kelab:</strong> Maklumat dikongsi dengan Jawatankuasa Kelab yang bertanggungjawab secara terhad untuk tujuan pengurusan kebajikan.<br>
    • <strong>Perkhidmatan pembayaran:</strong> Maklumat yang diperlukan untuk pemprosesan bayaran yuran melalui penyedia perkhidmatan pembayaran yang diluluskan.`
  },
  {
    tajuk: '5. Keselamatan Data',
    kandungan: `Kami mengambil langkah-langkah teknikal yang munasabah untuk melindungi data anda:<br><br>
    • Semua komunikasi data dilindungi dengan protokol HTTPS<br>
    • Kata laluan disimpan dalam bentuk cincang (hashed) yang tidak boleh dibaca<br>
    • Akses kepada data sensitif dihadkan kepada pentadbir yang diberi kuasa sahaja<br>
    • Pelayan aplikasi dilindungi mengikut amalan terbaik keselamatan`
  },
  {
    tajuk: '6. Penyimpanan Data',
    kandungan: `Maklumat peribadi anda disimpan selagi anda masih ahli kelab yang aktif atau sehingga anda memohon penghapusan akaun. Rekod kewangan dan kebajikan mungkin disimpan lebih lama mengikut keperluan undang-undang dan peraturan perkhidmatan awam Malaysia.`
  },
  {
    tajuk: '7. Hak Anda',
    kandungan: `Sebagai ahli, anda berhak untuk:<br><br>
    • <strong>Akses:</strong> Melihat maklumat peribadi anda melalui bahagian Profil dalam Aplikasi.<br>
    • <strong>Kemaskini:</strong> Mengemaskini maklumat peribadi anda pada bila-bila masa.<br>
    • <strong>Padam:</strong> Memohon penghapusan akaun dengan menghubungi pentadbir kelab.<br>
    • <strong>Aduan:</strong> Membuat aduan kepada Jabatan Perlindungan Data Peribadi Malaysia sekiranya terdapat pelanggaran.`
  },
  {
    tajuk: '8. Kuki dan Data Tempatan',
    kandungan: `Aplikasi ini menyimpan token pengesahan (JWT) dalam storan tempatan peranti anda bagi tujuan sesi log masuk. Token ini tidak mengandungi maklumat sensitif selain dari pengenalan pengguna dan taraf keahlian.`
  },
  {
    tajuk: '9. Perubahan Dasar Privasi',
    kandungan: `Kami berhak untuk mengemas kini Dasar Privasi ini dari semasa ke semasa. Sebarang perubahan material akan dimaklumkan melalui Aplikasi. Penggunaan berterusan Aplikasi selepas perubahan tersebut bermakna anda menerima Dasar Privasi yang dikemas kini.`
  },
  {
    tajuk: '10. Hubungi Kami',
    kandungan: `Sekiranya anda mempunyai sebarang pertanyaan berkenaan Dasar Privasi ini, sila hubungi kami melalui e-mel: <strong>kelabperhilitan@gmail.com</strong><br>Laman web: <strong>kelabperhilitan.my</strong>`
  },
];

const seksyen_en = [
  {
    title: '1. Introduction',
    content: `Kelab Sukan dan Kebajikan PERHILITAN ("the Club", "we", "us") is committed to protecting the privacy of our members. This Privacy Policy explains how we collect, use, store, and protect your personal information through the Kelab PERHILITAN mobile application ("the App").`
  },
  {
    title: '2. Information We Collect',
    content: `We collect the following information during registration and use of the App:<br><br>
    <strong>Personal Information:</strong><br>
    • Full name, national identification number (IC number)<br>
    • Email address and phone number<br>
    • Civil service grade and posting location<br>
    • Profile photo (optional)<br><br>
    <strong>Financial Information:</strong><br>
    • Bank account number and bank name (for welfare benefit disbursement)<br>
    • Club membership fee payment records<br><br>
    <strong>Next-of-Kin Information:</strong><br>
    • Name, phone number, and bank account of designated next-of-kin (for welfare purposes)<br><br>
    <strong>Usage Information:</strong><br>
    • Welfare assistance application records<br>
    • Club activity and sports participation records`
  },
  {
    title: '3. How We Use Your Information',
    content: `The information collected is used solely for the following purposes:<br><br>
    • Membership management and member record keeping<br>
    • Processing annual membership fee payments<br>
    • Managing welfare assistance applications (death benefit, accident, natural disaster, retirement)<br>
    • Managing club activity and sports participation<br>
    • Official communications regarding club matters<br>
    • Compliance with PERHILITAN Department regulations and Malaysian law`
  },
  {
    title: '4. Information Sharing',
    content: `We do <strong>not</strong> sell, rent, or disclose your personal information to third parties except in the following circumstances:<br><br>
    • <strong>Legal compliance:</strong> When required by law, court order, or competent authority.<br>
    • <strong>Club administration:</strong> Information is shared on a limited basis with authorised Club Committee members responsible for welfare management.<br>
    • <strong>Payment processing:</strong> Information necessary for membership fee processing through approved payment service providers.`
  },
  {
    title: '5. Data Security',
    content: `We take reasonable technical measures to protect your data:<br><br>
    • All data communications are protected using HTTPS protocol<br>
    • Passwords are stored in hashed form and cannot be read in plain text<br>
    • Access to sensitive data is restricted to authorised administrators only<br>
    • Application servers are secured following industry best practices`
  },
  {
    title: '6. Data Retention',
    content: `Your personal information is retained for as long as you remain an active club member, or until you request account deletion. Financial and welfare records may be retained for a longer period in accordance with Malaysian civil service regulations and legal requirements.`
  },
  {
    title: '7. Your Rights',
    content: `As a member, you have the right to:<br><br>
    • <strong>Access:</strong> View your personal information through the Profile section in the App.<br>
    • <strong>Update:</strong> Update your personal information at any time through the App.<br>
    • <strong>Delete:</strong> Request account deletion by contacting the club administrator.<br>
    • <strong>Complaint:</strong> Lodge a complaint with the Personal Data Protection Department of Malaysia if you believe your data rights have been violated.`
  },
  {
    title: '8. Cookies and Local Storage',
    content: `The App stores an authentication token (JWT) in your device's local storage to maintain your login session. This token contains only your user identifier and membership status, and does not contain sensitive personal information.`
  },
  {
    title: '9. Changes to This Privacy Policy',
    content: `We reserve the right to update this Privacy Policy from time to time. Any material changes will be communicated through the App. Your continued use of the App after such changes constitutes your acceptance of the updated Privacy Policy.`
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions regarding this Privacy Policy, please contact us at: <strong>kelabperhilitan@gmail.com</strong><br>Website: <strong>kelabperhilitan.my</strong>`
  },
];
</script>

<style scoped>
.font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
</style>
