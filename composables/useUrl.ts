export function useUrl() {
  const config = useRuntimeConfig();
  console.log('config : ', config.nitro);
  // const baseUrl = config.baseUrl;
  // const baseUrl = 'https://';
  const baseUrl = 'http://localhost:3001';

  return {
    login: () => `${baseUrl}/admin/login`, // POST
    me: () => `${baseUrl}/admin/me`, // GET
    files: (fileName?: string) => `${baseUrl}/admin/files${fileName ? `/${fileName}` : ''}`, // GET, DELETE/name, GET/name
  };
}
