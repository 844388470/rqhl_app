<!-- 明细详情 -->
<template>
  <div>
      <yd-cell-group class="mb10">
            <yd-cell-item>
                <span slot="left">网点</span>
                <span slot="right">{{data.fk_hpl_id | project_list}}</span>
            </yd-cell-item>           
        </yd-cell-group>

         

        <yd-preview class="mt0 mb0" :buttons="[]"  v-for="(items ,i ) in data.data" :key="i" >
          <yd-preview-header class="mb0">
              <div slot="left" class="black fs16">{{items.name}}</div>
              <div slot="right" >{{items.value | number_3}}（元）</div>
          </yd-preview-header>
          <yd-preview-item v-for="(item , index) in children[i]" :key="index" class="fs12 mt5">
               <div v-for="(it,ii) in item" :key="ii"  slot="left" class="item" >{{it.name}}: <span class="black">{{it.value | number_3}}(元)</span></div>
               <div slot="left" v-if="item.length==1"></div>
                
            
          </yd-preview-item>
         
          
           
          
        
      </yd-preview>

      <div class="toyal_text mt10">
          项目净利：<span class="done"> {{data.total | number_3}} </span><b>(元)</b>
      </div>


  </div>
</template>

<script>
import * as api from '../../api/count'
import _ from 'lodash'
export default {
  data () {
    return {
         
        search:JSON.parse(this.$route.query.search) || [],  
        data:[]
        
    }
  },
  computed:{
      children(){
          let data = this.data.data
          return new Array(data.length).fill().map((ele,i)=>{
              
              return _.chunk(data[i].children, 2)
          })
      }
  },
  mounted(){
      this.finance_detail_show()
  },
  methods: {
     finance_detail_show(){
         api.finance_detail_show(this.search).then(res=>{
             this.data = res.data
         })
     } 
  }
}

</script>
<style lang='scss' scoped>
.toyal_text{
    background: #fff;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    font-size: 0.45rem;
    b{
        font-size: 0.28rem;
        color: #666;
    }
    .item{
        
    }
    
}
</style>