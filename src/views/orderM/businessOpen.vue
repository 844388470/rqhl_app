<!--业务开单-->
<template>
  <div style="height: 100%;">
    <!-- <button @click="chanceCode">生产条码</button>
    <button @click="printImg">打印图片</button>
    <button @click="chanceImg">变图片</button> -->
    
    
     
     
     <!-- ↓↓↓↓ 搜索的组件 -->
      <mSearch  :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey" :name="searchName"/>
      <!-- ↑↑↑↑ 搜索的组件 -->
    <yd-layout >

        <!--  打印  -->
        <div v-show="isprint" >
          
          <div class="print" id="print">
            <h1 class="title bor">生活护理服务票据</h1>
            <div class="bor bcodeF">
                <p >订单号：{{order_data.order_base.order_no}}</p>
                <img id="bcode" class="bcode"/>

            </div>
          
            <!-- 基础 -->
            <div class="bor base">
              
              <!-- <p>开单日期：{{order_data.order_base.bill_time}}</p> -->
                <p><b class="blod">商户</b>：{{order_data.order_base.fk_hpl_id | project_to_companys }}</p>
               <div class="flex">
                 
                  <p style="width:65%"><b class="blod">网点</b>：{{order_data.order_base.fk_hpl_id | project_list }}</p>
                  <!-- 科室 -->
              <p>
                 <span  class="ml10"> {{order_data.order_base.dub_name  }} </span>/
                 <!-- 床位 -->
                 <span>{{order_data.order_base.bed }}床</span>
              </p>
               </div>

                <div class="flex mt5 flex-m">
                 <p style="width:65%"><b class="blod">客户：</b>{{order_data.order_base.patient_name  }} ({{order_data.order_base.patient_sex | sex}}) /{{ order_data.order_base.patient_phone  }}</p>
                 <!-- 电话 -->
                 <!-- <p class="ml10"> {{ order_data.order_base.patient_phone  }} </p> -->
                 <!-- 生日 -->
                  <p class="ml10">生日:{{ order_data.order_base.birth_day  }} </p>
               
               </div>
             
            </div>

              <!-- 产品 -->
              <div v-show="order_data.order_goods.length">
                <div class="bor base">
                  <div class="flex">
                      <p class="flex-3 tl "><b class="blod">产品</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">单价</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                  </div>

                  <div class="flex flex-m" v-for="(item ,i ) in order_data.order_goods" :key="i">
                      <!-- <p class="flex-3">产品{{i+1}}</p> -->
                      <!-- 产品 -->
                      <div class="flex-3 ">
                        <!-- {{item.goods_description}} -->
                        <!-- <p>{{sliceStr(item.goods_description,1)}}</p> -->
                        <p>{{sliceStr(item.goods_description,0)}}</p>
                        
                       </div>
                      <p class="flex-2 tl  pr10">{{item.price}}元/{{item.combo_type}} </p>
                      <!-- 数量 -->
                      <p class="flex-1 tl  pr10">{{item.real_combo_num}} {{item.combo_type | vir_combo_type}}</p>
                      <!-- 金额 -->
                      <p class="flex-1 tl  pr10">{{((item.real_combo_num/item.combo_num)*item.price).toFixed(2) | NaNf}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">浮动金额:</p>
                        <p class="flex-1 tr">-{{fu_total | toTow}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">应付金额:</p>
                        <p class="flex-1 tr">{{total | toTow}}</p>
                  </div>
                </div>
                
               </div>

                  
               <!-- 钱 -->
               <div class="base bor" v-show="order_data.order_charge.length">
                  <div class="flex">
                      <p class="flex-2 pr10"><b class="blod">收付日期</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">方式</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                      <p class="flex-4 tl pr10"><b class="blod">流水号</b></p>
                  </div>
                 <div class="bor3 flex flex-m"  v-show="item.charge_type!=3" v-for="(item ,i ) in order_data.order_charge" :key="i">
                    <!-- <p class="flex-3">收费{{i+1}}</p> -->
                   <div class="flex-2 pr10"  > {{item.charge_time}}  </div>
                    <div class="flex-1 tl pr10">   {{item.charge_type | charge_type}}</div>
                   <div class="flex-1 tl pr10">  {{item.price| toTow }}  </div>
                    <div class="flex-4 tl pr10"> {{item.trans_no}} </div>
                 </div>

                 <div class="flex flex-m mt5" >
                   <p class="blod mr10">收付合计:</p>
                    <p >{{chargeTotal | toTow}}</p>
                 </div>

               </div>

               <!-- 服务 -->
                
               <div>
                 <!-- <div class="bor"> 服务明细</div> -->
                 <div class="bor base  "  v-show="order_data.order_service.length">

                    <div class="flex">
                      <p class="flex-3 tl "><b class="blod">服务项目</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">服务起止</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">护理员</b></p>
                  </div>

                    <div class="flex  flex-m "  v-for="(item ,i ) in order_data.order_service" :key="i">
                       <!--  服务产品-->
                      <div class="flex-3 tl">
                        <!-- {{item.vir_goods_description}} -->
                        <!-- <p>{{sliceStr(item.vir_goods_description,1)}}</p> -->
                        <!-- <p>{{sliceStr(item.vir_goods_description,0)}}</p> -->
                         <p>{{sliceStr(item.vir_goods_description,2)}}</p> 
                      </div>
                      <div class="flex-2 tl pr10">
                        {{item.start}} {{item.end=(item.time==0||!item.time)? '': (item.count_type==1?(new Date(new Date(item.start).getTime() + Math.ceil(parseFloat(item.time))*864e5)):item.count_type==2?(new Date(new Date(item.start).getTime() +  Math.ceil(parseFloat(item.time)+1)*864e5)):new Date(item.start)) | Time}}
                      </div>
                      <!-- 服务数量 -->
                      <p class="flex-1 tl pr10">{{item.time}} {{item.vir_combo_type | vir_combo_type}}</p>
                      <!--  护工/护理组 -->
                      <div class="flex-1 tl pr10">
                        <p>{{item.fk_stf_id_name}}</p>
                        <!-- <p class="fs12">9999999999</p> -->
                      </div>
                  
  
                 </div>
                 </div>
                  <p class="tip bor"> 
                    请阅读背面服务协议，签字即同意该协议。
                 </p>
                  <p class="bor1 tip1">
                    开单人员：{{order_data.order_base.fk_stf_q_id_name| empitSelect}}
                  </p>

                   <div class="bor1 tip2">
                    <p>客户或代理</p>
                    <p>人签字：</p>
                  </div>

                   <div class="bor1 tip2">
                    <p>护理员签字：</p>
                  </div>
                  <div class=" base">
                     <div class=""> 打印时间：{{nowDate}} </div>
                     <div  class="">打印单号：{{ print_no }}</div>

                  </div>
               </div>          
          </div>
        </div>

      <!-- 非打印 -->
      <div >
            <yd-tab v-show="isOpenshow && !isprint"  :active-color="blue" :callback='tabCallback' class="businessOpen ">
                <yd-tab-panel v-show="!isprint" label="基础" :active='currentTab==1' :tabkey='1' ></yd-tab-panel>
                <yd-tab-panel v-show="!isprint"   label="产品" :active='currentTab==2' :tabkey='2'></yd-tab-panel>
                <yd-tab-panel v-show="!isprint"   label="服务" :active='currentTab==3' :tabkey='3'></yd-tab-panel>
                <yd-tab-panel v-show="!isprint"  label="收费" :active='currentTab==4' :tabkey='4'></yd-tab-panel>
            </yd-tab>
            <div class="businessOpen " >
              <basis v-show="currentTab==1 ||isprint " class="businessOpen " ref='basis' :isprint="isprint"  :searchData='searchData'  @showSearch = 'showSearch' />
              <product v-show="currentTab==2 && !isprint" :watchChangeNum='watchChangeNum' ref='product' :searchData='searchData'  @showSearch = 'showSearch'/>
              <service  v-show="currentTab==3 && !isprint" :changeNum="changeNum" :changItem="changItem" ref='service' :searchData='searchData'  @showSearch = 'showSearch' />
              <charge  v-show="currentTab==4 && !isprint" ref='charge' :searchData='searchData'  @showSearch = 'showSearch' />
            </div>

        </div>
      

        <yd-tabbar slot="tabbar" >
           <div class="tc w100p pt10 pb10">
             <div>
              <!-- 非打印按钮 -->
             <div v-show="!isprint">
                <div v-if="isOpenshow">
                  <yd-button v-show="currentTab!==1"  class="w15p" :bgcolor="blue" @click.native="prev()"  color="#FFF">上一步</yd-button>
                  <yd-button v-show="currentTab!==4" class="w15p" :bgcolor="blue" @click.native="next()" color="#FFF">下一步</yd-button>
                  <!-- <yd-button  class="w15p" :bgcolor="blue" @click.native="printView"  color="#FFF">打印预览</yd-button>     -->
                  <yd-button v-show="currentTab==1"  class="w15p" :bgcolor="blue" @click.native="printView"  color="#FFF">返回</yd-button>    
                  <yd-button v-show="currentTab==4" class="w15p" :bgcolor="blue"  @click.native="submitOrder()" color="#FFF">完成</yd-button>
                </div>
                <div  v-show="!isOpenshow">
                    <yd-button  class="w30p" :bgcolor="blue"  @click.native="submitOrder()" color="#FFF">完成</yd-button>
                </div>
            </div>  

            <!-- 打印按钮 -->
            <div v-show="isprint">
              <div v-if="isOpenshow">
                  <!-- <yd-button  class="w20p" :bgcolor="blue" @click.native="printViewPrev"  color="#FFF">上一步</yd-button>    -->
                  <yd-button  class="w20p" :bgcolor="blue" @click.native="printViewPrev"  color="#FFF">编辑</yd-button>   
                  <yd-button  class="w20p" :disabled="printDisable"  @click.native="submitOrder(1)" :bgcolor="banColor"  color="#FFF">打印<span v-show="printDisable">{{i}}</span></yd-button>    
                  <!-- <yd-button  class="w20p" :bgcolor="blue"  @click.native="submitOrder()"  color="#FFF">完成</yd-button> -->
                </div>

            </div>
           

            </div>


           </div>   
        
        </yd-tabbar>

    </yd-layout>
    <!-- isprint&&printShow -->
   <div v-show="isprint&&printShow" >
          
          <div class="print1" id="print1">
            <h1 class="title bor">生活护理服务票据</h1>
            <div class="bor bcodeF">
                <p >订单号：{{order_data.order_base.order_no}}</p>
                <img id="bcode" class="bcode"/>

            </div>
          
            <!-- 基础 -->
            <div class="bor base">
              
              <!-- <p>开单日期：{{order_data.order_base.bill_time}}</p> -->
               <p><b class="blod">商户</b>：{{order_data.order_base.fk_hpl_id | project_to_companys }}</p>
               <div class="flex">
                  <p><b class="blod">网点</b>：{{order_data.order_base.fk_hpl_id | project_list }}</p>
                  <!-- 科室 -->
                 <p  class="ml10"> {{order_data.order_base.dub_name  }}  </p>
                 <!-- 床位 -->
                 <p class="ml10">{{order_data.order_base.bed }}床</p>
    
               </div>

                <div class="flex mt5 flex-m">
                 <p ><b class="blod">客户：</b>{{order_data.order_base.patient_name  }} ({{order_data.order_base.patient_sex | sex}})</p>
                 <!-- 电话 -->
                 <p class="ml10"> {{ order_data.order_base.patient_phone  }} </p>
                 <!-- 生日 -->
                  <p class="ml10"> 生日:{{ order_data.order_base.birth_day  }} </p>
               
               </div>
             
            </div>

              <!-- 产品 -->
              <div v-show="order_data.order_goods.length">
                <div class="bor base">
                  <div class="flex">
                      <p class="flex-3 tl "><b class="blod">产品</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">单价</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                  </div>

                  <div class="flex flex-m" v-for="(item ,i ) in order_data.order_goods" :key="i">
                      <!-- <p class="flex-3">产品{{i+1}}</p> -->
                      <!-- 商品 -->
                      <div class="flex-3 tl ">
                        <!-- {{item.goods_description}} -->
                        <!-- <p>{{sliceStr(item.goods_description,1)}}</p> -->
                        <p>{{sliceStr(item.goods_description,0)}}</p>
                      </div>
                      <p class="flex-2 tl pr10">{{item.price | toTow}}元/{{item.combo_type}} </p>
                      <!-- 数量 -->
                      <p class="flex-1 tl pr10">{{item.real_combo_num}} {{item.combo_type | vir_combo_type}} </p>
                      <!-- 金额 -->
                      <p class="flex-1 tl pr10">{{((item.real_combo_num/item.combo_num)*item.price).toFixed(2) | NaNf}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">浮动金额:</p>
                        <p class="flex-1 tr">{{fu_total | toTow}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">应付金额:</p>
                        <p class="flex-1 tr">{{total | toTow}}</p>
                  </div>
                </div>
                
               </div>

                  
              
                   
               <!-- 钱 -->
               <div class="base bor" v-show="order_data.order_charge.length">
                  <div class="flex">
                      <p class="flex-2 tl pr10"><b class="blod">收付日期</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">方式</b></p>
                      <p class="flex-1 tl pr10 pl5"><b class="blod">金额</b></p>
                      <p class="flex-4 tl pr10"><b class="blod">流水号</b></p>
                  </div>
                 <div class="bor3 flex flex-m" v-for="(item ,i ) in order_data.order_charge" :key="i">
                    <!-- <p class="flex-3">收费{{i+1}}</p> -->
                   <div class="flex-2 tl pr10"  > {{item.charge_time}}  </div>
                    <div class="flex-1 tl pr10">   {{item.charge_type | charge_type}}</div>
                   <div class="flex-1 tl pr10 pl5">  {{item.price | toTow }}  </div>
                    <div class="flex-4 tl pr10"> {{item.trans_no}} </div>
                 </div>

                    <div class="flex flex-m mt5" >
                   <p class="blod mr10">收付合计:</p>
                    <p >{{chargeTotal | toTow}}</p>
                 </div>

               </div>

               <!-- 服务 -->
                
               <div>
                 <!-- <div class="bor"> 服务明细</div> -->
                 <div class="bor base  "  v-show="order_data.order_service.length">

                    <div class="flex">
                      <p class="flex-3 tl "><b class="blod">服务项目</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">服务起止</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">护理员</b></p>
                  </div>

                    <div class="flex  flex-m "  v-for="(item ,i ) in order_data.order_service" :key="i">
                       <!--  服务产品-->
                      <div class="flex-3 tl ">
                        <!-- {{item.vir_goods_description}} -->
                          <p>{{sliceStr(item.vir_goods_description,2)}}</p>
                        <!-- <p>{{sliceStr(item.vir_goods_description,1)}}</p>
                        <p>{{sliceStr(item.vir_goods_description,0)}}</p> -->
                      </div>
                      <div class="flex-2 tl pr10">
                        {{item.start}} {{item.end=(item.time==0||!item.time)? '': (item.count_type==1?(new Date(new Date(item.start).getTime() + Math.ceil(parseFloat(item.time))*864e5)):item.count_type==2?(new Date(new Date(item.start).getTime() +  Math.ceil(parseFloat(item.time)+1)*864e5)):new Date(item.start)) | Time}}
                      </div>
                      <!-- 服务数量 -->
                      <p class="flex-1 tl pr10">{{item.time}} {{item.vir_combo_type | vir_combo_type}}</p>
                      <!--  护工/护理组 -->
                      <div class="flex-1 tl pr10">
                        <p>{{item.fk_stf_id_name}}</p>
                        <!-- <p class="fs12">9999999999</p> -->
                      </div>
                  
  
                 </div>
                 </div>
                  <p class="tip bor"> 
                   请阅读背面服务协议，签字即同意该协议。
                 </p>
                  <p class="bor1 tip1">
                    开单人员：{{order_data.order_base.fk_stf_q_id_name| empitSelect}}
                  </p>

                   <div class="bor1 tip2">
                    <p>客户或代理</p>
                    <p>人签字：</p>
                  </div>

                   <div class="bor1 tip2">
                    <p>护理员签字：</p>
                  </div>
                   <div class=" base">
                     <div class=""> 打印时间：{{nowDate}} </div>
                     <div  class="">打印单号：{{ print_no }}</div>

                  </div>
                
                

               </div>
            
          </div>
          

        
        

        </div>
   
  
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode'
import moment from 'moment'
import domtoimage from 'dom-to-image';
import orderM from '../../minix/orderM'
import simpleUpload from '@/components/simpleUpload'
import mSearch from '@/components/mSearch'
import basis from './businessOpen/base'
import charge from './businessOpen/charge'
import product from './businessOpen/product'
import service from './businessOpen/service'
import * as utils from '@/utils'
import * as api from '@/api'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
import {mapState,mapGetters,mapActions} from 'vuex'



export default {
  name:'businessOpen',
   mixins:[orderM],
  components:{basis,charge,product,service,mSearch},  
  data () {
    return {
      i:10,
      banColor:'#5bacf9',
      nowDate:moment().format("YYYY-MM-DD   HH:mm"),
      printShow:false,
      print_no:'' , //打印单号
      printDisable:false,
       isOpenshow:false, //根据开单模式改变
       isprint:false, // 是否显示打印
       pk_id:this.$route.query.id || '',  //用户的pk_id      
       //搜索组件参数                      
        searchShow:false,
        searchKey:'',
        searchResult:[],
        searchData:'',  //搜索返回的值 
        searchName:'name',  //默认展示的字段属性

       
        
        //搜索返回的值
        searchID:'',
        searchKEY:'',
        searchNAME:'',

        currentTab:1, //当前Tab 序号 1 基础 2 产品 3 服务  4收费

        //网点ID
        fkHplId:'',

        baseForm:'',  //基础数据
        productForm:'', //产品数据
        serviceForm:'', //服务数据
        chargeForm:'',//收费数据 
        
        changeNum:0,        //记录单价改变次数
        changItem:{
          id:0,
          per_price:0
        },

        initOrderData:{} ,// 初始数据 用来比对改变

        isSubmit:false,
        order_data:{
          change_orders:[],
          order_base:{},
          order_charge:[],
          order_goods:[],
          order_service:[]
        } , //打印订单展示数据
    }
  },
  mounted(){

    if(this.$route.query.custom_id){
       sessionStorage.custom_id = this.$route.query.custom_id
    }
  window.ORDER_this =   this
  let has_new = localStorage.has_new || ''
  if(!has_new){
     this.isSubmit = true
    this.$router.push('/myinfo/openMode')
    return false
  }
 
 //1 : 手工开单  0:电子开单
  if(has_new=='0'){
    this.isOpenshow = false
  }else if(has_new=='1'){
     this.isOpenshow = true

  }

   if(this.pk_id){
     //编辑
           this.isprint=true  
     this.getOrderInfo().then(res=>{
       
      setTimeout(()=>{
      this.initOrderDataMethod()
        if(this.$route.query.id){
          this.printView()
        }
          },200)
        })

   }else{
     //新增
      setTimeout(()=>{
         this.initOrderDataMethod()
       },200)
   }

  },
  beforeRouteLeave: async(to, from, next) => {
    // console.log(window.ORDER_this)
   if(window.ORDER_this.isSubmit) {
      next()
      return 
   }
   let noChange= await window.ORDER_this.leverOrderDataMethod()
   console.log(noChange)
    if(!noChange){
     next(confirm('确认不保存修改直接离开么？'))
    }else{
     next()
    }
     
  },
  beforeDestroy(){
  
    this.setOrederBase({})
    this.setOrederCharge([])
    this.setOrederGoods([])
    this.setOrederService([])
    this.setChangeOrders([])
  },
  destroyed(){
    window.ORDER_this=""
  },
  methods:{
   
     ...mapActions(['setOrederBase','setOrederCharge','setOrederGoods','setOrederService','setChangeOrders']),

    //处理搜索结果 
    handleSearch(data,key){
     //console.log(data,key)
     this.searchData = JSON.stringify({
       searchData:data, 
       key:key
     })
    },


    //打印机打印
    print(){
     //  this.printShow=true  //调试订单图片
     
       let IsOP = IsOpened()
       if(IsOP==1){
         this.printDisable = true
         let date = moment().format('YYYY-MM-DD')
          //打印操作
           //alert(111) 
         this.chanceImg()
        // PrintText(this.order_data,date)
        //  setTimeout(()=>{this.printDisable = false},5000)
         this.i = 10
         let time = setInterval(()=>{
              this.i = this.i-1
              if(this.i<=0){
                 this.printDisable = false
                clearInterval(time)
              }
               
         },1000)

       }else{
         showDeviceList()
         
       }  
    },
    

    
    //生成条形码
    chanceCode(){
      JsBarcode("#bcode",this.order_data.order_base.order_no,{
        format: "CODE128B", 
        displayValue:false,
        height:50,
        })
    },
    //变图片测试
    chanceImg(){
      //print
      // alert(222) 
      this.printShow=true
      let that = this
      let nodeDome = document.getElementById('print1')
       let pritimg = document.getElementById('pritimg')
      domtoimage.toPng(nodeDome,{ quality: 1 })
      .then(function (dataUrl) {
          
        //  console.log(dataUrl)
          // alert(dataUrl.length)
       
        // alert(dataUrl.length) 
        let status =  window.Printer.getstatus()  //0 打印准备就绪 1打印中 2缺纸 6打印机开盖  其他出错
        
        //alert(status)
        if(status==1){
          return 
        }else if(status!=0){
          window.Printer.Abort()

        }
        let num = sessionStorage.print_num || '2'
         let pageLeng = '1820' 
          if(that.isrqhl){
            pageLeng = '1598' 
          }else{
            pageLeng = '1804' 
          }
         window.Printer.printAreaSize("0","200","200",pageLeng,num)
         window.Printer.Expanded3("0","0",dataUrl,0);
       
        
        setTimeout(()=>{
         that.printShow=false
        },500)
           
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });

    },
    
    //点击标签业
    tabCallback(label,tabkey){
     let last = this.currentTab 
     if(last==1){   
       this.$refs['basis'].saveData()   
        
     }else if(last==2){
        this.$refs['product'].saveData()   
     }else if(last ==3){
       this.$refs['service'].saveData()
     }else if(last ==4){
       this.$refs['charge'].saveData()
     }
      this.currentTab = tabkey
    },

    //下一步 
    next(){
     let last = this.currentTab 
     if(last==1){   
       this.$refs['basis'].saveData()    
     }else if(last==2){
        this.$refs['product'].saveData()   
     }else if(last ==3){
       this.$refs['service'].saveData()
     }else if(last ==4){
       this.$refs['charge'].saveData()
     }

     if(this.currentTab>=4){
       this.currentTab=1
     }else{
       this.currentTab++
     }
    // console.log(this.currentTab)
    },

        //上一步 
    prev(){
     let last = this.currentTab 
     if(last==1){   
       this.$refs['basis'].saveData()    
     }else if(last==2){
        this.$refs['product'].saveData()   
     }else if(last ==3){
       this.$refs['service'].saveData()
     }else if(last ==4){
       this.$refs['charge'].saveData()
     }

     if(this.currentTab<=1){
       this.currentTab=4
     }else{
       this.currentTab--
     }
    // console.log(this.currentTab)
    },

    //提交订单 (v有值不跳转页面)
    submitOrder(v){
       
      this.$refs['basis'].saveData()    
    
      this.$refs['product'].saveData()   
     
      this.$refs['service'].saveData()
     
      this.$refs['charge'].saveData()
     
     let order_base = this.$store.getters.order_base
     let order_charge = this.$store.getters.order_charge
     let order_goods = this.$store.getters.order_goods
     let order_service = this.$store.getters.order_service
     let change_orders = this.$store.getters.change_orders
     let has_pay = this.$store.getters.has_pay
     let total = this.$store.getters.total
     order_base.total=total
     order_base.has_pay=has_pay
    // order_base.has_new = localStorage.has_new || ''  //开单模式

     let order_data={order_base,order_charge,order_goods,order_service,change_orders}
  // console.log(this.initOrderData)
    // console.log(JSON.stringify(order_data))
    
    if(this.initOrderData==JSON.stringify(order_data)){
     if(v){
        
        this.print() //打印
        return false
     }else{
       this.success('保存成功')
        setTimeout(()=>{
           this.isSubmit = true
          this.$router.go(-1)
        },1000)
       return false
     }
     
    }
     if(this.pk_id){
      this.updateOrderInfo({order_data},v).then(res=>{
        //打印
        console.log(res)
         if(!res){
          return false
        }
        this.printDataChange(res) //打印加新数据更新

      })
     }else{
      this.createOrder({order_data},v).then(res=>{
        //打印
        console.log(res)
        if(!res){
          return false
        }
        let data = res.data
        this.pk_id = data.order_base.pk_id
        if(!this.$route.id){
          this.$refs['basis'].pk_id = this.pk_id
     
        }
        this.printDataChange(res) //打印加新数据更新

      })
     }
     
    },

    //保存订单开始初使数据
    initOrderDataMethod(){
       
      this.$refs['basis'].saveData()    
    
      this.$refs['product'].saveData()   
     
      this.$refs['service'].saveData()
     
      this.$refs['charge'].saveData()
     
     let order_base = this.$store.getters.order_base
     let order_charge = this.$store.getters.order_charge
     let order_goods = this.$store.getters.order_goods
     let order_service = this.$store.getters.order_service
     let change_orders = this.$store.getters.change_orders
     let has_pay = this.$store.getters.has_pay
     let total = this.$store.getters.total
     order_base.total=total
     order_base.has_pay=has_pay
   //  order_base.has_new = localStorage.has_new || ''  //开单模式

     let order_data={order_base,order_charge,order_goods,order_service,change_orders}
     //console.log(order_data)
     
     this.initOrderData = JSON.stringify(order_data)
     
    },
    

    //离开订单判断改变
    leverOrderDataMethod(){
       
      this.$refs['basis'].saveData()    
    
      this.$refs['product'].saveData()   
     
      this.$refs['service'].saveData()
     
      this.$refs['charge'].saveData()
     
     let order_base = this.$store.getters.order_base
     let order_charge = this.$store.getters.order_charge
     let order_goods = this.$store.getters.order_goods
     let order_service = this.$store.getters.order_service
     let change_orders = this.$store.getters.change_orders
     let has_pay = this.$store.getters.has_pay
     let total = this.$store.getters.total
     order_base.total=total
     order_base.has_pay=has_pay
     //order_base.has_new = localStorage.has_new || ''  //开单模式
         
     let order_data={order_base,order_charge,order_goods,order_service,change_orders}
     
     this.order_data = JSON.parse(JSON.stringify(order_data)) 

    //  console.log(this.initOrderData)
    //  console.log(JSON.stringify(order_data))
    //  console.log()
      return this.initOrderData==JSON.stringify(order_data)
     
    },



    
    //浏览打印
    printView(){
      this.leverOrderDataMethod()
      
      this.isprint=true  
       this.chanceCode()
    },
    
    //打印的上一步
    printViewPrev(){
      this.leverOrderDataMethod()
      this.isprint=false
    },


    //监听单价改变次数
    watchChangeNum(id,per_price){
      this.changeNum++
      this.changItem.id=id
      this.changItem.per_price=per_price
    },

    //显示搜索框
    showSearch(info){
      console.log(info)
      this.searchData='{}'
      this.searchKey = info.searchKey
      this.searchResult=info.result
      this.searchName=info.name || 'name'
      this.searchShow=true

    },

    //订单新增
    createOrder(data,v){
     return api.createOrder(data).then(res=>{

       
        let ORDER_INFO = {
          dub_name:data.order_data.order_base.dub_name,
          fk_hpl_id:data.order_data.order_base.fk_hpl_id,
          fk_dub_id:data.order_data.order_base.fk_dub_id,
          
          group_id:data.order_data.order_base.group_id,
          group_name:data.order_data.order_base.group_name,

          pattern:data.order_data.order_base.pattern,
          work_type:data.order_data.order_base.work_type,

        }
        localStorage.ORDER_INFO = JSON.stringify(ORDER_INFO)

        if(v){
          //打印预览
          return res
        }else{
        this.success('添加成功')
         console.log(res)
         sessionStorage.orderKey = 'add'

         let {pk_id,order_no,patient_name,patient_sex,dub_name,bed,bill_time} = res.data.order_base
         let goods = res.data.order_goods
         sessionStorage.order_goods = JSON.stringify({order_no,patient_name,patient_sex,dub_name,bed,bill_time,goods})
        setTimeout(()=>{   
          this.isSubmit = true
          this.$router.go(-1)
        },1000)
        return false

        }
       
      })
    },

    //订单修改
    updateOrderInfo(data,v){
     
     return api.updateOrderInfo(data).then(res=>{
        if(v){
          //打印预览
            console.log(v)
          return res
        
        }else{
         
           this.success('修改成功')
           sessionStorage.orderKey = 'edit'
           sessionStorage.order_goods = JSON.stringify(res.data.order_goods)
           console.log(res)
        setTimeout(()=>{
           
           this.isSubmit = true
          this.$router.go(-1)
        },1000)
         return false

        }
       
      })
    },

    //订单明细
    getOrderInfo(){
     return  api.getOrderInfo(this.pk_id).then(res=>{
        console.log(res)
        let data = res.data.data
        this.setOrederBase(data.order_base)
        this.setOrederCharge(data.order_charge)
        this.setOrederGoods(data.order_goods)
        this.setOrederService(data.order_service)
        
        this.setChangeOrders(data.change_orders || [] )

        this.$refs['basis'].form =JSON.parse(JSON.stringify(data.order_base)) 
        this.$refs['basis'].change_orders =JSON.parse(JSON.stringify(data.change_orders)) 
        this.getDubList(JSON.parse(JSON.stringify(data.order_base)).fk_hpl_id)
        this.$refs['product'].form =JSON.parse(JSON.stringify(data.order_goods)) 
        this.$refs['service'].form =JSON.parse(JSON.stringify(data.order_service)) 
        this.$refs['charge'].form =JSON.parse(JSON.stringify(data.order_charge))
        this.print_no =  data.print_no

         return res

      })
    },
    //打印时获取新数据后的数据更新赋值
    printDataChange(res){
       let data = res.data
        this.setOrederBase(data.order_base)
        this.setOrederCharge(data.order_charge)
        this.setOrederGoods(data.order_goods)
        this.setOrederService(data.order_service)
        
        this.setChangeOrders(data.change_orders || [] )

        this.$refs['basis'].form =JSON.parse(JSON.stringify(data.order_base)) 
        this.$refs['basis'].change_orders =JSON.parse(JSON.stringify(data.change_orders)) 
        this.getDubList(JSON.parse(JSON.stringify(data.order_base)).fk_hpl_id)
        this.$refs['product'].form =JSON.parse(JSON.stringify(data.order_goods)) 
        this.$refs['service'].form =JSON.parse(JSON.stringify(data.order_service)) 
        this.$refs['charge'].form =JSON.parse(JSON.stringify(data.order_charge))
        this.print_no =  data.print_no

        this.print() //打印
         setTimeout(()=>{
         this.initOrderDataMethod()
       },200) 

    },

    //获取科室数据
      getDubList(fk_hpl_id){     
        return  api.getDubList([fk_hpl_id]).then(res=>{          
              this.$refs['basis'].fk_dub_list = res.data
             return res
         })
      },

      //截取产品字段 v 1 为一级 0为描述 2
       
      sliceStr(str,v){
       let arr = str.split('/')
       if(arr.length<5){
         return str
       }
       if(v==1){
         return arr[1]
       }else if(v==0){
         arr.shift()
         arr.pop()
         return arr.join('/')
       }else if(v==2){
          arr.shift()
        
         return arr.join('/')

       }
      }

    
   
  },
  computed:{
      //应付金额
      total(){
        let total = 0
        let arr = this.order_data.order_goods.map(i=>i.real_total)
        if(!arr.length){return 0.00}
       // console.log(arr,11)
        arr.forEach(i=>{
            let num = (isNaN(i) || !i) ? 0 : parseFloat( i) 
            total+=num
        })
        return total
      },

      //收费总计
      chargeTotal(){
        let arr = this.order_data.order_charge.map(i=>i.price)
        if(!arr.length){return 0.00}
        return arr.reduce((total, num)=>{
            num = isNaN(num) ? 0 :num
            num = num || 0
            num = num<0? 0 :num
           return  parseFloat(total)+parseFloat(num)
            })  
      },
      

      //浮动金额(未完成)
      fu_total(){
        let total = 0
        let allTotal =0 //总价浮动
        let sTotal = 0  //单价浮动
        let arr = this.order_data.order_goods.map(i=>i.total_discount)
        if(!arr.length){return 0.00}
       // console.log(arr,11)
        arr.forEach(i=>{
            let num = (isNaN(i) || !i) ? 0 : parseFloat( i)  
            allTotal+=num
        })
        this.order_data.order_goods.forEach((item,i)=>{
           let  v = (isNaN(item.discount) || !item.discount) ? 0 : parseFloat(item.discount) 
           let num = (isNaN(item.real_combo_num) || !item.real_combo_num) ? 0 : parseFloat(item.real_combo_num) 
            sTotal+=v*num
        })
         
         
        return (allTotal+sTotal).toFixed(2)

      }
  },
  watch:{
   printDisable(v){
    if(!v){
      this.banColor = '#5bacf9'
    }else{
      this.banColor = '#85bdf3'
    }
   }
  }
}

</script>
<style lang='scss' scoped>
.print {
  background: #fff;
  padding: 0.3rem;
}
.bor {
  
  border-bottom: 4px solid #999;
 
}

.bcode{
  width: 80%;
  height: auto;
}

.title{
  font-size: 0.37rem;
  text-align: center;
  padding-bottom: 0.2rem;
   padding-top: 0.1rem;
  
  
}
.bcodeF{
  padding: 0.1rem;
  p{
    padding-left: 0.1rem;
    font-size: 0.29rem;
  }
}
.blod{
  font-weight: bold;
}
.base{
  padding: 0.2rem 0;
  font-size: 0.27rem;
}
.tip{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.36rem;
}
.tip1{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.31rem;
  
}

.tip2{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.31rem;
  height: 1.2rem;
}

.bor1{
  
  border-bottom: 4px dashed #999;
}

.bor3{
  padding-bottom: 0.1rem;
  padding-top: 0.1rem;
   border-bottom: 4px dashed #999;
}
.bor3:last-child{
   border-bottom:none !important;
}
.pritimg{
  width: 1100px;
  height: auto;
}

.print1{
   background: #fff;
   padding: 0.3rem;
   width: 1200px;
   
   .base{
     font-size: 0.45rem;
   }
   .tip{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.56rem;
}
.tip1{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.45rem;
  
}

.tip2{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.54rem;
  height: 2.4rem;
}
.title{
  font-size: 0.6rem;
  text-align: center;
  padding-bottom: 0.2rem;
   padding-top: 0.1rem;
}
.bcodeF{
  p{
 font-size: 0.45rem;
  }
 

}

}
.ban{
 background: #5bacf966
}

</style>