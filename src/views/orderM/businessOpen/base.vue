<!-- 业务开单-基础 -->
<template>
  <div class="mt10 bgf " style="height: 100%;">


      <div v-show="!isprint"> 
      <yd-cell-group>
          <yd-cell-item v-if='!!$route.query.id'>
            <b slot="left">订单号:</b>
           <span slot='left'>{{form.order_no}}</span>
        </yd-cell-item>
        <yd-cell-item @click.native="showSearch_fk_hpl" >
            <b slot="left">网点:</b>
           <span slot='left'>{{form.fk_hpl_id |project_list}}</span>
        </yd-cell-item>
         <yd-cell-item v-show="fk_dub_list.length || form.dub_name " @click.native="showSearch_dub_name()" >
            <b slot="left" >科室:</b>
           <span slot='left'>{{form.dub_name | empitSelect}}</span>
        </yd-cell-item>
         
         <yd-cell-item>
            <b slot="left">床位:</b>
           <input slot="right" v-model="form.bed" ref="bedInput" type="text" placeholder="">
        </yd-cell-item>
         <yd-cell-item>
            <div slot="left"><b>客户:</b> 
             <input  type="text"   v-model="form.patient_name" placeholder="">
             </div>
            <div @click="showCustomList" slot="right"><i>详情/选择</i></div>
        </yd-cell-item>

         <yd-cell-item arrow type="label" v-show="isrqhl">
            <b slot="left">性别：</b>
            <select slot="right" v-model="form.patient_sex">
                <option value="1">男</option>
                <option value="2">女</option>
            </select>
        </yd-cell-item>

         <yd-cell-item>
            <b slot="left">客户电话:</b>
            <input slot="right" v-model="form.patient_phone" type="number" placeholder="请输入手机号">
        </yd-cell-item>

        <!-- <yd-cell-item>
            <b slot="left">家属:</b>
            <input slot="right"  type="text" >
        </yd-cell-item> -->

        <!-- <yd-cell-item>
            <b slot="left">家属电话:</b>
            <input slot="right"  type="number" v-model="form.family_phone" placeholder="请输入手机号">
        </yd-cell-item> -->
         <yd-cell-item>
            <b slot="left">签约时间:</b>
            <yd-datetime :callback='clearDate.bind(this,1)' type="date"   v-model="form.bill_time" slot="right"></yd-datetime>    
        </yd-cell-item>

         <!-- <yd-cell-item>
            <b slot="left">结算日期:</b>
            <yd-datetime v-if="endtime_show" type="date" :init-emit="false" :start-date="form.bill_time" v-model="form.endtime" slot="right"></yd-datetime>
            <i slot="right" class="red" @click="clearDate(1)" > 清除</i>
        </yd-cell-item> -->

         <yd-cell-item @click.native="showSearch_fk_stf_q_id_name()" >
            <b slot="left"  >开单员:</b>
           <span slot='left'>{{form.fk_stf_q_id_name| empitSelect}}</span>
        </yd-cell-item>
        
         <yd-cell-item  type="label">
            <b slot="left">护工模式：</b>
            <yd-radio-group  slot="left" v-model="form.pattern" :color="blue">
                <yd-radio :disabled="!!$store.getters.order_service.length" val="1">整体</yd-radio>
                <yd-radio :disabled="!!$store.getters.order_service.length" val="2">一对一</yd-radio>
            </yd-radio-group>
        </yd-cell-item>

         <yd-cell-item  type="label">
            <b slot="left">护工薪酬：</b>
            <yd-radio-group  slot="left" v-model="form.work_type" :color="blue">
                <yd-radio val="1">月结</yd-radio>
                <yd-radio val="2">日结</yd-radio>
            </yd-radio-group>
        </yd-cell-item>
     
        <yd-cell-item @click.native="showSearch_group_name()" v-if="form.pattern=='1'" >
            <b slot="left"  >护理组:</b>
           <span slot='left'>{{form.group_name | empitSelect}}</span>
        </yd-cell-item>
      </yd-cell-group> 

      </div>
      
      <!-- 选择客户 -->
       <yd-popup v-model="customShow" position="bottom" height="60%">
            <yd-search cancel-text='搜索' :on-cancel="customSearchHandler"  class="searchInput" v-model="customSearch" :on-submit="customSearchHandler"></yd-search>
             <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
               <yd-list theme="1" slot="list">
                <div class="searchInputM">
                  <div class="flex flex-m customList" @click="checkCustom(item)" v-for="(item , i) in pageData" :key="i" :buttons="[]" >
                         
                            <div  class="flex-1" >{{item.name}}</div>
                            <div   class="flex-1">{{item.sex | sex}}</div>
                            <div  class="flex-1">{{item.mobile}}</div>
                          
                    </div>
                    </div>

               </yd-list>
            </yd-infinitescroll>
            
      </yd-popup>

    
   
   <!-- 图片上传弹出框 -->
   <yd-popup v-model="show" position="center" width="90%" class="img_popup" >
       <!-- 图片上传 -->
       <div class="pt20 pr15 pl15 pb15">
            <simpleUpload imgType="orders"  :apiMethod="api.getOss" :picUrl='picUrl' @success="upload_success"/>
             <yd-cell-group class="mt20">
                <yd-cell-item>
                    <span slot="left">票据单号：</span>
                    <input id="orderNO" slot="right" type="text" v-model="change_orders_item.order_no"  placeholder="请输入变更单号">
                   <yd-icon slot="right" v-show="isShowScanQRCode" @click.native="ScanQRCode" name="qrscan"></yd-icon>
                </yd-cell-item>

                <yd-cell-item arrow>
                    <span slot="left">变更日期：</span>
                    <yd-datetime type="date" v-model="change_orders_item.bill_time" slot="right"></yd-datetime>
                </yd-cell-item>
             </yd-cell-group>   

            <div class="mt20 tc">
                <yd-button class="w30p"  v-if="isEdit" type="danger"  @click.native="delChange_orders_item">删除</yd-button>
                <yd-button class="w30p"  v-if="!isEdit" :bgcolor="blue" color="#fff" @click.native="canlChange_orders_item">取消</yd-button>
                <yd-button class="w30p" :bgcolor="blue" color="#fff" @click.native="suerChange_orders_item">确定</yd-button>
            </div>  
       </div>  
    </yd-popup>

     <yd-list v-show=" isOpenM=='0' || isprint " theme="4">
       <yd-list-item @click.native="add_pic(0)">
            <img slot="img" src="../../../assets/img/upload_add.png">
            <span slot="title" class="add_pic">添加图片</span>
            
        </yd-list-item>

        <yd-list-item v-for="(item, key ) in change_orders"  @click.native="add_pic(1,key)" :key="key">
            <img slot="img" :src="item.path">
            <span slot="title">{{item.order_no}}</span>
            <yd-list-other slot="other">
                {{item.bill_time}}
            </yd-list-other>
        </yd-list-item>

        
    </yd-list>
  <button v-show="false" id="_setScanResult" @click="AndroidScanResul">安卓二维码t</button>
  
  </div>
