<!-- 业务开单-产品 -->
<template>
  <div>
     <yd-cell-group class="mt10 mb0">
        <yd-cell-item>
            <h4 slot="left" class="title">产品合计:{{total | NaNf}}(元)</h4>
            <div slot="right" v-show="false"  class="pr10 pl20" @click="addForm"><span  class="icon_add ">+</span></div>
        </yd-cell-item>
    </yd-cell-group>

    <yd-cell-group class="mt10 mb0" v-for="(item,i) in form" :key="i">
           <yd-cell-item class="pro" @click.native="showSearch_goods_name(i)" >
                <b slot="left" style="width:1.1rem">产品({{i+1}}):</b>
                <span slot="left" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">{{item.goods_description }}</span>
                <yd-icon  slot="right" @click.stop.native='delForm(i)' class="pl20 pr10" color="#333" size="0.4rem" name="delete" ></yd-icon>
           </yd-cell-item>
        
           <yd-cell-item>
                <div slot="left" >
                    <b >单价:</b>
                    <span>{{parseFloat(item.price).toFixed(2)}}</span>
                   <!-- <input  type="text" disabled :value='item.price' > -->
                </div>
                <div slot="left">
                   <b >单价浮动:</b>
                    <input @change="change_per_price($event,i,item.per_price)" type="number" v-model="item.discount"  >
                </div>
             </yd-cell-item>
             <yd-cell-item>
                <div slot="left">
                    <b >数量({{item.combo_num}}):</b>
                    <input @input="notMinus" @focus="focus_combo_num" @change="change_combo_num($event,i)" type="number" v-model="item.real_combo_num" >
                    <div v-show="false">{{item.num=item.real_combo_num}}</div>
                </div>
                <div slot="left">
                   <b >单位:</b>
                    <span slot="left">{{item.combo_type}}</span>
                </div>
             </yd-cell-item>
               <yd-cell-item>
                <div slot="left">
                    <b >总价:</b>
                     <span class="_span">{{((item.real_combo_num/item.combo_num)*item.price).toFixed(2) | NaNf}}</span>
                </div>
                <div slot="left">
                   <b >总价浮动:</b>
                    <input @change="change_per_price($event,i,item.per_price)" type="number" v-model="item.total_discount">
                </div>
             </yd-cell-item>
              <yd-cell-item>      
                <div slot="left">
                    <b >小计:</b>
                </div>
                 <span slot="right" class="pr10">
                    
                    {{item.real_total=(((parseFloat(item.price)+parseFloat(item.discount))*(parseFloat(item.real_combo_num)/parseFloat(item.combo_num)))+parseFloat(item.total_discount)).toFixed(2) | NaNf}} 
                </span>
                <span>{{item.per_price=(parseFloat(item.real_total)/parseFloat(item.real_combo_num))}}</span>
             </yd-cell-item>
             <yd-cell-item >
                <div slot="left" @click="showSearch_staffs(i)">
                     <b >业务员:</b>
                     <span class="_span" >{{item.saleman_name}}</span>
                </div>
                <div slot="left">
                   <b >抽成:</b>
                    <input  type="number" v-model="item.commission" >
                </div>
             </yd-cell-item>
               
      
    </yd-cell-group>

    <div class="mt10 tc">
         <yd-button :bgcolor="blue" @click.native="addForm" color="#fff"> 添加产品</yd-button>
    </div>
   

  </div>
</template>

