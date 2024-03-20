<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article'
const dialogFormVisible = ref(false)

const form = ref({
  categoryName: '',
  categoryAlias: ''
})

const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['success'])
const formRef = ref()
const onSubmit = async () => {
  await formRef.value.validate()
  form.value.id
    ? await artEditChannelService(form.value)
    : await artAddChannelService(form.value)
  ElMessage({
    type: 'success',
    message: form.value.id ? '编辑成功' : '添加成功'
  })
  dialogFormVisible.value = false
  emit('success')
}

/* 添加 和 编辑，可以共用一个弹层，所以可以将弹层封装成一个组件
组件对外暴露一个方法 open, 基于 open 的参数，初始化表单数据，并判断区分是添加 还是 编辑
open({}) => 添加操作，添加表单初始化无数据
open({ id: xx, … }) => 编辑操作，编辑表单初始化需回显
 */
const open = (row) => {
  form.value = { ...row }
  dialogFormVisible.value = true
}

//向外暴露方法
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="form.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="form.categoryName" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input v-model="form.categoryAlias" placeholder="请输入分类别名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
