<!-- 经营数据 -->
<template>
  <div>
      <!-- <mSearch  :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey"/> -->
      <mSearchs  :show.sync="searchShow" @search="handleSearch"  :result="searchResult" :searchKey="searchKey"  :yxz="yxz"/>
      <div>
          <yd-accordion>
            <yd-accordion-item ref="accordion" class="mselect">
                  <div slot="title">
                    <div>{{searchData.fk_org_id | short_company_list_more}}  {{searchData.fk_hpl_id | project_list_more}}</div>
                    <yd-button :bgcolor="blue" color="#FFF" ><yd-icon class="mr5" size="0.28rem" name="search"></yd-icon>筛选</yd-button>
                  </div>

                <div style="padding: .24rem;">
                     <yd-cell-group>
                        <yd-cell-item  class="f_ellipsis" @click.native="openSearchBox('fk_org_id')">
                            <span slot="left" class="flex-5 ellipsis">公司：{{searchData.fk_org_id | short_companys_list}}</span>
                            <!-- <span slot="left">{{searchData.fk_org_id[0] | short_company_list}}</span> -->
                           
                        </yd-cell-item>

                        <yd-cell-item class="f_ellipsis" @click.native="openSearchBox('fk_hpl_id')"> 
                            <span slot="left" class="flex-5 ellipsis">网点：{{searchData.fk_hpl_id | projects_list }}</span>
                            <!-- <span slot="left">{{searchData.fk_hpl_id[0] | project_list  }}</span> -->
                            
                        </yd-cell-item>

                         <yd-cell-item arrow>
                            <span slot="left">开始月份：</span>
                            <yd-datetime start-year="2017" type="month" :init-emit="false"  v-model="searchData.start" slot="right"></yd-datetime>
                          
                        </yd-cell-item>

                        <yd-cell-item arrow>
                            <span slot="left">结束月份：</span>
                            <yd-datetime start-year="2017" :init-emit="false" type="month" v-model="searchData.end" slot="right"></yd-datetime>
                        </yd-cell-item>
                        </yd-cell-group>                
                </div>

                <div class="tc mb10">
                     <yd-button @click.native="reset" :bgcolor="blue" color="#FFF" class="w30p" >重置</yd-button>
                      <yd-button @click.native="submit" :bgcolor="blue" color="#FFF" class="w30p" >确定</yd-button>
                  </div>
            </yd-accordion-item>
          </yd-accordion>
      </div>
      
      <!-- 代收  毛利 折线图 -->
      <div class="box mt10">
          <div id="profit" v-show="profitDataShow"  ></div>
      </div>


      <yd-cell-group class="mb10 mt10"  v-show="!profitDataShow">
             <yd-cell-item >
                <span slot="left">上月数据</span>
                <span  slot="right"></span>
            </yd-cell-item>
            <yd-cell-item  v-for="(item , i ) in last_month " :key="i">
                <span slot="left">{{item.name}}</span>
                <span  slot="right">{{item.value |number_3}}（元）</span>
            </yd-cell-item>
            
        </yd-cell-group>

        <yd-cell-group class="mb10 ">
             <yd-cell-item >
                <span slot="left">本期数据</span>
                <span  slot="right"></span>
            </yd-cell-item>
            <yd-cell-item  v-for="(item , i ) in current_month " :key="i">
                <span slot="left">{{item.name}}</span>
                <span  slot="right">{{item.value |number_3}}（元）</span>
            </yd-cell-item>
            
        </yd-cell-group>
      
      <!-- 收入数据结构图 -->
       <yd-cell-group class="mb10 mt10" v-show="incomeShow" >
            <yd-cell-item>
                <span slot="left" >收入结构数据</span>
                <span slot="right" @click="$router.push(`/count/projectDetail?search=${JSON.stringify(search)}`)">项目明细</span>
            </yd-cell-item>
             <div id="income" ></div> 
             <div class="pb20">
                <div class=" flex" v-for="(items , i) in incomeDataText" :key="i">
                    <div :class="{'pr10':1,'flex-1':1 , 'font':1, 'tr':index==0}"  v-for="(item , index) in items" :key="index"><div :style="{'background-color':color[i*2+index]}" class="color"></div > {{item.name}} : {{item.value}} </div>            
                    <div class="pl10 flex-1 font" v-if="items.length==1"></div>           
                </div> 
             </div>    
        </yd-cell-group>



        <!-- 收入数据结构图 -->
       <yd-cell-group class="" >
            <yd-cell-item>
                <span slot="left" >营业费用</span>
                <span slot="right"></span>
            </yd-cell-item>
             <div id="expanse" ></div>   
              <div class="pb20"> 
                <div class=" flex" v-for="(items , i) in expanseDataText" :key="i">
                    <div :class="{'pr10':1,'flex-1':1 , 'font':1, 'tr':index==0}"  v-for="(item , index) in items" :key="index"><div :style="{'background-color':color[i*2+index]}" class="color"></div > {{item.name}} : {{item.value}} </div>      
                    <div class="pl10 flex-1 font" v-if="items.length==1"></div>        
                </div>    
            </div>
        </yd-cell-group>

         <!-- 收入数据结构图 -->
       <yd-cell-group class=""  v-show="incomeShow">
            <yd-cell-item>
                <span slot="left" >管理费用</span>
                <span slot="right"></span>
            </yd-cell-item>
             <div id="manager" ></div>   
              <div class="pb20"> 
                <div class=" flex" v-for="(items , i) in managerDataText" :key="i">
                    <div :class="{'pr10':1,'flex-1':1 , 'font':1, 'tr':index==0}"  v-for="(item , index) in items" :key="index"><div :style="{'background-color':color[i*2+index]}" class="color"></div > {{item.name}} : {{item.value}} </div>      
                    <div class="pl10 flex-1 font" v-if="items.length==1"></div>        
                </div>    
            </div>
        </yd-cell-group>

        
    
  </div>
