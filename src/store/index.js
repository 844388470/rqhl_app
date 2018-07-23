import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import * as api from '../api'
import company from './modules/company'
import order from './modules/order'
import _ from 'lodash'

Vue.use(Vuex)

let modules = {
    company,
    order
}

let state = {
    loading: false,
    authModulesList: sessionStorage.authModulesList ? JSON.parse(sessionStorage.authModulesList) : [],
    userinfo:sessionStorage.userinfo ? JSON.parse(sessionStorage.userinfo) : {},

}

let actions = {
    setLoading({ commit }, info) {
        commit('SET_LOADING', info)
    },
    setauthModulesList({ commit }, info) {
        commit('SET_AUTO_MODULES_LIST', info)
    },
    setUserinfo({ commit }, info) {
        commit('SET_USER_INFO', info)
    },

}

let mutations = {
    SET_LOADING(state, info) {
        state.loading = info
    },
    SET_AUTO_MODULES_LIST(state, info) {
        sessionStorage.authModulesList = JSON.stringify(info)
        state.authModulesList = info
    },
    SET_USER_INFO(state, info) {
        sessionStorage.userinfo = JSON.stringify(info)
        state.userinfo = info
    }

}
let getters = {
    loading: state => state.loading,
    authModulesList: state => state.authModulesList,
    homeMeun:(state)=>{
        let showArr = state.authModulesList.filter(item => item.is_hidden==0)
        return _.chunk(showArr,6)
    },
    userinfo: state => state.userinfo
}

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules
})