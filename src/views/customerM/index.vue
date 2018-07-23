<template>
    <div class="customer">
        <div class="search">
            <yd-search cancel-text='搜索' :on-cancel="submitHandler" v-model="search.search" placeholder="床位/姓名/手机号" :on-submit="submitHandler"></yd-search>
        </div>
        <div class="content">
             <yd-infinitescroll :callback="getDataList" ref="infinitescrollDemo">
                    <yd-list theme="1" slot="list" >
                        <yd-accordion >
                        <yd-accordion-item v-for="(item , i) in pageData" :key="i">
                                <div slot="icon" class="flex item-title  w100p" @click="$router.push(`/addCustomerMo?id=${item.pk_id}`)">
                                    <div class="flex-1">{{item.name}}</div>
                                    <div class="flex-1">{{item.sex | sex}}</div>
                                    <div class="flex-1">{{item.mobile}}</div>
                                </div>
                                <div class="item_content">
                                  <div class="flex flex-m">
                                        <div class="flex-1">家属：{{item.desc.family_name}}</div>
                                        
                                        <div class="flex-1 tc">{{item.desc.family_mobile}}</div>
                                  </div>

                                   <div class="flex flex-m">
                                        <div class="flex-1">评估得分：{{item.desc.bathel}} <span v-show="!isNaN(Number(item.desc.bathel))">（分)</span></div>
                                        
                                        <div class="flex-1 tc" >
                                              <yd-button @click.native="creatOrder(item)" :bgcolor="blue" color="#fff">创建订单</yd-button>
                                        </div>
                                  </div>
                                  <div class="order_item" @click="$router.push(`/businessOpen?id=${it.pk_id}`)" v-for="(it , index) in item.desc.orders" :key="index">
                                      <div class="flex flex-m">
                                          <div class="flex-2">{{it.order_no}}</div>
                                          <div class="flex-1">{{it.goods_name}}</div>
                                      </div>
                                      <div class="flex flex-m">
                                          <div class="flex-2">{{it.total}}(元)</div>
                                          <div class="flex-1">{{it.bill_time}}</div>
                                      </div>
                                      
                                  </div>
                                  <div class="tc mt10">
                                      <yd-button v-show="item.desc.orders.length" @click.native="$router.push(`/orderM?custom_id=${item.pk_id}`)" bgcolor="#fff" class="w20p" :color="blue">更多</yd-button>
                                  </div>
                                </div>
                            </yd-accordion-item>
                        </yd-accordion>
                    </yd-list>

             </yd-infinitescroll>
          
        </div>
        <div class="footer">
            <yd-button @click.native="$router.push('/addCustomerMo')" bgcolor="#5bacf9" color="#fff" shape="circle">新增</yd-button>
        </div>
  </div>
</template>
<script>
import * as c_api from "../../api/customs";
export default {
  name: "customer",
  data() {
    return {
      search:{
       search:'', //床位/手机/姓名
      }, 
    };
  },
  mounted () {
      this.getDataList()
  },
  methods: {
    //搜索
    submitHandler(value) {
     
      this.pageData=[]
      this.pageInfo.page=1
      this.clearScrollResult()
      this.getDataList()
     
    },
    
    //获取数据
    getDataList() {
      c_api.operation_data(Object.assign(this.pageInfo,this.search) ).then(res => {
        console.log(res)
        this.handelScrollResult(res)
      });
    },
    creatOrder(item){
        this.$router.push(`/businessOpen?custom_id=${item.pk_id}&&name=${item.name}&&mobile=${item.mobile}`) 
    },
  },
  watch: {}
};
</script>
<style lang='scss' scoped>

.footer {
  position: fixed;
  text-align: center;
  // height: 0.88rem;
  // line-height: 0.88rem;
  bottom: 0;
  padding: 0.2rem 0;
  width: 100%;
  background: #fff;
}
.footer .yd-btn-circle {
  width: 1.8rem;
  height: 0.7rem;
  font-size: 0.3rem;
}
.content{
    padding-bottom:1.3rem; 
}
.item-title{
     font-size: 0.30rem;
}
.item_content{
    padding: 0.3rem 0.2rem;
    font-size: 0.30rem;
    color: #333;
    .flex{
        margin-top: 0.15rem;
    }

}
.order_item{
    background: #eee;
    padding: 0.1rem;
    margin-top: 0.1rem;
    font-size: 0.30rem;
}
</style>

