import type { NitroFetchOptions } from 'nitropack';
import { useAuthStore } from '~/stores/auth';

interface FetchOptions extends NitroFetchOptions<string> {}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      async afetch<T>(url: string, options?: FetchOptions) {
        const { onResponse = () => {}, ...otherOptions } = options || {};
        const { accessToken } = useAuthStore();

        const resp = await $fetch<T>(url, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          retry: 0,
          onResponse,
          ...otherOptions,
        });
        console.log('resp : ', resp);
        return resp;
      },
    },
  };
});
