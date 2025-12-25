<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">WebSocket 测试 (Global Hook)</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">WebSocket 地址</label>
        <div class="flex gap-2">
          <input 
            v-model="wsUrl" 
            type="text" 
            class="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="wss://echo.websocket.org"
          >
          <button 
            :class="[
              'px-6 py-2 text-white rounded-md transition-colors',
              isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            ]" 
            @click="toggleConnection"
          >
            {{ isConnected ? '断开' : '连接' }}
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">发送消息</label>
        <div class="flex gap-2">
          <input 
            v-model="messageInput" 
            type="text"
            class="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="输入消息..."
            :disabled="!isConnected"
            @keyup.enter="handleSendMessage"
          >
          <button 
            class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="!isConnected"
            @click="handleSendMessage"
          >
            发送
          </button>
        </div>
      </div>
    </div>

    <div class="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
      <div v-for="(log, index) in logs" :key="index" class="mb-1">
        <span class="text-gray-500">[{{ log.time }}]</span>
        <span :class="log.type === 'send' ? 'text-blue-400' : log.type === 'error' ? 'text-red-400' : 'text-green-400'">
          {{ log.type === 'send' ? '→' : '←' }} {{ log.content }}
        </span>
      </div>
    </div>
    
    <div class="mt-6 text-center">
        <router-link to="/" class="text-blue-600 hover:underline">返回主页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';

import { useWebSocket } from '@/hooks/useWebSocket';
import { formatDate } from '@/utils/date';

const wsUrl = ref('wss://echo.websocket.org');
const messageInput = ref('');

interface Log {
  time: string;
  content: string;
  type: string;
}

const logs = ref<Log[]>([]);

// 使用全局 Hook
// 注意：解构出的 isConnected, message, error 是全局响应式 ref
const { isConnected, message: lastMessage, error, sendMessage, close: wsClose } = useWebSocket();

const addLog = (content: string, type: string = 'receive') => {
  logs.value.push({
    time: formatDate(new Date(), 'HH:mm:ss'),
    content,
    type
  });
};

// 监听全局连接状态
watch(isConnected, (val) => {
  if (val) {
    addLog('连接成功');
  } else {
    addLog('连接断开', 'error');
  }
});

// 监听全局错误
watch(error, (err) => {
  if (err) {
    addLog(`发生错误: ${err}`, 'error');
  }
});

// 监听收到消息
watch(lastMessage, (newMsg) => {
  if (newMsg) {
    addLog(`收到消息: ${typeof newMsg === 'object' ? JSON.stringify(newMsg) : newMsg}`);
  }
});

const toggleConnection = () => {
  if (isConnected.value) {
    wsClose();
  } else {
    addLog(`正在连接到 ${wsUrl.value}...`, 'send');
    // 再次调用 hook 并传入 url 以触发初始化或重连
    useWebSocket(wsUrl.value);
  }
};

const handleSendMessage = () => {
  if (!messageInput.value || !isConnected.value) return;
  
  sendMessage(messageInput.value);
  addLog(`发送消息: ${messageInput.value}`, 'send');
  messageInput.value = '';
};

// 页面卸载时不主动断开，以演示全局单例特性
onUnmounted(() => {
  // 如果希望页面离开即断开，可以取消下面的注释
  // wsClose();
});
</script>
