<template>
  <div class="auth-wrapper">
    <div class="auth-header">
      <RouterLink to="/" class="brand">
        <img class="brand-logo" src="@/assets/logo.png" alt="logo" />
        <span class="brand-name">鱼皮应用生成</span>
      </RouterLink>
      <div class="header-actions">
        <span>已有账号？</span>
        <a-button type="link" @click="goLogin">去登录</a-button>
      </div>
    </div>

    <div class="auth-body">
      <div class="hero">
        <h2>十分钟拥有企业级应用</h2>
        <p>注册新账号即可享受万级模板、AI 智能配置与一键部署能力，助你快速构建业务系统。</p>
        <a-space>
          <a-tag color="cyan">极速上手</a-tag>
          <a-tag color="blue">模板丰富</a-tag>
          <a-tag color="geekblue">专业支持</a-tag>
        </a-space>
      </div>

      <div class="form-card">
        <h3 class="form-title">创建账号</h3>
        <p class="form-subtitle">填写信息完成注册，立刻体验云端应用生成服务</p>
        <a-form
          layout="vertical"
          :model="formState"
          :rules="rules"
          @finish="handleSubmit"
          @finish-failed="handleSubmitFailed"
        >
          <a-form-item label="账号" name="userAccount">
            <a-input
              v-model:value="formState.userAccount"
              size="large"
              placeholder="请输入账号"
              allow-clear
              autocomplete="username"
            />
          </a-form-item>
          <a-form-item label="密码" name="userPassword">
            <a-input-password
              v-model:value="formState.userPassword"
              size="large"
              placeholder="请设置密码"
              allow-clear
              autocomplete="new-password"
            />
          </a-form-item>
          <a-form-item label="确认密码" name="checkPassword">
            <a-input-password
              v-model:value="formState.checkPassword"
              size="large"
              placeholder="请再次输入密码"
              allow-clear
              autocomplete="new-password"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" block size="large" :loading="submitting">
              立即注册
            </a-button>
          </a-form-item>
        </a-form>
        <div class="agreement">
          注册即表示同意
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
import { register } from '@/api/userController'

const router = useRouter()
const route = useRoute()

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const submitting = ref(false)

const rules: Partial<Record<keyof API.UserRegisterRequest, Rule[]>> = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { min: 4, message: '账号至少 4 个字符' },
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少 6 个字符' },
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator: (_rule, value) => {
        if (!value) {
          return Promise.reject(new Error('请再次输入密码'))
        }
        if (value !== formState.userPassword) {
          return Promise.reject(new Error('两次输入的密码不一致'))
        }
        return Promise.resolve()
      },
    },
  ],
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    const res = await register({
      userAccount: formState.userAccount?.trim() ?? '',
      userPassword: formState.userPassword,
      checkPassword: formState.checkPassword,
    })
    if (res.data.code === 0) {
      message.success('注册成功，请登录')
      const redirect = (route.query.redirect as string) || '/'
      router.replace({ path: '/user/login', query: { redirect } })
      return
    }
    message.error(res.data.message || '注册失败，请稍后重试')
  } catch (error) {
    message.error('注册请求失败，请检查网络')
  } finally {
    submitting.value = false
  }
}

const handleSubmitFailed = () => {
  message.warning('请检查表单输入')
}

const goLogin = () => {
  router.push({ path: '/user/login', query: route.query })
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
  background: linear-gradient(135deg, #f0f5ff 0%, #ffffff 45%, #fff1f0 100%);
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
  background: rgba(255, 255, 255, 0.72);
  border-radius: 32px;
  padding: 48px 64px;
  box-shadow: 0 20px 60px rgba(255, 85, 0, 0.08);
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
  box-shadow: 0 12px 40px rgba(255, 122, 69, 0.16);
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

.agreement {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
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
