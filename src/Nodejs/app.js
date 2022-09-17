const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const jwt = require('./jwt')
const fns = require('./function')
const multiparty = require('multiparty')
const http = require("http")
const fs = require("fs")

const app = express()
//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 是否进行url解码
app.use(bodyParser.urlencoded({ extended: true }))
// 将数据转换为json格式
app.use(bodyParser.json())

// 创建数据库链接
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port: '3306',
    password: 'root',
    database: 'test',
})
conn.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log('数据库连接成功')
    }
})

// 数据库各表路径
let mysqlTablesPath = {}
conn.query('use cxzks', function (error, mysqlRes, fields) {
    if (error) {
        throw error
    }
    conn.query('show tables', function (error, mysqlRes, fields) {
        if (error) {
            throw error
        }
        for (let i in mysqlRes) {
            mysqlTablesPath[mysqlRes[i].Tables_in_cxzks] = "`用户名`.`" + mysqlRes[i].Tables_in_cxzks + "`"
        }

    })
})



//登录接口
let AccountList = []
app.get('/accountlist', function (req, res) {
    res.status(200)
    console.log("有人登录啦");
    // 每次访问更新数据
    conn.query('SELECT * FROM test.accountlist', function (error, mysqlRes, fields) {
        if (error) {
            throw error
        }
        AccountList = []
        for (let i in mysqlRes) {
            AccountList.push(mysqlRes[i])
        }
        res.json(AccountList)
    })

});


// 注册接口
app.post('/accountlist/set', function (req, res) {
    res.status(200).send("成功")
    // 获取参数
    let data = {}
    for (let i in req.body) {
        data = JSON.parse(JSON.stringify(JSON.parse(i)))
    }
    // 保存用户名密码
    const sql = "INSERT INTO `test`.`accountlist` (`username`, `password`) VALUES ('" + data.username + "','" + data.password + "')"
    conn.query(sql, function (error, res, fields) {
        if (error) throw error
        // 每次访问更新数据
        conn.query('SELECT * FROM test.accountlist', function (error, res, fields) {
            if (error) {
                throw error
            }
            AccountList = []
            for (let i in res) {
                AccountList.push(res[i])
            }
        })
    })

    // 创建用户数据库
    const beginning = "create database " + data.username
    conn.query(beginning, function (error, res, fields) {
        if (error) throw error
        let tableList = []
        for (let i in mysqlTablesPath) {

            tableList.push(i)
        }
        const CreateMysqlTable = (newDatabaseName, tableList, index = 0) => {
            new Promise((resolve, reject) => {
                const createTable = "create table `" + newDatabaseName + "`.`" + tableList[index] + "` like `cxzks`.`" + tableList[index] + "`;"
                conn.query(createTable, function (error, res, fields) {
                    if (error) {
                        throw error
                    }
                    if (index < tableList.length - 1) {
                        resolve()
                    }
                })
            }).then((data) => {
                CreateMysqlTable(newDatabaseName, tableList, index + 1)
            })
        }
        CreateMysqlTable(data.username, tableList)
    })
})



//token接口
app.post('/token', function (req, res) {
    res.status(200)
    // 获取参数
    let data = ""
    for (let i in req.body) {
        data = JSON.parse(JSON.stringify(JSON.parse(i)))
    }

    // 验证结果
    const verifyResult = {
        msg: "",
        verify: false
    }

    // 判断参数性质
    if (!data) {
        return
    } else if (data.length > 15) {
        // 验证token
        const status = jwt.verifyToken(data, "woyaoqifei").status
        if (status === 200) {
            verifyResult.verify = true
            verifyResult.msg = "token验证成功"
        } else if (status === 403) {
            verifyResult.msg = "token过期"
        } else {
            verifyResult.msg = "token错误"
        }
        res.json(verifyResult)
    } else {
        // 生成token
        const token = jwt.generateToken(data)
        res.json(token)
    }

});



