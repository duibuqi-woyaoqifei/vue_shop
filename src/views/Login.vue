<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box" @keydown.enter="Login">
      <h1 class="login_title">用 户 登 录</h1>
      <el-form
        ref="login_form_ref"
        label-width="0px"
        :model="login_form"
        :rules="login_form_rules"
      >
        <!-- 用户名 -->
        <el-form-item class="user_id" prop="username">
          <el-input
            v-model="login_form.username"
            placeholder="User Name"
            maxlength="15"
          >
            <!-- 字体图标 -->
            <template #prefix>
              <el-icon class="i" color="#656471" :size="20"
                ><UserFilled
              /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="user_password" prop="password">
          <el-input
            v-model="login_form.password"
            placeholder="Password"
            maxlength="18"
            show-password
          >
            <!-- 字体图标 -->
            <template #prefix>
              <el-icon color="#656471" :size="20"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-button
          class="login_button"
          type="primary"
          @click="Login"
          :plain="true"
          >登 录</el-button
        >
      </el-form>
      <!-- 选择框 -->
      <el-checkbox class="RememberMe" v-model="checked" label="记住我" />
      <!-- 去注册页面 -->
      <div class="flex">
        <el-button class="register" type="primary" @click="ToRegister"
          >注 册</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onBeforeUpdate, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    // 数据
    const checked = ref(false);
    const login_form = reactive({
      username: "",
      password: "",
    });
    const login_form_ref = ref(null);

    // 路由对象
    const router = useRouter();

    // 方法
    const methods = reactive({
      ToRegister() {
        router.push("/register");
      },
      Login() {
        login_form_ref.value.validate(async (isValid) => {
          // 校验结果判断
          if (!isValid)
            return ElMessage({
              message: "用户名或密码格式错误！",
              type: "error",
              showClose: true,
            });
          // 请求登录接口
          await axios
            .get("http://127.0.0.1:3000/accountlist")
            .then((data) => {
              for (var i of data.data) {
                if (i.username === login_form.username) {
                  if (i.password === login_form.password) {
                    // 是否保存用户名密码
                    if (checked.value) {
                      window.localStorage.setItem("checked", checked.value);
                      window.localStorage.setItem(
                        "username",
                        login_form.username
                      );
                      window.localStorage.setItem(
                        "password",
                        login_form.password
                      );
                    }
                    ElMessage.success({
                      message: "登录成功！",
                      showClose: true,
                    });
                    // 获取token
                    axios
                      .post(
                        "http://127.0.0.1:3000/token",
                        JSON.stringify(login_form.username)
                      )
                      .then((data) => {
                        // 保存token
                        window.localStorage.setItem("token", data.data);
                        // 记录当前用户
                        if (!window.localStorage.getItem("currentUsername")) {
                          window.localStorage.setItem(
                            "currentUsername",
                            login_form.username
                          );
                        }
                        router.push({
                          name: "我的信息",
                          path: "/home/personal-information",
                          params: {
                            // 路由守卫检测token
                            token: window.localStorage.getItem("token"),
                          },
                        });
                      })
                      .catch((err) => {
                        ElMessage({
                          message: "获取token失败！",
                          type: "error",
                          showClose: true,
                        });
                        console.log(err);
                      });
                    return;
                  }
                }
              }
              ElMessage({
                message: "用户名或密码错误！",
                type: "error",
                showClose: true,
              });
            })
            .catch((err) => {
              ElMessage({
                message: "请求错误！",
                type: "error",
                showClose: true,
              });
              console.log(err);
            });
        });
      },
    });

    // 生命周期函数
    onMounted(() => {
      // 更新数据库
      axios
        .get("http://127.0.0.1:3000/accountlist")
        .then((data) => {})
        .catch((err) => {
          ElMessage({
            message: "请求错误！",
            type: "error",
            showClose: true,
          });
          console.log(err);
        });

      // 校验token
      axios
        .post(
          "http://127.0.0.1:3000/token",
          JSON.stringify(window.localStorage.getItem("token"))
        )
        .then((data) => {
          if (data.data.verify === true) {
            router.push({
              name: "我的信息",
              path: "/home/personal-information",
            });
          }
        })
        .catch((err) => {
          ElMessage({
            message: "请求错误！",
            type: "error",
            showClose: true,
          });
          console.log(err);
        });

      // 是否有默认用户名密码
      checked.value = window.localStorage.getItem("checked") ? true : false;
      login_form.username = window.localStorage.getItem("username")
        ? window.localStorage.getItem("username")
        : "";
      login_form.password = window.localStorage.getItem("password")
        ? window.localStorage.getItem("password")
        : "";
    });

    // 登录表单自定义校验规则
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (value.match(/[^a-zA-Z0-9]/) !== null) {
        callback(new Error("用户名不能包含非法字符"));
      } else if (value.length < 3 || value.length > 15) {
        callback(new Error("用户名长度在3到15个字符之间"));
      }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.match(/[^a-zA-Z0-9]/) !== null) {
        callback(new Error("密码不能包含非法字符"));
      } else if (value.length < 6 || value.length > 18) {
        callback(new Error("密码长度在6到18个字符之间"));
      }
      callback();
    };
    // 登录表单绑定自定义校验规则
    const login_form_rules = reactive({
      username: [
        {
          validator: validateUsername,
          trigger: "blur",
        },
      ],
      password: [
        {
          validator: validatePassword,
          trigger: "blur",
        },
      ],
    });

    return {
      ...methods,
      checked,
      login_form,
      login_form_rules,
      login_form_ref,
    };
  },
};
</script>
<style scoped>
@import "../static/css/login.css";
</style>