//基础
import moment from "moment";
import * as api from '@/api/index'
import { custom_list } from '@/api/customs'
export default {
    data() {
        return {
            customShow: false,
            customSearch: '', //客户搜索值
            fk_dub_list: [],  //科室搜索数据 

            custom_id:this.$route.query.custom_id || '' , //客户ID
            name:this.$route.query.name || '', //客户名字
            mobile:this.$route.query.mobile || '', //客户手机号
            sex:this.$route.query.sex || '', //客户性别
            birth_day:this.$route.query.birth_day || '' , //客户生日 

          
        }
    },
    mounted() {
        
        if(!this.$route.query.id){
            this.order_data.order_base.order_no = this.createNO()
            try {
                //获取默认科室 网店
                let ORDER_INFO = JSON.parse(localStorage.ORDER_INFO)
                this.order_data.order_base.dub_name = ORDER_INFO.dub_name
                 this.order_data.order_base.fk_dub_id = ORDER_INFO.fk_dub_id
                  this.order_data.order_base.fk_hpl_id = ORDER_INFO.fk_hpl_id
 
                   this.order_data.order_base.pattern = ORDER_INFO.pattern ||'1'
                    this.order_data.order_base.work_type = ORDER_INFO.work_type || '1'
                  if(this.order_data.order_base.pattern==1){
 
                  this.order_data.order_base.group_id = ORDER_INFO.group_id
                  this.order_data.order_base.group_name = ORDER_INFO.group_name
 
                  }
                 
            } catch (error) {
                
            }
       }
         this.order_data.order_base.custom_id = this.custom_id || ''
         this.order_data.order_base.patient_name = this.name || ''
         this.order_data.order_base.patient_phone = this.mobile || ''
         this.order_data.order_base.patient_sex = this.sex || '2'
         this.order_data.order_base.birth_day = this.birth_day || ''
         if(this.custom_id&&this.order_data.order_base.fk_dub_id){
             this.getDubList()
         }

       
        
    },
    methods: {
        //显示客户列表
        showCustomList() {
            if (!this.pageData.length) {
                this.loadList()
            }
            this.customShow = true
        },

        loadList() {
            this.customList()
        },
        //获取客户列表数据
        customList() {
            let data = Object.assign(this.pageInfo, { search: this.customSearch })
            return custom_list(data).then(res => {
                this.handelScrollResult(res)
                return res
            })
        },

        //获取科室数据
        getDubList(fk_hpl_id) {
            let id = fk_hpl_id || this.order_data.order_base.fk_hpl_id
            return api.getDubList([id]).then(res => {
                this.fk_dub_list = res.data
              //  console.log(res.data)
                return res
            })
        },

        //获取护理组列表
        getGroupList() {
            return api.getGroupList([this.order_data.order_base.fk_hpl_id]).then(res => {
                return res
            })
        },

        //选中客户
        checkCustom(item) {
            //  console.log(item)
            this.order_data.order_base.custom_id = item.pk_id
            this.order_data.order_base.patient_name = item.name
            this.order_data.order_base.patient_phone = item.mobile
            this.order_data.order_base.patient_sex = item.sex
            this.order_data.order_base.birth_day = item.birth_day
            this.customShow = false
        },

        //搜索客户列表
        customSearchHandler() {
            this.pageInfo.page = 1
            this.pageData = []
            this.clearScrollResult()
            this.customList()
        },

        //显示网点搜索框
        showSearch_fk_hpl() {
            //处于编辑模式 不可以改网点
            console.log(this.pk_id)
            if (this.pk_id) {
                return false
            }
            //如果产品存在数据不让改
            if (this.order_data.order_goods.length) {
                this.error('产品存在数据，不能修改')
                return false
            }
            let searchData = {
                result: this.PROJECT_LIST,
                searchKey: 'fk_hpl_id',
            }

            this.showSearch(searchData)
        },

        //显示科室数据
        showSearch_dub_name() {
            if (this.order_data.order_base.fk_hpl_id) {
                let searchData = {
                    result: this.fk_dub_list,
                    searchKey: 'fk_dub_id',
                }
                this.showSearch(searchData)
            } else {
                this.error('请选择网点')
            }
        },

        //显示护理组数据
        showSearch_group_name() {
            if (this.order_data.order_base.fk_hpl_id) {
                this.getGroupList().then(res => {
                    let searchData = {
                        result: res.data,
                        searchKey: 'group_id',
                    }
                    this.showSearch(searchData)
                })
            } else {
                this.error('请选择网点')
            }
        },
        //生成订单号
      createNO(){
        let code = moment().format('YYMMDD')+ (Math.random()+'').slice(3,10)
        if(this.wuyiArr.indexOf(this.sysType) != -1){
            return '1'+code

        }else{
            return '0'+code
        }
    },
    

    },


    watch: {
       
    }
}