// 公司 项目组
import * as api from '@/api/index'
let state = {
  company_list: sessionStorage.getItem('company_list') ? JSON.parse(sessionStorage.getItem('company_list')) : [], // 公司列表
  project_list: sessionStorage.getItem('project_list') ? JSON.parse(sessionStorage.getItem('project_list')) : [] // 项目列表
}

let actions = {
  setCompany_list({ commit }, i) {
    api.getCompanyList().then(res => {
      commit('SET_COMPANY_LIST', res.data)
    }).catch(err => console.log(err))
  },

  setProject_list({ commit }, i) {
    api.getProjectList().then(res => {
        commit('SET_PROJECT_LIST', res.data)
      }).catch(err => console.log(err))
  }
}

let mutations = {
  SET_COMPANY_LIST(state, i) {
    sessionStorage['company_list'] = JSON.stringify(i)
    state.company_list = i
  },
  SET_PROJECT_LIST(state, i) {
    sessionStorage['project_list'] = JSON.stringify(i)
    state.project_list = i
  }

}

let getters = {
  project_list: state => state.project_list,
  PROJECT_LIST:state => state.project_list.filter(item => {return [1,2,3].indexOf(item.type)!= -1}),  
  company_list: state => state.company_list

}

export default {
  state,
  actions,
  mutations,
  getters}
