<!-- 人员管理 -->
<template>
    <div id="peopleM">
    <yd-infinitescroll :callback="btomscroll" ref="infinitescrollDemo" :distance="50">
        <div class="peopleM" slot="list">
        
            <yd-cell-group style="">
                <yd-cell-item class="option" style="background-color:#70d2ff">
                    <div slot="right" class="cf" @click="searchOperat('open')"> <yd-icon name="search" class="fl" size='0.34rem'></yd-icon> <i class="fl">筛选</i></div>
                    <div slot="left" class="cf" @click="$router.push('addPeople')"><yd-icon name="error-outline" style="transform: rotate(45deg)" class="fl" size='0.34rem'></yd-icon><i class="fl">新增</i></div>
                </yd-cell-item>
            </yd-cell-group>
            
            <div class="formItem pl10 pr10" v-for="item in list" :key="item.id">
                <div class="peopleBox mt15 " @click="$router.push({name:'peopleInfo',params:{id:item.pk_id}})">
                        <div class="imgBox ml5">
                            <img  :src="item.image_url"/>
                        </div>
                        <div style="width:70%">
                        <p class="font1">{{item.name}}</p>
                        <p class="font2">{{item.staff_no}}</p>
                        <p class="font2 mt5 overflow">部门：<span>{{item.fk_hpl_id | project_list}}</span></p>
                        <p class="font2 mt5">护理组：<span>{{item.departments_name}}</span></p>
                        <p class="font2 mt5">岗位：<span>{{item.position_name}}</span></p>
                        </div>
                </div>
            </div>
    

    <!-- 搜索弹出框 -->
            <yd-popup  class="searchBox" v-model="showModel" position="center" width="90%">
                <p class="pt10 pl10">
                    <yd-cell-group>
                        <yd-cell-item>
                            <span slot="left">输入</span>
                            <input class="pl20" slot="right" type="text" v-model="search.search" placeholder="请输入姓名或订单号或手机号">
                        </yd-cell-item>
                        <yd-cell-item>
                            <b slot="left">公司:</b>
                            <span class="" slot="right" @click="openModel('org')" style="width:100%;text-align:left;">{{search.orgid | company_list}}</span> 
                        </yd-cell-item>
                        <yd-cell-item>
                            <b slot="left">项目:</b>
                            <span class="" slot="right" @click="openModel('hpl')" style="width:100%;text-align:left;">{{search.hplid | project_list}}</span> 
                        </yd-cell-item>
                        <yd-cell-item>
                            <b slot="left">护理组:</b>
                            <span class="" slot="right" @click="openModel('group')" style="width:100%;text-align:left;">{{search.group_id || '请选择'}}</span> 
                        </yd-cell-item>
                       
                    </yd-cell-group>    
                </p>
                <p style="text-align: center;padding:0.3rem">
                    <yd-button class="w20p mr20" shape="circle" type="hollow" :color="blue" @click.native="searchOperat('reset')">重置</yd-button>
                    <yd-button class="w20p" shape="circle" :bgcolor="blue" color="#FFF" @click.native="searchList">搜索</yd-button>
                </p>
            </yd-popup>
            <div class="zIndexmax">
                <mSearch :show.sync="sel.showModel" :result.sync="sel.list" @search="choice" :searchKey="sel.type"></mSearch>
            </div>
        </div>
    </yd-infinitescroll>    
    </div>
</template>

