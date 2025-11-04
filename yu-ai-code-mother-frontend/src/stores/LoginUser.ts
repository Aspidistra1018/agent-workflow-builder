import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUser } from '@/api/userController'

export const useLoginUserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.LoginUserVO | null>(null)
  const loading = ref(false)
  const hasFetched = ref(false)

  const isLoggedIn = computed(() => Boolean(loginUser.value?.id))
  const isAdmin = computed(() => loginUser.value?.userRole === 'admin')

  const fetchLoginUser = async (force = false) => {
    if (loading.value) return
    if (hasFetched.value && !force) return
    loading.value = true
    try {
      const res = await getLoginUser()
      if (res.data.code === 0 && res.data.data) {
        loginUser.value = res.data.data
      } else {
        loginUser.value = null
      }
    } catch (error) {
      loginUser.value = null
    } finally {
      hasFetched.value = true
      loading.value = false
    }
  }

  const setLoginUser = (user: API.LoginUserVO | null) => {
    loginUser.value = user
    hasFetched.value = true
  }

  const resetLoginUser = () => {
    loginUser.value = null
    hasFetched.value = false
  }

    const updateLoginUser = (user: Partial<API.UserUpdateRequest> | null) => {
    if (user === null) {
      loginUser.value = null
    } else {
      if (loginUser.value) {
        // 合并属性，只更新提供的属性，保留原有未变更的属性
        Object.assign(loginUser.value, user)
      } else {
        // 如果原来没有值，则直接设置
        loginUser.value = user as API.LoginUserVO
      }
    }
    hasFetched.value = true
  }

  return {
    loginUser,
    loading,
    hasFetched,
    isLoggedIn,
    isAdmin,
    fetchLoginUser,
    setLoginUser,
    resetLoginUser,
    updateLoginUser,
  }
})