// 客户信息接口
let clientArr = []
app.post('/client', function (req, res) {
    res.status(200)
    let currentUsername = ""
    for (let i in req.body) {
        currentUsername = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.client.replace("用户名", currentUsername)

    // 访问客户信息
    const sql = "SELECT * FROM " + tablePath
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        clientArr = []
        for (let i in mysqlRes) {
            clientArr.push(mysqlRes[i])
        }
        res.json(clientArr)
    })

})

// 客户信息修改接口
app.post('/client/set', function (req, res) {
    res.status(200)

    // 获取参数
    let data = {}
    for (let i in req.body) {
        data = JSON.parse(JSON.stringify(JSON.parse(i)))
    }

    const tablePath = mysqlTablesPath.client.replace("用户名", data.currentUsername)

    // 访问客户信息
    const sql = "SELECT * FROM " + tablePath
    conn.query(sql, function (error, res, fields) {
        if (error) throw error
    })

    // 添加客户信息
    if (data.CRUD === "create") {
        const sql = "INSERT INTO " + tablePath + " (`name`, `phone`, `weixin`, `qq`, `date`, `time`, `gender`) VALUES ('" + data.name + "', '" + data.手机号码 + "', '" + data.微信 + "', '" + data.QQ + "', '" + data.date + "', '" + data.time + "', '" + data.gender + "');"
        conn.query(sql, function (error, res, fields) {
            if (error) throw error
        })
        res.json("ok")
    }

    // 修改客户信息
    if (data.CRUD === "update") {

        let sql = "UPDATE " + tablePath + " SET "
        for (let i in data) {
            if (i === "currentUsername") continue
            if (i === "nameOld") continue
            if (i === "CRUD") continue
            if (data[i]) {
                sql += "`" + i + "` = '" + data[i] + "', "
            }
        }
        sql = sql.slice(0, -2) + " WHERE (`name` = '" + data.nameOld + "');"
        conn.query(sql, function (error, res, fields) {
            if (error) throw error
        })
        res.json("ok")
    }

    // 删除客户信息
    if (data.CRUD === "delete") {
        const nameArr = data.names.split(",")

        for (let i in nameArr) {
            conn.query("DELETE FROM " + tablePath + " WHERE (`name` = '" + nameArr[i] + "');", function (error, res, fields) {
                if (error) throw error
            })
        }
        res.json("ok")
    }
})

// 用户列表接口
let userList = []
app.post('/userList', function (req, res) {
    res.status(200)
    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.userlist.replace("用户名", data.currentUsername)

    const m = (data.pageNum - 1) * data.pageSize
    const n = data.pageSize
    const sql = "SELECT * FROM " + tablePath + " where name like '%" + data.userListSearchContent + "%'" + " limit " + m + "," + n + ";"
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        userList = []
        for (let i in mysqlRes) {
            mysqlRes[i].state = mysqlRes[i].state === 1 ? true : false
            userList.push(mysqlRes[i])
        }
    })

    const sql2 = "SELECT * FROM " + tablePath + ";"
    conn.query(sql2, function (error, mysqlRes, fields) {
        if (error) throw error
        let resData = {
            userList,
            total: mysqlRes.length
        }
        res.json(resData)
    })

})

// 用户列表修改接口
app.post('/userList/set', function (req, res) {
    res.status(200)
    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.userlist.replace("用户名", data.currentUsername)

    if (data.operation === "changeState") {
        const state = data.state ? 1 : 0
        const sql = "UPDATE " + tablePath + " SET `state` = '" + state + "' WHERE (`index` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
        })
        res.json("Succeeded in modifying the status")
    }

    if (data.operation === "addUser") {
        const sql = "INSERT INTO " + tablePath + " (`name`, `phone`, `email`, `role`, `state`, `password`) VALUES ('" + data.name + "', '" + data.phone + "', '" + data.email + "', '" + data.role + "', '0', '" + data.password + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
        })
        res.json("Adding a user Succeeded")
    }

    if (data.operation === "editUser") {
        const sql = "UPDATE " + tablePath + " SET `phone` = '" + data.phone + "', `email` = '" + data.email + "' WHERE (`index` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
        })
        res.json("Modify user information successfully")
    }

    if (data.operation === "deleteUser") {
        const sql = "DELETE FROM " + tablePath + " WHERE (`index` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
        })
        res.json("Delete user successfully")
    }

    if (data.operation === "assignRole") {
        const sql = "UPDATE " + tablePath + " SET `role` = '" + data.role + "' WHERE (`index` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
        })
        res.json("Modify user information successfully")
    }
})