<script>
import * as utils from '@/utils' 
import * as api from '@/api'
import orderM from '@/minix/orderM'
import {mapState,mapActions, mapGetters} from 'vuex'
export default {
  props:['searchData','showSearch','watchChangeNum'],
  mixins:[orderM],
  data () {
    return {
      _combo_num:0, //改变前的数量
      index:-1, //当前操作的序号
      order_base :{},
      Goodslist:[], //产品集合
      formItem:{
       order_id:'',  
       goods_description:'' ,//展示用
       pk_id:'' ,//订单产品id 
       goods_id:'' ,//产品id
       price:'0' ,//产品单价
       num:'' ,//产品数量
       real_total  :'0' ,//金额小计  (（price+discount）*real_combo_num) + total_discount
       combo_num:'0' ,//服务总天/次数
       staff_pay:'' ,//每单位数量护工所得
       staff_pay_total:'' ,//单件护工总所得
       per_price:'' ,//每单位数量单价 real_total/real_combo_num
       virtual_good_id :'' ,//虚拟的订单产品id 
       discount:'0' ,// 单价浮动
       total_discount:'0' ,// 总价浮动
       goods_name:'' ,//产品名
       description:'' ,//产品描述
       goodssn:'' ,//产品编号
       combo_type:'' ,//单位
       real_combo_num:'1' ,//订单产品实际数量
       commission:'' ,//业务抽成
       saleman:'0' ,//业务员ID
       saleman_name:'', //业务员名字
       type:''      //产品类型   1：服务计时  2：实物产品   3：计量产品
      },
   
      form:[],

      //下发的价格
      priceItem:{
          index:0  //(修改次数)判断是否修改
      }
    }
  },

  mounted(){
     
      
  },
  methods:{
      ...mapActions(['setOrederGoods','setTotal']),

      //计算小计算
      com_real_total(){
          
      },

       //禁止删除
      banDel(index){
       let target =  this.form[index]
       
       let id = target.pk_id || target.virtual_good_id
      
       
       let order_service = this.$store.getters.order_service
        if(!order_service.length){
             //console.log(1)
            return true
        }else{
           let arr = order_service.filter(i=>{
               return (i.virtual_good_id==id ||i.order_goods_id==id )
           })
           console.log(arr)
           if(!arr.length){
               return true
           }else{
               return false
           }
        }
      },

      saveData(){
          console.log('saveData--setOrederGoods')
          this.setOrederGoods(this.form)
          this.setTotal(this.total)
      },

      //获取产品信息
      getGoods(){
       return  api.getGoods(this.order_base.fk_hpl_id).then(res=>
        {   
            
            return res
        })  
      },

      //获取业务员
      getStaffs(){
          let fk_hpl_id = this.order_base.fk_hpl_id
        return  api.getStaffs({fk_hpl_id}).then(res=>
        {   
            
            return res
        })  
      },
      
      //改变单价
      change_per_price(event , i ,per_price){
          
          if(!event.target.value){
             event.target.value=0
             // this.form[i].real_combo_num=0
          }
          if(!this.form[i].discount || this.form[i].discount==0){
              this.form[i].discount = 0
          }

          if(!this.form[i].total_discount || this.form[i].total_discount==0){
              this.form[i].total_discount = 0
          }
   
          //不改变
           let order_service = this.$store.getters.order_service     
            let id = this.form[i].virtual_good_id ||this.form[i].pk_id
          if(!order_service.length){
             
          }
         // console.log(order_service)
          let arr = order_service.filter(i=>{
              return (i.virtual_good_id==id ||i.order_goods_id==id )
          })
         // console.log(arr)
          if(!arr.length){
              
          }else{
              this.error('该产品对应的服务信息的实际单价发生改变！')
              
              
          }
         
          
          //改变父级 监听单价改变次数 事件
          this.watchChangeNum(id ,per_price)
      },

      //展示产品搜索框
      showSearch_goods_name(i){
          this.index=i
          this.order_base = this.$store.getters.order_base
          console.log(this.order_base.fk_hpl_id)
           if(this.order_base.fk_hpl_id){
            this.getGoods().then(res=>{
              let searchData={
                    result:res.data,
                    searchKey:'goods_id',
                    name:'goods_description'
                }
              this.$emit('showSearch',searchData)
            })
        }else{
          this.error('请选择网点')  
        }
      },

      //展示业务员搜索框
      showSearch_staffs(i){
          this.index=i
          this.order_base = this.$store.getters.order_base
          console.log(this.order_base.fk_hpl_id)
           if(this.order_base.fk_hpl_id){
            this.getStaffs().then(res=>{
              let searchData={
                    result:res.data,
                    searchKey:'staff_id',
                    name:'name'
                }
              this.$emit('showSearch',searchData)
            })
        }else{
          this.error('请选择网点')  
        }
      },

       //记录原数量
       focus_combo_num(event){
           console.log(event.target.value)
           this._combo_num = event.target.value

       },
      //监听数量的改变

      change_combo_num(event,index){
        if(!this.form[index].real_combo_num ||this.form[index].real_combo_num==0 ){
          this.form[index].real_combo_num =1
        }  
        let value = event.target.value
        console.log(value)
        let target =  this.form[index] 
        let id = target.pk_id || target.virtual_good_id
        let order_service = this.$store.getters.order_service
        if(!order_service.length){
           // console.log('无数据')
            return false
        }else{
          let arr = order_service.filter(i=>{
               return (i.virtual_good_id==id ||i.order_goods_id==id )
           })
           if(!arr.length){
              // console.log('未使用')
               return false
           }else{
               console.log(arr)
               let minNum = 0
                arr.forEach(i=>{
                  minNum += parseFloat(i.time) 
               })
               console.log(minNum)
               if(minNum>value){
                   this.form[index].real_combo_num=this._combo_num
                   this.error(`服务已使用数量为${minNum}`)
                   
                   //event.target.value=this._combo_num
               }
           }
        }
      }
         
  },
  computed:{


      total(){
        let total = 0
        let arr = this.form.map(i=>i.real_total)
        if(!arr.length){return 0.00}
       // console.log(arr,11)
        arr.forEach(i=>{
            let num = (isNaN(i) || !i) ? 0 : parseFloat( i) 
            total+=num
        })
        return total

      }
  },
  watch:{

      //处理返回的值
   searchData(v){    
       v = JSON.parse(v)
      
       if(v.key=='goods_id'){
            
           this.form[this.index].order_id=this.order_base.pk_id 
           this.form[this.index].virtual_good_id=this.index+1

           this.form[this.index].goods_id=v.searchData.goods_id
           this.form[this.index].goods_name=v.searchData.goods_name
           this.form[this.index].goods_description=v.searchData.goods_description
           this.form[this.index].combo_num=v.searchData.combo_num
           this.form[this.index].combo_type=v.searchData.combo_type
           this.form[this.index].commission=v.searchData.commission
           this.form[this.index].description=v.searchData.description
           this.form[this.index].goodssn=v.searchData.goodssn
           this.form[this.index].per_price=v.searchData.per_price
           this.form[this.index].price=v.searchData.price
           this.form[this.index].staff_pay=v.searchData.staff_pay
           this.form[this.index].staff_pay_total=v.searchData.staff_pay_total
           this.form[this.index].type=v.searchData.type     
       }else if(v.key=='staff_id'){
         
         this.form[this.index].saleman_name=v.searchData.name  
         this.form[this.index].saleman=v.searchData.pk_id   || 0


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