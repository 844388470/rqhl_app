<!-- 项目明细 -->
<template>
  <div>
      <yd-cell-group class="mb10">
            <yd-cell-item>
                <span slot="left">时间</span>
                <span slot="right">{{search.start}}～{{search.end}}</span>
            </yd-cell-item>           
        </yd-cell-group>

        <yd-preview class="mb10" :buttons="[]" v-for="(item , i) in data " :key="i">
          <yd-preview-header >
              <div slot="left" class="black fs16">网点 {{item.fk_hpl_id | project_list}}</div>
              <div slot="right" @click="$router.push(`/count/detailDetail?search=${JSON.stringify({
                  fk_hpl_id:item.fk_hpl_id , start:search.start , end:search.end
              })}`)" class="blue">详情</div>
          </yd-preview-header>
          <yd-preview-item class="fs14 mt5" v-for="(item , index) in children[i]" :key="index">
              <div slot="left" v-for="(it,ii) in item" :key="ii" >{{it.name}}: <span class="black">{{it.value |number_3 }}(元)</span></div>
              
               <div slot="left" v-if="item.length==1"></div>       
          </yd-preview-item>
         
      </yd-preview>
  </div>
</template>

<script>
import * as api from '../../api/count'
export default {
  data () {
    return {
        search:JSON.parse(this.$route.query.search),
        data:[]
    }
  },
  computed:{
      children(){
          let data = this.data
          return new Array(data.length).fill().map((ele,i)=>{
              
              return _.chunk(data[i].data, 2)
          })
      }
  },

  mounted(){
      this.finance_detail()
  },
  methods:{
      finance_detail(){
          api.finance_detail(this.search).then(res=>{
              this.data = res.data
              })
      }
  }
}

</script>
<style lang='scss' scoped>
</style>