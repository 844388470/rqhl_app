import axios from 'axios'

//阿里oss
export const getStaffList =(data)=>{
  return axios.post('/mobile/staff_list',data)
}

export const getStaffInfo =(data)=>{
  return axios.post('/mobile/staff_info',data)
}

export const getAllRolesList = (data) => {                //获取所有角色列表
    return axios.post('/get_all_roles',data)
}

export const getAllStaffSelect = (data) => {                         //下拉选项
    return axios.post('/get_all_staff_select' ,data)
}

export const addStaff = (data) => {                         //添加人员
    return axios.post('/mobile/staff_add' ,data)
}

export const editStaff = (data) => {                         //编辑人员
    return axios.post('/mobile/staff_edit' ,data)
}