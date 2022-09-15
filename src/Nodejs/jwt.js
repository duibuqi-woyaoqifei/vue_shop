const jwt = require('jsonwebtoken')

class Jwt {
    // 获取调用方法的传值
    constructor(data) {
        this.data = data
    }
    // 生成token
    generateToken(uid, scope) {
        const secretKey = "woyaoqifei"; // 生成token时的密钥，不能泄露
        const expiresIn = 60 * 60 * 24; // 生成的token的有效期
        // 生成token
        // 第一个参数是我们要存储到token中的用户信息数据,uid是用户id,scope是用户权限；
        // 第二个参数是加密的密钥；
        // 第三个参数是附带的属性信息，expiresIn是生成的token的有效期
        const token = jwt.sign({
            uid,
            scope
        }, secretKey, {
            expiresIn
        })
        return token
    }
    // 校验token
    verifyToken(token, secretKey) {
        try {
            const result = jwt.verify(token, secretKey)
            const currentTime = new Date().getTime()
            if (currentTime <= result.exp * 1000) {
                return {
                    status: 200,
                    token
                }
            } else {
                return {
                    status: 403,
                    msg: 'token失效'
                }
            }
        } catch (error) {
            return {
                status: 400,
                msg: 'token错误'
            }
        }
    }
}

module.exports = new Jwt
