<!-- 新增人员 -->
<template>
  <div class="box addpeople">
    <mSearch :show.sync="sel.showModel" :result.sync="sel.list" @search="choice" :searchKey="[sel.type,sel.index]"></mSearch>
    <mSearchs :show.sync="sel.showPsn" :result.sync="sel.Psnlist" @search="psnconfim" :yxz="sel.yxz"></mSearchs>
    <yd-layout class="m_tabbar">
        <yd-tab :active-color="blue" class="businessOpen mb20">
            <yd-tab-panel label="基础信息"><baseInfo ref="baseInfo"  :list.sync="sel.list" :showModel.sync="sel.showModel"  :type.sync="sel.type" :index.sync="sel.index" :showCity.sync="sel.showCity" :showPsn.sync="sel.showPsn" :yxz.sync="sel.yxz" :roleslist.sync="sel.Psnlist"/></yd-tab-panel>
            <yd-tab-panel label="技能证照"><skills ref="skills" :list.sync="sel.list" :showModel.sync="sel.showModel"  :type.sync="sel.type" :index.sync="sel.index" :picClass="Basdate.staff_pic_class"/></yd-tab-panel>
            <yd-tab-panel v-if="!isAdd" label="调动明细"><adjust ref="adjust" :list.sync="sel.list" :showModel.sync="sel.showModel"  :type.sync="sel.type" :index.sync="sel.index"/></yd-tab-panel>
        </yd-tab>

        <yd-tabbar slot="tabbar" class="bg">
            <div class="tc w100p pb5">
                <yd-button class="pt5 pb5 pr40 pl40" bgcolor="#41d5ff" color="#fff" shape="circle" @click.native="baocun">保存</yd-button>
            </div>
        </yd-tabbar>

    </yd-layout>
    <yd-cityselect ref="cityselect" v-model="sel.showCity" :columns="1" :callback="address" :items="sel.district"></yd-cityselect>
  
  </div>
</template>

<script>
import adjust from './adjust'
import baseInfo from './baseInfo'
import skills from './skills'
import mSearch from '@/components/mSearch'
import mSearchs from '@/components/mSearchs'
// import { provinceAndCityData } from 'element-china-area-data'
import District from 'ydui-district/dist/gov_province_city_id'
import * as api from '@/api/peopleM'
export default {
  name:'addPeople',
  components:{adjust,baseInfo,skills,mSearch,mSearchs},
  data () {
    return {
         isAdd:false,
        sel:{
            list:[],
            showModel:false,
            class:'',
            type:'',
            index:0,
            showCity:false,
            district: District,
            showPsn:false,
            Psnlist:[],
            yxz:[]
        },
        city:{
            provance:'',
            city:''
        },
        Basdate:{
            staff_pic_class:[]
        },
    }
  },
  mounted(){
        this.getBase()
        this.isAdd = !this.$route.params.id
        if(this.$route.params.id){
            api.getStaffInfo({pk_id:this.$route.params.id}).then(res=>{
                res.data.staff_base_data.group_id=res.data.staff_rau_turn_data.length?res.data.staff_rau_turn_data[0].fk_dub_name:''
                res.data.staff_base_data.fk_org_id=res.data.staff_rau_turn_data.length?res.data.staff_rau_turn_data[0].fk_org_id:''
                this.$refs.baseInfo.staff_base=JSON.parse(JSON.stringify(res.data.staff_base_data))
                console.log(res.data.staff_base_data)
                this.$refs.baseInfo.staff_bank=res.data.staff_bank_data


                try {
                    this.$refs.adjust.staff_turnover=res.data.staff_rau_turn_data
                    
                } catch (error) {
                    
                }
                
                res.data.staff_pic_data.forEach(respic=>{
                    respic.list=[{
                        allUrl:respic.image_url
                    }]
                },)
                this.$refs.skills.staff_pic_data=res.data.staff_pic_data
                if(res.data.staff_base_data.provinceid&&res.data.staff_base_data.provinceid!=='0'){
                    let city={}
                    District.forEach(rescity=>{
                        if(rescity.v==res.data.staff_base_data.provinceid){
                            city.itemName1=rescity.n
                            city.itemValue1=rescity.v
                            if(res.data.staff_base_data.cityid){
                                rescity.c.forEach(rescc=>{
                                    if(rescc.v==res.data.staff_base_data.cityid){
                                        city.itemName2=rescc.n
                                        city.itemValue2=rescc.v
                                        return
                                    }
                                })
                            }
                            return
                        }
                    })
                    this.address(city)
                }
            }).catch(()=>{})
        }
  },
  methods:{
    getBase(){
        api.getAllStaffSelect().then(res=>{
            this.Basdate=res.data
        }).catch(()=>{})
        api.getAllRolesList().then(_=>{
            this.sel.Psnlist=_.data
        }).catch(_=>{})
    },
    psnconfim(val,key){
        this.$refs.baseInfo.choice('psn',val)
    },
    address(res){
        this.$refs.baseInfo.choice('city',res)
    },
    choice(val,key){
        if(this.sel.type==='pic'){
            this.$refs.skills.choice(val.pk_id,key[1])
            return
        }
        if(key[1]==-666){
            this.$refs.baseInfo.choice(key[0],val.name,val.pk_id,key[1])
        }else{
            this.$refs.adjust.choice(key[0],val.name,val.pk_id,key[1])
        }
    },
    baocun(){
        let base=this.$refs.baseInfo.staff_base
        let value = this.$route.params.id?this.$refs.adjust.staff_turnover:""
        let form={
            staff_base_data:{
                name:base.name,
                sex:base.sex,
                id_card:base.id_card,
                fk_psn_id:base.fk_psn_id,
                entry_time:base.entry_time,
                provinceid:base.provinceid,
                cityid:base.cityid,
                addr:base.addr,
                phone:base.phone,
                fk_dpa_id:base.fk_dpa_id,
                fk_org_id:base.fk_org_id,
                fk_hpl_id:base.fk_hpl_id,
                group_id:base.group_id||''
                
            },
            staff_bank_data:this.$refs.baseInfo.staff_bank,
            staff_pic_data:this.$refs.skills.staff_pic_data,
            staff_rau_turn_data:value
        }

        try {
            this.$refs.adjust.staff_turnover=res.data.staff_rau_turn_data
        } catch (error) {
            
        }
        
        if(this.$route.params.id){
            form.staff_base_data.pk_id=this.$route.params.id
            api.editStaff({staff_data:form}).then(res=>{
                this.$dialog.toast({
                    mes: '保存成功',
                    timeout: 1000,
                    icon: 'success'
                });
                setTimeout(()=>{
                    // this.$router.push({name:'peopleInfo',params:{id:this.$route.params.id}})
                    this.$router.back()
                },1000)
            }).catch(()=>{})
        }else{
            api.addStaff({staff_data:form}).then(res=>{
                this.$dialog.toast({
                    mes: '保存成功',
                    timeout: 1000,
                    icon: 'success'
                });
                setTimeout(()=>{
                    this.$router.back()
                },1000)
            }).catch(()=>{})
        }
    }
  }
}

</script>
<style lang='scss' scoped>
.box{
    height: 100%;
}
.addpeople .zIndexmax{
        .yd-mask,.yd-popup{z-index:1502 !important;}
        .yd-popup{height:40% !important;}
        .yd-actionsheet-item{text-align:center;}
    }
.bg{
    background-color: rgba(0, 0, 0, 0) !important
}
</style>