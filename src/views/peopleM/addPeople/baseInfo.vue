<!-- 基础信息 -->
<template>
  <div class="mt10">
   
      <!-- <yd-cell-group  class="mb0">
         <yd-cell-item>
            <h4 slot="left" class="title">基础</h4>     
        </yd-cell-item>
      </yd-cell-group> -->
      
     <yd-cell-group >
        <!-- <yd-cell-item>
            <b slot="left">公司:</b>
            <span class="" slot="right" style="width:100%;text-align:left;">{{staff_base.fk_org_id | company_list(true)}}</span> 
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">部门:</b>
            <span class="" slot="right" style="width:100%;text-align:left;">{{staff_base.fk_hpl_id | project_list(true)}}</span> 
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">护理组:</b>
            <span class="" slot="right" style="width:100%;text-align:left;">{{staff_base.group_id || ''}}</span> 
        </yd-cell-item> -->

        
          <div v-if="isAdd">  
            <yd-cell-item  @click.native="openModel('org')"> 
                <b slot="left">公司:</b>
                <span class="" slot="right" style="width:100%;text-align:left;">{{staff_base.fk_org_id | company_list(true)}}</span> 
            </yd-cell-item>
            <yd-cell-item @click.native="openModel('hpl')">
                <b slot="left">部门:</b>
                <span class="" slot="right"  style="width:100%;text-align:left;">{{staff_base.fk_hpl_id | project_list(true)}}</span> 
            </yd-cell-item>
            <yd-cell-item @click.native="openModel('group')">
                <b slot="left">护理组:</b>
                <span class="" slot="right"  style="width:100%;text-align:left;">{{staff_base.group_id || ''}}</span> 
            </yd-cell-item>
          </div>  

        <yd-cell-item>
            <b slot="left" class="bitian">名字:</b>
            <input slot="right" type="text" v-model="staff_base.name">
        </yd-cell-item>

        <yd-cell-item  type="label">
            <b slot="left" class="bitian">性别</b>
            <yd-radio-group  slot="left" v-model="staff_base.sex" :color="blue">
                <yd-radio class="mr20" val="1">男</yd-radio>
                <yd-radio val="2">女</yd-radio>
            </yd-radio-group>
        </yd-cell-item>

        <yd-cell-item>
            <b slot="left" class="bitian">身份证号:</b>
            <input slot="right" type="text" v-model="staff_base.id_card">
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left" class="bitian">岗位:</b>
            <span class="" slot="right" @click.stop="openModel('psn')" style="width:100%;text-align:left;">{{ filterName(staff_base.fk_psn_id,roleslist,'name') || '请选择' }}</span> 
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left" class="bitian">入职时间:</b>
            <yd-datetime type="date" start-date="1950-01-01"  v-model="staff_base.entry_time" slot="right" :init-emit="false"></yd-datetime>
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">身份证地区:</b>
            <input slot="right" type="text" @click.stop="openModel('city')" v-model="place" readonly placeholder="请选择">
            <!-- <input slot="right" type="text" @click.stop="openModel('city')" v-model="staff_base.city" readonly placeholder="请选择"> -->
        </yd-cell-item>

        <yd-cell-item>
            <b slot="left">详细地址:</b>
            <input slot="right" type="text"  v-model="staff_base.addr">
        </yd-cell-item>
      
        <yd-cell-item>
            <b slot="left" class="bitian">手机号码:</b>
            <input slot="right" type="number"  v-model="staff_base.phone">
        </yd-cell-item>

        <yd-cell-item arrow type="label">
            <b slot="left">最高学历</b>
            <span class="" slot="right" @click="openModel('xueli')" style="width:100%;text-align:left;">{{ edu_list.filter(i=>i.pk_id==staff_base.fk_dpa_id).length!==0?edu_list.filter(i=>i.pk_id==staff_base.fk_dpa_id)[0].name:'请选择'}}</span> 
        </yd-cell-item>    
      </yd-cell-group>
  
    <yd-cell-group class="mb0">
         <yd-cell-item>
            <h4 slot="left" class="title">银行信息</h4>     
             <div slot="right"  @click="addBank"> <span class=" icon_add">+</span></div>
        </yd-cell-item>
    </yd-cell-group>  
    <yd-cell-group class="mb10" v-for="(item,index) in staff_bank" :key="index">
      
           <yd-cell-item  type="label">
                <span slot="left">开户银行：</span>
                <select slot="right"  v-model="item.bank">
                    <option value="">选择你的开户银行</option>
                    <option value="中国银行">中国银行</option>
                    <option value="中国工商银行">中国工商银行</option>
                    <option value="中国农业银行">中国农业银行</option>
                    <option value="中国建设银行">中国建设银行</option>
                    <option value="交通银行">交通银行</option>
                    <option value="招商银行">招商银行</option>
                    <option value="浦发银行">浦发银行</option>
                    <option value="民生银行">民生银行</option>
                    <option value="兴业银行">兴业银行</option>
                    <option value="深发展银行">深发展银行</option>
                    <option value="华夏银行">华夏银行</option>
                    <option value="光大银行">光大银行</option>
                    <option value="广发银行">广发银行</option>
                    <option value="中信银行">中信银行</option>
                    <option value="邮政储蓄">邮政储蓄</option>
                    <option value="平安银行">平安银行</option>
                    <option value="浙商银行">浙商银行</option>
                    <option value="渤海银行">渤海银行</option>
                    <option value="恒丰银行">恒丰银行</option>
                </select>
                 <yd-icon  name="delete" size='0.38rem' color="#bbb" slot="right" @click.native="deleteBank(index)"></yd-icon>
         </yd-cell-item>
                             
        <yd-cell-item>
            <b slot="left">户名:</b>
            <input slot="right" type="text" v-model="item.position_name">
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">账号:</b>
            <input slot="right" type="text" v-model="item.bank_no">
        </yd-cell-item>
        <yd-cell-item>
            <b slot="left">开户行:</b>
            <input slot="right" type="text" v-model="item.create_bank_place">
        </yd-cell-item>
      
    </yd-cell-group>
    </div>
