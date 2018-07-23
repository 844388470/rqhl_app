import axios from 'axios'

//阿里oss
export const getOss = (scene) => {
    return axios.post('/api/oss',{scene})
}

//获取
export const ad = () => {
    return axios.post('/ad')
}

//登录
export const login = (data) => {
    return axios.post('/login', data)
}

//是否登录
export const is_login = () => {
    return axios.post('/is_login')
}

//微信js api参数获取
export const getConfigInfo = (js_api) => {
    js_api = js_api || []
    return axios.post('/api/wechat_js',{url:location.href,js_api})
}

//站点基础信息获取
export const site_info = () => {
    return axios.post('/site/info')
}

//微信code认证
export const wechat_code = (code) => { 
    let d = new FormData()
    d.append('code',code)
    return axios.post('/wechat/code',d)
}
//微信解绑
export const unbind_wechat = () => {    
    return axios.post('/unbind_wechat')
}

//钉钉认证
export const ding_talk = (code) => { 
    return axios.post('/ding_talk/code',{code})
}

//钉钉账号解绑
export const unbind_dingding = (code) => { 
    return axios.post('/unbind_dingding',{code})
}

//注销
export const logout = () => {
    return axios.post('/logout')
}

//用户基础信息
export const userinfo = () => {
    return axios.post('/user/info')
}

//登入用户授权菜单权限获取模块
export const auth_modules = () => {
    return axios.post('/auth_modules', { client_type: 1 })
}



// 获取公司列表
export const getCompanyList = () => {
    return axios.post('/get_org_list')
}

// 获取网点(项目)
export const getProjectList = () => {
    return axios.post('/get_hpl_list')
}

// 获取科室列表
export const getDubList = (arr_id) => {
    return axios.post(`/get_dub_list`, { fk_hpl_id: arr_id })
}

// 获取护理组列表
export const getGroupList = (arr_id) => {
    return axios.post(`/get_group_list`, { fk_hpl_id: arr_id })
}

//获取项目产品列表
export const getGoods = (id) => {
    return axios.get(`/setup/get_goods?fk_hpl_id=${id}`)
}

//获取员工列表
export const getStaffs = (data) => {
    data = data || {}
    return axios.post(`/staff/get_staffs`, data)
}

//订单新增
export const createOrder = (data) => {
    data.order_data.order_base.order_no = ''
    return axios.post(`/mobile/orders/create`, data)
}

//订单明细
export const getOrderInfo = (pk_id) => {
    return axios.post(`/mobile/orders/order_info`, { pk_id })
}


//订单修改
export const updateOrderInfo = (data) => {
    return axios.post(`/mobile/orders/update`, data)
}

//通知列表
export const notices = (data) => {
    return axios.post(`/notices`, data)
}

//通知类型
export const notice_type = (data) => {
    return axios.post(`/notice/type`, data)
}

//通知详情
export const show_notices = (pk_id) => {
    return axios.post(`/notice/show`, { pk_id })
}

//删除通知 (数组)
export const del_notices = (pk_id) => {
    return axios.post(`/notice/delete`, { pk_id })
}
//日报列表
export const getDateList = (data) => {
    return axios.post(`/mobile/daydate_index`, data)
}
//日报添加
export const setReportedDataInfo = (data) => {
    return axios.post(`/mobile/daydate_add`, data)
}