</template>

<script>
import * as api from '../../api/count'
import mSearch from '../../components/mSearch'
import {mapGetters} from 'vuex'
import mSearchs from '../../components/mSearchs'
import _ from 'lodash'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  components: {mSearch,mSearchs},
  computed: {
     ...mapGetters(['company_list','PROJECT_LIST']) ,
   

     series(){
       let data = JSON.parse(JSON.stringify(this.profitData.data))
       return data.map((ele,i)=>{
           return Object.assign(ele,{
               type:'line',
               
           })
       })
   },

   expanseDataText(){
       return _.chunk(this.expanseData, 2)
   },

   incomeDataText(){
       return _.chunk(this.incomeData, 2)
   },

   managerDataText(){
       return _.chunk(this.managerData, 2)
   },


   profitDataShow(){
       try {
           if(this.profitData.header.length==1){
               return false
           }else{
               return true
           }
       } catch (error) {
          return true 
       }
   }

  },
  data () {
    return {
       // 搜索组件参数
      searchShow:false,
      searchKey:'key',
      yxz:[], //已选中的值 
      searchResult:[],
      _searchData:{},
      searchData:{ 
          fk_org_id:[0],  //公司ID
          fk_hpl_id:[0],  //项目ID
          start:new Date((new Date()).setMonth((new Date()).getMonth()-8)).toISOString().slice(0,7)
, 
          end:new Date((new Date()).setMonth((new Date()).getMonth()-1)).toISOString().slice(0,7)

      },
      incomeShow:true, //收入结构展示
      color:['#5bacf9','#9fe08d','#f95b67','#faca39','#5bd0f9',
      '#fa7639','#fade39','#59e5a6','#d0fa39','#635bf9','#a8fa39','#b4f95b',
      '#f370da','#ff7134','#2b9de6','#3334ee','#31d6e4'],
      //收入的数据
    //   incomeData:[
    //       {name: 'A-1212', value: 1212},
    //       {name: 'B', value: 2323},
    //       {name: 'C', value: 1919} ],
    incomeData:[],
       
      //支出数据 
      expanseData:[], 

      //管理数据
      managerData:[], 

      //曲线
      profitData:[],
      moneyData:{},

      last_month:[], //上个月数据
      current_month:[] , //本期数据
      search:{}, //返回的搜索数据
    }
  },

  
  mounted () {
      
      this._searchData = JSON.parse(JSON.stringify(this.searchData))
      try {
           this.searchData.fk_org_id[0] = this.company_list[0].pk_id 
      } catch (error) {
          this.searchData.fk_org_id[0] = 0
          
      }
     
      this.finance_operation()
    //   this.incomeDataInit()
    //   this.profitDataInit()
  },
  methods: {
      //搜索 后返回
      handleSearch(res,key){
          console.log(res,key)
          if(key == 'fk_org_id'){
           //this.searchData.fk_org_id[0] = res.pk_id || 0
           let mark = JSON.stringify( this.searchData.fk_org_id )
           this.searchData.fk_org_id = res.map(i=> i.pk_id)
           if(mark != JSON.stringify( this.searchData.fk_org_id )){
               this.searchData.fk_hpl_id= []
           }
          }else if(key == 'fk_hpl_id'){
              // this.searchData.fk_hpl_id[0] = res.pk_id || 0     
              this.searchData.fk_hpl_id = res.map(i=> i.pk_id)   
          }     
      },
      
      //提交搜索数据
      submit(){
          console.log(this.searchData)
         
          if(this.searchData.fk_hpl_id[0]){
              this.incomeShow = false
          }else{
              console.log(1)
               this.incomeShow = true
          }
          this.finance_operation()
          this.$refs.accordion.closeItem()
      },
      
      //重置搜索数据
      reset(){
          this.searchData=JSON.parse(JSON.stringify(this._searchData))
      },

      //获取财务经营数据
      finance_operation(){
          api.finance_operation(this.searchData).then(res=>{
              this.incomeData = res.data.income
              this.expanseData = res.data.expanse
              this.profitData = res.data.history
              this.managerData = res.data.manager
              this.last_month=res.data.last_month
              this.current_month=res.data.current_month
              this.search=res.data.search
              this.incomeDataInit()
              this.profitDataInit()
              this.expanseDataInit()
              this.managerDataInit()
          })
      },

      //打开搜索面板
      openSearchBox(v){
         if(v=='fk_org_id'){
            this.yxz = JSON.parse(JSON.stringify(this.searchData.fk_org_id))
             this.searchResult = JSON.parse(JSON.stringify(this.company_list))
             this.searchKey = v
         }else if(v=='fk_hpl_id'){
             if(!this.searchData.fk_org_id.length){
                 this.error('请选择公司')
                 return 
             }
                this.yxz = JSON.parse(JSON.stringify(this.searchData.fk_hpl_id))
           //  let PROJECT_LIST = this.PROJECT_LIST.filter(i=> i.pid==this.searchData.fk_org_id)
            let PROJECT_LIST = this.PROJECT_LIST.filter(i=> this.searchData.fk_org_id.indexOf(i.pid)!=-1)
             this.searchResult = JSON.parse(JSON.stringify(PROJECT_LIST))
             this.searchKey = v

         }
         this.searchShow=true
      },

      // 收入图配置
      incomeDataInit(){
          echarts.init(document.getElementById('income')).setOption({
            series: {
                type: 'pie',
                radius : '50%',
                center: ['50%', '40%'],
                data:this.incomeData,     
            },
            // legend: {
            //      bottom: 10,
            //      left: 'center',
            //     // data:['A','B','C']
            // },
            color:this.color

        });

      },

       // 支出图配置
      expanseDataInit(){
          echarts.init(document.getElementById('expanse')).setOption({
            series: {
                type: 'pie',
                radius : '50%',
                center: ['50%', '40%'],
                data:this.expanseData,     
            },
            // legend: {
            //      bottom: 10,
            //      left: 'center',
            //     // data:['A','B','C']
            // },
            color:this.color

        });

      },
      //管理费用
      managerDataInit(){
          echarts.init(document.getElementById('manager')).setOption({
            series: {
                type: 'pie',
                radius : '50%',
                center: ['50%', '40%'],
                data:this.managerData,     
            },
            // legend: {
            //      bottom: 10,
            //      left: 'center',
            //     // data:['A','B','C']
            // },
            color:this.color

        });

      },

      //线状图
      profitDataInit(){
       echarts.init(document.getElementById('profit')).setOption({
            color:this.color,
           legend: {
               // data:['代收','毛利']
            },
             tooltip: {
                trigger: 'axis',
                //formatter: '{b0} <br>{a0}:{c0}万 <br />{a1}:{c1}万'
            },
            xAxis: {
                name:'时间',
                axisLabel: {
                rotate: 30,
                interval: 0
            },
                type: 'category',
                boundaryGap: false,
                data: this.profitData.header
               // data: ['2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06', '2018-07']
            },
            yAxis: {
                name:'元',
                type: 'value'
            },
            series:this.series
            // series: [{
            //     name:'代收',
            //     data: [820, 932, 901, 934, 1290, 1330, 1320],
            //     type: 'line',
            //     color:['#9fe08d'], //折线颜色
            //     areaStyle: {}
            // },
            // {
            //     name:'毛利',
            //     data: [220, 432, 601, 734, 90, 330, 1220],
            //     type: 'line',
            //     color:['#5bacf9'], //折线颜色
            //     areaStyle: {}
            // }]
       })
      }
      
      
  }

}

</script>
<style lang='scss' scoped>

#income{
    width: 100%;
    height: 5rem;
    background: #fff
}

#expanse{
    width: 100%;
    height: 6rem;
    background: #fff
}
#profit{
     width: 99%;
    height: 6rem;
    background: #fff

}
#manager{
     width: 99%;
    height: 6rem;
    background: #fff

}
.box{
    margin: 0 auto;
    background: #fff;
}

.color{
    
    width: 20px;
    height: 20px;
    display: inline-block;
    // background-color: #333;
}
.font{
    font-size: 0.20rem;
}

</style>