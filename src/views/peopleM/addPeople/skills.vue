<!-- 技能证照 -->
<template>
  <div class="mt10">
    <!--yd-cell-group class="mb0">
         <yd-cell-item>
            <h4 slot="left" class="title">护理技能</h4>     
        </yd-cell-item>
        <div>
             <yd-checkbox-group v-model="nurSkill" class="checkbox" :color='blue' size="18">
                <yd-checkbox val="1">生活护理</yd-checkbox>
                <yd-checkbox val="2">卫生护理</yd-checkbox>
                <yd-checkbox val="3">生命体征监测</yd-checkbox>
                <yd-checkbox val="4">鼻试管喂药</yd-checkbox>
                <yd-checkbox val="5">协同病患医检</yd-checkbox>
                <yd-checkbox val="6">基础护理技能</yd-checkbox>
                <yd-checkbox val="6">护士执业资格证</yd-checkbox>
                <yd-checkbox val="5">协同病患医检</yd-checkbox>
                <yd-checkbox val="6">基础护理技能</yd-checkbox>
                <yd-checkbox val="6">护士执业资格证</yd-checkbox>
            </yd-checkbox-group>
        </div>
    </yd-cell-group-->  


     <yd-cell-group class="mb0 mt10">
         <yd-cell-item>
            <h4 slot="left" class="title">基础表格/证照信息</h4>     
             <div slot="right"> <span class=" icon_add"  @click="addPic">+</span></div>
        </yd-cell-item>
    </yd-cell-group>  
     <yd-cell-group class="mb10" v-for="(item,i) in staff_pic_data" :key="i">
        <yd-cell-item type="label">
            <b slot="left">证件类型:</b>
            <span class="" slot="right" @click="openModel(i)" style="width:79%;text-align:left;">{{ picClass.filter(i=>i.pk_id===item.pic_class).length!==0?picClass.filter(i=>i.pk_id===item.pic_class)[0].name:'请选择'}}</span> 
            <yd-icon name="delete" size='0.34rem' color="#bbb" slot="right" @click="deletePic(i)"></yd-icon>     
            <span slot="right" class="blue ml5" @click="deletePic(i)">删除</span>
        </yd-cell-item>

          <yd-cell-item>
                <b slot="left">证件编号:</b>
                <input slot="right" type="text" v-model="item.cert_no">
          </yd-cell-item> 

        <yd-cell-item  type="label">
            <b slot="left">有效期类型</b>
            <yd-radio-group  slot="left" v-model="item.valid_type" :color="blue">
                <yd-radio class="mr20" val="0">截止日期</yd-radio>
                <yd-radio val="1">长期</yd-radio>
            </yd-radio-group>
        </yd-cell-item>

         <yd-cell-item v-if="item.valid_type==0">
            <b slot="left">起止时间:</b>
             <yd-datetime type="date" v-model="item.start_valid_time" slot="right" :init-emit="false"></yd-datetime>
             <yd-icon name="compose" slot="right"  size="0.34rem"></yd-icon>
             <span slot="right" class="ml15 mr15">至</span>
             <yd-datetime type="date" v-model="item.end_valid_time" slot="right" :init-emit="false"></yd-datetime>
             <yd-icon  name="compose" slot="right"  size="0.34rem"></yd-icon>
        </yd-cell-item>

        <yd-cell-item  type="label">
            <b slot="left">发证单位:</b>
            <input slot="right" type="text" v-model="item.check_org">
        </yd-cell-item>

        <yd-cell-item  type="label">
            <b slot="left">备注:</b>
            <input slot="right" type="text" v-model="item.mark">
        </yd-cell-item>
        <div style="padding-left:.24rem;">
            <peoplePicUpload imgType='staff' :leng="1" :idx="i" :apiMethod="p_api.getOss" @succ="sucmethod" :lists="item.list"></peoplePicUpload>
        </div>
        
        <!--mUpload :apiMethod="api.getOss" :isnowUpload="false"></mUpload--> 
     </yd-cell-group>
  </div>
</template>

<script>
import * as api from '@/api/index'
import * as func from '@/utils'
import peoplePicUpload from '@/components/peoplePicUpload'
import * as p_api from "@/api"
export default {
    components:{peoplePicUpload},
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
        picClass:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data () {
        return {
            api,
            p_api,
            checkbox:[],
            radio:'',
            datetime:'',
            staff_pic_data:[]
        }
    },
     methods:{
        addPic(){
            this.staff_pic_data.push({
                cert_no:'',
                image_url:'',
                pic_class:'',
                valid_type:0,
                start_valid_time:'',
                end_valid_time:'',
                check_org:'',
                mark:''
            })
        },
        deletePic(index){
            this.$dialog.confirm({
                title: '警告',
                mes: '确认删除证照吗?',
                opts: () => {
                    this.staff_pic_data.splice(index,1)
                }
            });
        },
        openModel(i){
            this.$emit('update:type','pic')
            this.$emit('update:list', this.picClass)
            console.log(this.picClass)
            this.$emit('update:index', i)
            this.$emit('update:showModel', true)
            
        },
        choice(id,index){
            this.staff_pic_data[index].pic_class=id
        },
        sucmethod(index,url){
            this.staff_pic_data[index].image_url=url
        }
    }
}

</script>
<style lang='scss' scoped>

</style>