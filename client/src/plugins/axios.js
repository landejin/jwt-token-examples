import axios from "axios";
import { getRefreshToken, getAccessToken, setAccessToken} from '@/plugins/utils.js'


const instance = axios.create({
  baseURL: '',
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组
// let white = ['/login'] // 加密白名单
let lock = null

axios.interceptors.request.use((config) => {
    config.headers['access-token'] = getAccessToken()
    if (isRefreshing) {
        return new Promise(resolve => {
            lock?.then(() => {
                console.log('刷新成功')
                config.headers['access-token'] = getAccessToken()
                resolve(config)
            })
        })
    } else {
        return config
    }
})

// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    const { config } = res
    if (res.data.code === 402) { // 过期
        if (!isRefreshing) {
            isRefreshing = true
            let response = null
            lock = new Promise(resolve => {
                response = refreshToken().then(res => {
                    const { access_token } = res.data.data
                    setAccessToken(access_token)
                    config.headers['access-token'] = access_token
                    resolve()
                    return instance(config)
                }).catch(err => {
                    // 重新登录
                    alert('你要重新登录了')
                }).finally(() => {
                    isRefreshing = false
                })
            })

            return response
        }
    }

    return res
  },
  (error) => {}
);

// 刷新token
function refreshToken() {
    console.log('刷新token')
    return instance.post('/api/auth/refresh', {
        refresh_token: getRefreshToken()
    })
}

export default axios
