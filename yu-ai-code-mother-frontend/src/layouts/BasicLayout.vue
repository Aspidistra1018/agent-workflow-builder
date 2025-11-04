<template>
  <a-layout class="basic-layout">
    <GlobalHeader v-if="!isAuthPage" />
    <a-layout-content :class="contentClass">
      <router-view />
    </a-layout-content>
    <GlobalFooter v-if="!isAuthPage" />
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

const route = useRoute()

const isAuthPage = computed(() => Boolean(route.meta?.hideChrome))

const contentClass = computed(() => ({
  'main-content': !isAuthPage.value,
}))
</script>

<style scoped>
.basic-layout {
  background: none;
}

.main-content {
  max-width: 1200px;
  padding: 24px;
  background: white;
  margin: 16px auto 56px;
}
</style>
