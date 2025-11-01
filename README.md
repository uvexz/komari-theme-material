# Komari Theme Material

一个基于 Material UI 的 Komari Monitor 主题，提供现代化的 Material Design 风格界面。

## 特性

- ✨ Material Design 风格界面
- 🎨 支持明暗主题切换
- 📊 三种显示模式：详细网格、简约网格、表格
- 🔧 可配置的主题参数
- 📱 响应式设计
- ⚡ 实时数据更新
- 🎯 按 weight 自动排序节点

## 显示模式

### 详细网格模式
显示完整的节点信息，包括 CPU、内存、磁盘使用率和网络流量，带有进度条可视化。

### 简约网格模式
紧凑的卡片视图，显示关键指标，适合监控大量节点。

### 表格模式
传统的表格视图，便于快速浏览和比较多个节点的状态。

## 主题配置

在 Komari 管理面板中可以配置以下参数：

- **默认显示模式**: 选择默认的节点显示模式
- **每行卡片数**: 网格模式下每行显示的卡片数量（1-4）
- **主色调**: 选择主题的主色调（蓝色、紫色、绿色、橙色、红色）
- **启用动画效果**: 是否启用卡片和过渡动画

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 打包主题

构建完成后，将以下文件打包成 zip：
- komari-theme.json
- dist/ 目录
- preview.png（可选）

## 技术栈

- React 19
- Material UI 7
- TypeScript
- Vite

## 许可证

MIT
