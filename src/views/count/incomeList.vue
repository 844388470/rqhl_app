<!-- 经营数据 -->
<template>
  <div>
    <yd-infinitescroll :callback="btomscroll" ref="infinitescrollDemo" :distance="50">
        <div slot="list">
            <yd-accordion>
                    <yd-accordion-item ref="accordion" class="mselect">
                        <div slot="title">
                            <div>{{form.fk_org_id | short_company_list_more}}  {{form.fk_hpl_id | project_list_more}}</div>
                        </div>
                    </yd-accordion-item>
            </yd-accordion>    
            <div>
                <div class="flex title" style="border-bottom: 1px solid #eee;">
                    <span class="flex-1">日期</span>
                    <span class="flex-1">金额</span>
                    <span class="flex-1">人次</span>
                </div>
            </div>
            <div>
                <div class="flex" v-for="(item,i) in list" :key="i" @click="routerDetail(i)" style="border-bottom: 1px solid #eee;">
                    <span class="flex-1">{{item.time}}</span>
                    <span class="flex-1">{{item.income}}</span>
                    <span class="flex-1">{{item.custom_num}}</span>
                </div>
            </div>
        </div>
        <span slot="doneTip">数据全部加载完毕</span>
    </yd-infinitescroll>
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
        form:{},
        pageInfo:{
            page:1,
            limit:'20'
        },
        list:[]
    }
  },

  
  mounted () {
      this.form=JSON.parse(this.$route.params.data)
      this.form.limit=this.pageInfo.limit
      this.getList()
  },
  methods: {
      btomscroll(){
            this.pageInfo.page=this.pageInfo.page+1
            this.getList()
      },
      getList(){
        this.form.page=this.pageInfo.page
        this.form.limit=this.pageInfo.limit
        api.getIncomeQueryList(this.form).then(res=>{
            this.list=this.list.concat(res.data.data)
            if(!res.data.current_page){
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone')
            }else if(res.data.current_page===res.data.last_page||res.data.current_page>res.data.last_page){
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone')
            }else{
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad')
            }
        }).catch(()=>{
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone')
        })
    },
    routerDetail(index){
        this.$router.push({ name: '/count/incomeDetail', params: { data: JSON.stringify({
            date:this.list[index].time,
            type:this.form.type,
            fk_org_id:this.form.fk_org_id,
            fk_hpl_id:this.form.fk_hpl_id
        })}})
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