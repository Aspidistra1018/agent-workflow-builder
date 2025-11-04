<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1>鱼皮应用生成 · 一站式智能建站平台</h1>
        <p>
          结合 AI 智能与云原生技术，帮助团队以更高效率交付业务需求。从原型到上线，只需几个简单步骤。
        </p>
        <a-space :size="16">
          <a-button type="primary" shape="round" size="large" href="/user/register">
            立即体验
          </a-button>
          <a-button shape="round" size="large" href="/about">了解更多</a-button>
        </a-space>
      </div>
      <div class="hero-visual">
        <div class="icon-wrapper">
          <desktop-outlined class="hero-icon" />
        </div>
      </div>
    </section>

    <section class="feature-section">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :md="8">
          <a-card class="feature-card" :bordered="false">
            <h3>丰富模板</h3>
            <p>覆盖主流行业场景，一键即可生成标准化模块，快速搭建业务骨架。</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="8">
          <a-card class="feature-card" :bordered="false">
            <h3>智能生成</h3>
            <p>AI 自动配置页面与接口，支持自定义逻辑扩展，显著缩短开发周期。</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="8">
          <a-card class="feature-card" :bordered="false">
            <h3>云端运维</h3>
            <p>内置高可用部署与实时监控，开箱即用，保障业务稳定运行。</p>
          </a-card>
        </a-col>
      </a-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DesktopOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
:global(.main-content) {
  max-width: none;
  padding: 0 48px 96px;
  margin: 0;
  background: transparent;
}

.home-page {
  padding: 48px 0 96px;
  min-height: 100%;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  margin-bottom: 64px;
}

.hero-content h1 {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1f1f1f;
  line-height: 1.2;
}

.hero-content p {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 32px;
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 460px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: linear-gradient(135deg, #e6f7ff, #f0faff);
  box-shadow: 0 24px 60px rgba(22, 119, 255, 0.25);
}

.hero-icon {
  font-size: 200px;
  color: #1890ff;
}

.feature-section {
  background: #f7faff;
  padding: 32px 24px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(38, 79, 217, 0.08);
}

.feature-card {
  min-height: 160px;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.12);
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-card p {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.7;
}

@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .icon-wrapper {
    width: 320px;
    height: 220px;
  }

  .hero-icon {
    font-size: 150px;
  }
}
</style>