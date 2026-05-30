import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// ── Helper: semak sama ada role adalah Admin ──
const isAdminRole = (role) => role === 'Admin' || role === 'Super Admin';

// ── Helper: semak sama ada peranti PC/tablet (lebar >= 768px) ──
const isPCOrTablet = () => window.innerWidth >= 768;

const routes = [
  // ==========================================
  // HALAMAN TETAMU (GUEST ROUTES)
  // ==========================================
  {
    path: '/',
    name: 'GetStarted',
    component: () => import('../views/GetStartedView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPasswordView.vue'),
    meta: { requiresGuest: true }
  },

  // ==========================================
  // HALAMAN AWAM
  // ==========================================
  {
    path: '/terms',
    name: 'TermsPolicy',
    component: () => import('../views/TermsPolicyView.vue')
  },

  // ==========================================
  // DASHBOARD AHLI (Mobile-first)
  // ==========================================
  {
    path: '/dashboard',
    component: () => import('../views/dashboard/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard/utama' },
      { path: 'utama',    name: 'Utama',    component: () => import('../views/dashboard/UtamaView.vue') },
      { path: 'yuran',    name: 'Yuran',    component: () => import('../views/dashboard/YuranView.vue') },
      { path: 'aktiviti', name: 'Aktiviti', component: () => import('../views/dashboard/AktivitiView.vue') },
      { path: 'kedai',    name: 'Kedai',    component: () => import('../views/dashboard/KedaiView.vue') },
      { path: 'bantuan',  name: 'Bantuan',  component: () => import('../views/dashboard/BantuanView.vue') },
      { path: 'profil',   name: 'Profil',   component: () => import('../views/dashboard/ProfilView.vue') },
    ]
  },

  // ==========================================
  // ADMIN PANEL (Desktop/Tablet)
  // ==========================================
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'ahli',
        name: 'AdminAhli',
        component: () => import('../views/admin/PengurusanAhliView.vue')
      },
      {
        path: 'kewangan',
        name: 'AdminKewangan',
        component: () => import('../views/admin/DashboardKewangan.vue')
      },
      {
        path: 'kedai',
        name: 'AdminKedai',
        component: () => import('../views/admin/PengurusanKedai.vue')
      },
      {
        path: 'kebajikan',
        name: 'AdminKebajikan',
        component: () => import('../views/admin/PengurusanKebajikanView.vue')
      },
      {
        path: 'aktiviti',
        name: 'AdminAktiviti',
        component: () => import('../views/admin/PengurusanAktivitiView.vue')
      },
      {
        path: 'bayaran',
        name: 'AdminBayaran',
        component: () => import('../views/admin/PengurusanBayaranView.vue')
      }
    ]
  },

  // ==========================================
  // 404 CATCH-ALL
  // ==========================================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ==========================================
// NAVIGATION GUARD UTAMA
// ==========================================
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth    = authStore.isAuthenticated();
  const role      = authStore.user?.role;

  // ── 1. Halaman tetamu — jika dah login, alih ke tempat betul ──
  if (to.meta.requiresGuest && isAuth) {
    // Admin + PC/tablet → admin panel
    if (isAdminRole(role) && isPCOrTablet()) {
      return next('/admin');
    }
    // Semua lain → dashboard ahli
    return next('/dashboard');
  }

  // ── 2. Halaman yang perlukan login ──
  if (to.meta.requiresAuth && !isAuth) {
    return next('/login');
  }

  // ── 3. Laluan /admin — perlukan role Admin/Super Admin ──
  if (to.meta.requiresAdmin) {
    if (!isAdminRole(role)) {
      // Ahli biasa yang cuba masuk /admin secara manual → tolak ke dashboard
      return next('/dashboard');
    }
  }

  // ── 4. Admin yang cuba akses /dashboard pada PC/tablet ──
  //    Alih ke admin panel supaya mereka tidak tersesat di UI mobile
  if (to.path.startsWith('/dashboard') && isAuth && isAdminRole(role) && isPCOrTablet()) {
    return next('/admin');
  }

  // ── 5. Semua OK ──
  next();
});

export default router;
