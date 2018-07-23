<!-- 数据上报 -->
<template>
  <div id="dataReport">
       <mSearchs  :show.sync="searchShow" @search="handleSearch"  :result="searchResult" :searchKey="searchKey"  :yxz="yxz"/>
      <div>
          <yd-accordion>
            <yd-accordion-item ref="accordion" class="mselect">
                  <div slot="title">
                    <div> {{searchData.fk_hpl_id | project_list_mores}}</div>
                    <yd-button :bgcolor="blue" color="#FFF" ><yd-icon class="mr5" size="0.28rem" name="search"></yd-icon>筛选</yd-button>
                  </div>

                <div style="padding: .24rem;">
                     <yd-cell-group>
                       

                        <yd-cell-item class="f_ellipsis" @click.native="openSearchBox('fk_hpl_id')"> 
                            <span slot="left" class="flex-5 ellipsis">网点：{{searchData.fk_hpl_id | projects_list }}</span>         
                        </yd-cell-item>
                        <yd-cell-item class="f_ellipsis" @click.native="openSearchBox('fk_dub_id')"> 
                            <span slot="left" class="flex-5 ellipsis" >科室：{{fk_dub_name_arr | fk_dub_name_arr_filert}}</span>
                            
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
    <div style="margin-top:20px;">
         <yd-infinitescroll :callback="getList" ref="infinitescrollDemo">
        <yd-list theme="1" slot="list">
          <div v-for="(item, key) in pageData" class="redBox" :key="key" >
            <p>网点:{{item.hospital_name}}</p>
            <yd-flexbox >
                <yd-flexbox-item> 
                    <p>科室:{{item.group_name}}</p>
                    <p>分娩量:{{item.childbirth}}</p>
                </yd-flexbox-item>
                <yd-flexbox-item>
                    <p>月份:{{item.date}}</p>
                    <p>住院数:{{item.hospitalization}}</p>
                </yd-flexbox-item>
            </yd-flexbox>
        </div>
        </yd-list>
         </yd-infinitescroll>
    </div>


	

     <yd-backtop></yd-backtop>

        <yd-tabbar  slot="tabbar" fixed  >
            <div class="tc w100p pt5 pb5">
                  <yd-button class="w30p " color="#fff" :bgcolor="blue"  @click.native="searchOperat()">添加</yd-button>

            </div>
         
        </yd-tabbar>
	

    <!-- 搜索弹出框 -->
	<yd-popup  class="searchBox" v-model="showModel" position="center" width="90%">
		<p class="pt10 pl10">
			<yd-cell-group>
				 
				<yd-cell-item>
					<b slot="left">网点:</b>
					<span class="" slot="right" @click="openModel('hpl')" style="width:100%;text-align:left;">{{reportedData.hplid | project_list}}</span> 
				</yd-cell-item>
				<yd-cell-item>
					<b slot="left">科室:</b>
					<span class="" slot="right" @click="openModel('dub')" style="width:100%;text-align:left;">{{reportedData.dub_name || '请选择'}}</span> 
				</yd-cell-item>
				<yd-cell-item>
					<b slot="left">上报时间:</b>
                	<yd-datetime type="month" v-model="reportedData.reported_date" slot="right"  :init-emit="false"></yd-datetime>
				</yd-cell-item>
				<yd-cell-item>
					<b slot="left">住院数:</b>
                	<input class="pl20" slot="right" type="text" v-model="reportedData.hospitalization" placeholder="请输入住院数">
				</yd-cell-item>
				<yd-cell-item>
					<b slot="left">分娩量:</b>
                	<input class="pl20" slot="right" type="text" v-model="reportedData.childbirth" placeholder="请输入分娩量">
				</yd-cell-item>
			
			</yd-cell-group>    
		</p>
		<p style="text-align: center;padding:0.3rem">
			<yd-button class="w20p mr20" shape="circle" @click.native="showModel=false" type="hollow" :color="blue" >取消</yd-button>
			<yd-button class="w20p" shape="circle" type="danger" :bgcolor="blue" color="#FFF" @click.native="reportedDataInfo">确认</yd-button>
		</p>
	</yd-popup>
	<div class="zIndexmax">
		<mSearch :show.sync="sel.showModel" :result.sync="sel.list" @search="choice" :searchKey="sel.type"></mSearch>
	</div>
    
  </div>
</template>

