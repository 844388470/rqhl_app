<!-- 经营数据 -->
<template>
  <div>
      <mSearch  :show.sync="searchShows" @search="okselect" :result="types" :searchKey="searchKey"/>
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

                        <yd-cell-item > 
                            <span slot="left" class="flex-5 ellipsis">类型：</span>
                            <yd-radio-group v-model="searchData.type" slot="left">
                                <yd-radio val="d">日报</yd-radio>
                                <yd-radio val="m">月报</yd-radio>
                            </yd-radio-group>
                            
                        </yd-cell-item>

                        <yd-cell-item arrow>
                            <span slot="left">{{searchData.type=='d'?'开始日期':'开始月份'}}:</span>
                            <yd-datetime v-show="searchData.type=='m'" start-year="2017" type="month" :init-emit="false"  v-model="searchData.startm" slot="right"></yd-datetime>
                            <yd-datetime v-show="searchData.type=='d'" start-year="2017" type="date" :init-emit="false"  v-model="searchData.startd" slot="right"></yd-datetime>
                        </yd-cell-item>

                        <yd-cell-item arrow>
                            <span slot="left">{{searchData.type=='d'?'结束日期':'结束月份'}}:</span>
                            <yd-datetime v-show="searchData.type=='m'"  start-year="2017" :init-emit="false" type="month" v-model="searchData.endm" slot="right"></yd-datetime>
                            <yd-datetime v-show="searchData.type=='d'" start-year="2017" :init-emit="false" type="date" v-model="searchData.endd" slot="right"></yd-datetime>
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
        <yd-cell-group class="mb10 mt10 box">
            <yd-cell-item>
                <span slot="left" >收入折线图</span>
            </yd-cell-item>
            <yd-cell-item class="not"   @click.native="searchShows=true">
                <span slot="left" >收入总额:{{total || 0}}</span>
                <span slot="right" class="flex-5 ellipsis">收入项目:{{types.filter(res=>res.pk_id===currenttype)[0].name}}</span>
            </yd-cell-item>
             <div id="profit"></div>
        </yd-cell-group>

        <div class="flex">
                <span class="flex-1">床位数量:{{datas.bed || 0}}</span>
                <span class="flex-1">在册护工数:{{datas.staff_count || 0}}</span>
        </div>
         <div class="flex">
                <span class="flex-1">月分娩量:{{datas.child_birth || 0}}</span>
                <span class="flex-1">在岗护工数:{{datas.in_work || 0}}</span>
        </div>
         <div class="flex">
                <span class="flex-1">客户人数:{{datas.customer || 0}}</span>
                <span class="flex-1">护工陪护比:{{datas.staff_pro || 0}}</span>
        </div>
      <!-- 收入数据结构图 -->
       <yd-cell-group class="mb10 mt10">
            <yd-cell-item>
                <span slot="left" >收入占比图</span>
            </yd-cell-item>
             <div id="income" ></div> 
             <div class="pb20">
                <div>
                    <div :class="{'pr10':i%2==0,'pl10':i%2==1,'flex-1':1 , 'font':1, 'tr':i%2==0}"  v-for="(item , i) in incomeData" :key="i" style="width:50%;float:left;"><div :style="{'background-color':color[i]}" class="color"></div > {{item.name}} : {{item.value}} </div>            
                    <div style="clear:both;"></div>           
                </div> 
             </div>    
        </yd-cell-group>
        
        <span class="anniul" @click="routerList">查看明细</span>
       
  </div>
</template>

