import request from '@/utils/request'

// 请求获取表格数据
export const artGetChannelsService = () => request.get('/category')
// 添加文章分类
export const artAddChannelService = (categoryModel) =>
  request.post('/category', categoryModel)
// 编辑文章分类
export const artEditChannelService = (data) => request.put('/category', data)
// 删除文章分类
export const artDelChannelService = (id) =>
  request.delete('/category', {
    params: { id }
  })

//获取文章列表
export const artGetListService = (params) => request.get('/article', { params })
// 添加文章
export const artPublishService = (data) => request.post('/article', data)
// 文章回显
export const artGetDetailService = (id) =>
  request.get('/article/detail', { params: { id } })
// 编辑文章
export const artEditService = (data) => request.put('/article', data)
// 删除文章
export const artDelService = (id) =>
  request.delete('/article', { params: { id } })
