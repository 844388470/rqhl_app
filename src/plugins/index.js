import intercepter from './intercepter'
import organSelect from '../components/organSelect.vue'
import mUpload from '../components/mUpload.vue'
import filters from './filters'
import * as api from '@/api'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog'
console.log(process.env, 1)

export default {
    install(Vue, opts) {
        intercepter(Vue, opts)
        // 全局组件
        Vue.component('organSelect', organSelect)
        Vue.component('mUpload', mUpload)

        Vue.mixin({
            mixins: [filters],
            data() {
                return {
                    api,
                    blue: '#5bacf9',
                    whiteww:'#fff',
                    edu_list: [
                        { pk_id: 1, name: '初中' },
                        { pk_id: 2, name: '高中' },
                        { pk_id: 3, name: '中专' },
                        { pk_id: 4, name: '大专' },
                        { pk_id: 5, name: '本科' },
                        { pk_id: 6, name: '硕士' },
                        { pk_id: 7, name: '小学' },
                        { pk_id: 8, name: '职高' }
                    ],
                    sex_list: [{ pk_id: '1', name: '男' }, { pk_id: '2', name: '女' }],
                    sysType: process.env['NODE_ENV'], // rqwy ：母婴 rqhl ：医护
                    pageInfo: {
                        limit: '20',
                        page: 1
                    },
                    pageData: [], // 滚动列表的数据 
                    rqhlArr: ['dev_huli', 'test_huli', 'sit_huli'],
                    wuyiArr: ['dev_muyin', 'test_muyin', 'sit_muyin'],
                }
            },
            methods: {
                // 成功弹出框
                success(mes) { Toast({ mes, timeout: 1500, icon: 'success' }) },
                // 错误弹出框
                error(mes) { Toast({ mes, timeout: 1500, icon: 'error' }) },
                //处理 滚动加载数据
                handelScrollResult(res, ref) {
                    ref = ref || 'infinitescrollDemo'
                    this.pageData = [...this.pageData, ...res.data.data]
                    if (this.pageData.length >= res.data.total || this.pageInfo.page >= res.data.last_page) {
                        /* 所有数据加载完毕 */
                        this.$refs[ref].$emit('ydui.infinitescroll.loadedDone')

                        return
                    }

                    this.$refs[ref].$emit('ydui.infinitescroll.finishLoad')
                    this.pageInfo.page++
                },


                clearScrollResult(ref) {
                    ref = ref || 'infinitescrollDemo'
                    this.$refs[ref].$emit('ydui.infinitescroll.reInit')
                },


                // 获取科室信息/护理组 & 显示搜索弹框
                /**@augments
                 * @param API 对应的api 里的方法
                 * @param key 对应form表单的key
                 */
                getSearchList(API, key, fuc, stop) {
                    fuc = fuc || this.showSearchBox
                    stop = stop || false
                    if (stop) {
                        return false
                    }
                    if (this.form.fk_hpl_id) {
                        api[API]([this.form.fk_hpl_id]).then(res => {
                            fuc(res.data, key)
                        })
                    } else {
                        this.error('请先选择网点')
                    }
                },

                // 显示搜索合作 
                /**@augments
                 * @param data  所有搜索项
                 * @param key   对应form表单的key
                 */
                showSearchBox(data, key) {
                    
                    this.searchShow = true
                    this.searchKey = key
                    this.searchResult = data
                    console.log( this.searchShow )
                },
                CB() {
                    setTimeout(() => { this.$router.go(-1) }, 1000)
                },

                getUserInfo() {
                    return this.api.userinfo().then(res => {
                        this.$store.dispatch('setUserinfo', res.data)
                        return res
                    })
                },

                //获取版本信息
                site_info() {
                    return this.api.site_info().then(res => {
                        sessionStorage.print_num = res.data.print_num
                        if (res.data.h5_version > localStorage.h5_version) {
                            this.reload()
                        }
                        return false
                    })
                },
                reload() {
                    try { window.location.reload(true) } catch (error) { }
                    alert(window.OMS.reload)
                    try {
                        //安卓刷新
                        window.OMS.reload()

                    } catch (error) {

                    }
                },



            },
            computed: {
                isrqhl() {
                    if (this.rqhlArr.indexOf(this.sysType) != -1) {
                        return true
                    } else {
                        return false

                    }

                }
            },


        })
    }

}