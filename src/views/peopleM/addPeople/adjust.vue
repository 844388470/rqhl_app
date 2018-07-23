<!-- 调动明细 -->
<template>
  <div class="mt10 adjust"  style="height: 100%;">
       <yd-cell-group class="mb0">
            <yd-cell-item class="option">
                <div slot="right" class="cf" @click="addTurnover"><i class="fl mr10">新增调动</i> <span class="fl icon_add">+</span></div>
            </yd-cell-item>
       </yd-cell-group>

        <yd-cell-group class="mb10" v-for="(item,index) in staff_turnover" :key="index">
            <yd-cell-item>
                <b slot="left">调动时间:</b>
                <yd-datetime type="date" v-model="item.turnover_date" slot="right"  :init-emit="false"></yd-datetime>
                <yd-icon slot="right" name="share2" size="0.34rem">删除</yd-icon>
                <span slot="right" class="blue ml5" @click="deleteTurnover(index)">删除调动</span>
            </yd-cell-item>
            <yd-cell-item>
                <b slot="left">公司:</b>
                <span class="" slot="right" @click="openModel('org',index)" style="width:100%;text-align:left;">{{item.fk_org_id | company_list}}</span> 
            </yd-cell-item>
            <yd-cell-item>
                <b slot="left">部门:</b>
                <span class="" slot="right" @click="openModel('hpl',index)" style="width:100%;text-align:left;">{{item.fk_hpl_id | project_list}}</span> 
            </yd-cell-item>
            <yd-cell-item>
                <b slot="left">护理组:</b>
                <span class="" slot="right" @click="openModel('group',index)" style="width:100%;text-align:left;">{{item.fk_dub_name || '请选择'}}</span> 
            </yd-cell-item>
        </yd-cell-group>
        

  </div>
</template>

<script>
import * as apii from '@/api/index'
import * as func from '@/utils'
export default {
    name:'adjust',
    props:{
      list: {
        type: Array,
        default(){
            return []
        }
      },
      id: {
        type: String,
        default:''
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
      }
    },
    data () {
        return {
            staff_turnover:[],
            form:{
                
            }
        }
    },
    mounted(){
        
    },
    methods:{
        addTurnover(){
            this.staff_turnover.push({
                pk_id:'',
                turnover_date:'',
                fk_org_id:'',
                fk_hpl_id:'',
                fk_dub_id:'',
                fk_dub_name:''
            })
        },
        deleteTurnover(index){
            this.$dialog.confirm({
                title: '警告',
                mes: '确认删除调动吗?',
                opts: () => {
                    this.staff_turnover.splice(index,1)
                }
            });
        },
        openModel(type,index){
            this.$emit('update:type', type)            
            this.$emit('update:index', index)            
            if(type=='org'){
                this.$emit('update:list', this.$store.getters.company_list)
                this.$emit('update:showModel', true)
            }else if(type=='hpl'){
                this.$emit('update:list', this.$store.getters.project_list.filter(_=>_.pid==this.staff_turnover[index].fk_org_id))
                this.$emit('update:showModel', true)
            }else if(type=='group'){
                if(!this.staff_turnover[index].fk_hpl_id){
                    this.$emit('update:list', [])
                    this.$emit('update:showModel', true)
                    return
                }
                apii.getGroupList(this.staff_turnover[index].fk_hpl_id).then(_=>{
                    this.$emit('update:list', _.data)
                    this.$emit('update:showModel', true)
                }).catch(()=>{})
            }
        },
        choice(type,name,id,index){
            
            if(type=='org'){
                this.staff_turnover[index].fk_org_id=id
                this.staff_turnover[index].fk_hpl_id=''
                this.staff_turnover[index].fk_dub_id=''
                this.staff_turnover[index].fk_dub_name=''
            }else if(type=='hpl'){
                this.staff_turnover[index].fk_hpl_id=id
                this.staff_turnover[index].fk_dub_id=''
                this.staff_turnover[index].fk_dub_name=''
            }else if(type=='group'){
                this.staff_turnover[index].fk_dub_id=id
                this.staff_turnover[index].fk_dub_name=name
            }
        }
    }
}

</script>
<style lang='scss' scoped>
    
</style>