// 权限列表接口
app.get('/permissionList', function (req, res) {
    res.status(200)

    let currentUsername = JSON.parse(req.query[0])
    const tablePath = mysqlTablesPath.permissionlist.replace("用户名", currentUsername)

    const sql = "SELECT * FROM " + tablePath
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        permissionList = []
        for (let i in mysqlRes) {
            mysqlRes[i].state = mysqlRes[i].state === 1 ? true : false
            permissionList.push(mysqlRes[i])
        }

        res.json(permissionList)
    })

})

// 角色列表接口
let permissionList = []
app.get('/roleList', function (req, res) {
    res.status(200)

    let currentUsername = JSON.parse(req.query[0])
    const tablePath = mysqlTablesPath.rolelist.replace("用户名", currentUsername)

    const sql = "SELECT * FROM " + tablePath
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        permissionList = []
        for (let i in mysqlRes) {
            mysqlRes[i].state = mysqlRes[i].state === 1 ? true : false
            permissionList.push(mysqlRes[i])
        }

        res.json(permissionList)
    })

})

// 角色列表修改接口
app.post('/roleList/set', function (req, res) {
    res.status(200)

    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.rolelist.replace("用户名", data.currentUsername)

    if (data.operation === "editRole") {
        const sql = "UPDATE " + tablePath + " SET `name` = '" + data.name + "', `describe` = '" + data.describe + "' WHERE (`name` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error

            res.json("Modify character information successfully")
        })
    }

    if (data.operation === "deleteRole") {
        const sql = "DELETE FROM " + tablePath + " WHERE (`name` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error

            res.json("Delete character successfully")
        })
    }

    if (data.operation === "addRole") {
        const sql = "INSERT INTO " + tablePath + " (`name`, `describe`) VALUES ('" + data.name + "', '" + data.describe + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error

            res.json("Add character successfully")
        })

    }

    if (data.operation === "editPermission") {
        const sql = "UPDATE " + tablePath + " SET `permissionListOne` = '" + data.permissionListOne + "', `permissionListTwo` = '" + data.permissionListTwo + "', `permissionListThree` = '" + data.permissionListThree + "' WHERE (`name` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error

            res.json("Permission modified successfully")
        })
    }

    if (data.operation === "removePermission") {
        const sql = "UPDATE " + tablePath + " SET `permissionListOne` = '" + data.permissionListOne + "', `permissionListTwo` = '" + data.permissionListTwo + "', `permissionListThree` = '" + data.permissionListThree + "' WHERE (`name` = '" + data.index + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error

            res.json("Permission removed successfully")
        })
    }

})

// 商品分类接口
app.get('/commodityClassification', function (req, res) {
    res.status(200)

    let data = JSON.parse(req.query[0])
    const tablePath = mysqlTablesPath.commodityclassification.replace("用户名", data.currentUsername)

    const sql = "SELECT * FROM " + tablePath
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        let resData = []
        for (let i in mysqlRes) {
            if (mysqlRes[i].two) {
                let children = []
                let twoArr = mysqlRes[i].two.split(",")
                for (let index in twoArr) {
                    let childrenTwoArr = []
                    if (mysqlRes[i].three) {
                        let threeArr = mysqlRes[i].three.split(";")
                        if (threeArr[index]) {
                            let indexThreeArr = threeArr[index].split(",")
                            for (let x in indexThreeArr) {
                                childrenTwoArr.push({ name: indexThreeArr[x], level: 2 })
                            }
                        }
                    }
                    children.push({ name: twoArr[index], level: 1, children: childrenTwoArr })
                }
                resData.push({ name: mysqlRes[i].one, level: 0, children })
            } else {
                resData.push({ name: mysqlRes[i].one, level: 0 })
            }
        }

        res.json(resData)
    })

})

