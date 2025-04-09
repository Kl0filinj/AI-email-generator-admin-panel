import { acceptHMRUpdate, defineStore } from 'pinia';
import { useUrl } from '~/composables/useUrl';

interface AuthState {
  isAuthenticated: boolean;
  //   authLoading: boolean;
  accessToken: string | null;
}

interface LoginResponse {
  accessToken: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    // authLoading: false,
    accessToken: null,
  }),

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
      localStorage.setItem('accessToken', token);
    },

    clearAuth() {
      this.accessToken = null;
      this.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },

    async login(username: string, password: string) {
      //   this.authLoading = true;
      try {
        const response = await $fetch<LoginResponse>(useUrl().login(), {
          method: 'POST',
          body: { username, password },
        });
        // this.authLoading = false;
        console.log('response : ', response);

        this.setAccessToken(response.accessToken);
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      } finally {
        // this.authLoading = false;
      }
    },

    signOut() {
      console.log('SIGN OUT');
      this.clearAuth();
      navigateTo('/');
    },

    async checkAuth() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        console.log('accessToken FROM LOCAL ST: ', accessToken);
        if (!accessToken) {
          return false;
        }

        const meResponse = await $fetch(useUrl().me(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('meResponse : ', meResponse);

        this.setAccessToken(accessToken);
        this.isAuthenticated = true;
        return true;
      } catch (e) {
        console.log('CHECK AUTH ERR: ', e);
        this.clearAuth();
        return false;
      }
      // finally {
      //   this.authLoading = false;
      // }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
