import axios from 'axios'
const url = 'http://localhost:3001/api'

const axiosInstance = axios.create({ baseURL: url })

axiosInstance.interceptors.request.use(
)

axiosInstance.interceptors.response.use(
)

export default axiosInstance