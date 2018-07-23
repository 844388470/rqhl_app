<!-- 人员详细 -->
<template>
  <div class="peopleM pb10 peopleInfo">
      <yd-cell-group class="mb0">
            <yd-cell-item class="option" style="background: #70d2ff;">
                <div slot="right" class="devW"  @click="$router.push({name:'addPeople',params:{id:$route.params.id}})">
                 <yd-icon  name="compose" class="fl"  size="0.35rem"></yd-icon>
                 <i class=" mr5">编辑</i>
                 </div>
            </yd-cell-item>
       </yd-cell-group>
    <div class="mb10 pl10 pr10">  
        <div class="box mt10">
                    <div class="pt10 pb10 pl15 titleBox"><span class="baseTitle">基础</span></div>
                    <div class="contentBox mt10">
                        <span class="statePos" :class="['state',form.staff_status===0?'blue':form.staff_status===1?'no':'']">{{form.staff_status===0?'在职':form.staff_status===1?'离职':''}}</span>
                        <div class="imgBox">
                        <img class="head" :src="form.image_url?form.image_url:''"/>
                        </div>
                        <div class="infoBox">
                     <p class="fs fw">{{form.name}}</p>
                     <p class="" >{{form.staff_no}}</p>
                   <p class="fs mt10"> <span class="fw">公司：</span><span>{{form.fk_ogz_id | company_list}}</span></p>
                   <p class="fs mt5"> <span class="fw">部门：</span><span>{{form.fk_hpl_id | project_list}}</span></p>
                   <p class="fs mt5"> <span class="fw">护理组：</span><span>{{ form.group_id || '' }}</span></p>
                   <p class="fs mt5"> <span class="fw">岗位：</span><span>{{ filterName(form.fk_psn_id,roleslist,'name') }}</span></p>
                   <p class="fs mt5"> <span class="fw">出生年月：</span><span>{{form.birth_day}}</span></p>
                   <p class="fs mt5"> <span class="fw">最高学历：</span><span>{{filterName(form.fk_dpa_id,Basdate.staff_dpa,'name')}}</span></p>
                   <p class="fs mt5"> <span class="fw">身份证号：</span><span>{{form.id_card}}</span></p>
                   <p class="fs mt5"> <span class="fw">身份证住址：</span><span>{{form.addr}}</span></p>
                        </div>
                   </div>
      </div>
      </div>
      <yd-accordion v-if="familylist.length || staff_bank.length">
        <yd-accordion-item title="更多信息" ref="moreInfo" > 
            <div  class="_bg" >
                    <!--yd-cell-group class="">
                            <yd-cell-item>
                                <div slot="left">护理技能 </div>
                            </yd-cell-item>
                        <div class="btngroup">    
                            <yd-button  slot="left" bgcolor="#80d77b" color="#fff" shape="circle">生命体征检测</yd-button>
                            <yd-button  slot="left" bgcolor="#80d77b" color="#fff" shape="circle">育婴嫂</yd-button>
                            <yd-button  slot="left" bgcolor="#80d77b" color="#fff" shape="circle">月嫂</yd-button>          
                        </div>   
                    </yd-cell-group-->

                    <yd-cell-group class="pb10" v-for="item in familylist" :key="this">
                            <yd-cell-item>
                                <div slot="left">家庭成员 </div>
                            </yd-cell-item>
                            <yd-cell-item>
                                <span slot="left" class="mr40">{{item.name}} </span>
                                <span slot="left" >{{item.relation}}  </span>
                                <div slot="right"><span>{{item.phone}} </span> </div>
                            </yd-cell-item>        
                    </yd-cell-group>

                    <yd-cell-group class="pb10" v-for="item in staff_bank" :key="this">
                            <yd-cell-item>
                                <div slot="left">银行卡 </div>
                                <!--div slot="right" class="blue">更多> </div-->
                            </yd-cell-item>
                            <yd-cell-item>
                                <span slot="left" class="mr40">{{item.bank}}</span>
                                <span slot="left" >{{item.position_name}}</span>
                                <div slot="right"><span>{{item.bank_no}}</span> </div>
                            </yd-cell-item>
                            <yd-cell-item>
                                <span slot="left" class="mr40">{{'地址: '+item.create_bank_place}} </span>
                            </yd-cell-item>                 
                    </yd-cell-group>

                    <p class="blue tc up" @click="$refs.moreInfo.closeItem()">收起 ^</p> 

                   
                
            </div>
        </yd-accordion-item>
      </yd-accordion>  

     

        <!--div class="formItem mb10">
        <yd-preview :buttons="[]" class="mt10">
                <yd-preview-header>
                    <div slot="left"><span class="title">服务记录</span></div>
                    <div slot="right"></div>
                </yd-preview-header>

                <div>
                 <yd-preview-item>
                    <div slot="left"><span >张三</span></div>
                    <div slot="right"><span class="gray">订单号</span><span>11094659469</span></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left" ><span class="gray">起止时间</span></div>
                    <div slot="right"><span >2018.01.01</span> - <span>2018.01.28</span></div>
                </yd-preview-item>
                </div>

                <div>
                <yd-preview-item>
                    <div slot="left"><span >张三</span></div>
                    <div slot="right"><span class="gray">订单号</span><span>11094659469</span></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left" ><span class="gray">起止时间</span></div>
                    <div slot="right"><span >2018.01.01</span> - <span>2018.01.28</span></div>
                </yd-preview-item>
                </div>
        </yd-preview>
        </div>

       <yd-cell-group class="mt10">
            <yd-cell-item>
                <div slot="left">薪酬 </div>
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left" class="mr40">昨日薪酬预计 </span>
                <span slot="left" class="no" >200元</span>
                <div slot="right" class="blue"><span>查看明细</span> </div>
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left" class="mr40">本月薪酬预计 </span>
                <span slot="left" class="no" >3200元</span>
                <div slot="right" class="blue"><span>查看明细</span> </div>
            </yd-cell-item>
           
                      
       </yd-cell-group-->

      

       
  </div>

  