// 商品分类修改接口
app.post('/commodityClassification/set', function (req, res) {
    res.status(200)

    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.commodityclassification.replace("用户名", data.currentUsername)
    const tablePath2 = mysqlTablesPath.parameterproperties.replace("用户名", data.currentUsername)


    if (data.operation === "addCommodityclassification") {
        if (data.parentName) {
            const path = data.parentName.split(",")
            const one = path[0]
            const sql = "SELECT * FROM " + tablePath + " where one = '" + one + "';"
            conn.query(sql, function (error, mysqlRes, fields) {
                if (error) throw error
                for (let i in mysqlRes) {
                    if (path.length === 1) {
                        let newTwo = ""
                        if (mysqlRes[i].two) {
                            newTwo = mysqlRes[i].two + "," + data.name
                        } else {
                            newTwo = data.name
                        }
                        const sql2 = "UPDATE " + tablePath + " SET `two` = '" + newTwo + "' WHERE (`one` = '" + one + "');"
                        conn.query(sql2, function (error, mysqlRes, fields) {
                            if (error) throw error
                            res.json("Added successfully")
                        })
                    }
                    if (path.length === 2) {
                        let oldTwo = mysqlRes[i].two.split(",")
                        let oldThree = ""
                        let newThree = ""
                        if (mysqlRes[i].three) {
                            oldThree = mysqlRes[i].three.split(";")
                            if (oldThree[oldTwo.indexOf(path[1])]) {
                                oldThree[oldTwo.indexOf(path[1])] = oldThree[oldTwo.indexOf(path[1])] + "," + data.name
                            } else {
                                oldThree[oldTwo.indexOf(path[1])] = data.name
                            }
                            newThree = oldThree.join(";")
                        } else {
                            if (oldTwo.indexOf(path[1])) {
                                newThree = ";" * oldTwo.indexOf(path[1]) + data.name
                            } else {
                                newThree = data.name
                            }
                        }
                        const sql5 = "INSERT INTO " + tablePath2 + " (`commodityClassification`) VALUES ('" + data.parentName + "," + data.name + "');"
                        conn.query(sql5, function (error, mysqlRes, fields) {
                            if (error) throw error
                        })

                        const sql3 = "UPDATE " + tablePath + " SET `three` = '" + newThree + "' WHERE (`one` = '" + one + "');"
                        conn.query(sql3, function (error, mysqlRes, fields) {
                            if (error) throw error
                            res.json("Added successfully")
                        })
                    }
                }
            })
        } else {
            const sql4 = "INSERT INTO " + tablePath + " (`one`) VALUES ('" + data.name + "');"
            conn.query(sql4, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Added successfully")
            })
        }
    }

    if (data.operation === "deleteCommodityclassification") {
        if (data.level === 0) {
            const sql2 = "DELETE FROM " + tablePath2 + " WHERE (`commodityClassification` like '" + data.one + "%');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
            })

            const sql = "DELETE FROM " + tablePath + " WHERE (`one` = '" + data.one + "');"
            conn.query(sql, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Deleted successfully")
            })
        }
        if (data.level === 1) {
            const sql3 = "DELETE FROM " + tablePath2 + " WHERE (`commodityClassification` like '" + data.one + "," + data.two + "%');"
            conn.query(sql3, function (error, mysqlRes, fields) {
                if (error) throw error
            })

            const sql = "SELECT * FROM " + tablePath + " where one = '" + data.one + "';"
            conn.query(sql, function (error, mysqlRes, fields) {
                let oldTwo = mysqlRes[0].two.split(",")
                const index = oldTwo.indexOf(data.name)
                if (mysqlRes[0].three) {
                    let oldThree = mysqlRes[0].three.split(";")
                    oldTwo.splice(index, 1)
                    oldThree.splice(index, 1)
                    const newTwo = oldTwo.join(",")
                    const newThree = oldThree.join(";")

                    const sql2 = "UPDATE " + tablePath + " SET `two` = '" + newTwo + "', `three` = '" + newThree + "' WHERE (`one` = '" + data.one + "');"
                    conn.query(sql2, function (error, mysqlRes, fields) {
                        if (error) throw error
                        res.json("Deleted successfully")
                    })
                } else {
                    oldTwo.splice(index, 1)
                    const newTwo = oldTwo.join(",")
                    const sql2 = "UPDATE " + tablePath + " SET `two` = '" + newTwo + "' WHERE (`one` = '" + data.one + "');"
                    conn.query(sql2, function (error, mysqlRes, fields) {
                        if (error) throw error
                        res.json("Deleted successfully")
                    })
                }
            })
        }
        if (data.level === 2) {
            const commodityClassification = data.one + "," + data.two + "," + data.name
            const sql3 = "DELETE FROM " + tablePath2 + " WHERE (`commodityClassification` = '" + commodityClassification + "');"
            conn.query(sql3, function (error, mysqlRes, fields) {
                if (error) throw error
            })

            const sql = "SELECT * FROM " + tablePath + " where one = '" + data.one + "';"
            conn.query(sql, function (error, mysqlRes, fields) {
                let oldThree = mysqlRes[0].three
                let newThree = ""
                if (oldThree.indexOf("," + data.name) !== -1) {
                    newThree = oldThree.replace("," + data.name, "")
                } else if (oldThree.indexOf(data.name + ",") !== -1) {
                    newThree = oldThree.replace(data.name + ",", "")
                } else {
                    newThree = oldThree.replace(data.name, "")
                }

                const sql2 = "UPDATE " + tablePath + " SET `three` = '" + newThree + "' WHERE (`one` = '" + data.one + "');"
                conn.query(sql2, function (error, mysqlRes, fields) {
                    if (error) throw error
                    res.json("Deleted successfully")
                })
            })
        }
    }


})

