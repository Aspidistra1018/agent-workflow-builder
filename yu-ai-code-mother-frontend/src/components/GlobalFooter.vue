<template>
  <a-layout-footer class="footer">
    <div class="footer-inner">
      <span>© {{ currentYear }} 鱼皮应用生成 · 让更多想法快速实现</span>
      <a-space :size="12">
        <a
          href="https://www.codefather.cn"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          编程导航
        </a>
        <a
          href="https://github.com/liyupi"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          GitHub
        </a>
      </a-space>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: linear-gradient(90deg, rgba(22, 119, 255, 0.12), rgba(111, 207, 255, 0.12));
  padding: 24px 48px;
  text-align: center;
}

.footer-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  color: rgba(0, 0, 0, 0.55);
  font-size: 14px;
}

.footer-link {
  color: #1677ff;
}
</style>