</template>

<script>
import moment from 'moment'
import mSearch from '@/components/mSearch'
import simpleUpload from '@/components/simpleUpload'
import {mapState,mapGetters,mapActions} from 'vuex'
import * as api from '@/api/index'
import {custom_list} from '@/api/customs'
import _weixin from '../../../minix/weixin'

export default {
 components:{mSearch,simpleUpload},
//  props:['searchData','isprint'],
 props:{
searchData:{},
    isprint:{
        default:false
    }
 },
 mixins: [_weixin],
  data () { 
    return {   
         pk_id:this.$route.query.id,
         endtime_show:true , //开单时间
         isAndroid:!!window.OMS,
         customShow :false, //客户列表弹出框
         customSearch:'', //客户搜索值
         custom_id:this.$route.query.custom_id || '' , //客户ID
         name:this.$route.query.name || '', //客户名字
         mobile:this.$route.query.mobile || '', //客户手机号
         sex:this.$route.query.sex || '', //客户性别
         birth_day:this.$route.query.birth_day || '' , //客户生日 

         isOpenM:localStorage.has_new,  //  //0 : 手工开单  1:电子开单
         isShowScanQRCodeArr:['weixin'], //需要扫码的环境
         isShowScanQRCode:false,
         show:false,  //添加图片弹出框
         isEdit:false , //是否处于编辑状态
         picUrl:'' , //编辑时的图片地址
         index:-1,

         api,  
         groupStop:false,    //护理组是否不能选择
         

         change_orders:[], //订单图片
        //订单图片里面的每一项
        change_orders_item:{
          pk_id:'', //订单变更id
          order_id:'',//订单id
          picid:'0',//图片id 
          path:'',//图片地址  必填
          order_no:'',//变更单号
          bill_time:moment().format('YYYY-MM-DD'),//变更日期  必填
        },
        
        _change_orders_item:{},  //用来还原数据
        
  
        fk_dub_list:[],  //科室搜索数据 

        form:{
           birth_day:'' , //获取
           custom_id:'', //客户选中id
           order_no:'', //订单号
           pk_id:'',  //订单ID
           fk_hpl_id:'' , //网点 必填
           fk_dub_id:'0' , //科室ID
           bed:'' ,   //床位
           patient_name:'' ,//客户姓名 必填
           patient_sex:'2' , //性别
           patient_phone:'', //客户手机
           family_phone:'' ,//家属手机
           endtime:'' ,//结算日期
           pattern:'1' , //护理模式  1：整体 2：一对一  当护理模式为1，必填护理组，否则禁用护理组
           work_type:'1',//护工薪酬  1：月 2：日结
           group_id:'0', //护理组
            
           bill_time:moment().format('YYYY-MM-DD'), //开单时间
           fk_stf_q_id:this.$store.state.userinfo.pk_id, //开单员
           fk_stf_q_id_name:this.$store.state.userinfo.name ,//开单员
           total:'', //产品金额总计
           has_pay:'', //收费金额总计
           group_name:'' , //护理组名字
           dub_name:''  ,  //科室名字
        }
    }
  },
   computed:{
    ...mapState(['PROJECT_LIST','company_list']),
    ...mapGetters(['PROJECT_LIST','company_list'])  
  },
  mounted(){
  
    //   console.log(this.sysType,this.$route.query)
      if(!this.$route.query.id){
           this.form.order_no = this.createNO()
           try {
               //获取默认科室 网店
               let ORDER_INFO = JSON.parse(localStorage.ORDER_INFO)
               this.form.dub_name = ORDER_INFO.dub_name
                this.form.fk_dub_id = ORDER_INFO.fk_dub_id
                 this.form.fk_hpl_id = ORDER_INFO.fk_hpl_id

                  this.form.pattern = ORDER_INFO.pattern ||'1'
                   this.form.work_type = ORDER_INFO.work_type || '1'
                 if(this.form.pattern==1){

                 this.form.group_id = ORDER_INFO.group_id
                 this.form.group_name = ORDER_INFO.group_name

                 }
                
           } catch (error) {
               
           }
      }
        this.form.custom_id = this.custom_id || ''
        this.form.patient_name = this.name || ''
        this.form.patient_phone = this.mobile || ''
        this.form.patient_sex = this.sex || '2'
        this.form.birth_day = this.birth_day || ''
        
        this._change_orders_item = JSON.parse(JSON.stringify(this.change_orders_item))
        this.isScanQRCode()
           
  },

  methods:{
      ...mapActions(['setOrederBase','setChangeOrders']),
      saveData(){
          console.log('saveData--OrederBase')
          this.setOrederBase(this.form)
          this.setChangeOrders(this.change_orders)
      },
     
     //是否显示扫码
     isScanQRCode(){
         let ANGENT = sessionStorage.ANGENT || ''
         if(this.isShowScanQRCodeArr.includes(ANGENT)){
             this.isShowScanQRCode=true
         }
         if( this.isAndroid){
              //安卓 
              this.isShowScanQRCode=true
         }

     },

     //显示客户列表
     showCustomList(){
         if(!this.pageData.length){
             this.loadList()
         }
         this.customShow=true
     },

     //搜索客户列表
     customSearchHandler(value){
      
      this.pageInfo.page=1  
      this.pageData=[]
      this.clearScrollResult()
      this.customList()
     },

      loadList(){
        this.customList()
      },
      
     //获取客户列表数据
     customList(){
       let data = Object.assign(this.pageInfo,{search:this.customSearch})
        return custom_list(data).then(res=>{
            this.handelScrollResult(res)               
            return res
         })
     } ,
     //选中客户
     checkCustom(item){
       console.log(item)
        this.form.custom_id = item.pk_id
        this.form.patient_name = item.name
        this.form.patient_phone = item.mobile
        this.form.patient_sex = item.sex
        this.form.birth_day = item.birth_day
        this.customShow = false
     },
      //显示网点搜索框
      showSearch_fk_hpl(){   
        //处于编辑模式 不可以改网点
        console.log(this.pk_id)
       if(this.pk_id){
         return false
       }
       //如果产品存在数据不让改
       if(this.$store.getters.order_goods.length){
            
           this.error('产品存在数据，不能修改')
           return false        
       }
       let searchData={
           result:this.PROJECT_LIST,
           searchKey:'fk_hpl_id',
       } 
       this.$emit('showSearch',searchData)
      },

      //显示科室数据
      showSearch_dub_name(){
        if(this.form.fk_hpl_id){
            alert(this.form.fk_hpl_id)
              let searchData={
                    result:this.fk_dub_list,
                    searchKey:'fk_dub_id',
                }
              this.$emit('showSearch',searchData)
           
        }else{
          this.error('请选择网点')  
        }
      },
      
      

      //显示护理组数据
       showSearch_group_name(){
          if(this.form.fk_hpl_id){
            this.getGroupList().then(res=>{
              let searchData={
                    result:res.data,
                    searchKey:'group_id',
                }
              this.$emit('showSearch',searchData)
            })
        }else{
          this.error('请选择网点')  
        }
      },

       //显示开单员数据
      showSearch_fk_stf_q_id_name(){
          if(this.form.fk_hpl_id){
            this.getStaffs().then(res=>{
              let searchData={
                    result:res.data,
                    searchKey:'fk_stf_q_id_name',
                }
              this.$emit('showSearch',searchData)
            })
        }else{
          this.error('请选择网点')  
        }

      },

      //添加图片 
      add_pic(isEdit,index){
          this.isEdit = !!isEdit
          this.change_orders_item = JSON.parse(JSON.stringify(this._change_orders_item))
          
          this.picUrl = ''
          if(this.isEdit){
            //编辑
            this.index= index
            this.change_orders_item = JSON.parse(JSON.stringify(this.change_orders[index]))
            this.picUrl = this.change_orders[index].path
          }else{
            //添加


          }
          this.show=true
      },

      //图片上传成功
      upload_success(res){
        console.log(res)
        this.change_orders_item.path=res.url
        this.change_orders_item.picid='0'
        
      },

      //删除图片
      delChange_orders_item(){
            this.$dialog.confirm({
                    title: '提示',
                    mes: '确定删除该条记录吗？',
                    opts: () => {
                         this.change_orders.splice(this.index,1)
                         this.show=false 
                    }
           })      
      },

      //取消 图片
      canlChange_orders_item(){
        
       this.picUrl = ' 1 '       
       this.show=false

      },

      //添加/修改图片
      suerChange_orders_item(){
          
            if(this.change_orders_item.path){
              
              if(this.isEdit){
               //编辑
               this.change_orders.splice(this.index,1,JSON.parse(JSON.stringify(this.change_orders_item)))

              }else{
                  //添加
                  this.change_orders.push(JSON.parse(JSON.stringify(this.change_orders_item)))
                   
                    
              }
               this.picUrl = ' 1 '
              
               this.show=false
   
            }else{
                this.error('请选择图片上传')
            }
      },
      //微信扫一扫
      ScanQRCode(){
       
       if(sessionStorage.ANGENT=='weixin'){
            this._setScanQRCode((res)=>{     
             this.change_orders_item.order_no = res.resultStr.split(',')[1]       
             this.success('扫码成功')
       },(res)=>{
            this.error('扫码失败')
       }) 
       }else if(this.isAndroid){
        
            window.OMS.startCodeScan(3)
       } 
      },

      //安卓二维码回掉
      AndroidScanResul(){
          let data =  sessionStorage._setScanResult || '{}'
           data = JSON.parse(data)
            this.change_orders_item.order_no = data.data 
           

      },

      //获取科室数据
      getDubList(fk_hpl_id){
        let id = fk_hpl_id ||  this.form.fk_hpl_id
        return  api.getDubList([id]).then(res=>{
             this.fk_dub_list = res.data
             console.log(res.data)
             return res
         })
      },

      //获取护理组列表
      getGroupList(){
         return  api.getGroupList([this.form.fk_hpl_id]).then(res=>{ 
             return res
         }) 
      },

      //获取开单员数据
      getStaffs(){
          return api.getStaffs({fk_hpl_id:this.form.fk_hpl_id}).then(res=>{
              return res
          })
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
      
      //清除时间
      clearDate(v){
         console.log(v)
          if(v){
             this.endtime_show = false
             this.form.endtime = ''
             setTimeout(()=>{
                 this.endtime_show = true
             },200)
          }
      }
    
      


  },
  watch:{
    //是否显示护理组（初始化数据）
    'form.pattern'(v){
        if(v!='1'){
            this.group_name='',
            this.group_id='0'
        }

    },


   //处理返回的值
   searchData(v){    
       v = JSON.parse(v)
       //console.log(v , '搜索返回的值')
       if(v.key=='fk_hpl_id'){     
           this.form.fk_hpl_id=v.searchData.pk_id || 0
           
           //清空下级数据
           this.form.fk_dub_id= 0
            this.form.dub_name=''

            this.form.group_id= 0
            this.form.group_name=''
            
            if(this.form.fk_hpl_id){
                this.getDubList().then(res=>{
                    if(this.fk_dub_list.length){
                        this.showSearch_dub_name()
                    }else{
                        
                    }
                })
            }
           

       }else if(v.key=='fk_dub_id'){
            this.form.fk_dub_id=v.searchData.pk_id || 0
            this.form.dub_name=v.searchData.name 
            console.log(v)
            //改变科室 如果服务无数据 则 修改修理护理模式
            if(!this.$store.getters.order_service.length){
              this.form.pattern = v.searchData.pattern || 1 
            }
        // pattern:'1' , //护理模式  1：整体 2：一对一  当护理模式为1，必填护理组，否则禁用护理组
           // console.log(11)
           //护理模式为1 默认护理组信息
           console
           if(this.form.pattern==1){
               this.form.group_id = v.searchData.group_id
                 this.form.group_name = v.searchData.group_name

           }
            this.$refs.bedInput.focus()


       }else if(v.key=='group_id'){
            this.form.group_id=v.searchData.pk_id || 0
            this.form.group_name=v.searchData.name

       }else if(v.key=='fk_stf_q_id_name'){
            console.log(v,'fanhiu')
            this.form.fk_stf_q_id=v.searchData.pk_id || 0
            this.form.fk_stf_q_id_name=v.searchData.name
       }
   }

    
    
  
    

   
  }
}

</script>
<style lang='scss' scoped>
.add_pic{
    display: block;
    text-align: center;
    margin-top: 0.6rem;
    font-size: 0.36rem;
    
}

.customList{
    padding: 0.3rem 0.1rem;
    border-bottom: 1px solid #eee;
    font-size: 0.31rem;
}
.searchInput{
    position: fixed;
    width: 100%;
    z-index: 9999;
}
.searchInputM{
    padding-top: 1.2rem;
}
</style>