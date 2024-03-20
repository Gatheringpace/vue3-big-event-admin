<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(true)

//自定义变量ruleFormRef赋值给 ref 属性，
//通过ruleFormRef.value 拿到form表单的实例对象，
//通过调用validate方法对表单项目进行校验；
const form = ref()
const register = async () => {
  //注册成功之前，先进行校验，校验成功 -> 请求 , 失败 -> 提示
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter() //userRouter表示拿大概念路由对象 userRoutes表示拿路由参数使用

const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.data)
  ElMessage.success('登录成功')
  router.push('/')
}

//整个的from数据提交
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

// 整个表单的校验规则
// 整个表单的校验规则
// 1.非空校验 required: true  message消息提示，trigger触发校验的时机 blur change
// 2.长度校验 min: xx, max: xx
// 3.正则校验 pattern: 正则规则   \S 非空字符
// 4.自定义校验 => 自己写逻辑校验（校验函数）
//   validator: (rules, value, callback)
//   (1)rule 当前校验规则的相关信息
//   (2)value 所校验的表单元素目前的表单值
//   (3)callback 无论成功还是失败，都需要 callback 回调
//             -callback() 校验成功
//             -callback(new Error(错误信息))
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10 位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rules, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() //就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

//切换的时候重置表单内容 监听事件
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!-- 
        el-row表示一行，一行分成24份
        el-col表示列
        (1):span='12' 表示在一行中，占12份（50%）
        (2):pan='6'   表示在一行中，占6份（25%）
        (3):offset="3"  代表在一行中，左侧margin份数

            el-form 整个表单组件
            el-form-item 表单的一行（一个表单域）
            el-input 表单元素（输入框） 

         -->
  <el-row class="login-page">
    <!-- 左半部分的大事件源码 -->
    <!-- <el-col :span="12" class="bg"></el-col> -->
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登陆相关表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  // background-color: #fff;
  background-image: url('@/assets/背景.jpg');

  //左半部分的大事件源码
  // .bg {
  //   background:
  //     url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
  //     url('@/assets/login_bg.jpg') no-repeat center / cover;
  //   border-radius: 0 20px 20px 0;
  // }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    //似乎可有可无
    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
