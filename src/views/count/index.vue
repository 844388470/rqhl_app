<!-- 统计 -->
<template>
  <div>
    <yd-cell-group v-if="show.OPERATION_DATA">
      <yd-cell-item   @click.native="$router.push('/count/runData')" arrow>
            <img slot="icon" src="../../assets/img/operate@2x.png">
            <span slot="left">经营数据</span>        
        </yd-cell-item>
        <yd-preview :buttons="[]" >
        <yd-preview-header>
            <div slot="left">{{data.month}}</div>
            <div slot="right"></div>
        </yd-preview-header>

        <yd-preview-item>
            <div slot="left">收入：</div>
            <div slot="right" class="done">+{{data.income |number_3}}（元）</div>
        </yd-preview-item>
        <yd-preview-item>
            <div slot="left">支出：</div>
            <div slot="right" class="no">-{{data.profit |number_3}}（元）</div>
        </yd-preview-item>
        <yd-preview-item>
            <div slot="left">毛利：</div>
            <div slot="right" class="black">{{data.profit |number_3}}（元）</div>
        </yd-preview-item>
    </yd-preview>
    </yd-cell-group>

    <!-- <yd-cell-group v-show="true">
      <yd-cell-item arrow>
            <img slot="icon" src="../../assets/img/business@2x.png">
            <span slot="left">业务统计</span>        
        </yd-cell-item>
        <yd-preview :buttons="[]" >
      

        <yd-preview-item class="pt10">
            <div slot="left">今日收款：<span class="done">+{{data.pay_total | number_3}}元</span></div>
            <div slot="left">今日付款：<span class="no">-{{data.charge_total| number_3}}元</span></div>
        </yd-preview-item>
       

         <yd-preview-item  v-for="(items , index ) in charge_detail " :key="index">
            <div slot="left"  v-for="(item , i ) in items " :key="i">{{item.pay_type |pay_type }}<span  class="black" >{{item.price | number_3 }}元</span></div>
            <div slot="left" v-if="items.length==1"></div>
           
        </yd-preview-item>
        
    </yd-preview>
    </yd-cell-group> -->

    <yd-cell-group >

        <yd-cell-item v-if="show.CHARGE_QUERY_BY_DAY"  @click.native="$router.push('/count/charge')" arrow>
            <img slot="icon" src="../../assets/img/Group 5 Copy@2x.png">
            <span slot="left">收费查询</span>
           
        </yd-cell-item>

        <yd-cell-item v-if="show.INCOME_QUERY" @click.native="$router.push('/count/income')" arrow>
            <img slot="icon" src="../../assets/img/Group 6 Copy@2x.png">
            <span slot="left">收入查询</span>
          
        </yd-cell-item>

        <!-- <yd-cell-item arrow>
            <img slot="icon" src="../../assets/img/Group Copy@2x.png">
            <span slot="left">综合查询</span>
           
        </yd-cell-item> -->
    </yd-cell-group>

    
  </div>
</template>

<script>

import _ from 'lodash'
import {mapGetters} from 'vuex'
import * as api from '../../api/count'
export default {
  data () {
    return {
        show:{
            OPERATION_DATA:false, //经营数据
            INCOME_QUERY:false, //收入查询
            CHARGE_QUERY_BY_DAY:false //收费查询
        },
        form:{
            fk_org_id:[0],
            fk_hpl_id:[]
        },
        data:{}
    }
  },
  computed:{
     ...mapGetters(['company_list','project_list','authModulesList']) ,
      charge_detail(){
          if(this.data.charge_detail){
              return _.chunk(this.data.charge_detail, 2)
          }else{
              return []
          }
      }
  },
  mounted () {
      try {
          this.form.fk_org_id[0] = this.company_list[0].pk_id        
      } catch (error) {
          this.form.fk_org_id[0] = 0
      }   
      this.changeShow()
      if(this.show.OPERATION_DATA){
          this.get_operation_data()
      }
      
  },
  methods: {
     get_operation_data(){
       //  this.form.fk_org_id = (this.form.fk_org_id +'').split()
        // this.form.fk_hpl_id = (this.form.fk_hpl_id +'').split()
         api.operation_data(this.form).then(res=>{
             this.data=res.data
         })
     },
     
     //判断权限
     changeShow(){
       let showKey = Object.keys(this.show)
       showKey.forEach(i=>{
           if(this.showMuen(i)){
               this.show[i]=true
           }
       })
     },
      
  }
}

</script>
<style lang='scss' scoped>
</style>