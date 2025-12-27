import { defineStore } from 'pinia';

interface UserState {
  token: string;
  userInfo: any | null;
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
  },
  actions: {
    /**
     * 设置 token
     * @param {string} token
     */
    setToken(token: string) {
      this.token = token;
    },
    /**
     * 设置用户信息
     * @param {object} info
     */
    setUserInfo(info: any) {
      this.userInfo = info;
    },
    /**
     * 退出登录
     */
    logout() {
      this.token = '';
      this.userInfo = null;
    },
  },
  persist: {
    key: 'user-store',
    pick: ['token', 'userInfo'],
  },
});
