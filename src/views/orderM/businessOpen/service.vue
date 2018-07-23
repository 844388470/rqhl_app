<!-- 业务开单-服务 -->
<template>
  <div>
    <!-- <yd-cell-group class="mt10 mb0">
        <yd-cell-item>
            <h4 slot="left" class="title">服务产品</h4>
            <div slot="right" v-show="false" class="pr10 pl20" @click="addForm"><span  class="icon_add">+</span></div>
        </yd-cell-item>
    </yd-cell-group> -->

    <yd-cell-group class="mt10 mb0" v-for="(item,i) in form" :key="i" >
           <yd-cell-item class="pro" @click.native='showSearch_pro_ser(i)'>
                <b slot="left"  >服务产品({{i+1}}):</b>
                <span class="_span"  slot="left" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden" >{{item.vir_goods_description}}</span>
                <yd-icon slot="right" @click.stop.native='delForm(i)' class="pl20 pr10" color="#333" size="0.4rem" name="delete"></yd-icon>
           </yd-cell-item>
           
           <yd-cell-item  type="label">
            <b slot="left">计时方式：</b>
            <yd-radio-group  slot="left" v-model="item.count_type" :color="blue">
                <yd-radio  v-show="item.vir_type=='1'" val="1" class="mr20">12个小时</yd-radio>
                <yd-radio  v-show="item.vir_type=='1'" val="2">24小时</yd-radio>
                 <yd-radio v-show="item.vir_type!='1'" val="3">计量方式</yd-radio>
            </yd-radio-group>   
        </yd-cell-item>
         <yd-cell-item>
                <b slot="left">开始时间:</b>
                 <yd-datetime type="date"  v-model="item.start"  slot="right"></yd-datetime>
           </yd-cell-item>
            <yd-cell-item>
                <div slot="left">
                    <b >服务数量({{item.vir_combo_type | vir_combo_type}}):</b>
                    <input @input="notMinus" @focus="focus_time" @change="change_time($event,i)" type="number"  v-model="item.time" >
                </div>
                <div slot="left">
                   <b >实际单价:</b>
                     <span class="_span" slot="left">{{(parseFloat(item.per_price)).toFixed(2) | NaNf}} </span>
                     
                </div>
           </yd-cell-item>
            <yd-cell-item>
                <b slot="left">结束时间:</b>
                <span class="_span" slot="left">
                  <span v-show="item.time!=0||item.time">  {{item.end=(item.time==0||!item.time)? '': (item.count_type==1?(new Date(new Date(item.start).getTime() + Math.ceil(parseFloat(item.time-1))*864e5)):item.count_type==2?(new Date(new Date(item.start).getTime() +  Math.ceil(parseFloat(item.time))*864e5)):new Date(item.start)).toISOString().slice(0,10)}}</span>
                </span>
           </yd-cell-item>
          
            <yd-cell-item>
                <b slot="left">服务金额小计：</b>
                <span class="_span ml15" slot="left">{{item.server_amount=(item.per_price * Math.ceil(parseFloat(item.time))).toFixed(2) | NaNf}}</span>
                           
           </yd-cell-item>
           <yd-cell-item  @click.native='showSearch_fk_stf(i)'>
                <b slot="left"  >护工/护理组:</b>
                <span class="_span" slot="left" >{{item.fk_stf_id_name}}</span>
           </yd-cell-item>
            <yd-cell-item>
                <b slot="left">护工所得:</b>
                 <input   slot="right" type="number"  v-model="item.staff_pay" >
             

           </yd-cell-item>
    </yd-cell-group>

     <div class="mt10 tc">
         <yd-button :bgcolor="blue" @click.native="addForm" color="#fff"> 添加服务</yd-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as api from '@/api'
