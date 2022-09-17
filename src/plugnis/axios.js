import axios from "axios"
class HttpRequest {
    //初始化构造函数，this指向的是构造函数自身
    constructor() {
        this.baseURL = "http://127.0.0.1:3000";
        this.timout = 3000;
    }
    setInterceptors(instance) { //创建拦截器
        instance.interceptors.request.use(config => {
            // 一般增加一些token属性等  jwt
            return config
        });
        //响应拦截器
        instance.interceptors.response.use(res => {
            if (res.status == 200) {
                return Promise.resolve(res.data);
            } else {
                return Promise.reject(res.data)
            }
        }, err => {
            switch (err.response.status) {
                case '401':
                    console.log(err)
                    break;

                default:
                    break;
            }
            return Promise.reject(err)
        })
    }
    mergeOptions(options) {
        return {
            baseURL: this.baseURL, timout: this.timout, ...options
        }
    }
    //真正发送请求在这
    request(options) {
        const instance = axios.create();
        this.setInterceptors(instance);
        const opts = this.mergeOptions(options);
        return instance(opts);
    }
    //封装get方法
    get(url, config) {
        return this.request({
            method: 'get',
            url,
            params: config,

        })
    }
    //封装post方法
    post(url, data) {
        return this.request({
            method: 'post',
            url,
            data: data,

        })
    }
}

export default new HttpRequest;   