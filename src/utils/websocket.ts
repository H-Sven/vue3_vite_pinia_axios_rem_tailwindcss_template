/**
 * WebSocket 封装
 */
class Socket {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  reconnectAttempts: number;
  ws: WebSocket | null;
  listeners: Map<string, ((...args: any[]) => void)[]>;
  isConnected: boolean;

  /**
   * 构造函数
   * @param {string} url WebSocket地址
   * @param {number} reconnectInterval 重连间隔(ms)
   * @param {number} maxReconnectAttempts 最大重连次数
   */
  constructor(url: string, reconnectInterval: number = 3000, maxReconnectAttempts: number = 5) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.reconnectAttempts = 0;
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;

    this.connect();
  }

  /**
   * 建立连接
   */
  connect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket Max reconnect attempts reached');
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('open', undefined);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (_e) {
          this.emit('message', event.data);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Closed');
        this.isConnected = false;
        this.emit('close', undefined);
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('WebSocket Connection Failed:', error);
      this.reconnect();
    }
  }

  /**
   * 重连机制
   */
  reconnect() {
    if (this.isConnected) return;
    setTimeout(() => {
      console.log(`WebSocket Reconnecting... Attempt ${this.reconnectAttempts + 1}`);
      this.reconnectAttempts++;
      this.connect();
    }, this.reconnectInterval);
  }

  /**
   * 发送消息
   * @param {any} data 要发送的数据
   */
  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  /**
   * 关闭连接
   */
  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  /**
   * 监听事件
   * @param {string} event 事件名
   * @param {function} callback 回调函数
   */
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * 移除监听
   * @param {string} event 事件名
   * @param {function} callback 回调函数
   */
  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.listeners.has(event)) return;
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} event 事件名
   * @param {any} data 事件数据
   */
  emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach((callback) => callback(data));
    }
  }
}

export default Socket;