</template>

<script>
import * as apii from '@/api/index'
import * as func from '@/utils'
export default {
    props:{
        list: {
            type: Array,
            default(){
                return []
            }
        },
        type: {
            type: String,
            default:''
        },
        index: {
            type: Number,
            default:0
        },
        showModel: {
            type: Boolean ,
            default:false
        },
        showCity: {
            type: Boolean ,
            default:false
        },
        showPsn: {
            type: Boolean ,
            default:false
        },
        yxz: {
            type: Array,
            default(){
                return []
            }
        },
        roleslist:{
            type: Array,
            default(){
                return []
            }
        }
    },
    mounted(){
        this.isAdd = !this.$route.params.id
        
    },
    data () {
        return {
            isAdd:true, //是否添加
            radio:'',
            defUse:'',
            staff_base:{
                pk_id:'',
                fk_org_id:'',
                fk_hpl_id:'',
                fk_dpa_id:'',
                group_id:'',
                name:'',
                sex:'',
                id_card:'',
                addr:'',
                phone:'',
                provinceid:'',
                cityid:'',
                entry_time:'',
                fk_psn_id:[],
                city:''
            },
            staff_bank:[],
            place:''  //用来展示身份证地区，staff_base的city赋值照常进行
        }
    },
    methods:{
        openModel(type){
            if(type=='xueli'){
                this.$emit('update:type', type)           
                this.$emit('update:list', this.edu_list)
                this.$emit('update:index', -666)
                this.$emit('update:showModel', true)
            }else if(type=='city'){
                this.$emit('update:showCity', true)
            }else if(type=='psn'){
                this.$emit('update:showPsn', true)
                this.$emit('update:yxz', this.staff_base.fk_psn_id)
            }else if(type=='org'){
                 this.$emit('update:type', type)  
                 this.$emit('update:list', this.$store.getters.company_list)
                 this.$emit('update:index', -666)
                 this.$emit('update:showModel', true)
            }else if(type=='hpl'){
                 this.$emit('update:type', type)  
                this.$emit('update:list', this.$store.getters.project_list.filter(_=>_.pid==this.staff_base.fk_org_id))
                 this.$emit('update:index', -666)
                 this.$emit('update:showModel', true)
            }else if(type=='group'){
                 this.$emit('update:type', type)  
                 this.$emit('update:index', -666)

                 if(!this.staff_base.fk_hpl_id){
                    this.$emit('update:list', [])
                    this.$emit('update:showModel', true)
                    return
                      
                }
               apii.getGroupList(this.staff_base.fk_hpl_id).then(_=>{
                    this.$emit('update:list', _.data)
                    this.$emit('update:showModel', true)
                }).catch(()=>{})
            }

        },
        choice(type,name,id){
            if(type=='xueli'){
                this.staff_base.fk_dpa_id=id
            }else if(type=='city'){
                this.place  = name.itemName1+'/'+name.itemName2
                this.staff_base.city=name.itemName1+'/'+name.itemName2
                this.staff_base.provinceid=name.itemValue1
                this.staff_base.cityid=name.itemValue2
            }else if(type=='psn'){
                let list=[]
                name.forEach(res=>{
                    list.push(res.pk_id)
                })
                this.staff_base.fk_psn_id=list
            }else if(type=='org'){
                // console.log(id)
                this.staff_base.fk_org_id =  id  
                this.staff_base.fk_hpl_id =  ''  
                this.staff_base.fk_dub_id =  ''  
                this.staff_base.group_id =  ''                
            }else if(type=='hpl'){       
                this.staff_base.fk_hpl_id =  id  
                this.staff_base.fk_dub_id =  ''  
                this.staff_base.group_id =  ''        
            }else if(type=='group'){       
                
                this.staff_base.fk_dub_id =  id  
                this.staff_base.group_id =  name  
                  
            }

        },


        addBank(){
            this.staff_bank.push({
                bank:'',
                position_name:'',
                bank_no:'',
                create_bank_place:''
            })
        },
        deleteBank(index){
            this.$dialog.confirm({
                title: '警告',
                mes: '确认删除此银行信息吗?',
                opts: () => {
                    this.staff_bank.splice(index,1)
                }
            });
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
    },
        watch:{
            // 'place'(val,oldval){
            //     this.staff_base.city = this.place
            // }
        // 'staff_base1'(val,oldval){
        //     this.staff_base = JSON.parse(JSON.stringify(this.staff_base1))
        // }
    }
}

</script>
<style lang='scss' scoped>

</style>