// 商品参数设置接口
app.get('/commodityParameterSetting', function (req, res) {
    res.status(200)


    let data = JSON.parse(req.query[0])
    const tablePath = mysqlTablesPath.parameterproperties.replace("用户名", data.currentUsername)

    const sql = "SELECT * FROM " + tablePath + " where commodityClassification = '" + data.content + "';"
    conn.query(sql, function (error, mysqlRes, fields) {
        if (error) throw error
        let resData = []

        if (mysqlRes[0][data.type]) {
            const list = mysqlRes[0][data.type].split(",")
            for (let i in list) {
                resData.push({ name: list[i] })
            }
        }
        res.json(resData)
    })



})

// 商品参数设置设置接口
app.post('/commodityParameterSetting/set', function (req, res) {
    res.status(200)

    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.parameterproperties.replace("用户名", data.currentUsername)
    const tablePath2 = mysqlTablesPath.tags.replace("用户名", data.currentUsername)

    if (data.operation === "addParameter") {
        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let parameterList = []
            if (mysqlRes[0].parameter) {
                parameterList = mysqlRes[0].parameter.split(",")
                parameterList.push(data.name)
            } else {
                parameterList.push(data.name)
            }
            const parameter = parameterList.join(",")
            const sql2 = "UPDATE " + tablePath + " SET `parameter` = '" + parameter + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Added successfully")
            })

        })

    }
    if (data.operation === "addProperties") {
        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let propertiesList = []
            if (mysqlRes[0].properties) {
                propertiesList = mysqlRes[0].properties.split(",")
                propertiesList.push(data.name)
            } else {
                propertiesList.push(data.name)
            }
            const properties = propertiesList.join(",")
            const sql2 = "UPDATE " + tablePath + " SET `properties` = '" + properties + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Added successfully")
            })

        })
    }

    if (data.operation === "editParameter") {
        const sql3 = "SELECT * FROM " + tablePath2
        conn.query(sql3, function (error, mysqlRes, fields) {
            if (error) throw error
            const oldTagsParent = data.currentClassification + ",参数," + data.oldName
            const newTagsParent = data.currentClassification + ",参数," + data.name
            for (let i in mysqlRes) {
                if (mysqlRes[i].parent === oldTagsParent) {
                    const sql4 = "UPDATE " + tablePath2 + " SET `parent` = '" + newTagsParent + "' WHERE (`parent` = '" + oldTagsParent + "');"
                    conn.query(sql4, function (error, mysqlRes, fields) {
                        if (error) throw error
                    })
                }
            }
        })
        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let parameterList = []
            parameterList = mysqlRes[0].parameter.split(",")
            parameterList.splice(data.index, 1, data.name)
            const parameter = parameterList.join(",")

            const sql2 = "UPDATE " + tablePath + " SET `parameter` = '" + parameter + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Modified successfully")
            })

        })
    }

    if (data.operation === "editProperties") {
        const sql3 = "SELECT * FROM " + tablePath2
        conn.query(sql3, function (error, mysqlRes, fields) {
            if (error) throw error
            const oldTagsParent = data.currentClassification + ",属性," + data.oldName
            const newTagsParent = data.currentClassification + ",属性," + data.name
            for (let i in mysqlRes) {
                if (mysqlRes[i].parent === oldTagsParent) {
                    const sql4 = "UPDATE " + tablePath2 + " SET `parent` = '" + newTagsParent + "' WHERE (`parent` = '" + oldTagsParent + "');"
                    conn.query(sql4, function (error, mysqlRes, fields) {
                        if (error) throw error
                    })
                }
            }
        })
        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let propertiesList = []
            propertiesList = mysqlRes[0].properties.split(",")
            propertiesList.splice(data.index, 1, data.name)
            const properties = propertiesList.join(",")

            const sql2 = "UPDATE " + tablePath + " SET `properties` = '" + properties + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Modified successfully")
            })

        })
    }

    if (data.operation === "deleteParameter") {
        const tagsParent = data.currentClassification + ",参数," + data.oldName
        const sql3 = "DELETE FROM " + tablePath + " WHERE (`parent` = '" + tagsParent + "');"
        conn.query(sql3, function (error, mysqlRes, fields) {
            if (error) throw error
        })

        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let parameterList = []
            parameterList = mysqlRes[0].parameter.split(",")
            parameterList.splice(data.index, 1)
            const parameter = parameterList.join(",")

            const sql2 = "UPDATE " + tablePath + " SET `parameter` = '" + parameter + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Deleted successfully")
            })

        })
    }

    if (data.operation === "deleteProperties") {
        const tagsParent = data.currentClassification + ",属性," + data.oldName
        const sql3 = "DELETE FROM " + tablePath + " WHERE (`parent` = '" + tagsParent + "');"
        conn.query(sql3, function (error, mysqlRes, fields) {
            if (error) throw error
        })

        const sql = "SELECT * FROM " + tablePath + " WHERE (`commodityClassification` = '" + data.currentClassification + "');"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let propertiesList = []
            propertiesList = mysqlRes[0].properties.split(",")
            propertiesList.splice(data.index, 1)
            const properties = propertiesList.join(",")

            const sql2 = "UPDATE " + tablePath + " SET `properties` = '" + properties + "' WHERE (`commodityClassification` = '" + data.currentClassification + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json("Deleted successfully")
            })

        })
    }

})


