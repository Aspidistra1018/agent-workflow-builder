<template>
  <a-layout-header class="header">
    <div class="header-inner">
      <RouterLink to="/" class="brand">
        <img class="brand-logo" src="@/assets/logo.png" alt="logo" />
        <div class="brand-text">
          <span class="brand-title">鱼皮应用生成</span>
          <span class="brand-subtitle">让灵感快速落地</span>
        </div>
      </RouterLink>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        :items="menuItems"
        class="nav-menu"
        @click="handleMenuClick"
      />

      <div class="header-actions">
        <template v-if="isLoggedIn">
          <a-space :size="12" align="center">
            <a-tag v-if="isAdmin" color="red" bordered>管理员</a-tag>
            <a-dropdown placement="bottomRight">
              <a-space :size="8" class="user-entry" @click="handleGoProfile">
                <a-avatar :size="36" class="user-avatar">
                  {{ (loginUser?.userName || loginUser?.userAccount || '鱼')?.slice(0, 1) }}
                </a-avatar>
                <div class="user-meta">
                  <span class="user-name">{{ loginUser?.userName || loginUser?.userAccount }}</span>
                  <span class="user-account">{{ loginUser?.userAccount }}</span>
                </div>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile" @click="handleGoProfile">
                    <span>个人信息</span>
                  </a-menu-item>
                  <a-menu-item key="account" disabled>
                    <span>账号：{{ loginUser?.userAccount }}</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
        <template v-else>
          <a-space :size="12">
            <a-button type="link" class="ghost-button" @click="handleGoLogin">登录</a-button>
            <a-button type="primary" shape="round" @click="handleGoRegister">免费注册</a-button>
          </a-space>
        </template>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import type { MenuProps } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/LoginUser'
import { userLogout } from '@/api/userController'

const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()
const { loginUser, isLoggedIn, isAdmin } = storeToRefs(loginUserStore)

const selectedKeys = ref<string[]>([route.path])

onMounted(() => {
  loginUserStore.fetchLoginUser()
})

const menuItems = computed<MenuProps['items']>(() => {
  const items: NonNullable<MenuProps['items']> = [
    {
      key: '/',
      label: '首页',
    },
    {
      key: '/about',
      label: '关于',
    },
    {
      key: 'others',
      label: h(
        'a',
        { href: 'https://www.codefather.cn', target: '_blank', rel: 'noopener noreferrer' },
        '编程导航',
      ),
    },
  ]
  if (isAdmin.value) {
    items.splice(1, 0, {
      key: '/admin/users',
      label: '用户管理',
    })
  }
  return items
})

const handleMenuClick: MenuProps['onClick'] = (info) => {
  const targetKey = info.key as string
  if (targetKey.startsWith('/')) {
    selectedKeys.value = [targetKey]
    router.push(targetKey)
  }
}

const handleGoLogin = () => {
  router.push({ path: '/user/login', query: { redirect: route.fullPath } })
}

const handleGoRegister = () => {
  router.push({ path: '/user/register', query: { redirect: route.fullPath } })
}

const handleGoProfile = () => {
  router.push('/user/profile')
}

const handleLogout = async () => {
  try {
    const res = await userLogout()
    if (res.data.code === 0) {
      message.success('已退出登录')
      loginUserStore.resetLoginUser()
      router.replace('/user/login')
      return
    }
    message.error(res.data.message || '退出失败，请稍后重试')
  } catch (error) {
    message.error('退出请求失败，请检查网络')
  }
}

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
  },
  { immediate: true },
)
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(12px);
  padding: 12px 48px;
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.1);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f1f1f;
}

.brand-subtitle {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.nav-menu {
  flex: 1;
  min-width: 320px;
  background: transparent;
  border-bottom: none;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ghost-button {
  color: #1677ff;
}

.user-entry {
  cursor: pointer;
}

.user-avatar {
  background: linear-gradient(135deg, #1677ff, #69b1ff);
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.user-account {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

@media (max-width: 992px) {
  .header {
    padding: 12px 24px;
  }

  .header-inner {
    gap: 16px;
  }

  .nav-menu {
    display: none;
  }
}
</style>
