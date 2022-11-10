// 对于路径请求的封装==>以后改装成redux后的操作空间==>需要对于redux的操作进行使用
import axios from "axios";
// 省略路径
axios.defaults.baseURL = 'http://localhost:8000';

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use