<template>
  <div class="detail">
      <ul>
          <li class="item-list" v-for="(item,index) in dataList" :key="index">
              <p class="list flex">
                  <span class="flex-1">{{item.fk_stf_id_name}}</span>
                  <span class="flex-1">{{item.type}}</span>
                  <span class="flex-1">{{item.date}}</span>
              </p>
          </li>
      </ul>
  </div>
</template>
<script>
import * as api from '../../api/attendance'
export default {
    data(){
        return{
            info:this.$route.query.info,
            queryItem:JSON.parse(this.$route.query.item),
           
            dataList:[]
           
        }
    },
    computed: {
        item(){
            return{
                fk_hpl_id:this.queryItem.fk_hpl_id || 0,
                group_id:this.queryItem.group_id || 0,
                date:this.queryItem.day || this.queryItem.date ||'',
                fk_stf_id:this.queryItem.fk_stf_id || 0

            }
        }
    },
    mounted () {
        this.getDataList()
    },
    methods:{
        // 考勤按天查询详情
        get_attendance_info_for_day(){
         api.get_attendance_info_for_day(this.item).then(res=>{
             this.dataList = res.data
         })
        },

          // 考勤按人详情查询
        get_attendance_info_for_staff(){
         api.get_attendance_info_for_staff(this.item).then(res=>{
             this.dataList = res.data
         })
        },

        //
        getDataList(){
         if(this.info=="people"){
            this.get_attendance_info_for_staff()

         }else if(this.info=="day"){
            this.get_attendance_info_for_day()
         }
        }
    }
}
    
</script>

<style lang='scss' scoped>
.detail{
    background: #fff;
}
.item-list{
    border-bottom: 0.01rem solid #ddd;
}
.list{
    height:1rem;
    line-height: 1rem;
    font-size: 0.32rem;
    margin: 0 0.3rem;
}
.list span:first-child{
    width:30%;
    display: inline-block;
}
</style>
