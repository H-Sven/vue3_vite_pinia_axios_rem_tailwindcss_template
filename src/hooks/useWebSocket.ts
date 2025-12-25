import { type Ref,ref } from 'vue';

import Socket from '@/utils/websocket';

// 模块级变量，充当单例存储
let socketInstance: Socket | null = null;

// 全局响应式状态，让所有使用此 hook 的组件共享状态
const isConnected: Ref<boolean> = ref(false);
const message: Ref<any> = ref(null);
const error: Ref<any> = ref(null);

/**
 * 全局唯一 WebSocket Hook
 * @param {string} [url] WebSocket 服务地址
 * @returns {object} WebSocket 状态和操作方法
 */
export function useWebSocket(url?: string) {
  // 如果提供了 URL，尝试初始化或切换连接
  if (url) {
    // 如果实例不存在，或者 URL 发生了变化，则重新创建
    if (!socketInstance || socketInstance.url !== url) {
      // 如果已有实例，先关闭
      if (socketInstance) {
        socketInstance.close();
      }

      // 创建新实例
      socketInstance = new Socket(url);

      // 绑定事件更新全局状态
      socketInstance.on('open', () => {
        isConnected.value = true;
        error.value = null;
      });

      socketInstance.on('close', () => {
        isConnected.value = false;
      });

      socketInstance.on('error', (err: any) => {
        error.value = err;
        isConnected.value = false;
      });

      socketInstance.on('message', (data: any) => {
        message.value = data;
      });
    } else if (!socketInstance.isConnected) {
      // 如果实例存在，URL 相同，但未连接，则尝试重连
      socketInstance.connect();
    }
  }

  // 发送消息方法
  const sendMessage = (data: any) => {
    if (socketInstance) {
      socketInstance.send(data);
    } else {
      console.warn('WebSocket instance not initialized');
    }
  };

  // 手动重连
  const connect = () => {
    if (socketInstance && !socketInstance.isConnected) {
      socketInstance.connect();
    }
  };

  // 手动关闭
  const close = () => {
    if (socketInstance) {
      socketInstance.close();
    }
  };

  return {
    socket: socketInstance, // 暴露原始实例以便高级操作
    isConnected,
    message,
    error,
    sendMessage,
    connect,
    close
  };
}
