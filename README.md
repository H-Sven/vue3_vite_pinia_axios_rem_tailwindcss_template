# Vue 3 + Vite 企业级开发模板

基于 Vue 3、Vite、Tailwind CSS、Pinia、Axios 构建的现代化前端开发模板，集成了国际化、移动端适配、代码规范等企业级特性。

## ✨ 特性

- **核心框架**: Vue 3 (Script Setup) + Vite 5
- **样式方案**: Tailwind CSS + PostCSS (自动将 px 转换为 rem，完美适配移动端)
- **CSS 预处理**: 支持 Sass (SCSS)
- **状态管理**: Pinia + pinia-plugin-persistedstate (数据持久化)
- **网络请求**: Axios 深度封装 (拦截器、GET/POST/PUT/PATCH/DELETE、错误处理)
- **国际化**: Vue I18n (支持多语言切换)
- **路由**: Vue Router (路由守卫配置)
- **工具库**:
  - **Day.js**: 轻量级日期处理
  - **Mitt**: 全局事件总线 (EventBus)
  - **WebSocket**: 封装带重连机制的 WebSocket 类及全局 Hook
- **代码规范**: ESLint + eslint-plugin-simple-import-sort (自动排序导入导出)
- **多环境**: 支持 development, test, pre, production 多环境配置
- **开发体验**: 配置 `@` 路径别名

## 🚀 快速开始

### 1. 安装依赖

本项目使用 `pnpm` 进行包管理：

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
# 默认开发环境
pnpm dev

# 预发布环境
pnpm dev:pre

# 测试环境
pnpm dev:test

# 生产环境
pnpm dev:prod
```

### 3. 构建部署

```bash
# 构建生产环境
pnpm build:prod

# 构建其他环境
pnpm build:pre
pnpm build:test
```

## 📂 目录结构

```text
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── hooks/           # 组合式函数 (如 useWebSocket)
│   ├── locales/         # 国际化语言包
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia 状态管理
│   ├── utils/           # 工具函数 (request, bus, websocket等)
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── .env.*               # 环境变量文件
├── eslint.config.js     # ESLint 配置
├── postcss.config.js    # PostCSS 配置
├── tailwind.config.js   # Tailwind 配置
└── vite.config.js       # Vite 配置
```

## 🛠 功能使用说明

### 1. 网络请求 (Axios)

已在 `src/utils/request.js` 中封装，支持所有标准 HTTP 方法。

```javascript
import request from '@/utils/request';

// GET
request.get('/api/users', { id: 1 });

// POST
request.post('/api/login', { username, password });

// PUT/PATCH/DELETE
request.put('/api/users/1', data);
request.delete('/api/users/1');
```

### 2. WebSocket

提供了全局单例 Hook `useWebSocket`，支持自动重连和全局状态共享。

```javascript
import { useWebSocket } from '@/hooks/useWebSocket';

const { isConnected, message, sendMessage, connect, close } = useWebSocket('wss://your-url');

// 发送消息
sendMessage({ type: 'ping' });

// 监听消息 (message 是响应式 ref)
watch(message, (newMsg) => {
  console.log('Received:', newMsg);
});
```

### 3. EventBus

使用 `mitt` 封装的全局事件总线。

```javascript
import bus from '@/utils/bus';

// 监听
bus.on('event-name', (data) => {
  console.log(data);
});

// 触发
bus.emit('event-name', { some: 'data' });

// 移除
bus.off('event-name');
```

### 4. 国际化 (I18n)

```javascript
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// 切换语言
locale.value = 'en'; // or 'zh-CN'

// 使用
console.log(t('message.welcome'));
```

### 5. 环境变量

在根目录下通过 `.env.[mode]` 文件配置：

```properties
VITE_API_URL=https://api.example.com
```

在代码中使用：

```javascript
console.log(import.meta.env.VITE_API_URL);
```

## 📄 License

MIT
