<template>
  <div class="home_container">
    <!-- 主页盒子 -->
    <div class="home_box">
      <!-- 左边内容盒子 -->
      <div class="left_content_box">
        <!-- 导航栏字体图标 -->
        <el-icon class="up"><ArrowUpBold /></el-icon>
        <el-icon class="down"><ArrowDownBold /></el-icon>
        <!-- 导航栏盒子 -->
        <div class="nav">
          <!-- 导航栏 -->
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            router
            @open="handleOpen"
            @close="handleClose"
            collapse
          >
            <!-- 导航一 -->
            <el-sub-menu index="1">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><HomeFilled /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>个人中心</span></template>
                <el-menu-item index="/home/personal-information"
                  >我的信息</el-menu-item
                >
                <el-menu-item index="/home/plan">计划</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 导航二 -->
            <el-sub-menu index="2">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><Key /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>权限</span></template>
                <el-menu-item index="/home/role-list">角色列表</el-menu-item>
                <el-menu-item index="/home/permission-list"
                  >权限列表</el-menu-item
                >
              </el-menu-item-group>
              <el-menu-item-group title="用户管理">
                <el-menu-item index="/home/user-list">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 导航三 -->
            <el-sub-menu index="3">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><ShoppingBag /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>商品</span></template>
                <el-menu-item index="/home/product-list">商品列表</el-menu-item>
                <el-menu-item index="/home/commodity-classification"
                  >商品分类</el-menu-item
                >
                <el-menu-item index="3-3">商品参数设置</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 导航四 -->
            <el-sub-menu index="4">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><List /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>订单</span></template>
                <el-menu-item index="4-1">订单管理</el-menu-item>
                <el-menu-item index="4-2">售后管理</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="评价">
                <el-menu-item index="4-3">评价管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 导航五 -->
            <el-sub-menu index="5">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><DataLine /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>统计</span></template>
                <el-menu-item index="5-1">数据报表</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 导航六 -->
            <el-sub-menu index="6">
              <!-- 字体图标 -->
              <template #title>
                <el-icon><Setting /></el-icon>
              </template>
              <el-menu-item-group>
                <template #title><span>设置</span></template>
                <el-menu-item index="6-1">基本设置</el-menu-item>
                <el-menu-item index="6-2">高级设置</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </div>
        <!-- 搜索框 -->
        <el-col :span="22">
          <el-autocomplete
            class="search_box"
            v-model="SearchContent"
            :fetch-suggestions="querySearch"
            placeholder="请输入导航名称"
            @select="handleSelect"
            :trigger-on-focus="false"
          >
            <!-- 字体图标 -->
            <template #prefix>
              <el-icon color="#656471" :size="20"><Search /></el-icon>
            </template>
          </el-autocomplete>
        </el-col>
        <!-- 面包屑 -->
        <el-breadcrumb :separator-icon="ArrowRight" class="crumbs">
          <el-breadcrumb-item
            :to="secondNav === '我的信息' ? '' : { path: '/home' }"
            >主页</el-breadcrumb-item
          >
          <el-breadcrumb-item>{{ secondNav }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 头像 -->
        <el-col class="head_portrait">
          <el-avatar size="large" src="/img/head/girl.jpg" />
        </el-col>
        <!-- 左边内容 -->
        <div class="left_content">
          <router-view></router-view>
        </div>
      </div>
      <!-- 右边内容盒子 -->
      <div class="right_content_box">
        <!-- 返回登录界面 -->
        <el-row>
          <el-button class="back" size="large" circle @click="goBack">
            <el-icon><Back /></el-icon>
          </el-button>
        </el-row>
        <div class="right_content">
          <!-- 当前时间 -->
          <div class="current_time">
            <p>{{ currentDay }} 星期{{ week }}</p>
            <h1>{{ currentTime }}</h1>
          </div>
          <el-row class="function">
            <!-- 添加客户 -->
            <el-button
              v-show="showFunction"
              class="addClient"
              icon="Plus"
              size="large"
              circle
              @click="addClient"
            />
            <!-- 删除客户 -->
            <el-button
              v-show="showFunction"
              class="deleteClient"
              icon="Delete"
              size="large"
              circle
              @click="deleteClient"
            />
            <!-- 修改客户 -->
            <el-button
              v-show="showFunction"
              class="editClient"
              icon="Edit"
              size="large"
              circle
              @click="editClient"
            />
            <!-- 查询客户 -->
            <el-button
              v-show="showFunction"
              class="searchClient"
              icon="Search"
              size="large"
              circle
              @click="searchClient"
            />
          </el-row>
          <!-- 查询客户搜索框 -->
          <el-col v-show="showSearchClient" class="searchClientBox">
            <el-autocomplete
              v-model="searchClientContent"
              :fetch-suggestions="querySearch2"
              placeholder="请输入客户姓名"
              :trigger-on-focus="false"
              @select="selectClient"
              placement="top"
            >
              <!-- 字体图标 -->
              <template #prefix>
                <el-icon color="#656471" :size="20"><Search /></el-icon>
              </template>
            </el-autocomplete>
            <span class="closeSearch">
              <el-icon><Close class="ico" @click="closeSearch" /></el-icon>
            </span>
          </el-col>
          <!-- 客户表 -->
          <el-form
            ref="clientFormRef"
            :rules="clientFormRules"
            v-show="showClientForm"
            class="clientForm"
            :model="clientForm"
            label-width="130px"
            label-position="right"
          >
            <!-- 姓名 -->
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="clientForm.name"
                placeholder="请填写联系人姓名"
              />
            </el-form-item>

            <!-- 联系方式 -->
            <el-form-item label="联系方式" prop="way">
              <el-checkbox-group v-model="clientForm.way">
                <el-checkbox label="手机号码" @change="clearNumber" />
                <el-checkbox label="微信" @change="clearNumber" />
                <el-checkbox label="QQ" @change="clearNumber" />
              </el-checkbox-group>
            </el-form-item>
            <!-- 联系号码 -->
            <el-form-item
              v-for="(value, index) in clientForm.way"
              :key="index"
              :label="value"
              :prop="value"
            >
              <el-input
                :placeholder="'请填写' + value"
                v-model="clientForm[value]"
              />
            </el-form-item>

            <!-- 用el-config-provider设置语言 -->
            <!-- 联系时间 -->
            <el-config-provider :locale="local">
              <el-form-item label="联系时间" prop="date">
                <el-col :span="11">
                  <el-date-picker
                    v-model="clientForm.date"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                  />
                </el-col>
                &nbsp;-&nbsp;
                <el-col :span="11">
                  <el-time-picker
                    v-model="clientForm.time"
                    placeholder="选择时间"
                    style="width: 100%"
                  />
                </el-col>
              </el-form-item>
            </el-config-provider>

            <!-- 性别 -->
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="clientForm.gender">
                <el-radio border label="男" />
                <el-radio border label="女" />
              </el-radio-group>
            </el-form-item>

            <!-- 提交表单 -->
            <el-form-item>
              <el-row>
                <el-button
                  icon="Check"
                  circle
                  @click="onSubmit"
                  class="submit"
                />
                <el-button icon="Close" circle @click="cancel" />
              </el-row>
            </el-form-item>
          </el-form>

          <!-- 客户信息增删改查 -->
          <ul class="infinite-list">
            <template v-for="(item, index) in mysqlClientArr2" :key="index">
              <!-- 删除 -->
              <li v-show="showDelete" class="function-list">
                <span class="fn">
                  <el-icon
                    ><CloseBold class="ico" @click="Delete" :index="index"
                  /></el-icon>
                </span>
              </li>
              <!-- 修改 -->
              <li v-show="showEdit" class="function-list">
                <span class="fn">
                  <el-icon
                    ><EditPen class="ico" @click="Edit" :index="index"
                  /></el-icon>
                </span>
              </li>
              <!-- 展示 -->
              <li class="infinite-list-item">
                <div class="clientHead">
                  <el-avatar size="large"> {{ item.name }} </el-avatar>
                </div>
                <div class="ClientInfo">
                  <h3>姓名：{{ item.name }}</h3>
                  <p v-if="item.phone">手机号：{{ item.phone }}</p>
                  <p v-else-if="item.weixin">微信：{{ item.weixin }}</p>
                  <p v-else-if="item.qq">QQ：{{ item.qq }}</p>
                  <div class="contactTime">
                    <h3 v-if="item.date">
                      {{
                        item.date.slice(5, 8) + (item.date.slice(8, 10) * 1 + 1)
                      }}
                    </h3>
                    <h3 v-else>
                      {{ item.gender }}
                    </h3>
                    <p v-if="item.time">
                      {{
                        ((item.time.slice(11, 13) * 1 + 8 > 23
                          ? item.time.slice(11, 13) * 1 + 8 - 24
                          : item.time.slice(11, 13) * 1 + 8) < 10
                          ? "0" +
                            (item.time.slice(11, 13) * 1 + 8 > 23
                              ? item.time.slice(11, 13) * 1 + 8 - 24
                              : item.time.slice(11, 13) * 1 + 8)
                          : item.time.slice(11, 13) * 1 + 8 > 23
                          ? item.time.slice(11, 13) * 1 + 8 - 24
                          : item.time.slice(11, 13) * 1 + 8) +
                        item.time.slice(13, 16)
                      }}
                    </p>
                    <p v-else>&nbsp;</p>
                  </div>
                </div>
                <div class="ClientDetail" v-if="item.name !== settingName">
                  <p>姓名：{{ item.name }}</p>
                  <p>性别：{{ item.gender }}</p>
                  <p>手机号：{{ item.phone }}</p>
                  <p>微信：{{ item.weixin }}</p>
                  <p>QQ：{{ item.qq }}</p>
                  <p v-if="item.date">
                    联系时间：{{ item.date.slice(0, 4) }}
                    {{
                      item.date.slice(5, 8) + (item.date.slice(8, 10) * 1 + 1)
                    }}
                    {{
                      ((item.time.slice(11, 13) * 1 + 8 > 23
                        ? item.time.slice(11, 13) * 1 + 8 - 24
                        : item.time.slice(11, 13) * 1 + 8) < 10
                        ? "0" +
                          (item.time.slice(11, 13) * 1 + 8 > 23
                            ? item.time.slice(11, 13) * 1 + 8 - 24
                            : item.time.slice(11, 13) * 1 + 8)
                        : item.time.slice(11, 13) * 1 + 8 > 23
                        ? item.time.slice(11, 13) * 1 + 8 - 24
                        : item.time.slice(11, 13) * 1 + 8) +
                      item.time.slice(13, 16)
                    }}
                  </p>
                  <p v-else>联系时间：</p>
                </div>
                <!-- 修改所有信息 -->
                <div class="ClientDetail" v-else>
                  <el-form
                    ref="newClientRef"
                    :rules="newClientRules"
                    :model="newClient"
                    label-width="85px"
                    label-position="left"
                  >
                    <el-form-item label="姓名" prop="姓名2">
                      <el-input v-model="newClient.姓名2"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                      <el-radio-group v-model="newClient.性别2">
                        <el-radio border label="男" />
                        <el-radio border label="女" />
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机号" prop="手机号码2">
                      <el-input v-model="newClient.手机号码2"></el-input>
                    </el-form-item>
                    <el-form-item label="微信号" prop="微信2">
                      <el-input v-model="newClient.微信2"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="QQ2">
                      <el-input v-model="newClient.QQ2"></el-input>
                    </el-form-item>
                    <el-config-provider :locale="local">
                      <el-form-item label="联系时间">
                        <el-col :span="11">
                          <el-date-picker
                            v-model="newClient.日期2"
                            type="date"
                            placeholder="选择日期"
                            style="width: 100%"
                          />
                        </el-col>
                        &nbsp;-&nbsp;
                        <el-col :span="11">
                          <el-time-picker
                            v-model="newClient.时间2"
                            placeholder="选择时间"
                            style="width: 100%"
                          />
                        </el-col>
                      </el-form-item>
                    </el-config-provider>
                  </el-form>
                </div>

                <!-- 字体图标 -->
                <div class="showClientDetail">
                  <el-icon isfold="true"
                    ><ArrowUp @click="showClientDetail" class="ico"
                  /></el-icon>
                </div>
              </li>
            </template>
          </ul>
          <!-- 确认删除和取消删除 -->
          <div class="confirmFn" v-show="showDelete" @click="confirmDelete">
            <el-button icon="Check" circle size="large" />
          </div>
          <div class="cancelFn" v-show="showDelete" @click="cancelDelete">
            <el-button icon="Close" circle size="large" />
          </div>
          <!-- 确认修改和取消修改 -->
          <div class="confirmFn" v-show="showEdit" @click="confirmEdit">
            <el-button icon="Check" circle size="large" />
          </div>
          <div class="cancelFn" v-show="showEdit" @click="cancelEdit">
            <el-button icon="Close" circle size="large" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { ArrowRight, Delete } from "@element-plus/icons-vue";
import axios from "../plugnis/axios";
import zhcn from "element-plus/lib/locale/lang/zh-cn";
export default {
  setup() {
    // 一些数据
    const local = zhcn; //element组件设置中文
    const clientFormRef = ref(null); //客户表ref
    const newClientRef = ref(null); //新客户表ref
    const secondNav = ref(null); // 二级面包屑
    const SearchContent = ref(""); //搜索内容
    const searchClientContent = ref(""); //客户信息搜索内容
    const restaurants = ref([]); //搜索提示
    const restaurants2 = ref([]); //搜索提示
    const mysqlClientArr = ref([]); //数据库客户信息
    const mysqlClientArr2 = ref([]); //复制数据库客户信息
    const pendingdeleteArr = ref([]); //待删除列表
    const settingName = ref(""); //正在修改的客户姓名
    const indexArr = ref([]); // 列表索引记录
    // 时间
    const currentTime = ref("");
    const currentDay = ref("");
    const week = ref("");
    // 显示隐藏
    const open = ref(true); //节流
    const showFunction = ref(true);
    const showClientForm = ref(false);
    const showDelete = ref(false);
    const showEdit = ref(false);
    const showSearchClient = ref(false);
    // 搜索提示内容
    const loadAll = () => {
      return [
        { value: "我的信息", router: "/home/personal-information" },
        { value: "计划", router: "/home/" },
        { value: "用户权限", router: "/home/" },
        { value: "权限等级", router: "/home/" },
        { value: "用户列表", router: "/home/" },
        { value: "商品列表", router: "/home/" },
        { value: "商品分类", router: "/home/" },
        { value: "商品参数设置", router: "/home/" },
      ];
    };
    // 客户信息搜索提示内容
    const clientAll = () => {
      const arr = [];
      for (let i in mysqlClientArr2.value) {
        arr.push(mysqlClientArr2.value[i]);
        arr[i].value = mysqlClientArr2.value[i].name;
      }
      return arr;
    };
    // 客户数据
    const clientForm = reactive({
      name: "",
      way: ["手机号码"],
      手机号码: "",
      微信: "",
      QQ: "",
      date: "",
      time: "",
      gender: "男",
    });
    // 待修改项
    const pendingEdit = reactive({
      姓名: "",
      手机号码: "",
      微信: "",
      QQ: "",
      日期: "",
      时间: "",
      性别: "",
    });
    // 客户更新数据
    const newClient = reactive({
      姓名: "",
      手机号码: "",
      微信: "",
      QQ: "",
      日期: "",
      时间: "",
      性别: "",
      姓名2: "",
      手机号码2: "",
      微信2: "",
      QQ2: "",
      日期2: "",
      时间2: "",
      性别2: "",
      isEdit: false,
      index: null,
    });

    // 侦听客户更新列表
    for (let i in newClient) {
      if (i.indexOf("2") === -1) continue;
      watch(
        () => newClient[i],
        (after, before) => {
          for (let item in newClient) {
            if (item.indexOf("2") === -1) continue;
            if (newClient[item] !== newClient[item.slice(0, -1)]) {
              return (newClient.isEdit = true);
            }
          }
          newClient.isEdit = false;
        }
      );
    }
    watch(searchClientContent, (a, b) => {
      if (a === "") {
        mysqlClientArr2.value = [];
        for (let i of restaurants2.value) {
          mysqlClientArr2.value.push(i);
        }
      }
    });

    // 路由对象
    const router = useRouter();

    // 路由守卫
    router.afterEach((to, from) => {
      // 面包屑
      secondNav.value = router.currentRoute.value.name;
    });

    // 方法
    const methods = reactive({
      addClient() {
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "disappear 0.15s forwards";
        setTimeout(() => {
          showFunction.value = false;
          showClientForm.value = true;
          const clientFormBtn = document.getElementsByClassName("clientForm");
          clientFormBtn[0].style.animation = "appear 0.15s forwards";
        }, 150);
      },
      handleOpen(key, keyPath) {},
      handleClose(key, keyPath) {},
      goBack() {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("currentUsername");
        router.push("/login");
      },
      querySearch(queryString, cb) {
        const results = queryString
          ? restaurants.value.filter(createFilter(queryString))
          : restaurants.value;

        cb(results);
      },
      querySearch2(queryString, cb) {
        const results = queryString
          ? restaurants2.value.filter(createFilter(queryString))
          : restaurants2.value;

        mysqlClientArr2.value = results;
        cb(results);
      },
      handleSelect(item) {
        router.push(item.router);
        SearchContent.value = "";
      },
      cancel() {
        for (let i in clientForm) {
          if (i === "way") {
            clientForm[i] = ["手机号码"];
          } else if (i === "gender") {
            clientForm[i] = "男";
          } else {
            clientForm[i] = "";
          }
        }
        clientFormRef.value.clearValidate();
        const clientFormBtn = document.getElementsByClassName("clientForm");
        clientFormBtn[0].style.animation = "disappear 0.15s forwards";
        setTimeout(() => {
          showFunction.value = true;
          showClientForm.value = false;
          const functionBtn = document.getElementsByClassName("function");
          functionBtn[0].style.animation = "appear 0.15s forwards";
        }, 150);
      },
      onSubmit() {
        clientFormRef.value.validate(async (isValid) => {
          if (!isValid) {
            return ElMessage.error({
              message: "填写错误！",
              showClose: true,
            });
          }
          await axios
            .post(
              axios.baseURL + "/client/set",
              JSON.stringify({
                currentUsername: window.localStorage.getItem("currentUsername"),
                name: clientForm.name,
                手机号码: clientForm.手机号码,
                微信: clientForm.微信,
                QQ: clientForm.QQ,
                date: clientForm.date,
                time: clientForm.time,
                gender: clientForm.gender,
                CRUD: "create",
              })
            )
            .then((data) => {
              mysqlClientArr2.value.unshift({
                name: clientForm.name,
                phone: clientForm.手机号码,
                weixin: clientForm.微信,
                qq: clientForm.QQ,
                date: JSON.parse(JSON.stringify(clientForm.date)),
                time: JSON.parse(JSON.stringify(clientForm.time)),
                gender: clientForm.gender,
              });
              ElMessage.success({
                message: "添加成功！",
                showClose: true,
              });
              const clientFormBtn =
                document.getElementsByClassName("clientForm");
              clientFormBtn[0].style.animation = "disappear 0.3s forwards";
              setTimeout(() => {
                for (let i in clientForm) {
                  if (i === "way") {
                    clientForm[i] = ["手机号码"];
                  } else if (i === "gender") {
                    clientForm[i] = "男";
                  } else {
                    clientForm[i] = "";
                  }
                }
                showFunction.value = true;
                showClientForm.value = false;
                const functionBtn = document.getElementsByClassName("function");
                functionBtn[0].style.animation = "appear 0.3s forwards";
              }, 300);
              restaurants2.value = clientAll();
            })
            .catch((err) => {
              ElMessage({
                message: "请求错误！",
                type: "error",
                showClose: true,
              });
            });
        });
      },
      cancelDelete() {
        indexArr.value = [];
        showDelete.value = false;
        showFunction.value = true;
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "appear 0.3s forwards";

        const listC = document.getElementsByClassName("infinite-list-item");
        for (let i of listC) {
          if (
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running right" ||
            i.style.animation === "1s ease 0s 1 normal forwards running Dfold"
          ) {
            i.style.animation = "left 0.5s forwards";
          } else if (
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running Dunfold" ||
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running right2"
          ) {
            i.style.animation = "left2 0.5s forwards";
          } else if (
            i.style.animation === "1s ease 0s 1 normal forwards running clear"
          ) {
            i.style.animation = "back 1s forwards";
          } else if (
            i.style.animation === "1s ease 0s 1 normal forwards running clear2"
          ) {
            i.style.animation = "back2 1s forwards";
          } else {
            i.style.animation = "left 0.5s forwards";
            i.lastChild.style.animation = "appear 0.5 forwards";
            i.lastChild.firstChild.setAttribute("isfold", "true");
          }
        }

        const closeBtn = document.getElementsByClassName("ico");
        for (let i of closeBtn) {
          i.style.opacity = "1";
        }
        pendingdeleteArr.value = [];
      },
      showContactInput() {},
      clearNumber() {
        let contactArr = ["手机号码", "微信", "QQ"];
        for (let i of clientForm.way) {
          contactArr.splice(contactArr.indexOf(i), 1);
        }
        for (let i of contactArr) {
          clientForm[i] = "";
        }
      },
      showClientDetail(e) {
        if (open.value) {
          open.value = false;
          if (
            e.target.parentNode.parentNode.getAttribute("class") === "el-icon"
          ) {
            open.value = true;
            return;
          }
          if (e.target.parentNode.getAttribute("isfold") === "true") {
            if (showDelete.value === false) {
              e.target.parentNode.parentNode.style.animation =
                "CCW 1s forwards";
              e.target.parentNode.parentNode.parentNode.style.animation =
                "unfold 1s forwards";
              e.target.parentNode.setAttribute("isfold", "false");
            } else {
              e.target.parentNode.parentNode.style.animation =
                "CCW 1s forwards";
              e.target.parentNode.parentNode.parentNode.style.animation =
                "Dunfold 1s forwards";
              e.target.parentNode.setAttribute("isfold", "false");
            }
          } else {
            if (showDelete.value === false) {
              e.target.parentNode.parentNode.style.animation = "CW 1s forwards";
              e.target.parentNode.parentNode.parentNode.style.animation =
                "fold 1s forwards";
              e.target.parentNode.setAttribute("isfold", "true");
            } else {
              e.target.parentNode.parentNode.style.animation = "CW 1s forwards";
              e.target.parentNode.parentNode.parentNode.style.animation =
                "Dfold 1s forwards";
              e.target.parentNode.setAttribute("isfold", "true");
            }
          }
          setTimeout(() => {
            open.value = true;
          }, 1000);
        }
      },
      deleteClient() {
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "disappear 0.3s forwards";
        setTimeout(() => {
          showFunction.value = false;
        }, 300);
        showDelete.value = true;
        const listC = document.getElementsByClassName("infinite-list-item");

        for (let i of listC) {
          if (
            i.style.animation ===
              "1s ease 0s 1 normal forwards running unfold" ||
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running left2" ||
            i.style.animation === "1s ease 0s 1 normal forwards running back2"
          ) {
            i.style.animation = "right2 0.5s forwards";
          } else if (
            i.style.animation === "" ||
            i.style.animation === "1s ease 0s 1 normal forwards running fold" ||
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running left" ||
            i.style.animation ===
              "0.5s ease 0s 1 normal forwards running Efold" ||
            i.style.animation ===
              "1s ease 0s 1 normal forwards running Dfold" ||
            i.style.animation === "1s ease 0s 1 normal forwards running back"
          ) {
            i.style.animation = "right 0.5s forwards";
          }
        }
      },
      Delete(e) {
        if (e.target.getAttribute("class") !== "ico") {
          for (let i in indexArr.value) {
            if (i === e.target.parentNode.getAttribute("index")) return;
          }
          indexArr.value.push(e.target.parentNode.getAttribute("index"));
          e.target.parentNode.style.opacity = "0";
          const Clist = document.getElementsByClassName("infinite-list-item");
          if (
            Clist[e.target.parentNode.getAttribute("index")].style.animation !==
            "0.5s ease 0s 1 normal forwards running right"
          ) {
            Clist[e.target.parentNode.getAttribute("index")].style.animation =
              "clear2 1s forwards";
          } else {
            Clist[e.target.parentNode.getAttribute("index")].style.animation =
              "clear 1s forwards";
          }

          pendingdeleteArr.value.push(
            Clist[e.target.parentNode.getAttribute("index")].firstChild
              .firstChild.innerText
          );

          return;
        }
        for (let i in indexArr.value) {
          if (i === e.target.getAttribute("index")) return;
        }
        indexArr.value.push(e.target.getAttribute("index"));
        e.target.style.opacity = "0";
        const Clist = document.getElementsByClassName("infinite-list-item");
        if (
          Clist[e.target.getAttribute("index")].style.animation !==
          "0.5s ease 0s 1 normal forwards running right"
        ) {
          Clist[e.target.getAttribute("index")].style.animation =
            "clear2 1s forwards";
        } else {
          Clist[e.target.getAttribute("index")].style.animation =
            "clear 1s forwards";
        }
        pendingdeleteArr.value.push(
          Clist[e.target.getAttribute("index")].firstChild.firstChild.innerText
        );
      },
      confirmDelete() {
        if (pendingdeleteArr.value.length === 0) return this.cancelDelete();
        axios
          .post(
            axios.baseURL + "/client/set",
            JSON.stringify({
              currentUsername: window.localStorage.getItem("currentUsername"),
              names: pendingdeleteArr.value.join(","),
              CRUD: "delete",
            })
          )
          .then((data) => {
            ElMessage({
              message: "删除成功！",
              type: "success",
              showClose: true,
            });
            for (let i in mysqlClientArr2.value) {
              for (let a in pendingdeleteArr.value) {
                if (
                  mysqlClientArr2.value[i].name === pendingdeleteArr.value[a]
                ) {
                  mysqlClientArr2.value.splice(i, 1);
                }
              }
            }
            restaurants2.value = clientAll();
            this.cancelDelete();
          })
          .catch((err) => {
            ElMessage({
              message: "请求错误！",
              type: "error",
              showClose: true,
            });
          });
      },
      editClient() {
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "disappear 0.3s forwards";
        setTimeout(() => {
          showFunction.value = false;
        }, 300);
        showEdit.value = true;
        const listC = document.getElementsByClassName("infinite-list-item");
        for (let i of listC) {
          if (
            i.style.animation !== "1s ease 0s 1 normal forwards running unfold"
          ) {
            i.style.animation = "Eunfold 0.5s forwards";
          } else {
            i.style.animation = "Eunfold2 0.5s forwards";
          }
        }
        const showClientDetailBtn =
          document.getElementsByClassName("showClientDetail");
        for (let i of showClientDetailBtn) {
          if (
            i.style.animation !== "1s ease 0s 1 normal forwards running CCW"
          ) {
            i.style.animation = "disappear 0.5s forwards";
          } else {
            i.style.animation = "disappear2 0.5s forwards";
          }
        }
      },
      confirmEdit() {
        if (!newClient.isEdit) {
          return this.cancelEdit();
        }
        newClientRef.value[0].validate(async (isValid) => {
          // 校验结果判断
          if (!isValid)
            return ElMessage({
              message: "客户信息格式错误！",
              type: "error",
              showClose: true,
            });

          // 遍历出修改的数据
          for (let i in newClient) {
            if (i.indexOf("2") === -1) continue;
            if (newClient[i] !== newClient[i.slice(0, -1)]) {
              pendingEdit[i.slice(0, -1)] = newClient[i];
            }
          }

          // 请求客户信息修改接口
          await axios
            .post(
              axios.baseURL + "/client/set",
              JSON.stringify({
                currentUsername: window.localStorage.getItem("currentUsername"),
                nameOld: newClient.姓名,
                name: pendingEdit.姓名,
                phone: pendingEdit.手机号码,
                weixin: pendingEdit.微信,
                qq: pendingEdit.QQ,
                date: pendingEdit.日期,
                time: pendingEdit.时间,
                gender: pendingEdit.性别,
                CRUD: "update",
              })
            )
            .then((data) => {
              for (let i in pendingEdit) {
                if (pendingEdit[i]) {
                  if (i === "姓名") {
                    mysqlClientArr2.value[newClient.index].name =
                      pendingEdit[i];
                  }
                  if (i === "手机号码") {
                    mysqlClientArr2.value[newClient.index].phone =
                      pendingEdit[i];
                  }
                  if (i === "微信") {
                    mysqlClientArr2.value[newClient.index].weixin =
                      pendingEdit[i];
                  }
                  if (i === "QQ") {
                    mysqlClientArr2.value[newClient.index].qq = pendingEdit[i];
                  }
                  if (i === "日期") {
                    mysqlClientArr2.value[newClient.index].date = JSON.parse(
                      JSON.stringify(pendingEdit[i])
                    );
                  }
                  if (i === "时间") {
                    mysqlClientArr2.value[newClient.index].time = JSON.parse(
                      JSON.stringify(pendingEdit[i])
                    );
                  }
                  if (i === "性别") {
                    mysqlClientArr2.value[newClient.index].gender =
                      pendingEdit[i];
                  }
                  pendingEdit[i] = "";
                }
              }
              ElMessage({
                message: "修改成功！",
                type: "success",
                showClose: true,
              });
              restaurants2.value = clientAll();
              this.cancelEdit();
            })
            .catch((err) => {
              ElMessage({
                message: "请求错误！",
                type: "error",
                showClose: true,
              });
            });
        });
      },
      cancelEdit() {
        newClient.isEdit = false;
        showFunction.value = true;
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "appear 0.3s forwards";
        showEdit.value = false;
        settingName.value = "";
        const listC = document.getElementsByClassName("infinite-list-item");
        for (let i of listC) {
          i.style.animation = "Efold 0.5s forwards";
        }
        const showClientDetailBtn =
          document.getElementsByClassName("showClientDetail");
        for (let i of showClientDetailBtn) {
          i.style.animation = "appear 0.5s forwards";
          i.firstChild.setAttribute("isfold", "true");
        }
        const editBtn = document.getElementsByClassName("ico");
        for (let i of editBtn) {
          i.style.opacity = "1";
        }
      },
      Edit(e) {
        if (newClient.isEdit) {
          newClientRef.value[0].validate(async (isValid) => {
            // 校验结果判断
            if (!isValid)
              return ElMessage({
                message: "客户信息格式错误！",
                type: "error",
                showClose: true,
              });

            // 遍历出修改的数据
            for (let i in newClient) {
              if (i.indexOf("2") === -1) continue;
              if (newClient[i] !== newClient[i.slice(0, -1)]) {
                pendingEdit[i.slice(0, -1)] = newClient[i];
              }
            }

            // 请求客户信息修改接口
            await axios
              .post(
                axios.baseURL + "/client/set",
                JSON.stringify({
                  currentUsername:
                    window.localStorage.getItem("currentUsername"),
                  nameOld: newClient.姓名,
                  name: pendingEdit.姓名,
                  phone: pendingEdit.手机号码,
                  weixin: pendingEdit.微信,
                  qq: pendingEdit.QQ,
                  date: pendingEdit.日期,
                  time: pendingEdit.时间,
                  gender: pendingEdit.性别,
                  CRUD: "update",
                })
              )
              .then((data) => {
                for (let i in pendingEdit) {
                  if (pendingEdit[i]) {
                    if (i === "姓名") {
                      mysqlClientArr2.value[newClient.index].name =
                        pendingEdit[i];
                    }
                    if (i === "手机号码") {
                      mysqlClientArr2.value[newClient.index].phone =
                        pendingEdit[i];
                    }
                    if (i === "微信") {
                      mysqlClientArr2.value[newClient.index].weixin =
                        pendingEdit[i];
                    }
                    if (i === "QQ") {
                      mysqlClientArr2.value[newClient.index].qq =
                        pendingEdit[i];
                    }
                    if (i === "日期") {
                      mysqlClientArr2.value[newClient.index].date = JSON.parse(
                        JSON.stringify(pendingEdit[i])
                      );
                    }
                    if (i === "时间") {
                      mysqlClientArr2.value[newClient.index].time = JSON.parse(
                        JSON.stringify(pendingEdit[i])
                      );
                    }
                    if (i === "性别") {
                      mysqlClientArr2.value[newClient.index].gender =
                        pendingEdit[i];
                    }
                    pendingEdit[i] = "";
                  }
                }
                newClient.isEdit = false;
                if (e.target.getAttribute("class") === "ico") {
                  newClient.index = e.target.getAttribute("index");
                  const clientBtn =
                    e.target.parentNode.parentNode.parentNode.nextSibling
                      .nextSibling.firstChild.nextSibling.nextSibling;

                  if (clientBtn.nodeName === "#text") return;

                  settingName.value = clientBtn.firstChild.innerText.slice(3);
                  newClient.姓名 = clientBtn.firstChild.innerText.slice(3);
                  newClient.性别 =
                    clientBtn.firstChild.nextSibling.innerText.slice(-1);
                  newClient.手机号码 =
                    clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(
                      4
                    );
                  newClient.微信 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.QQ =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.日期 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.时间 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.姓名2 = clientBtn.firstChild.innerText.slice(3);
                  newClient.性别2 =
                    clientBtn.firstChild.nextSibling.innerText.slice(-1);
                  newClient.手机号码2 =
                    clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(
                      4
                    );
                  newClient.微信2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.QQ2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.日期2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.时间2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                } else {
                  newClient.index = e.target.parentNode.getAttribute("index");
                  const clientBtn =
                    e.target.parentNode.parentNode.parentNode.parentNode
                      .nextSibling.nextSibling.firstChild.nextSibling
                      .nextSibling;

                  if (clientBtn.nodeName === "#text") return;

                  settingName.value = clientBtn.firstChild.innerText.slice(3);
                  newClient.姓名 = clientBtn.firstChild.innerText.slice(3);
                  newClient.性别 =
                    clientBtn.firstChild.nextSibling.innerText.slice(-1);
                  newClient.手机号码 =
                    clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(
                      4
                    );
                  newClient.微信 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.QQ =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.日期 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.时间 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.姓名2 = clientBtn.firstChild.innerText.slice(3);
                  newClient.性别2 =
                    clientBtn.firstChild.nextSibling.innerText.slice(-1);
                  newClient.手机号码2 =
                    clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(
                      4
                    );
                  newClient.微信2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.QQ2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      3
                    );
                  newClient.日期2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                  newClient.时间2 =
                    clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                      5
                    );
                }
                ElMessage({
                  message: "修改成功！",
                  type: "success",
                  showClose: true,
                });
                restaurants2.value = clientAll();
              })
              .catch((err) => {
                ElMessage({
                  message: "请求错误！",
                  type: "error",
                  showClose: true,
                });
              });
          });
        } else {
          if (e.target.getAttribute("class") === "ico") {
            newClient.index = e.target.getAttribute("index");
            const clientBtn =
              e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling
                .firstChild.nextSibling.nextSibling;

            if (clientBtn.nodeName === "#text") return;

            settingName.value = clientBtn.firstChild.innerText.slice(3);
            newClient.姓名 = clientBtn.firstChild.innerText.slice(3);
            newClient.性别 =
              clientBtn.firstChild.nextSibling.innerText.slice(-1);
            newClient.手机号码 =
              clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(4);
            newClient.微信 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.QQ =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.日期 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.时间 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.姓名2 = clientBtn.firstChild.innerText.slice(3);
            newClient.性别2 =
              clientBtn.firstChild.nextSibling.innerText.slice(-1);
            newClient.手机号码2 =
              clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(4);
            newClient.微信2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.QQ2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.日期2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.时间2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
          } else {
            newClient.index = e.target.parentNode.getAttribute("index");
            const clientBtn =
              e.target.parentNode.parentNode.parentNode.parentNode.nextSibling
                .nextSibling.firstChild.nextSibling.nextSibling;

            if (clientBtn.nodeName === "#text") return;

            settingName.value = clientBtn.firstChild.innerText.slice(3);
            newClient.姓名 = clientBtn.firstChild.innerText.slice(3);
            newClient.性别 =
              clientBtn.firstChild.nextSibling.innerText.slice(-1);
            newClient.手机号码 =
              clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(4);
            newClient.微信 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.QQ =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.日期 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.时间 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.姓名2 = clientBtn.firstChild.innerText.slice(3);
            newClient.性别2 =
              clientBtn.firstChild.nextSibling.innerText.slice(-1);
            newClient.手机号码2 =
              clientBtn.firstChild.nextSibling.nextSibling.innerText.slice(4);
            newClient.微信2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.QQ2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                3
              );
            newClient.日期2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
            newClient.时间2 =
              clientBtn.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.slice(
                5
              );
          }
        }
      },
      searchClient() {
        const functionBtn = document.getElementsByClassName("function");
        functionBtn[0].style.animation = "disappear 0.15s forwards";
        setTimeout(() => {
          showFunction.value = false;
          showSearchClient.value = true;
          const searchClientBtn =
            document.getElementsByClassName("searchClientBox");
          searchClientBtn[0].style.animation = "appear 0.15s forwards";
        }, 150);
      },
      closeSearch() {
        searchClientContent.value = "";
        const searchClientBtn =
          document.getElementsByClassName("searchClientBox");
        searchClientBtn[0].style.animation = "disappear 0.15s forwards";
        setTimeout(() => {
          showFunction.value = true;
          showSearchClient.value = false;
          const functionBtn = document.getElementsByClassName("function");
          functionBtn[0].style.animation = "appear 0.15s forwards";
        }, 150);
      },
      selectClient(item) {
        methods.querySearch2(item.name, () => {});
      },
    });

    // 搜索框信息过滤
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    };

    // 客户表单校验规则
    const validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else if (
        value.match(
          /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/
        )
      ) {
        callback(new Error("请输入正确姓名"));
      }
      if (rule.field === "姓名2") {
        if (value === newClient.姓名) {
          return callback();
        }
      }
      for (let i in mysqlClientArr2.value) {
        if (value === mysqlClientArr2.value[i].name) {
          callback(
            new Error("姓名重复,推荐使用：" + value + "2，" + value + "3……")
          );
        }
      }
      callback();
    };
    const validatePhone = (rule, value, callback) => {
      if (rule.field === "手机号码2") {
        if (
          !value.match(
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
          ) &&
          value
        ) {
          callback(new Error("请输入正确的手机号"));
        } else if (!newClient.手机号码2 && !newClient.微信2 && !newClient.QQ2) {
          callback(new Error("请至少输入一种联系方式"));
        }
        return callback();
      }
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (
        !value.match(
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        )
      ) {
        callback(new Error("请输入正确的手机号"));
      }
      callback();
    };
    const validateWeixin = (rule, value, callback) => {
      if (rule.field === "微信2") {
        if (value.match(/[^a-zA-Z0-9]/)) {
          callback(new Error("请输入正确的微信号"));
        } else if (!newClient.手机号码2 && !newClient.微信2 && !newClient.QQ2) {
          callback(new Error("请至少输入一种联系方式"));
        }
        return callback();
      }
      if (value === "") {
        callback(new Error("请输入微信号"));
      } else if (value.match(/[^a-zA-Z0-9]/)) {
        callback(new Error("请输入正确的微信号"));
      }
      callback();
    };
    const validateQQ = (rule, value, callback) => {
      if (rule.field === "QQ2") {
        if (!value.match(/[1-9][0-9]{4,10}$/) && value) {
          callback(new Error("请输入正确的QQ号"));
        } else if (!newClient.手机号码2 && !newClient.微信2 && !newClient.QQ2) {
          callback(new Error("请至少输入一种联系方式"));
        }
        return callback();
      }
      if (value === "") {
        callback(new Error("请输入QQ号"));
      } else if (!value.match(/[1-9][0-9]{4,10}$/)) {
        callback(new Error("请输入正确的QQ号"));
      }
      callback();
    };

    // 客户表单绑定校验规则
    const clientFormRules = reactive({
      name: [{ validator: validateName, trigger: "blur", required: true }],
      手机号码: [{ validator: validatePhone, trigger: "blur", required: true }],
      微信: [{ validator: validateWeixin, trigger: "blur", required: true }],
      QQ: [{ validator: validateQQ, trigger: "blur", required: true }],
      way: [
        {
          required: true,
          message: "请至少选择一种联系方式",
          trigger: "change",
        },
      ],
    });
    const newClientRules = reactive({
      姓名2: [{ validator: validateName, trigger: "blur", required: true }],
      手机号码2: [{ validator: validatePhone, trigger: "blur" }],
      微信2: [{ validator: validateWeixin, trigger: "blur" }],
      QQ2: [{ validator: validateQQ, trigger: "blur" }],
    });

    // 生命周期
    onMounted(() => {
      // 获取当前时间
      setInterval(
        (function getNow() {
          const YY = new Date().getFullYear();
          const MM = new Date().getUTCMonth() + 1;
          const DD = new Date().getDate();
          const HH =
            new Date().getHours() < 10
              ? "0" + new Date().getHours()
              : new Date().getHours();
          const mm =
            new Date().getMinutes() < 10
              ? "0" + new Date().getMinutes()
              : new Date().getMinutes();
          const ss =
            new Date().getSeconds() < 10
              ? "0" + new Date().getSeconds()
              : new Date().getSeconds();
          currentTime.value = HH + ":" + mm + ":" + ss;
          currentDay.value = YY + "年" + MM + "月" + DD + "日";

          const weeks = ["日", "一", "二", "三", "四", "五", "六"];
          week.value = weeks[new Date().getDay()];

          return getNow;
        })(),
        1000
      );

      // 从数据库获取当前用户客户表
      function getMysqlClient() {
        axios
          .post(
            axios.baseURL + "/client",
            JSON.stringify(window.localStorage.getItem("currentUsername"))
          )
          .then((data) => {
            // 获取信息
            for (let i in data) {
              if (
                new Date(
                  data[i].date.replace(/-/g, "/").slice(0, 10) +
                    " " +
                    data[i].time.slice(11, 16)
                ).getTime() +
                  115200000 -
                  new Date().getTime() >
                0
              ) {
                mysqlClientArr.value.push(data[i]);
              }
            }
            // 将客户表按最接近当前时间排序
            mysqlClientArr.value.sort(function (a, b) {
              return (
                Math.abs(
                  new Date().getTime() -
                    (new Date(
                      a.date.replace(/-/g, "/").slice(0, 10) +
                        " " +
                        a.time.slice(11, 16)
                    ).getTime() +
                      115200000)
                ) -
                Math.abs(
                  new Date().getTime() -
                    (new Date(
                      b.date.replace(/-/g, "/").slice(0, 10) +
                        " " +
                        b.time.slice(11, 16)
                    ).getTime() +
                      115200000)
                )
              );
            });
            // 将联系时间已过的客户加入列表最后
            for (let i in data) {
              if (
                new Date(
                  data[i].date.replace(/-/g, "/").slice(0, 10) +
                    " " +
                    data[i].time.slice(11, 16)
                ).getTime() +
                  115200000 -
                  new Date().getTime() <
                0
              ) {
                mysqlClientArr.value.push(data[i]);
              } else if (data[i].date === "") {
                mysqlClientArr.value.push(data[i]);
              }
            }
            for (let i of mysqlClientArr.value) {
              mysqlClientArr2.value.push(i);
            }
            restaurants2.value = clientAll();
          })
          .catch((err) => {
            ElMessage({
              message: "请求错误！",
              type: "error",
              showClose: true,
            });
          });
      }

      getMysqlClient();

      // 搜索框
      restaurants.value = loadAll();

      // 面包屑
      secondNav.value = router.currentRoute.value.name;
    });

    return {
      local,
      clientFormRef,
      newClientRef,
      mysqlClientArr,
      mysqlClientArr2,
      pendingdeleteArr,
      pendingEdit,
      open,
      showFunction,
      showClientForm,
      showDelete,
      showEdit,
      showSearchClient,
      settingName,
      clientForm,
      newClient,
      currentTime,
      currentDay,
      week,
      secondNav,
      SearchContent,
      searchClientContent,
      clientFormRules,
      newClientRules,
      ...methods,
      ArrowRight,
    };
  },
};
</script>

<style scoped>
@import url("../static/css/home.css");
</style>