<!-- 订单管理 -->
<template>

<div  id="lybox" class="Bopen h100" @click.stop="showOpenBtnShow()">
 <yd-layout >   
    <mSelect ref="mselect"  :showItem="showItem" @search="search" />
    <yd-tab v-model="tab" :callback="tabCBK" :active-color="blue" class="formItem " >
        <yd-tab-panel label="全部" ref="orderTab" active  tabkey=""></yd-tab-panel>
        <yd-tab-panel label="待服务" ref="orderTab"   tabkey="1"></yd-tab-panel>
        <yd-tab-panel label="服务中" ref="orderTab"   tabkey="2"></yd-tab-panel>
        <yd-tab-panel label="待结算" ref="orderTab"   tabkey="3"></yd-tab-panel>
        <yd-tab-panel label="已完成" ref="orderTab"   tabkey="4"></yd-tab-panel>
        
        
        
    </yd-tab>
    <!-- 订单 -->
     <yd-pullrefresh :callback="downloadList" ref="pullrefreshDemo"> 
    <div class="order formItem">
         <yd-infinitescroll :callback="getOrderList" ref="infinitescrollDemo">
                 <yd-list theme="1" slot="list">
                      <swipeout class="mb5" :id="'order'+i" v-for="(item , i ) in pageData" :key="i" @click.native='goRouter(item.pk_id,i)'>
                            <swipeout-item  :sensitivity="2">
                                <div slot="right-menu">
                               
                                <swipeout-button @click.native.stop="delOrder(item,i)" type="warn">删除</swipeout-button>
                                </div>
                                <div slot="content" class="demo-content">
                                    <yd-preview :buttons="[]" class="pt10 pb10" >
                                        <div class="flex flex-m  pr10" style="justify-content:space-between">
                                            <div class="flex">
                                                <h4 class="flex-1">订单号<span>{{item.order_no}}</span></h4>
                                                
                                               
                                            </div>
                                             <div class="flex-1 tr">签约：{{item.bill_time}}</div>
                                            <!-- <div  v-if="!item.endtime"><h4 class="doing">未结算</h4></div> -->
                                            <!-- <div slot="right" v-if="item.endtime"><h4 >已结算</h4></div> -->
                                        </div>
                                        <div class="flex pl5 pr10" style="justify-content:space-between">
                                            <div class="flex w100p">
                                                <div class="">
                                                  {{item.patient_name}} ({{item.patient_sex | sex}}) {{item.dub_name}} <span v-show="item.bed">{{item.bed}}床</span>   
                                                </div>

                                                <div class="flex-1 tr">{{item.patient_phone}}</div>
                                               
                                            </div>
                                               
                                            </div>
 
                                            <div v-for="(ite,i ) in item.goods" :key="i" class="flex  w100p pl5 pr5">
                                                <div class="flex-1">{{ite.description}}</div>
                                                <div class="flex-1 flex tr">
                                                    <div class="flex-3">{{ite.price|toInt}}元/{{ite.combo_type}}</div>
                                                    <div class="flex-2">{{ite.num|toTow}}{{ite.combo_type}}</div>
                                                    <div class="flex-2">{{computedTotal(ite.price , ite.num) |toInt }}元</div>
                                                </div>

                                            </div>
                                            <div v-show="!item.goods.length" class="tl pl5 pt5"> 
                                                无产品信息

                                            </div>
                                      
                                            
                                      
                                       
                                    </yd-preview>
                                </div>
                            </swipeout-item>
                        </swipeout>





                      
                 </yd-list>
         
            </yd-infinitescroll>   

    </div>
    <!-- 预约单 -->
    <!-- <div class="formItem" v-show="!orderShow">
          <yd-preview :buttons="[]" class="pt10 mt10">
                <yd-preview-item>
                    <div slot="left"><span class="doing">预约时间</span><span>2018.01.09</span></div>
                    <div slot="right"><yd-button size="small" class="s" bgcolor="#f5a623" color="#fff">业务开单</yd-button></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><span class="doing">预约产品</span><span>未知</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
            </yd-preview>

            <yd-preview :buttons="[]" class="pt10 mt10">
                <yd-preview-item>
                    <div slot="left"><b>王荣</b><span >13934569594</span></div>
                    <div slot="right"><yd-button size="small"   :bgcolor="blue" color="#fff">查看订单</yd-button></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >预约产品</i><span>月嫂</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                 <yd-preview-item>
                    <div slot="left"><i >预约时间</i><span>2018.01.09</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >地址</i><span>安徽省合肥市蜀山区创新产业园</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >备注</i><span>该客户需要育婴嫂 宝宝目前3个月大</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >状态</i><span class="done">已成交</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
            </yd-preview>

            <yd-preview :buttons="[]" class="pt10 mt10">
                <yd-preview-item>
                    <div slot="left"><b>王荣</b><span >13934569594</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >预约产品</i><span>月嫂</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                 <yd-preview-item>
                    <div slot="left"><i >预约时间</i><span>2018.01.09</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >地址</i><span>安徽省合肥市蜀山区创新产业园</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >备注</i><span>该客户需要育婴嫂 宝宝目前3个月大</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >状态</i><span >已成交</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
            </yd-preview>

            <yd-preview :buttons="[]" class="pt10 mt10">
                <yd-preview-item>
                    <div slot="left"><b>王荣</b><span >13934569594</span></div>
                    <div slot="right"><yd-button size="small" class="s"  :bgcolor="blue" color="#fff">处理</yd-button></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >预约产品</i><span>月嫂</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                 <yd-preview-item>
                    <div slot="left"><i >预约时间</i><span>2018.01.09</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >地址</i><span>安徽省合肥市蜀山区创新产业园</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >备注</i><span>该客户需要育婴嫂 宝宝目前3个月大</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><i >状态</i><span class="doing">已成交</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
            </yd-preview>

    </div> -->

      <!-- 返回顶部 -->
     <yd-backtop></yd-backtop>
     </yd-pullrefresh>
        <yd-tabbar slot="tabbar" class="openBtn" >
            <yd-button size="large"   :bgcolor="blue" color="#fff" shape="circle" @click.native="$router.push('/businessOpen')">业务开单</yd-button>
        </yd-tabbar>

    </yd-layout>
     
  </div>