<script>
import mSearch from '@/components/mSearch'
import mSearchs from '../../components/mSearchs'
import * as apii from '@/api/index'
import moment from 'moment'
import {mapGetters} from 'vuex'
export default {
	 name:'dataReportIndex',
    components:{mSearch,mSearchs},
      computed: {
     ...mapGetters(['company_list','PROJECT_LIST']) ,
      },
  data () {
    return {
        fk_dub_name_arr:[], // 科室名字
        dataList:[],//数据列表
        showModel:false,
          // 搜索组件参数
        searchShow:false,
        searchKey:'key',
        yxz:[], //已选中的值 
        searchResult:[],
        search:{}, //返回的搜索数据
        _searchData:{},
        searchData:{ 
            fk_hpl_id:[],  //项目ID
            fk_dub_id:[],  //科室ID
            start:moment().format('YYYY-MM'), 
            end:moment().format('YYYY-MM'), 
        },
		  sel:{
                showModel:false,
                list:[],
                type:''
			},
            project_list:[],
            _reportedData:{},
			reportedData:{
                hplid:'',
                dubid:'',
                dub_name:'',
                hplid_req:'',
                dubid_req:'',
				dub_name_req:'',
				reported_date:moment().format('YYYY-MM'),
				hospitalization:'',
				childbirth:''
            },     
    }
  },
  mounted(){     
    this._searchData = JSON.parse(JSON.stringify(this.searchData))
     this._reportedData = JSON.parse(JSON.stringify(this.reportedData))
     this.getList()
  },
  methods:{
      getList(){
          let data={
            fk_hpl_id:this.searchData.fk_hpl_id,
            fk_dub_id:this.searchData.fk_dub_id,
            start:this.searchData.start,
            end:this.searchData.end
        }
         Object.assign(data,this.pageInfo) 
       
          apii.getDateList(data).then(_=>{
              this.dataList=_.data.data
              this.handelScrollResult(_) 
          })
      },
       searchOperat(){
            this.showModel=true  
    	},
	   openModel(type){
        this.sel.type=type
        if(type=='hpl'){
            this.sel.list=this.$store.getters.project_list
            this.sel.showModel=true
            this.reportedData.dub_name=''
        }else if(type=='dub'){
            if(!this.reportedData.hplid){
                this.sel.list=[]
                this.sel.showModel=true
                return
            }
            apii.getDubList(this.reportedData.hplid).then(_=>{
                this.sel.list=_.data
                this.sel.showModel=true
            }).catch(()=>{})
        }
	},
	  choice(val,key){
     if(key=='hpl'){
            this.reportedData.hplid=val.pk_id
            this.hplshowModel=false
        }
        else if(key=='dub'){
            this.reportedData.dubid=val.pk_id
            this.reportedData.dub_name=val.name
            this.dubshowModel=false
        }
    },
    //打开搜索面板
    openSearchBox(v){
         if(v=='fk_org_id'){
           
         }else if(v=='fk_hpl_id'){
           
             this.yxz = JSON.parse(JSON.stringify(this.searchData.fk_hpl_id))
           let PROJECT_LIST = this.PROJECT_LIST
          
             this.searchResult = JSON.parse(JSON.stringify(PROJECT_LIST))
             this.searchKey = v
             this.searchShow=true

         }else if(v=='fk_dub_id'){
             if(!this.searchData.fk_hpl_id.length){
                 this.error('请选择网点')
                 return 
             }
             apii.getDubList(this.searchData.fk_hpl_id).then(_=>{
                this.searchData.fk_dub_id_list=_.data
                console.log(this.searchData.fk_dub_id)
                 this.yxz = JSON.parse(JSON.stringify(this.searchData.fk_dub_id))   
                 this.searchResult = JSON.parse(JSON.stringify(this.searchData.fk_dub_id_list))
                 
                this.searchKey = v
                this.searchShow=true
            }).catch(()=>{})
         }
         
      },
    //   //搜索 后返回
      handleSearch(res,key){
        
        
        if(key == 'fk_hpl_id'){
               console.log(res)
              this.searchData.fk_hpl_id = res.map(i=> i.pk_id)  
               this.fk_dub_name_arr = [] 
              this.searchData.fk_dub_id = []
              
          }else if(key == 'fk_dub_id'){
              console.log(res)
              this.fk_dub_name_arr = []
              this.fk_dub_name_arr = res.map(i=>i.name)
              this.searchData.fk_dub_id = []
              this.searchData.fk_dub_id = res.map(i=> i.pk_id)
               
          }     
      },
      
    //     //提交搜索数据
      submit(){
        this.$refs.accordion.closeItem()
        this.pageData=[]
        this.pageInfo.page=1
        this.clearScrollResult()
        this.getList()
        
      },
      
      //重置搜索数据
      reset(){
          this.searchData=JSON.parse(JSON.stringify(this._searchData))
          this.fk_dub_name_arr = []
          this.submit()
      },


	reportedDataInfo(){
		let data={
			fk_hpl_id:this.reportedData.hplid,
			fk_dub_id:this.reportedData.dubid,
			date:this.reportedData.reported_date,
			hospitalization:this.reportedData.hospitalization,
			childbirth:this.reportedData.childbirth
		}
		apii.setReportedDataInfo(data).then(_=>{    
            this.success('添加成功')
            this.showModel=false
            this.pageData=[]
            this.pageInfo.page=1
            this.clearScrollResult()
            this.getList()
		})
	}
  },
  filters:{
    fk_dub_name_arr_filert(v){
       
        if(!v.length){
            return '请选择'

        }else{
           return v.join(',')
        }
    }
  },
  watch:{
      showModel(v){
         if(!v){
             this.reportedData = JSON.parse(JSON.stringify(this._reportedData))
         }
      }
  }
}

</script>
<style lang='scss' scoped>
#dataReport{
    p{
        padding:5px;
        color: #333;
    }
    padding-bottom: 1.2rem;
}
.redBox{
    background: #fff;
    margin-bottom: 0.2rem;
    padding: 0.2rem;
    font-size: 0.28rem;
    line-height: 0.5rem;
    color: #333;
}

</style>
<style lang="scss">
.zIndexmax{
    .yd-mask,.yd-popup{z-index:1502 !important;}
    .yd-popup{height:60% !important;}
    .yd-actionsheet-item{text-align:center;}
    .yd-preview-item>:first-child{
        text-align:left;
    }
  }
  
</style>
