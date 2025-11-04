import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/registerView.vue'
import AboutView from '@/pages/AboutView.vue'
import AdminUserManage from '@/pages/admin/AdminUserManage.vue'
import UserProfileEdit from '@/pages/user/UserProfileEdit.vue'
import { useLoginUserStore } from '@/stores/LoginUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUserManage,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: LoginView,
      meta: {
        hideChrome: true,
      },
    },
    {
      path: '/user/register',
      name: 'userRegister',
      component: RegisterView,
      meta: {
        hideChrome: true,
      },
    },
    {
      path: '/user/profile',
      name: 'userProfile',
      component: UserProfileEdit,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  await loginUserStore.fetchLoginUser()

  if (to.meta?.requiresAuth && !loginUserStore.isLoggedIn) {
    next({
      path: '/user/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  if (to.meta?.requiresAdmin && loginUserStore.loginUser?.userRole !== 'admin') {
    if (to.path !== from.path) {
      message.warning('暂无权限访问该页面')
    }
    next(from.fullPath ? from.fullPath : '/')
    return
  }

  next()
})

export default router