import {mapState,mapGetters,mapActions} from 'vuex'
import orderM from '../../../minix/orderM'
export default {
   props:['searchData','showSearch','changeNum','changItem'],
  mixins:[orderM],
  data () {
    return {
       _time:0, // 记录当前操作的数量
      index:-1, //当前操作的序号
      form:[],
      order_base:{},
      order_goods:[],
      formItem:{
        order_id:'',  
        pk_id:'' , //订单服务id  
        virtual_good_id:'' , //虚拟的订单产品id   对应订单产品的虚拟id 
        order_goods_id:'' , //订单产品id 
        goods_id:'' , //产品id   必填 
        start:moment().format('YYYY-MM-DD') , //服务开始时间   必填
        end:'' , //服务结束时间
        time:'0' , //天数 
        fk_stf_id:'' , //护工id/护理组id   必填 
        staff_pay:'' , //护工所得 
        pattern:'' , //护理模式  
        per_price:'' , //每单位数量单价 
        price:'',
        server_amount:'' , //服务金额小计   per_price*time
        count_type:'1',  //计时方式   必填
        pay_type:'',    //结算方式    对应基础信息的护工薪酬    1：月结   2：日结

        vir_goods_description:'',  //展示的服务产品名
        vir_combo_type:'',         //单位   
        vir_staff_pay:'',          //每单位护工所得
        fk_stf_id_name:'',     //护工/护理组
        vir_type:'1'     //产品类型

        //
      }

    }
  },
   mounted(){
      if(this.isrqhl){
          
          this.formItem.count_type = '1'
      }else{
            this.formItem.count_type = '2'
      }
     
  },
  methods:{
       ...mapActions(['setOrederService']),
      saveData(){
          console.log('saveData--setOrederService')
          this.setOrederService(this.form)
      },
      
      //显示服务产品搜索框
      showSearch_pro_ser(i){
          this.index=i
          this.order_goods = this.$store.getters.order_goods
          if(this.order_goods.length){
              let searchData={
                    result:this.order_goods.filter(i=>i.type!=2),
                    searchKey:'pro_ser',
                    name:'goods_description'
                }
              this.$emit('showSearch',searchData)
            
          }else{
              this.error('请选择产品')  
          }

      },

      //显示护工/护理组搜索框
      showSearch_fk_stf(i){
         this.index=i
         //护理模式 pattern
         let pattern = this.form[this.index].pattern 
         
         if(pattern){
          this.getPatternList(pattern).then(res=>{
              console.log(res)

              let searchData={
                    result:res.data,
                    searchKey:'fk_stf',
                    name:'name'
                }
              this.$emit('showSearch',searchData)
              
          })


         }else{
             this.error('请选择服务产品')
         }
      },
      
      //获取护工/护理组 数据
      // 如果护理模式为1，fk_stf_id 获取的接口为护理组的
      //如果护理模式为2，fk_stf_id 获取的接口为护工的
      getPatternList(i){
          this.order_base = this.$store.getters.order_base
          let fk_hpl_id =  this.order_base.fk_hpl_id 
          if(!fk_hpl_id){
              this.error('请先选择网点')
              return false
          }
          if(i==1){
            
            return api.getGroupList([fk_hpl_id]).then(res=>res)
          }else if(i==2){
            return api.getStaffs({fk_hpl_id}).then(res=>res) 
          }

      },

      //记录操作时的数量
      focus_time(event){
         this._time=event.target.value

      },

      //监听改变的数量
      change_time(event,i){
         
        let value = event.target.value
        console.log(event.target.value)
        if( !this.form[i].time){ this.form[i].time= 0 }
        let id = this.form[i].virtual_good_id || this.form[i].order_goods_id
        console.log(id,'id')
        this.order_goods = this.$store.getters.order_goods
        let order_goods = this.$store.getters.order_goods
        let maxNum = 0
        let curNum = 0
        console.log(order_goods,arr,'arr')
        let arr =order_goods.filter(i=>{
            return (i.pk_id==id ||i.virtual_good_id==id ) 
        })
        if(arr.length){
           // console.log(arr)
           arr.forEach(i=>{
                  maxNum += parseFloat(i.real_combo_num) 
               })
            
         let arr_order_service = this.form.filter(i=>{
               return (i.virtual_good_id==id ||i.order_goods_id==id )
           })

           arr_order_service.forEach(i=>{
                  curNum += parseFloat(i.time) 
               })
           console.log(curNum,maxNum)
           if(curNum>maxNum){
               this.form[i].time=this._time
              // event.target.value= this._time
               this.error(`服务总数量超过订单产品数量`)

           }    

        }else{
            this.error('无效数据，无此产品！')
        }
        this.form[i].staff_pay=(this.form[i].vir_staff_pay * Math.ceil(parseFloat(this.form[i].time))).toFixed(2)

        

      }



       
  },
  watch:{
      changeNum(v){
        console.log(this.changItem)
        this.form.forEach((i,index)=>{
          let id = i.virtual_good_id|| i.order_goods_id
          if(id==this.changItem.id){
            this.form[index].per_price=this.changItem.per_price
          }  
        })
        
        
      },
    //处理返回的值
   searchData(v){    
       v = JSON.parse(v)  
       if(v.key=='pro_ser'){
           console.log(v,'选中的值')
           this.order_base = this.$store.getters.order_base
           this.form[this.index].pattern=this.order_base.pattern 
           this.form[this.index].pay_type=this.order_base.work_type
           
           if(this.form[this.index].pattern==1){

               this.form[this.index].fk_stf_id_name=this.order_base.group_name
               this.form[this.index].fk_stf_id=this.order_base.group_id || 0

           }
           


           this.form[this.index].vir_goods_description=v.searchData.goods_description
           this.form[this.index].order_id=v.searchData.order_id 
           this.form[this.index].order_goods_id=v.searchData.pk_id
           this.form[this.index].goods_id=v.searchData.goods_id
           this.form[this.index].per_price=v.searchData.per_price
           this.form[this.index].virtual_good_id=v.searchData.virtual_good_id
           this.form[this.index].price=v.searchData.price

           this.form[this.index].vir_combo_type=v.searchData.combo_type
           this.form[this.index].vir_staff_pay=v.searchData.staff_pay
           this.form[this.index].vir_type=v.searchData.type

           if(this.form[this.index].vir_type==3){
               this.form[this.index].count_type= 3
           }

       }else if(v.key=='fk_stf'){
           
            this.form[this.index].fk_stf_id_name=v.searchData.name
            this.form[this.index].fk_stf_id=v.searchData.pk_id || 0


       }
   }
      
   
    
 
    

  }
}

</script>
<style lang='scss' scoped>
._span{
    display: inline-block;
    width: 1.2rem;
}
</style>