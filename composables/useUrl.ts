export function useUrl() {
  const config = useRuntimeConfig();
  console.log('config : ', config);
  // const baseUrl = config.baseUrl;
  // const baseUrl = 'https://pug-simple-tadpole.ngrok-free.app';
  const baseUrl = 'http://localhost:3001';

  return {
    login: () => `${baseUrl}/admin/login`, // POST
    me: () => `${baseUrl}/admin/me`, // GET
  };
}
