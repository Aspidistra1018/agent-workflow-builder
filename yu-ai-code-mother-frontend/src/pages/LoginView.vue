<template>
  <div class="auth-wrapper">
    <div class="auth-header">
      <RouterLink to="/" class="brand">
        <img class="brand-logo" src="@/assets/logo.png" alt="logo" />
        <span class="brand-name">鱼皮应用生成</span>
      </RouterLink>
      <div class="header-actions">
        <span>还没有账号？</span>
        <a-button type="link" @click="goRegister">去注册</a-button>
      </div>
    </div>

    <div class="auth-body">
      <div class="hero">
        <h2>智能开发 · 极速上线</h2>
        <p>拥有灵感就能拥有应用，云端一键生成，让业务创新更快一步。</p>
        <a-space>
          <a-tag color="blue">云原生</a-tag>
          <a-tag color="geekblue">AI 助力</a-tag>
          <a-tag color="purple">无需运维</a-tag>
        </a-space>
      </div>

      <div class="form-card">
        <h3 class="form-title">账号登录</h3>
        <p class="form-subtitle">使用账号密码登录，享受全链路开发体验</p>
        <a-form layout="vertical" :model="formState" :rules="rules" @finish="handleSubmit">
          <a-form-item label="账号" name="userAccount">
            <a-input v-model:value="formState.userAccount" size="large" placeholder="请输入账号" allow-clear
              autocomplete="username" />
          </a-form-item>
          <a-form-item label="密码" name="userPassword">
            <a-input-password v-model:value="formState.userPassword" size="large" placeholder="请输入密码" allow-clear
              autocomplete="current-password" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" block size="large" :loading="submitting">
              立即登录
            </a-button>
          </a-form-item>
        </a-form>
        <div class="form-extra">
          忘记密码？
          <a-typography-link disabled>联系管理员重置</a-typography-link>
        </div>
        <div class="agreement">
          登录即默认同意
          <a-typography-link disabled>《用户协议》</a-typography-link>
          和
          <a-typography-link disabled>《隐私政策》</a-typography-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { userLogin } from '@/api/userController'
import { useLoginUserStore } from '@/stores/LoginUser'


const router = useRouter()
const route = useRoute()
const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})

const submitting = ref(false)

const rules: Partial<Record<keyof API.UserLoginRequest, Rule[]>> = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { min: 4, message: '账号至少 4 个字符' },
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少 6 个字符' },
  ],
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const res = await userLogin({
      userAccount: formState.userAccount?.trim() ?? '',
      userPassword: formState.userPassword,
    })
    if (res.data.code === 0) {
      loginUserStore.setLoginUser(res.data.data ?? null)
      message.success('登录成功')
      const redirect = (route.query.redirect as string) || '/'
      router.replace(redirect)
      return
    }
    message.error(res.data.message || '登录失败，请稍后重试')
  } catch (error) {
    message.error('登录请求失败，请检查网络')
  } finally {
    submitting.value = false
  }
}

const goRegister = () => {
  router.push({ path: '/user/register', query: route.query })
}
</script>

<style scoped>
:global(.main-content) {
  max-width: none;
  padding: 0;
  margin: 0;
  background: transparent;
}

.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #ffffff 45%, #f6ffed 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 64px;
}

.auth-header {
  width: 100%;
  max-width: 1120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f1f1f;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(0, 0, 0, 0.65);
}

.auth-body {
  width: 100%;
  max-width: 1120px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 64px;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 32px;
  padding: 48px 64px;
  box-shadow: 0 20px 60px rgba(0, 63, 155, 0.08);
  backdrop-filter: blur(12px);
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero h2 {
  font-size: 36px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
}

.hero p {
  margin: 0;
  font-size: 16px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.65);
}

.form-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 32px 24px;
  box-shadow: 0 12px 40px rgba(24, 144, 255, 0.12);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px;
}

.form-subtitle {
  margin: 0 0 32px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.form-extra,
.agreement {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.agreement {
  margin-top: 8px;
}

@media (max-width: 992px) {
  .auth-body {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px 32px;
  }

  .hero {
    text-align: center;
    align-items: center;
  }
}
</style>
