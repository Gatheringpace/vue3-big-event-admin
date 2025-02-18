<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { ref } from 'vue'
import articleedit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article.js'
import { formatTime } from '@/utils/format'

const loading = ref(false)

// 文章列表
const articleList = ref([])
//总条数
const total = ref(0)

//定义请求参数对象
const params = ref({
  pageNum: 1,
  pageSize: 5,
  categoryId: '',
  state: ''
})

//基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data.items
  total.value = res.data.data.total
  loading.value = false
}
getArticleList()

// 处理分页逻辑
const onSizeChange = (size) => {
  params.value.pageNum = 1
  params.value.pageSize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pageNum = page
  getArticleList()
}

// 重置与搜索的实现
const onSearch = () => {
  params.value.pageNum = 1
  getArticleList()
}

const onReset = () => {
  params.value.pageNum = 1
  params.value.categoryId = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()

// 编辑新增逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}

const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}

// 添加或编辑的回调
const onSuccess = (type) => {
  if (type === 'add') {
    getArticleList()
  } else {
    getArticleList()
  }
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单内容 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.categoryId"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" width="400" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 添加编辑的抽屉 -->
    <!-- 弹窗 -->
    <articleedit ref="articleEditRef" @success="onSuccess"></articleedit>
  </page-container>
</template>
