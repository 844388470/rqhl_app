import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import text1 from '../components/lianjiTest.vue'

let dev = ['dev_huli','development','dev_muyin']
//const _import = require('./_import_' + process.env.NODE_ENV)
let _import = require('./_import_production')
//alert(process.env.NODE_ENV)
try {
    if(dev.includes(process.env.NODE_ENV)){
        _import = require('./_import_development')
    }else{
        _import = require('./_import_production')
    }
} catch (error) {   }

let isrqhl = ['dev_huli','test_huli','sit_huli'].indexOf(process.env['NODE_ENV'])!=-1
let title = isrqhl?'瑞泉护理':'瑞泉无忧'
title = '护理管理平台'
console.log(isrqhl,title)
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
       
        {
            path: '/login',
            name: 'login',
            meta: { title: '登录' },
            component: _import('login')
        },
        {
            path: '/orderM',
            name: 'orderM',
            meta: { title: '订单管理' },
            component: _import('orderM/index')
        },
        {
            path: '/accountM',
            name: 'accountM',
            meta: { title: '结算确认' },
            component: _import('accountM/index')
        },
        {
            path: '/accountDetails',
            name: 'accountDetails',
            meta: { title: '结算确认' },
            component: _import('accountM/accountDetails')
        },
        {
            path: '/customerM',
            name: 'customerM',
            meta: { title: '客户管理' },
            component: _import('customerM/index'),
        },
        {
            path: '/addCustomerMo',
            name: 'addCustomerMo',
            meta: { title: '客户管理' },
            component: _import('customerM/customerMo/index')
        },
        {
            path: '/assList',
            name: 'assList',
            meta: { title: '历史评估' },
            component: _import('customerM/customerMo/assList')
        },
        {
            path: '/dataReport',
            name: 'dataReport',
            meta: { title: '数据上报' },
            component: _import('dataReport/index')
        },
        {
            path: '/bedM',
            name: 'bedM',
            meta: { title: '床位管理' },
            component: _import('bedM/index')
        },
        {
            path: '/message',
            name: 'message',
            meta: { title: '消息管理' },
            component: _import('message/index')
        }, {
            path: '/messageDet',
            name: 'messageDet',
            meta: { title: '消息详情' },
            component: _import('message/detail')
        },
    
        {
            path: '/customerDet',
            name: 'customerDet',
            meta: { title: '客户详情' },
            component: _import('customerM/customerMo/detail')
        },

        {
            path: '/assessment',
            name: 'assessment',
            meta: { title: '护理评估' },
            component: _import('customerM/customerMo/assessment')
        },
       
        {
            path: '/businessOpen',
            name: 'businessOpen',
            meta: { title: '订单编辑' },
            component: _import('orderM/openOrder/index')
        },
        {
            path: '/attendanceM',
            name: 'attendanceM',
            meta: { title: '考勤管理' },
            component: _import('attendanceM/index'),
            redirect: '/attendanceM/attendance',
            children: [
                { path: '/attendanceM/attendance', name: '/attendanceM/attendance', meta: { title: '考勤' }, component: _import('attendanceM/attendance') },
                { path: '/attendanceM/statistics', name: '/attendanceM/statistics', meta: { title: '统计' }, component: _import('attendanceM/statistics') },
                { path: '/attendanceM/me', name: '/attendanceM/me', meta: { title: '我的' }, component: _import('attendanceM/me') },
                { path: '/attendanceM/detail', name: '/attendanceM/detail', meta: { title: '考勤详情' }, component: _import('attendanceM/detail') }
            ]
        },

        {
            path: '/layout',
            name: 'layout',
            meta: { title: title },
            component: _import('layout'),
            redirect: '/layout/home',
            children: [
                { path: '/layout/home', name: 'layout/home', meta: { title: title }, component: _import('layout/home') },
                { path: '/layout/myinfo', name: 'layout/myinfo', meta: { title: '我的信息' }, component: _import('myinfo/index') },
                { path: '/layout/count', name: 'layout/count', meta: { title: '统计' }, component: _import('count/index') }
            ]
        },
        {
            path: '/myinfo/openMode',
            name: '/myinfo/openMode',
            meta: { title: '开单模式' },
            component: _import('myinfo/openMode'),


        },
        {
            path: '/count/runData',
            name: '/count/runData',
            meta: { title: '经营数据' },
            component: _import('count/runData'),
        },
        {
            path: '/count/projectDetail',
            name: '/count/projectDetail',
            meta: { title: '项目明细' },
            component: _import('count/projectDetail'),
        },
        {
            path: '/count/detailDetail',
            name: '/count/detailDetail',
            meta: { title: '明细详情' },
            component: _import('count/detailDetail'),
        },
        {
            path: '/count/charge',
            name: '/count/charge',
            meta: { title: '收费查询' },
            component: _import('count/charge'),
        },
        {
            path: '/count/chargeList:data',
            name: '/count/chargeList',
            meta: { title: '收费列表' },
            component: _import('count/chargeList'),
        },
        {
            path: '/count/chargeDetail:data',
            name: '/count/chargeDetail',
            meta: { title: '收费明细' },
            component: _import('count/chargeDetail'),
        },
        {
            path: '/count/income',
            name: '/count/income',
            meta: { title: '收入查询' },
            component: _import('count/income'),
        },
        {
            path: '/count/incomeList:data',
            name: '/count/incomeList',
            meta: { title: '收入列表' },
            component: _import('count/incomeList'),
        },
        {
            path: '/count/incomeDetail:data',
            name: '/count/incomeDetail',
            meta: { title: '收入明细' },
            component: _import('count/incomeDetail'),
        },
        {
            path: '/peopleM',
            name: 'peopleM',
            meta: { title: '人员管理' },
            component: _import('peopleM/index')
        },
        {
            path: '/addPeople',
            name: 'addPeople',
            meta: { title: '新增人员' },
            component: _import('peopleM/addPeople/index')
        },
        {
            path: '/peopleInfo',
            name: 'peopleInfo',
            meta: { title: '人员详情' },
            component: _import('peopleM/peopleInfo')
        }

    ]
})