<!-- 公司、项目。科室。服务下拉选项 组件-->
<template>
  <div>
     <yd-cell-group>
            <yd-cell-item arrow>
                <span slot="left">公司：</span>
                <input slot="right" type="text" v-model="option.company"  @click.stop="openModel(0)" readonly placeholder="请选择公司">
            </yd-cell-item>
             <yd-cell-item arrow>
                <span slot="left">项目:</span>
                <input slot="right" type="text" v-model="option.project"  @click.stop="openModel(1)" readonly placeholder="请选择项目">
            </yd-cell-item>
             <yd-cell-item arrow>
                <span slot="left">科室:</span>
                <input slot="right" type="text" v-model="option.dub" @click.stop="openModel(2)" readonly placeholder="请选择科室">
            </yd-cell-item>
             <yd-cell-item arrow>
                <span slot="left">护理组:</span>
                <input slot="right" type="text" v-model="option.group" @click.stop="openModel(3)" readonly placeholder="请选择护理组">
            </yd-cell-item>
         </yd-cell-group>
         <yd-button size="large" type="primary" @click.native="handleSubmit(option)">提交</yd-button>

       <yd-popup class="m-popup" v-model="modelShow"  position="center" width="90%">
            <yd-cell-item >
                <span slot="left">搜索：</span>
                <input slot="right" type="text" v-model="modelData.search"   placeholder="请输入关键字">
            </yd-cell-item>
         
         <yd-checklist align="right" v-model="modelData.check">
          <yd-checklist-item v-for='( item , index) in modelData.items' :key="index"  :val='JSON.stringify(item)'>
                <div  style="height: 50px;line-height: 50px;" >{{item.name}}</div>
            </yd-checklist-item>        
        </yd-checklist>
            
        </yd-popup>
        
    
     
  </div>
</template>

<script>
import * as api from '../api/company'
import * as utils from '../utils/index'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'companySelect',
  mounted() {},
  props:['handleSubmit'],
  data() {
    return {
      idkey:['pk_id','pid','pk_id','pk_id'],
      //选项
      i: 0, //用来判断下拉框 ， 0 公司; 1项目;  2科室 ;3护理组
      //选中的值
      option: {
        company: [], //公司
        company_id: [], //公司id
        project: [], //项目
        project_id: [], //项目id
        dub: [], //科室
        dub_id: [], //科室id
        group: [], //护理组
        group_id: [] //护理组id
      },

      //弹出框显示是数据
      modelData: {
        search: '',
        items: [], //遍历的下拉列表
        check: [] //选择中的值
      },

      // 选择项的初始值
      dataInit: {
        company_list: [], //公司
        project_list: [], //项目
        dub_list: [], //科室
        group_list: [] //护理组
      },

      modelShow: false //选项弹框
    }
  },

  methods: {
    //打开下拉列表（设置默认值）
    openModel(i) {
      this.i = i
      this.modelData = utils.emptyObject(this.modelData)
      this.getDataInit()
      if (i == 0) {
        if (this.option.company_id.length) {
          let obj = this.modelData.items.filter(i =>
            this.option.company_id.includes(i['pk_id'])
          )
          obj.forEach(ele => {
            this.modelData.check.push(JSON.stringify(ele))
          })
        }else{
          //设置默认值
        }
      } else if (i == 1) {
        if (this.option.project_id.length) {
          let obj = this.modelData.items.filter(i =>
            this.option.project_id.includes(i['pid'])
          )
          obj.forEach(ele => {
            this.modelData.check.push(JSON.stringify(ele))
          })
        }else{
          //设置默认值
        }
      } else if (i == 2) {
        //异步 在获取初始数据处理了  
      } else if (i == 3) {
        //异步 在获取初始数据处理了 
 }
      this.modelShow = true
    },

    //获取初始数据（type进行操作）
    getDataInit() {
      if (this.i == 0) {
        this.dataInit.company_list = this.company_list
        this.modelData.items = this.dataInit.company_list
      } else if (this.i == 1) {
        this.dataInit.project_list = this.project_list.filter(i =>
          this.option.company_id.includes(i.pk_id)
        )
        this.modelData.items = this.dataInit.project_list
      } else if (this.i == 2) {
        api.getDubList(this.option.project_id).then(res => {
          this.dataInit.dub_list = res
          this.modelData.items = this.dataInit.dub_list
           if (this.option.dub_id.length) {
            let obj = this.modelData.items.filter(i =>
              this.option.dub_id.includes(i['pk_id'])
            )
            obj.forEach(ele => {
              this.modelData.check.push(JSON.stringify(ele))
            })
          } else{
            //设置默认值
          }
        })
      }else if(this.i==3){
        api.getGroupList(this.option.project_id).then(res=>{
          this.dataInit.group_list = res
          this.modelData.items = this.dataInit.group_list
          if (this.option.group_id.length) {
            let obj = this.modelData.items.filter(i =>
              this.option.group_id.includes(i['pk_id'])
            )
            obj.forEach(ele => {
              this.modelData.check.push(JSON.stringify(ele))
            })
          }else{
            //设置默认值
          } 
        })
      }
    }
  },
  watch: {
    //选中操作
  
    modelShow(v) {
      if (!v) {
         if(this.dataInitNumArr.includes(this.i)){
          let name=[] 
          let id=[] 
          this.modelData.check.forEach(ele => {
          name.push(JSON.parse(ele)['name'])
          id.push(JSON.parse(ele)[this.idkey[this.i]])
          })
          this.option[this.optionArr[this.i*2]]=name
          this.option[this.optionArr[this.i*2+1]]=id   
         }
      }
    },

    //搜索
    'modelData.search'(v) {
      if(this.dataInitNumArr.includes(this.i)){
        this.modelData.items = this.dataInit[this.dataInitArr[this.i]].filter(i =>
          i.name.includes(v)
          )
      }
    },

    //重置项
    'option.company_id'(n,o){
      this.option.project=[]
      this.option.project_id=[]
      this.option.dub=[]
      this.option.dub_id=[]
      this.option.group=[]
      this.option.group_id=[]
    },
    'option.project_id'(n,o){
      this.option.dub=[]
      this.option.dub_id=[]
      this.option.group=[]
      this.option.group_id=[]
    }
  },
  computed: {
    ...mapState(['project_list', 'company_list','loading']),
    ...mapGetters(['project_list', 'company_list','loading']),
    optionArr(){return Object.keys(this.option)},
    dataInitArr(){
      return Object.keys(this.dataInit)
    },
    dataInitNumArr(){
       let len =  Object.keys(this.dataInit).length
       return new Array(len).fill(1).map((v,i)=>v*i)
    }
  }
}
</script>
<style lang='scss' scoped>

</style>