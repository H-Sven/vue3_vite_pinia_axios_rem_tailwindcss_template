import { defineStore } from 'pinia';

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    /**
     * 设置 token
     * @param {string} token 
     */
    setToken(token) {
      this.token = token;
    },
    /**
     * 设置用户信息
     * @param {object} info 
     */
    setUserInfo(info) {
      this.userInfo = info;
    },
    /**
     * 退出登录
     */
    logout() {
      this.token = '';
      this.userInfo = null;
    }
  },
  persist: {
    key: 'user-store',
    pick: ['token', 'userInfo'],
  },
});