</template>

<script>
import * as api from '@/api/peopleM'
import * as apindex from '@/api/index'
export default {
  data () {
    return {
        form:{
            name:'',
            staff_no:'',
            fk_ogz_id:'',
            fk_hpl_id:'',
            group_id:'',
            psn_name:'',
            birth_day:'',
            id_card:'',
            phone:'',
            skills:''           //护理技能
        },
        Basdate:{
            staff_dpa:[]
        },
        piclist:[],
        familylist:[],
        roleslist:[],
        staff_bank:[]
    }
  },
  mounted(){
      if(!this.$route.params.id){
          this.$router.go(-1)
          return
      }
      document.getElementsByTagName('body')[0].scrollTop=0
      this.getInfo()
  },
  methods:{
      getInfo(){
        api.getAllStaffSelect().then(res=>{
            this.Basdate=res.data
        }).catch(()=>{})
        api.getAllRolesList().then(_=>{
            this.roleslist=_.data
        }).catch(_=>{})
        api.getStaffInfo({pk_id:this.$route.params.id}).then(res=>{
            this.form=res.data.staff_base_data
            this.staff_bank=res.data.staff_bank_data
            this.piclist=res.data.staff_pic_data
            this.familylist=res.data.staff_family_data
            if(res.data.staff_rau_turn_data.length){
                this.form.group_id=res.data.staff_rau_turn_data[0].fk_dub_name
            }
        }).catch(()=>{})
      },
      filterName(id,list,name){
        let names=''
        if(typeof id==='object'){
            list.forEach(res=>{
                id.forEach(data=>{
                    if(data==res.pk_id){
                        names=names?(names+','+res[name]):res[name]
                    }
                })
            })
        }else{
            list.forEach(res=>{
                if(id===res.pk_id){
                    names=res[name]
                }
            })
        }
        return names
      }
  }
}

</script>
<style lang='scss' scoped>
.btngroup{
    padding: 25px;
    button{
        margin-bottom: 10px;
        min-width: 15%;
        margin-right: 30px;

    }
}
.up{
    margin-top: -10px !important;
    line-height: 1rem;
    height: 1rem;
    margin-top: 0.3rem;
    font-size: 0.3rem;
    background: #fff
}
.peopleInfo .Info{
    :first-child{
        text-align:left;
        i{
            vertical-align: top;
        }
        span{
            display: inline-block;width: 4.5rem;
        }
    }
}
.baseTitle{
    font-size: 0.32rem;
    font-weight: bold
}
.titleBox{
    border-bottom: 0.02rem dashed #ededed 
}
.box{
     background: white;
    border-radius: 20px;
    box-shadow:  0 8px 30px #b9b8b8;
}
.contentBox{
    display: flex;
    position: relative;
    justify-content: space-between;
    padding: 10px 25px 60px 25px;

}
.imgBox{
 width: 28%;

}
.infoBox{
    width: 70%
}
.statePos{
    position: absolute;
    right: 40px;
}
.head{
    width:100%;height:50%;
    border-radius: 10px
}
.fw{
    font-weight: bold;
}
.fs{
    font-size: 0.3rem;
}
.devW{
    color: white
}
</style>