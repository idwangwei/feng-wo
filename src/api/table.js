import request from '@/utils/request';

export function getUserList(data) {
  return request({
    url: '/bms/user/list',
    method: 'post',
    data
  });
}

export function modifyUserInfo(data) {
  return request({
    url: '/bms/user',
    method: 'put',
    data
  });
}

export function getPoolList(data) {
  return request({
    url: '/bms/mining/list',
    method: 'post',
    data
  });
}
export function switchPoolEnableStatus(data) {
  return request({
    url: '/bms/mining/enable',
    method: 'post',
    data
  });
}
export function updatePoolInfo(data) {
  return request({
    url: '/bms/mining/update',
    method: 'post',
    data
  });
}
export function getWWTPrice(data) {
  return request({
    url: '/bms/price',
    method: 'post',
    data
  });
}
export function getPriceList() {
  return request({
    url: '/bms/price/list',
    method: 'get'
  });
}
export function updateWWTPrice(data) {
  return request({
    url: '/bms/price',
    method: 'put',
    data
  });
}

export function getOrderList(data) {
  return request({
    url: '/bms/market/list',
    method: 'post',
    data
  });
}
export function getBuyOrderList(data) {
  return request({
    url: '/bms/market/buyorder',
    method: 'post',
    data
  });
}
export function cancelOrder(data) {
  return request({
    url: '/bms/market/canceled',
    method: 'post',
    data
  });
}
export function cancelBuyOrder(data) {
  return request({
    url: '/bms/market/down',
    method: 'post',
    data: { language: "", ...data }
  });
}
export function matchBuyOrder() {
  return request({
    url: '/bms/market/match',
    method: 'post',
    data: { language: "" }
  });
}
export function permitOrder(data) {
  return request({
    url: '/bms/market/permit',
    method: 'post',
    data: { language: "", ...data }
  });
}
export function getNotifyList(data) {
  return request({
    url: '/bms/ann/list',
    method: 'post',
    data
  });
}
export function deleteNotify(params) {
  return request({
    url: '/bms/ann',
    method: 'delete',
    params
  });
}
export function addNotify(data) {
  return request({
    url: '/bms/ann',
    method: 'post',
    data: { language: '', ...data }
  });
}
export function getFeedbackList(data) {
  return request({
    url: '/bms/feedback/list',
    method: 'post',
    data
  });
}
export function deleteFeedback(data) {
  return request({
    url: '/bms/feedback/delete',
    method: 'post',
    data
  });
}
export function getFeedbackReplyList(data) {
  return request({
    url: '/bms/feedback/replyfeedbacks',
    method: 'post',
    data
  });
}
export function replyFeedback(data) {
  return request({
    url: '/bms/feedback/reply',
    method: 'post',
    data
  });
}
export function getHomeData() {
  return request({
    url: '/bms/common/home',
    method: 'post'
  });
}
export function getImg({ imageType, filename }) {
  return request({
    url: `/bms/common/images/${imageType}/${filename}`,
    method: 'get'
  });
}

// 角色操作
export function getRoles() {
  return request({
    url: '/bms/adminuser/role/list',
    method: 'get'
  });
}
export function addRole(data) {
  return request({
    url: '/bms/adminuser/role',
    method: 'post',
    data
  });
}
export function updateRole(data) {
  return request({
    url: '/bms/adminuser/role',
    method: 'put',
    data
  });
}
export function deleteRole(params) {
  return request({
    url: '/bms/adminuser/role',
    method: 'delete',
    params
  });
}
export function getRoleById(data) {
  return request({
    url: '/bms/adminuser/role',
    method: 'get',
    data
  });
}

// 管理员操作
export function getAdminuser() {
  return request({
    url: `/bms/adminuser/list`,
    method: 'get'
  });
}
export function addAdminuser(data) {
  return request({
    url: `/bms/adminuser`,
    method: 'post',
    data
  });
}
export function deleteAdminuser(params) {
  return request({
    url: `/bms/adminuser`,
    method: 'delete',
    params
  });
}
export function updateAdminuserEnable(data) {
  return request({
    url: `/bms/adminuser`,
    method: 'put',
    data
  });
}
export function updateAdminuserRole(data) {
  return request({
    url: `/bms/adminuser/update`,
    method: 'put',
    data
  });
}
export function getAdminuserByName(params) {
  return request({
    url: `/bms/adminuser/username`,
    method: 'get',
    params
  });
}
export function getAdminuserByPhone(params) {
  return request({
    url: `/bms/adminuser/phone`,
    method: 'get',
    params
  });
}
export function getAdminuserByRoleName(params) {
  return request({
    url: `/bms/adminuser/roleName`,
    method: 'get',
    params
  });
}
export function getPriceStatus() {
  return request({
    url: `/bms/price/status`,
    method: 'get'
  });
}

export function setPriceStatus(data) {
  return request({
    url: `/bms/price/status`,
    method: 'put',
    data
  });
}

export function addUserWwt(data) {
  return request({
    url: `/bms/user/wwt`,
    method: 'post',
    data
  });
}
export function getWwtSmsCode() {
  return request({
    url: `/bms/common/sms/superadmin`,
    method: 'get'
  });
}

export function getUserInfo(params) {
  return request({
    url: `/bms/user/info`,
    method: 'post',
    params
  });
}
export function getTalentInfoList(data) {
  return request({
    url: `/bms/talent/info`,
    method: 'post',
    data: { language: "", ...data }
  });
}
export function getTalentOverview() {
  return request({
    url: `/bms/talent/overview`,
    method: 'get'
  });
}
export function getVoteList(data) {
  return request({
    url: `/bms/vote/list`,
    method: 'post',
    data: { ...data, language: '' }
  });
}
export function deleteVote(data) {
  return request({
    url: `/bms/vote/delete`,
    method: 'post',
    data
  });
}
export function addVote(data) {
  return request({
    url: `/bms/vote/add`,
    method: 'post',
    data
  });
}
