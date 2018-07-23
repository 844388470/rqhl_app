// 客户API
import axios from 'axios'

// 客户列表(手机端)
export const operation_data = (data) => {
    return axios.post('/mobile/customs', data)
}

// 客户添加(手机端)
export const custom_add = (data) => {
    return axios.post('/mobile/custom/add', data)
}

// 客户修改(手机端)
export const custom_update = (data) => {
    return axios.post('/mobile/custom/update', data)
}

// 删除客户
export const custom_delete = (pk_id) => {
    return axios.post('/mobile/custom/delete', {pk_id})
}

//客户详情获取
export const custom_show = (pk_id) => {
    return axios.post('/mobile/custom/show', {pk_id})
}

//评估历史
export const cbathel_history = (data) => {
    return axios.post('/mobile/bathel/history', data)
}

//评估明细
export const cbathel_show = (pk_id) => {
    return axios.post('/mobile/bathel/show', {pk_id})
}

//护理评估添加
export const cbathel_add = (data) => {
    return axios.post('/mobile/bathel/add', data)
}

//护理评估修改
export const cbathel_update = (data) => {
    return axios.post('/mobile/bathel/update', data)
}

//删除评估
export const cbathel_delete = (pk_id) => {
    return axios.post('/mobile/bathel/delete', {pk_id})
}

//订单客户列表
export const custom_list = (data) => {
    return axios.post('/mobile/custom/list', data)
}

//检测客户是否重复
export const duplicate = (data) => {
    return axios.post('/mobile/custom/duplicate', data)
}