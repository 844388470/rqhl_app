<!-- 历史评估 -->
<template>
  <div>
       <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
               <yd-list theme="1" slot="list">

                  <yd-preview :class="[{ pt10:true,mb5:true}]" @click.native="$router.push(`/assessment?pk_id=${item.pk_id}&name=${item.name}`)"  v-for="(item , i) in pageData" :key="i" :buttons="[]" >
                        <yd-preview-item>
                                <div slot="left"><span>评估得分：{{item.total_score}} 分</span></div>
                                <div slot="right"><span></span></div>
                            </yd-preview-item>
                           
                            <yd-preview-item>
                                <div slot="left"><span>评估时间：{{item.created_at}}</span></div>
                                <div slot="right"><span>评估者：{{item.operator_name}}</span></div>
                            </yd-preview-item>
                        
                    </yd-preview>

               </yd-list>
            </yd-infinitescroll>
  </div>
</template>

<script>
import * as c_api from "../../../api/customs";
export default {
  data () {
    return {
        custom_id:this.$route.query.custom_id,
        dataList:[]
    }
  },
  mounted(){
   this.cbathel_history()
  },
  methods:{
      loadList(){
              this.cbathel_history()
            },
   cbathel_history(){
     let data = Object.assign({custom_id:this.custom_id},this.pageInfo)
     c_api.cbathel_history(data).then(res=>{
       this.handelScrollResult(res) 
     })
   }
  }
}

</script>
<style lang='scss' scoped>

</style>