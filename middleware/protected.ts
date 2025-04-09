import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return;
  }
  const authStore = useAuthStore();
  await authStore.checkAuth();
  console.log('PROTECTED - authStore AFTER CHECK AUTH : ', authStore);

  if (!authStore.accessToken) {
    return navigateTo('/');
  }
});
