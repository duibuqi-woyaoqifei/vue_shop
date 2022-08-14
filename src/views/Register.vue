<template>
  <div class="register_container">
    <!-- 注册盒子 -->
    <div class="register_box">
      <h1 class="register_title">用 户 注 册</h1>
      <el-form
        label-width="0px"
        ref="register_form_ref"
        :model="register_form"
        :rules="register_form_rules"
      >
        <!-- 用户名 -->
        <el-form-item class="username" prop="username">
          <el-input
            v-model="register_form.username"
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
        <el-form-item class="password" prop="password">
          <el-input
            v-model="register_form.password"
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
        <!-- 确认密码 -->
        <el-form-item class="password_again" prop="password_again">
          <el-input
            v-model="register_form.password_again"
            placeholder="Confirm Password"
            maxlength="18"
            show-password
          >
            <!-- 字体图标 -->
            <template #prefix>
              <el-icon color="#656471" :size="20"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-button
          class="register_button"
          type="primary"
          @click="register"
          :plain="true"
          >注 册</el-button
        >
      </el-form>
      <!-- 选择框 -->
      <el-checkbox class="RememberMe" v-model="checked" label="记住我" />
      <!-- 去登录页面 -->
      <div class="flex">
        <el-button class="register" type="primary" @click="ToLogin"
          >登 录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "../plugnis/axios";
export default {
  setup() {
    // 数据
    const checked = ref(false);
    const register_form = reactive({
      username: "",
      password: "",
      password_again: "",
    });
    const register_form_ref = ref(null);
    const mysqlUsername = reactive([]);

    // 路由对象
    const router = useRouter();

    // 方法
    const methods = reactive({
      ToLogin() {
        router.push("/login");
      },
      register() {
        register_form_ref.value.validate(async (isValid) => {
          if (!isValid)
            return ElMessage({
              message: "用户名或密码格式错误！",
              type: "error",
              showClose: true,
            });
          await axios
            .post(
              axios.baseURL + "/accountlist/set",
              JSON.stringify({
                username: register_form.username,
                password: register_form.password,
              })
            )
            .then((data) => {
              if (checked.value) {
                window.localStorage.setItem("checked", checked.value);
                window.localStorage.setItem("username", register_form.username);
                window.localStorage.setItem("password", register_form.password);
              }
              ElMessage.success({
                message: "注册成功！",
                showClose: true,
              });
              router.push("/login");
              return;
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
      axios
        .get(axios.baseURL + "/accountlist")
        .then((data) => {
          for (let i of data) {
            mysqlUsername.push(i["username"]);
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
      for (let i of mysqlUsername) {
        if (register_form.username === i) {
          callback(new Error("用户名已经存在"));
          break;
        }
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
    const validatePasswordAgain = (rule, value, callback) => {
      if (value !== register_form.password) {
        callback(new Error("密码输入不一致"));
      }
      callback();
    };
    // 登录表单绑定自定义校验规则
    const register_form_rules = reactive({
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
      password_again: [
        {
          validator: validatePasswordAgain,
          trigger: "blur",
        },
      ],
    });

    return {
      checked,
      register_form,
      ...methods,
      register_form_ref,
      register_form_rules,
      mysqlUsername,
    };
  },
};
</script>
<style scoped>
@import "../static/css/register.css";
</style>