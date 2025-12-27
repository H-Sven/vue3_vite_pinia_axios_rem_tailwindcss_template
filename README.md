# Vue 3 + TypeScript + Vite 企业级开发模板

基于 Vue 3、TypeScript、Vite、Tailwind CSS、Pinia、Axios 构建的现代化前端开发模板，集成了国际化、移动端适配、代码规范、Git 提交规范等企业级特性。

## ✨ 特性

- **核心框架**: Vue 3 (Script Setup) + TypeScript + Vite 5
- **样式方案**: Tailwind CSS + PostCSS (自动将 px 转换为 rem，完美适配移动端)
- **CSS 预处理**: 支持 Sass (SCSS)
- **状态管理**: Pinia + pinia-plugin-persistedstate (数据持久化)
- **网络请求**: Axios 深度封装 (拦截器、GET/POST/PUT/PATCH/DELETE、错误处理、类型定义)
- **国际化**: Vue I18n (支持多语言切换)
- **路由**: Vue Router (路由守卫配置)
- **工具库**:
  - **Day.js**: 轻量级日期处理
  - **Mitt**: 全局事件总线 (EventBus)
  - **WebSocket**: 封装带重连机制的 WebSocket 类及全局 Hook
- **代码规范**:
  - **ESLint**: TypeScript + Vue 3 规则配置
  - **Prettier**: 代码格式化工具，统一代码风格
  - **Husky + lint-staged**: Git 提交前自动检查并修复代码
- **多环境**: 支持 development, test, pre, production 多环境配置
- **开发体验**: 配置 `@` 路径别名，全量 TypeScript 类型支持，自动导入 Vue 组件、Pinia 状态、工具函数等

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

### 3. 代码检查与修复

```bash
# 运行 ESLint 检查
pnpm lint

# 运行 Prettier 格式化
pnpm format

# 运行类型检查
pnpm exec vue-tsc --noEmit
```

### 4. 构建部署

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
│   ├── hooks/           # 组合式函数 (如 useWebSocket.ts)
│   ├── locales/         # 国际化语言包
│   ├── router/          # 路由配置 (index.ts)
│   ├── stores/          # Pinia 状态管理 (*.ts)
│   ├── utils/           # 工具函数 (request.ts, bus.ts, websocket.ts等)
│   ├── views/           # 页面组件 (*.vue)
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── vite-env.d.ts    # Vite 类型声明
├── .husky/              # Git Hooks 配置
├── .env.*               # 环境变量文件
├── eslint.config.js     # ESLint 配置
├── postcss.config.js    # PostCSS 配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
├── auto-imports.d.ts    # 自动导入类型声明 (自动生成)
├── components.d.ts      # 组件类型声明 (自动生成)
└── .eslintrc-auto-import.json # ESLint 自动导入配置 (自动生成)
```

## 🛠 功能使用说明

### 1. 网络请求 (Axios)

已在 `src/utils/request.ts` 中封装，支持所有标准 HTTP 方法及类型推断。

```typescript
import request from '@/utils/request';

// 定义响应数据接口
interface User {
  id: number;
  name: string;
}

// GET
request.get<User>('/api/users', { id: 1 });

// POST
request.post('/api/login', { username, password });

// PUT/PATCH/DELETE
request.put('/api/users/1', data);
request.delete('/api/users/1');
```

### 2. WebSocket

提供了全局单例 Hook `useWebSocket`，支持自动重连和全局状态共享。

```typescript
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

```typescript
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

项目集成了 `vue-i18n` 并通过 `Pinia` (`appStore`) 实现了语言状态的持久化管理。

```typescript
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/stores/app';

const { t } = useI18n();
const appStore = useAppStore();

// 切换语言 (会自动保存到本地存储并更新 i18n 实例)
appStore.setLanguage('en'); // or 'zh'

// 使用翻译
console.log(t('message.welcome'));
```

### 5. 环境变量

在根目录下通过 `.env.[mode]` 文件配置：

```properties
VITE_API_URL=https://api.example.com
```

在代码中使用 (有类型提示)：

```typescript
console.log(import.meta.env.VITE_API_URL);
```

### 6. Git 提交规范 (Husky + lint-staged)

项目配置了 `pre-commit` 钩子。当你执行 `git commit` 时：

1. 会自动运行 `lint-staged`。
2. 对暂存区的文件执行 `prettier --write` 进行格式化。
3. 对代码文件 (`.js`, `.ts`, `.vue` 等) 执行 `eslint --fix`。
4. 如果 ESLint 修复失败或发现无法修复的错误，提交将被终止。

### 7. 自动导入 (Auto Import)

项目集成了 `unplugin-auto-import` 和 `unplugin-vue-components`，为您提供极佳的开发体验。

#### API 自动导入

无需手动 `import` Vue、Vue Router、Pinia 的常用 API。

```typescript
// ❌ 以前的写法
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const count = ref(0);
const router = useRouter();

// ✅ 现在的写法 (直接使用)
const count = ref(0);
const router = useRouter();
```

#### 组件自动导入

在 `src/components` 目录下的组件，以及通过 Element Plus 等 UI 库引入的组件，可以直接在模板中使用，无需手动导入和注册。

#### ⚠️ 常见问题

如果您遇到 **ESLint 报错** (如 `ref is not defined`) 或 **缺少类型提示**：

1. 请确保项目已安装依赖 (`pnpm install`)。
2. 运行一次开发服务器 (`pnpm dev`) 或构建命令 (`pnpm build`)。
3. 这些命令会自动更新 `auto-imports.d.ts`、`components.d.ts` 和 `.eslintrc-auto-import.json` 文件。
4. 如果问题仍未解决，尝试重启 IDE 或 ESLint 服务。

## 📄 License

MIT