</template>

<script>
import keepData from './M_keepData.js'
import * as api from '@/api/orderM'
import mSelect from '../../components/mSelect'
export default {
  name:'orderList',
  components:{mSelect},
  mixins:[keepData],
  data () {
    return {
       tab:0,
       orderShow:true,
       order_status:'', //订单状态   0:未知 1:待服务 2:服务中 3:待结算 4:已完成
       custom_id:this.$route.query.custom_id || '', //通过客户路由过来的客户id
       openBtnShow:true, //业务开单按钮
       showItem:[], //mselect 参数
       orderShowItem:['is_end','start','end','order_no','fk_hpl_id','fk_dub_id','group_id','patient_name'],
       yuOrderShowItem:['start','end','fk_hpl_id','fk_dub_id','group_id','search','server_start','good_cate'], //'is_end'是否结算已经隐藏
    //    yuOrderShowItem:['is_end','start','end','fk_hpl_id','fk_dub_id','group_id','patient_name','patient_phone','select']
    }
  },

  mounted(){
      if(sessionStorage.getItem('orderMPI')){
          this.pageInfo = JSON.parse( sessionStorage.getItem('orderMPI')) 
      }
      this.getOrderList()
  },
 methods:{
     //业务开单按钮的展示
     showOpenBtnShow(flag){  
        try{
         this.openBtnShow=this.$refs['orderTab'].classes
          }catch(err){
            this.openBtnShow=''
         }     
     },

     //获取订单列表
     getOrderList(){
         Object.assign(this.pageInfo,{custom_id:this.custom_id})
         api.getOrderList(this.pageInfo).then(res=>{
           console.log(res)
           this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
           this.handelScrollResult(res)
         })
     },
     //过滤
     search(v){
    //  console.log(this.pageInfo,v)
      this.pageData=[]
      this.pageInfo.page=1
      this.clearScrollResult()
      Object.assign(this.pageInfo,v,{order_status:this.order_status})
     // console.log(this.pageInfo,111111111)
      sessionStorage.orderMPI = JSON.stringify(this.pageInfo)
      this.getOrderList()
     },
   

     // 标签页回调
     tabCBK(label,key){
       //  console.log(label,key)
        this.pageInfo.page=1  
        this.pageData=[]
        this.order_status = key
        this.clearScrollResult()
        this.$refs.mselect.submit()

        
      
        
     },
     
     //删除订单操作
     delOrder(item,i){
      
       this.$dialog.confirm({
                    title: '删除提示',
                    mes: `是否确定删除订单号为${item.order_no}的订单？`,
                    opts: () => {
                       this.ordersDelete(item.pk_id,i)
                    }
                })
     },
     //删除订单Api
     ordersDelete(id,i){
        api.ordersDelete(id).then(res=>{
            this.success('删除成功')
            this.pageData.splice(i,1)
        }) 
     }

 },
 watch:{
     //通过开单按钮的状态来切换筛选的状态
   openBtnShow(v){
       this.showItem = v?this.orderShowItem:this.yuOrderShowItem
   }  
 }

}

</script>
<style lang='scss' scoped>
.openBtn{
    position: relative;
    bottom: 0px;
    z-index: 10;
    width:100%;

}
.bh100{
    height: 100% ;
   
}
.mh17{
   min-height: 6rem;
}
</style>