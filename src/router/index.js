import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Pastikan path ke Pinia store anda betul

const routes = [
  // ==========================================
  // HALAMAN TETAMU (GUEST ROUTES - Tanpa Login)
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
  // HALAMAN AWAM (PUBLIC ROUTES - Semua boleh akses)
  // ==========================================
  {
    path: '/terms',
    name: 'TermsPolicy',
    component: () => import('../views/TermsPolicyView.vue')
  },

  // ==========================================
  // HALAMAN RAHSIA (PROTECTED ROUTES - DASHBOARD & TAB)
  // ==========================================
  {
    path: '/dashboard',
    component: () => import('../views/dashboard/DashboardLayout.vue'),
    meta: { requiresAuth: true }, // Mesti ada Token / Login
    children: [
      {
        // Jika user taip /dashboard sahaja, bawa terus ke tab Utama
        path: '', 
        redirect: '/dashboard/utama'
      },
      {
        path: 'utama',
        name: 'Utama',
        component: () => import('../views/dashboard/UtamaView.vue')
      },
      {
        path: 'yuran',
        name: 'Yuran',
        component: () => import('../views/dashboard/YuranView.vue')
      },
      {
        path: 'aktiviti',
        name: 'Aktiviti',
        component: () => import('../views/dashboard/AktivitiView.vue')
      },
      {
        path: 'kedai',
        name: 'Kedai',
        component: () => import('../views/dashboard/KedaiView.vue')
      },
      {
        path: 'bantuan',
        name: 'Bantuan',
        component: () => import('../views/dashboard/BantuanView.vue')
      },
      {
        path: 'profil',
        name: 'Profil',
        component: () => import('../views/dashboard/ProfilView.vue')
      }
    ]
  },

  // ==========================================
  // HALAMAN SESAT (CATCH-ALL / 404)
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
// KAWALAN LALUAN (ROUTE GUARD) UTAMA
// ==========================================
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuth = authStore.isAuthenticated(); // Pastikan fungsi ini memulangkan 'true' jika JWT wujud

  // 1. User dah login TAPI cuba buka halaman depan (Splash, Login, Daftar)
  if (to.meta.requiresGuest && isAuth) {
    next('/dashboard/utama'); 
  } 
  
  // 2. User belum login TAPI cuba buka Dashboard
  else if (to.meta.requiresAuth && !isAuth) {
    next('/login'); 
  } 
  
  // 3. Semuanya tepat, teruskan!
  else {
    next(); 
  }
});

export default router;