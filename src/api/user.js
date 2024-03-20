import request from '@/utils/request'

/* export const userRegisterService = ({ username, password, repassword }) => {
  return request.post('/api/reg', { username, password, repassword })
}
 */

//注册接口
export const userRegisterService = (registerData) => {
  var params = new URLSearchParams()
  for (let key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/register', params)
}

//登录接口
export const userLoginService = (loginData) => {
  var params = new URLSearchParams()
  for (let key in loginData) {
    params.append(key, loginData[key])
  }
  return request.post('/user/login', params)
}

// 用户基本信息获取
export const userGetInfoService = () => request.get('/user/userInfo')

// 更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/user/update', { id, nickname, email })

// 更新头像
export const userUploadAvatarService = (avatarUrl) => {
  let params = new URLSearchParams()
  params.append('avatarUrl', avatarUrl)
  return request.patch('/user/updateAvatar', params)
}

//更新密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/user/updatePwd', { old_pwd, new_pwd, re_pwd })
