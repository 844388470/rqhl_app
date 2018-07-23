<template>
  <div class="statistics">
    <div class="header">
     
       <div class="header">
     <organSelect :ready="organSelectReady"  @click.native="openOrganSelect" :show.sync="organSelectShow" :items="dataTree" @organSelectsuccess="organSelectsuccess"/>
        <yd-cell-group style="">
            <yd-cell-item style="margin-top:-10px" arrow>
            <span  slot="left">日期：</span>
            <yd-datetime type="month" :end-date="(new Date()).toISOString().slice(0,7)" v-model="form.date" slot="right"></yd-datetime>
        </yd-cell-item>        
        </yd-cell-group>
      
    </div >
      <div class="allday"><p>总考勤：<span>{{total}}天</span></p></div>        
    </div>
    <yd-tab :active-color="blue" :callback="tabCallback">    
        <yd-tab-panel tabkey="1"  label="按人"></yd-tab-panel>
        <yd-tab-panel tabkey="2" label="按天"></yd-tab-panel>
    </yd-tab>
  
  <div v-show="!dataList.length" class="noMessage">
     没有数据
  </div>
   <div v-show="dataList.length" >
    <people   v-show="form.order==1" :dataList="dataList"></people>
     <day   v-show="form.order==2" :dataList="dataList"></day>
  </div>
  
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import * as  p_api from '@/api'
import * as  api from '@/api/attendance'
import day from './statistics/day'
import people from './statistics/people'
export default {
  name:'statistics',
  components:{day,people},  
  data () {
    return {
      //网点 科室 树形
      dataTree:[],
      organSelectReady:false,
      organSelectShow:false,
      total:0,
      dataList:[],
      form:{
            group_id:0,
            fk_hpl_id:0,
            date:(new Date()).toISOString().slice(0,10),
            order:1  //1 按人  2按月 

         },

        }
  },
  computed:{
     ...mapGetters(['project_list']),
  },
  mounted () {
    this.getDubList()
  },
  methods: {
    //查询考勤
   serachAttendance(){
    api.serachAttendance(this.form).then(res=>{
      this.total=res.data.all
      this.dataList=res.data.data
    })
   },

   //点击标签页回调
   tabCallback(label,tabkey){
     this.form.order = tabkey
     if(!this.form.fk_hpl_id){
       return false
     }
     this.serachAttendance()
    
   },

    //联机返回的结果
    organSelectsuccess(ret){
     console.log(ret)
     this.form.fk_hpl_id= ret.itemValue1 || 0
     this.form.group_id = ret.itemValue2 || 0  
     this.serachAttendance()  
    },

     //打开连级框
     openOrganSelect(){                
        this.organSelectShow=true
      },

   //获取科室
         getDubList(){
           p_api.getGroupList().then(res=>{
             let dublist = res.data
              let project_list = this.project_list
             this.dataTree = new Array(project_list.length).fill() .map((item,i) =>{ return ({v:project_list[i].pk_id,n:project_list[i].name ,
              c:new Array(dublist.filter(item1=>item1.pid ==project_list[i].pk_id ).length).fill().map((item2,i2)=>{
                 return {
                   v:dublist.filter(item1=>item1.pid ==project_list[i].pk_id )[i2].pk_id,
                   n:dublist.filter(item1=>item1.pid ==project_list[i].pk_id )[i2].name,
                   c:[]
                 }
               })
               })  })
               //过滤没有护理组的网点
               this.dataTree = this.dataTree.filter(i=> i.c.length)
 
               this.organSelectReady = true
             
           })
         },
         
  }
}
</script>
<style lang='scss' scoped>
.allday{
  
  border-bottom:0.2rem solid #eee;
  font-size: 0.3rem;
}
.allday p{
  height:1rem;
  line-height:1rem;
  margin:0 0 0 0.34rem;
}
.datatime{
  background: url('../../assets/img/daliy@2x.png') no-repeat  right center;
  background-size: 40px 40px;
}

.noMessage{
  text-align: center;
  color: #666;
  padding: 0.3rem;
  font-size: 0.3rem;
}
</style>