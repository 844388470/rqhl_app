import axios from 'axios'

// 获取公司列表
export const getCompanyList = () => {
  return axios.get('/temporary_company_list')
}

// 获取项目列表
export const getProjectList = () => {
  return axios.get('/temporary_project_list')
}

// 获取科室列表
export const getDubList = (id) => {
  // return axios.get(`/temporary_dub_list?project_id=${JSON.stringify(id)}` )
  return axios.get(`/temporary_dub_list?project_id=${id}`)
}

// 获取护理组列表
export const getGroupList = (id) => {
  return axios.get(`/temporary_group_list?project_id=${id}`)
}

//获取树形结构
// 参数type    dub   获取科室      group    获取护理组     不填  两个都获取
export const getTreeList = (type) => {
    return axios.get(`/temporary_all_list?type=${type}`)
  }