app.get('/tags', function (req, res) {
    res.status(200)

    let data = JSON.parse(req.query[0])

    const tablePath = mysqlTablesPath.tags.replace("用户名", data.currentUsername)

    let parent = ""
    let sql = ""
    let resData = []
    for (let i in data.total) {
        parent = data.parent + "," + data.total[i].name
        sql = "SELECT * FROM " + tablePath + " WHERE parent = '" + parent + "';"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            if (mysqlRes[0]) {
                if (mysqlRes[0].name) {
                    const nameList = mysqlRes[0].name.split(",")
                    resData.push({ tags: nameList })
                } else {
                    resData.push({ tags: [] })
                }
            } else {
                resData.push({ tags: [] })
            }
            if (resData.length === data.total.length) {
                res.json(resData)
            }
        })
    }

})

app.post('/tags/set', function (req, res) {
    res.status(200)

    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    const tablePath = mysqlTablesPath.tags.replace("用户名", data.currentUsername)

    if (data.operation === "add") {
        const sql = "SELECT * FROM " + tablePath + " WHERE parent = '" + data.parent + "';"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            if (mysqlRes[0]) {
                const oldName = mysqlRes[0].name
                const newName = oldName + "," + data.name
                const sql2 = "UPDATE " + tablePath + " SET `name` = '" + newName + "' WHERE (`parent` = '" + data.parent + "');"
                conn.query(sql2, function (error, mysqlRes, fields) {
                    if (error) throw error
                })
            } else {
                const sql2 = "INSERT INTO " + tablePath + " (`parent`, `name`) VALUES ('" + data.parent + "', '" + data.name + "');"
                conn.query(sql2, function (error, mysqlRes, fields) {
                    if (error) throw error
                })
            }
            res.json("Added successfully")
        })
    }

    if (data.operation === "delete") {
        const sql = "SELECT * FROM " + tablePath + " WHERE parent = '" + data.parent + "';"
        conn.query(sql, function (error, mysqlRes, fields) {
            if (error) throw error
            let nameList = mysqlRes[0].name.split(",")
            nameList.splice(nameList.indexOf(data.name), 1)
            const newName = nameList.join(",")

            const sql2 = "UPDATE " + tablePath + " SET `name` = '" + newName + "' WHERE (`parent` = '" + data.parent + "');"
            conn.query(sql2, function (error, mysqlRes, fields) {
                if (error) throw error
            })
            res.json("Deleted successfully")
        })
    }


})