<script>
import * as api from '../../api/count'
import mSearch from '../../components/mSearch'
import {mapGetters} from 'vuex'
import mSearchs from '../../components/mSearchs'
import moment from 'moment'
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
     ...mapGetters(['company_list','PROJECT_LIST'])
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
          fk_org_id:[],  //公司ID
          fk_hpl_id:[],  //项目ID
          startm:moment().subtract(7,'months').format('YYYY-MM'), 
          startd:moment().subtract(7,'days').format('YYYY-MM-DD'), 
          endm:moment().format('YYYY-MM'),
          endd:moment().format('YYYY-MM-DD'),
          start:'',
          end:'',
          type:'d'
      },
      incomeShow:true, //收入结构展示
      color:['#5bacf9','#9fe08d','#f95b67','#faca39','#5bd0f9',
      '#fa7639','#fade39','#59e5a6','#d0fa39','#635bf9','#a8fa39','#b4f95b',
      '#f370da','#ff7134','#2b9de6','#3334ee','#31d6e4'],
      //收入的数据

    incomeData:[],
       

      //曲线
      profitData:[],
      searchShows:false,
      datas:{}, //返回的数据
      types:[
          {pk_id:'all',name:'全部'},
          {pk_id:'hospital_care',name:'院护'},
          {pk_id:'breast_care',name:'乳护'},
          {pk_id:'home_care',name:'上户'},
          {pk_id:'appreciation',name:'增值服务'},
          {pk_id:'other',name:'其他'}
      ],
      currenttype:'all',
      total:0
    }
  },

  
  mounted () {
      this._searchData = JSON.parse(JSON.stringify(this.searchData))    
        if(sessionStorage.getItem('incomeSD')){

            this.searchData = JSON.parse(sessionStorage.getItem('incomeSD'))
        }else{
             try {
               this.searchData.fk_org_id.push(this.company_list[0].pk_id)
          } catch (error) {
              this.searchData.fk_org_id[0] = 0
              
          }
        }
      

         
      
      this.finance_operation()
  },
  methods: {
      //搜索 后返回
      handleSearch(res,key){
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
      okselect(res,key){
          if(res.pk_id){
            this.currenttype=res.pk_id
            this.series={
                header:[],
                body:[]
            }
            this.total=0
            for(let i in this.datas.rows){
                if(res.pk_id==this.datas.rows[i].key){
                    for(let j in this.datas.rows[i].detail){
                        this.series.header.push(this.datas.rows[i].detail[j].time)
                        this.series.body.push(this.datas.rows[i].detail[j].income)
                    }
                    this.total=this.datas.rows[i].value
                }
            }
            this.profitDataInit()
          }
      },
      //提交搜索数据
      submit(){
          this.finance_operation()
          this.$refs.accordion.closeItem()
      },
      
      //重置搜索数据
      reset(){
          
          this.searchData=JSON.parse(JSON.stringify(this._searchData))
      },

      //获取数据
      finance_operation(){
          if(this.searchData.type=='d'){
            this.searchData.start=this.searchData.startd
            this.searchData.end=this.searchData.endd
          }else{
            this.searchData.start=this.searchData.startm
            this.searchData.end=this.searchData.endm
          }
          this.currenttype='all'
          api.getIncomeQuery(this.searchData).then(res=>{
              this.series={
                  header:[],
                  body:[]
              }
              this.incomeData=[]
              for(let i in res.data.rows){
                    res.data.rows[i].value=Number(res.data.rows[i].value.toFixed(2))
                    if(res.data.rows[i].key!=='all'){
                        this.incomeData.push({value:res.data.rows[i].value,name:res.data.rows[i].name})
                    }else{
                        this.total=res.data.rows[i].value
                    }
              }
              for(let i in res.data.rows[0].detail){
                this.series.header.push(res.data.rows[0].detail[i].time)
                this.series.body.push(res.data.rows[0].detail[i].income)
              }
              this.datas=res.data
              this.profitDataInit()
              this.incomeDataInit()
              sessionStorage.incomeSD = JSON.stringify(this.searchData)
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
            tooltip : {
                trigger: 'item'
            },
            color:this.color

        });

      },
      //线状图
      profitDataInit(){
       echarts.init(document.getElementById('profit')).setOption({
            color:this.color,
            legend: {

            },
             tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '18%',
                right:'12%',
                bottom:'15%'
            },
            xAxis: {
                name:'时间',
                type: 'category',
                data: this.series.header
            },
            yAxis: {
                name:'元',
                type: 'value'
            },
            series:[{
                data:this.series.body,
                type: 'line'
            }]
       })
      },
      routerList(){
          if(this.searchData.fk_org_id.length==0){
                this.$dialog.toast({
                    mes: '公司不得为空',
                    timeout: 1000,
                    icon: 'error',
                });
              return
          }
          this.searchData.all_income=this.datas.all_income
          this.$router.push({ name: '/count/incomeList', params: { data: JSON.stringify(this.searchData)}})
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
}
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
.not.yd-cell-item:not(:last-child):after {
    border-bottom: 0;
}
.anniul{
    text-align: center;
    position: relative;
    border: none;
    pointer-events: auto;
    width: 100%;
    display: block;
    font-size: 0.36rem;
    height: 1rem;
    line-height: 1rem;
    margin-top: 0.5rem;
    border-radius: 3px;
    background-color: rgb(91, 172, 249);
    color: #FFF;
}
</style>