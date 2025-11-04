<template>
  <div class="about-page">
    <div class="about-hero">
      <h1>关于鱼皮应用生成</h1>
      <p>
        我们致力于打造新一代 AI 驱动的应用搭建平台，帮助开发者和业务团队在极短时间内完成原型构建与上线。
      </p>
    </div>

    <div class="about-grid">
      <a-card class="about-card" :bordered="false">
        <h3>平台愿景</h3>
        <p>让每一个想法都能快速落地，用更低成本探索更多可能性，推动数字化创新。</p>
      </a-card>
      <a-card class="about-card" :bordered="false">
        <h3>核心能力</h3>
        <ul>
          <li>海量行业模板，随选随用</li>
          <li>AI 自动化配置，智能生成页面与接口</li>
          <li>一键部署与监控，持续稳定运行</li>
        </ul>
      </a-card>
      <a-card class="about-card" :bordered="false">
        <h3>联系我们</h3>
        <p>关注编程导航社区，第一时间获得平台动态与技术分享。</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
:global(.main-content) {
  max-width: none;
  padding: 0 48px 96px;
  margin: 0;
  background: transparent;
}

.about-page {
  padding: 48px 0 96px;
  min-height: 100%;
  background: linear-gradient(180deg, #f6f9ff 0%, #ffffff 70%);
}

.about-hero {
  text-align: center;
  margin-bottom: 48px;
}

.about-hero h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f1f1f;
}

.about-hero p {
  max-width: 640px;
  margin: 0 auto;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.8;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.about-card {
  height: 100%;
  border-radius: 20px;
  box-shadow: 0 16px 36px rgba(33, 150, 243, 0.12);
}

.about-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.about-card p,
.about-card li {
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.8;
}

.about-card ul {
  padding-left: 20px;
  margin: 0;
}
</style>