const apiList = ["ProductList", "OrderList"]

for (let i of apiList) {
    const UnderScoreCaseI = fns.SplitWord(i)
    app.get('/' + i, function (req, res) {
        res.status(200)

        let data = JSON.parse(req.query[0])

        const tablePath = mysqlTablesPath[UnderScoreCaseI].replace("用户名", data.currentUsername)

        if (data.content) {
            let queryFields = "name"
            if (i === "OrderList") {
                queryFields = "number"
            }
            const sql = "SELECT * FROM " + tablePath + " where " + queryFields + " like '%" + data.content + "%'"
            conn.query(sql, function (error, mysqlRes, fields) {
                if (error) throw error
                const m = (data.currentPage - 1) * data.pageSize
                const n = data.pageSize

                const sql2 = "SELECT * FROM " + tablePath + " where " + queryFields + " like '%" + data.content + "%' limit " + m + "," + n
                conn.query(sql2, function (error, mysqlRes2, fields) {
                    if (error) throw error
                    let resData = mysqlRes2
                    if (resData.length) {
                        resData[0]["total"] = mysqlRes.length
                    }
                    if (i === "OrderList") {
                        for (let i in resData) {
                            if (resData[i].isPay == 1) {
                                resData[i].isPay = true
                            } else {
                                resData[i].isPay = false
                            }
                            if (resData[i].isConsign == 1) {
                                resData[i].isConsign = true
                            } else {
                                resData[i].isConsign = false
                            }
                        }
                    }
                    res.json(resData)
                })
            })
        } else {
            const sql = "SELECT * FROM " + tablePath
            conn.query(sql, function (error, mysqlRes, fields) {
                if (error) throw error
                if (data.currentPage) {
                    const m = (data.currentPage - 1) * data.pageSize
                    const n = data.pageSize

                    const sql2 = "SELECT * FROM " + tablePath + " limit " + m + "," + n
                    conn.query(sql2, function (error, mysqlRes2, fields) {
                        if (error) throw error
                        let resData = mysqlRes2
                        if (resData.length) {
                            resData[0]["total"] = mysqlRes.length
                        }
                        if (i === "OrderList") {
                            for (let i in resData) {
                                if (resData[i].isPay == 1) {
                                    resData[i].isPay = true
                                } else {
                                    resData[i].isPay = false
                                }
                                if (resData[i].isConsign == 1) {
                                    resData[i].isConsign = true
                                } else {
                                    resData[i].isConsign = false
                                }
                            }
                        }
                        res.json(resData)
                    })
                } else {
                    let resData = mysqlRes
                    if (resData.length) {
                        resData[0]["total"] = mysqlRes.length
                    }
                    res.json(resData)
                }

            })
        }


    })

    app.post('/' + i + '/set', function (req, res) {
        res.status(200)

        let data = {}
        for (let i in req.body) {
            data = JSON.parse(i)
        }

        const tablePath = mysqlTablesPath[UnderScoreCaseI].replace("用户名", data.currentUsername)

        let sql = ""
        let resJson = ""

        if (data.operation === "add") {
            if (i === "ProductList") {
                sql = "INSERT INTO " + tablePath + " (`name`, `price`, `weight`, `create_time`, `parameter`, `properties`, `commodityClassification`) VALUES ('" + data.商品名称 + "', '" + data.价格 + "', '" + data.重量 + "', '" + data.createTime + "', '" + data.参数 + "', '" + data.属性 + "', '" + data.分类 + "');"
            }
            resJson = "Added successfully"
        }

        if (data.operation === "edit") {
            if (i === "ProductList") {
                sql = "UPDATE " + tablePath + " SET `name` = '" + data.商品名称 + "', `price` = '" + data.价格 + "', `weight` = '" + data.重量 + "', `parameter` = '" + data.参数 + "', `properties` = '" + data.属性 + "', `commodityClassification` = '" + data.分类 + "' WHERE (`index` = '" + data.index + "');"
            }
            if (i === "OrderList") {
                let p = ""
                let c = ""
                let a = ""
                if (data['省市区/县']) {
                    pca = data['省市区/县'].split(",")
                    p = pca[0]
                    c = pca[1]
                    a = pca[2]
                }
                sql = "UPDATE " + tablePath + " SET `detailAddress` = '" + data['详细地址'] + "', `province` = '" + p + "', `city` = '" + c + "', `area` = '" + a + "' WHERE (`index` = '" + data.index + "');"
            }
            resJson = "Modified successfully"
        }

        if (data.operation === "delete") {
            if (i === "ProductList") {
                sql = "DELETE FROM " + tablePath + " WHERE (`index` = '" + data.index + "');"
                resJson = "Deleted successfully"
            }
        }

        if (data.operation === "change") {
            if (i === "OrderList") {
                let onOff = ""
                let isOnOff = undefined
                if (data.isConsign === undefined) {
                    onOff = "isPay"
                    isOnOff = data.isPay ? 1 : 0
                } else {
                    onOff = "isConsign"
                    isOnOff = data.isConsign ? 1 : 0
                }

                sql = "UPDATE " + tablePath + " SET `" + onOff + "` = '" + isOnOff + "' WHERE (`index` = '" + data.index + "');"
                resJson = "Modified successfully"
            }
        }

        if (sql) {
            conn.query(sql, function (error, mysqlRes, fields) {
                if (error) throw error
                res.json(resJson)
            })
        }

    })
}

app.get('/upload', function (req, res) {
    res.status(200)

    const imgUrl = fs.readdirSync("public/img/head").join("")

    res.json(imgUrl)


})

app.post('/upload/set', function (req, res) {
    res.status(200)

    let data = {}
    for (let i in req.body) {
        data = JSON.parse(i)
    }

    if (data.operation === "delete") {
        fs.unlink("public/img/head/" + fs.readdirSync("public/img/head").join(""), (err) => {
            res.json("Deleted successfully")
        })
    }
})


// 配置服务端口
const server = app.listen(3000, function () {
    const host = '127.0.0.1';
    const port = server.address().port;
    console.log('ctrl+左键点击访问：http://%s:%s/accountlist', host, port);
})


const httpServer = http.createServer((req, res) => {
    if (req.url === "/upload") {
        const form = new multiparty.Form({
            uploadDir: 'public/img/head'
        })
        form.parse(req)
        form.on("file", (name, value) => {
            console.log(name, value);
        })
        res.write("123")
    }

})

httpServer.listen(3001)