<script>
import * as api from '@/api/peopleM'
import * as apii from '@/api/index'
import mSearch from '@/components/mSearch'
export default {
    name:'peopleMindex',
    components:{mSearch},
    data () {
        return {
            showModel:false,
            sel:{
                showModel:false,
                list:[],
                type:''
            },
            radio:'',
            search:{
                search:'',
                states:'',
                orgid:'',
                hplid:'',
                groupid:'',
                groupname:'',
                search_req:'',
                states_req:'',
                orgid_req:'',
                hplid_req:'',
                groupid_req:'',
                groupname_req:''
            },
            list:[],
            orglist:this.$store.getters.company_list,
            grouplist:[]
        }
 },
 mounted(){
    this.getList()
 },
 methods:{
    searchOperat(val){
        if(val=='reset'){
            this.search.search=''
            this.search.states=''
            this.search.orgid=''
            this.search.hplid=''
            this.search.groupid=''
            this.search.groupname=''
        }
        if(val=='open'){
            this.showModel=true
            this.search.search=this.search.search_req
            this.search.states=this.search.states_req
            this.search.orgid=this.search.orgid_req
            this.search.hplid=this.search.hplid_req
            this.search.groupid=this.search.groupid_req
            this.search.groupname=this.search.groupname_req
        }
    },
    searchList(){
        this.search.search_req=this.search.search
        this.search.states_req=this.search.states
        this.search.orgid_req=this.search.orgid
        this.search.hplid_req=this.search.hplid
        this.search.groupid_req=this.search.groupid
        this.search.groupname_req=this.search.groupname
        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit')
        this.pageInfo.page=1
        this.list=[]
        this.getList()
    },
    btomscroll(){
        this.pageInfo.page=this.pageInfo.page+1
        this.getList()
    },
    getList(){
        api.getStaffList({
            fk_org_id:this.search.orgid_req,
            fk_hpl_id:this.search.hplid_req,
            fk_dub_id:this.search.groupid_req,
            search:this.search.search_req,
            page:this.pageInfo.page,
            limit:this.pageInfo.limit}).then(_=>{
            this.list=this.list.concat(_.data.data)
            if(_.data.current_page===_.data.last_page){
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone')
            }else{
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad')
            }
        }).catch(()=>{
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone')
        })
    },
    openModel(type){
        this.sel.type=type
        if(type=='org'){
            this.sel.list=this.$store.getters.company_list
            this.sel.showModel=true
        }else if(type=='hpl'){
            this.sel.list=this.$store.getters.project_list.filter(_=>_.pid==this.search.orgid)
            this.sel.showModel=true
        }else if(type=='group'){
            if(!this.search.hplid){
                this.sel.list=[]
                this.sel.showModel=true
                return
            }
            apii.getGroupList(this.search.hplid).then(_=>{
                this.sel.list=_.data
                this.sel.showModel=true
            }).catch(()=>{})
        }
    },
    choice(val,key){
        if(key=='org'){
            this.search.orgid=val.pk_id
            this.search.hplid=''
            this.search.groupid=''
            this.search.groupname=''
            this.orgshowModel=false
        }else if(key=='hpl'){
            this.search.hplid=val.pk_id
            this.search.groupid=''
            this.search.groupname=''
            this.hplshowModel=false
        }
        else if(key=='group'){
            this.search.groupid=val.pk_id
            this.search.groupname=val.name
            this.groupshowModel=false
        }
    },
 },
 computed:{
     
 },
 watch:{
     
 }
}

</script>
<style lang='scss' scoped>
.option{
    i{
       font-size: 32px;
       line-height: 0.4rem;
       margin-right:20px;
      color: white;
    }
}
.peopleBox{
    padding: 30px 15px;
    background: white;
    border-radius: 20px;
    box-shadow:  0 8px 30px #b9b8b8;
    display: flex;
    justify-content: space-between;
}
.imgBox{
    // border: 1px solid;
    width:25%;
    border-radius: 10px;
    overflow: hidden;

}
.font1{
    font-size: 0.26rem !important;
    font-weight: bold
}
.font2{
    font-size: 0.26rem !important
}
.overflow{
        overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

  
</style>
<style lang='scss'>
.zIndexmax{
    .yd-mask,.yd-popup{z-index:1502 !important;}
    .yd-popup{height:60% !important;}
    .yd-actionsheet-item{text-align:center;}
    .yd-preview-item>:first-child{
        text-align:left;
    }
  }
#peopleM{
    .yd-preview-item>:first-child{
        text-align:left;
    }
    .formItem .asd{
        i{
            vertical-align: middle;
        }
        p{
            width: 4rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
        }
    }
}

</style>