<template>
  <div class="profile-page">
    <a-page-header
      class="page-header"
      title="个人信息"
      sub-title="更新昵称、头像与简介，让账号更具识别度"
      @back="handleBack"
    />
    <a-spin :spinning="pageLoading">
      <a-card class="profile-card" bordered>
        <template v-if="loginUser">
          <a-form
            ref="formRef"
            layout="vertical"
            :model="formState"
            :rules="rules"
            @finish="handleSubmit"
          >
            <a-row :gutter="24">
              <a-col :xs="24" :md="12">
                <a-form-item label="账号">
                  <a-input :value="loginUser.userAccount" disabled />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="12">
                <a-form-item label="昵称" name="userName">
                  <a-input
                    v-model:value="formState.userName"
                    allow-clear
                    maxlength="16"
                    placeholder="请输入昵称"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="头像地址" name="userAvatar">
              <a-input
                v-model:value="formState.userAvatar"
                allow-clear
                placeholder="请输入头像图片地址，支持 http(s) 链接"
              />
            </a-form-item>

            <a-form-item label="个人简介" name="userProfile">
              <a-textarea
                v-model:value="formState.userProfile"
                allow-clear
                :rows="4"
                maxlength="200"
                placeholder="请输入个人简介（最多 200 字）"
                show-count
              />
            </a-form-item>

            <div class="form-actions">
              <a-space :size="12">
                <a-button @click="handleReset" :disabled="submitting">重置</a-button>
                <a-button type="primary" html-type="submit" :loading="submitting">
                  保存修改
                </a-button>
              </a-space>
            </div>
          </a-form>
        </template>
        <template v-else>
          <a-empty description="未获取到用户信息，请重新登录后再尝试" />
        </template>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { useLoginUserStore } from '@/stores/LoginUser'
import { updateInfo } from '@/api/userController'

const router = useRouter()
const loginUserStore = useLoginUserStore()
const { loginUser, loading, hasFetched } = storeToRefs(loginUserStore)

const formRef = ref<FormInstance>()
const submitting = ref(false)
const formState = reactive<API.UserUpdateRequest>({})

const rules: Partial<Record<keyof API.UserUpdateRequest, Rule[]>> = {
  userName: [
    { required: true, message: '请输入昵称' },
    { min: 2, message: '昵称至少需要 2 个字符' },
  ],
  userAvatar: [
    {
      type: 'url',
      message: '请输入合法的链接地址',
      trigger: 'blur',
    },
  ],
  userProfile: [
    {
      max: 200,
      message: '个人简介最多 200 个字符',
      trigger: 'blur',
    },
  ],
}

const pageLoading = computed(() => loading.value && !hasFetched.value)

const fillForm = (user: API.LoginUserVO) => {
  formState.userName = user.userName ?? ''
  formState.userAvatar = user.userAvatar ?? ''
  formState.userProfile = user.userProfile ?? ''
}

watch(
  () => loginUser.value,
  (user) => {
    if (user) {
      fillForm(user)
    }
  },
  { immediate: true },
)

onMounted(() => {
  loginUserStore.fetchLoginUser()
})

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}

const handleReset = () => {
  if (loginUser.value) {
    fillForm(loginUser.value)
  }
}

const handleSubmit = async () => {
  if (!loginUser.value?.id) {
    message.error('未获取到登录状态，请重新登录')
    return
  }
  submitting.value = true
  loginUserStore.updateLoginUser(formState)
  formState.id = loginUser.value.id
  try {
    const res = await updateInfo(formState)

    if (res.data?.code === 0) {
      message.success('个人信息更新成功')
      await loginUserStore.fetchLoginUser(true)
      handleReset()
      return
    }

    message.error(res.data?.message || '更新失败，请稍后重试')
  } catch (error) {
    message.error('更新请求失败，请检查网络连接')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.page-header {
  padding: 0;
  margin-bottom: 24px;
}

.profile-card {
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(64, 158, 255, 0.08);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 24px 16px 40px;
  }
}
</style>
