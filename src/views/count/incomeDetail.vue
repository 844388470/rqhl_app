<!-- 经营数据 -->
<template>
  <div>
    <div slot="list">
        <yd-accordion>
                <yd-accordion-item ref="accordion" class="mselect">
                    <div slot="title">
                        <div>{{form.fk_org_id | short_company_list_more}}  {{form.fk_hpl_id | project_list_more}}</div>
                    </div>
                </yd-accordion-item>
        </yd-accordion>    
        <div class="pt10">
            <div class="flex title">
                <span class="flex-1" style="color:rgb(230,124,36);border-bottom: 1px solid #eee;">品类收入明细</span>
            </div>
            <div class="flex title" style="border-bottom: 1px solid #eee;">
                <span class="flex-1">品类</span>
                <span class="flex-1">人次</span>
                <span class="flex-1">金额</span>
                <span class="flex-1">占比</span>
            </div>
        </div>
        <div class="pb10">
            <div class="flex" v-for="(item , i ) in list" :key="i" style="border-bottom: 1px solid #eee;">
                <span class="flex-1">{{item.name}}</span>
                <span class="flex-1">{{item.custom_num}}</span>
                <span class="flex-1">{{item.value | number_3_2}}</span>
                <span class="flex-1">{{item.ratio}}</span>
            </div>
            <div class="yd-list-donetip" v-if="list.length===0">没有更多数据了</div>
        </div>
        <div v-if="this.form.fk_hpl_id.length===1">
            <div class="flex title">
                <span class="flex-1" style="color:rgb(230,124,36);border-bottom: 1px solid #eee;">科室收入明细</span>
            </div>
            <div class="flex title" style="border-bottom: 1px solid #eee;">
                <span class="flex-1">科室</span>
                <span class="flex-1">人次</span>
                <span class="flex-1">金额</span>
                <span class="flex-1">占比</span>
            </div>
        </div>
        <div v-if="this.form.fk_hpl_id.length===1&&dublist.length!==0">
            <div class="flex" v-for="(item , i) in dublist" :key="i" style="border-bottom: 1px solid #eee;">
                <span class="flex-1">{{item.name}}</span>
                <span class="flex-1">{{item.custom_num}}</span>
                <span class="flex-1">{{item.value | number_3_2}}</span>
                <span class="flex-1">{{item.ratio}}</span>
            </div>
            <div class="yd-list-donetip" v-if="dublist.length===0">没有更多数据了</div>
        </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/count'
import {mapGetters} from 'vuex'
export default {
  computed: {
     ...mapGetters(['company_list','project_list']) ,
  },
  data () {
    return {
        form:{
            fk_hpl_id:[]
        },
        list:[],
        dublist:[]
    }
  },

  
  mounted () {
      this.form=JSON.parse(this.$route.params.data)
      this.getList()
  },
  methods: {
      getList(){
        //   this.form.all_income=109217.98
        api.getIncomeQueryDetail(this.form).then(res=>{
            this.list=res.data
        }).catch(()=>{
            
        })
        if(this.form.fk_hpl_id.length===1){
            api.getIncomeQueryDetailByDub(this.form).then(res=>{
                this.dublist=res.data
            }).catch(()=>{
                
            })
        }
        
    }
  }

}

</script>
<style lang='scss' scoped>
.flex span{
    text-align: center;
    background-color:#fff;
    font-size:0.3rem;
    line-height:0.8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.title span{
    font-size:0.35rem;
    line-height:1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>