const user = JSON.parse(localStorage.admin || '{}');
// api: 'https://api.siska.rejajamil.com/api',
// img: 'https://api.siska.rejajamil.com/public/img',
export default {
  api: 'http://192.168.100.2/siska/api',
  img: 'http://192.168.100.2/siska/public/img',
  user:user,
  token:user.api_token,
  headers:{Authorization:'Bearer '+user.api_token, Accept: 'application/json'}
}
