<!-- 业务开单-收费 -->
<template>
  <div>
     
     <yd-cell-group class="mt10 mb0">
        <yd-cell-item>
            <h4 slot="left" class="title">收费总金额:{{total | NaNf}}(元)</h4>
            <div slot="right" v-show="false" class="pr10 pl20" @click="addForm"><span  class="icon_add">+</span></div>
        </yd-cell-item>
    </yd-cell-group>

    <yd-cell-group class="mt10 mb0" v-for="(item,i) in form" :key="i">
         <yd-cell-item>
            <span slot="left">收款({{i+1}})</span>
             <yd-icon @click.stop.native='delForm(i)'  slot="right" class="pl20 pr10" color="#333" size="0.4rem" name="delete"></yd-icon>
        </yd-cell-item>
         <yd-cell-item  type="label">
            <b slot="left">类型：</b>
            <yd-radio-group  slot="left" v-model="item.charge_type" :color="blue">
                <yd-radio val="1" class="mr20">收费</yd-radio>
                <yd-radio val="2">退款</yd-radio>
                <yd-radio val="3">付费</yd-radio>
            </yd-radio-group>
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">金额（元）:</b>
            <input slot="right" type="number" @change="change_price($event,i)" v-model="item.price">
        </yd-cell-item>
       
        <yd-cell-item>
            <b slot="left">收费日期:</b>
            <yd-datetime type="date" v-model="item.charge_time" slot="right"></yd-datetime>
        </yd-cell-item>
      <yd-cell-item  type="label">
            <b slot="left">付款方式：</b>
            <yd-radio-group  slot="left" v-model="item.pay_type" :color="blue">
              <div class="mt10">
                <yd-radio class="mr20" val="1">现金</yd-radio>
                <yd-radio val="2">银行卡</yd-radio>
              </div>
               <div class="mt10 mb10" >
                <yd-radio val="3" class="mr20">微信</yd-radio>
                <yd-radio val="4">支付宝</yd-radio>
               </div> 
            </yd-radio-group>
        </yd-cell-item>  
        <!-- <yd-cell-item>
            <b slot="left">状态:</b>
            <span slot="left" class="no">未支付</span>
            <yd-button slot="right" :bgcolor="blue" color="#fff" class="w40" >催款</yd-button>
        </yd-cell-item> -->
        <yd-cell-item>
            <b slot="left">流水号:</b>
            <input slot="right" type="text" v-model="item.trans_no">
        </yd-cell-item>
       
        <yd-cell-item class="remark">
              <b slot="left">备注:</b>
            <yd-textarea slot="right" v-model="item.item" placeholder="请输入备注" maxlength="100"></yd-textarea>
        </yd-cell-item>
    
        <yd-cell-item>
            <b slot="left" @click='showSearch_fk_stf_c_id_name(i)' >操作人:</b>
            <span class="_span" @click='showSearch_fk_stf_c_id_name(i)' slot="left" >{{item.fk_stf_c_id_name}}</span>
           
        </yd-cell-item>
    </yd-cell-group>
    
     <div class="mt10 tc">
         <yd-button :bgcolor="blue" @click.native="addForm" color="#fff"> 添加收费</yd-button>
    </div>
   
  </div> 
</template>

<script>
import * as api from '@/api'
import orderM from '@/minix/orderM'
import moment from 'moment'
import {mapState,mapGetters,mapActions} from 'vuex'
export default {
    props:['searchData','showSearch'],
 
  mixins:[orderM],
  data () {
    return {
      index:-1,
      order_base:{},  
      form:[],
      formItem:{
        pk_id:'' ,// 订单收付id
        order_id:'' ,// 订单id
        price:'0' ,// 金额  必填
        charge_time:moment().format('YYYY-MM-DD'),//  收付日期  必填
        charge_type:'1' ,// 收付类型 1:收费 2:退费 3:付费   必填
        pay_type:'1' ,// 付款方式   1:现金 2:银行转账 3:微信 4:支付宝 5:其他   必填
        fk_stf_c_id:this.$store.state.userinfo.pk_id ,//收银员id    必填
        fk_stf_c_id_name:this.$store.state.userinfo.name, //收银员名字
        pay_status:'0' ,// 付款状态   0：未支付  1：已支付   
        trans_no:'',  //流水号
        item:'' , //备注
      }
    }
  },
  mounted(){
      
  },
  methods:{
      ...mapActions(['setOrederCharge','setHasPay']),
      saveData(){
          console.log('saveData--setOrederCharge')
          this.setOrederCharge(this.form)
          this.setHasPay(this.total)
      },

      //显示 操作员 搜索框
      showSearch_fk_stf_c_id_name(i){
         this.index=i
         this.order_base = this.$store.getters.order_base
         let fk_hpl_id =  this.order_base.fk_hpl_id 
         this.getStaffs(fk_hpl_id).then(res=>{
             let searchData={
                    result:res.data,
                    searchKey:'fk_stf_p',
                    name:'name'
                }
              this.$emit('showSearch',searchData)      
         })
      },

      //获取操作员 信息 
      getStaffs(fk_hpl_id){
       return  api.getStaffs({fk_hpl_id}).then(res=>res) 

      },
      //监听金额改变
      change_price(e,i){
          console.log(i)
          if( !this.form[i].price){
               this.form[i].price = 0
          }
          if(this.form[i].charge_type==1){
              if(parseFloat(this.form[i].price)<0){
                  this.form[i].price = 0
              }
          }
          else if(this.form[i].charge_type==2 || this.form[i].charge_type==3){
               if(parseFloat(this.form[i].price)>0){
                  this.form[i].price = -this.form[i].price
              }

          }
      }

    
  },
  computed:{
      total(){
        let arr = this.form.map(i=>i.price)
        if(!arr.length){return 0.00}
        return arr.reduce((total, num)=>{
            num = isNaN(num) ? 0 :num
            num = num || 0
           return  parseFloat(total)+parseFloat(num)
            })  
      }
  },
  watch:{

              //处理返回的值
   searchData(v){    
       v = JSON.parse(v)  
       if(v.key=='fk_stf_p'){
           console.log(v,'返回的结果')
           
            this.form[this.index].fk_stf_c_id_name=v.searchData.name
            this.form[this.index].fk_stf_c_id=v.searchData.pk_id || 0


       }
   }
     

      
  }
}

</script>
<style lang='scss' scoped>
</style>