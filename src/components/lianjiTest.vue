<template>
    <div>
        <yd-cell-group>
            <yd-cell-item arrow>
                <span slot="left">所在地区：</span>
                <input slot="right" type="text" @click.stop="show2 = true" v-model="model2" readonly placeholder="请选择收货地址">
            </yd-cell-item>
        </yd-cell-group>

        <yd-cityselect
                title="请选择"
                v-model="show2"
                ref="cityselectDemo"
                :callback="result2"
                :items="dis1"
               
        ></yd-cityselect>
    </div>
</template>

<script>
import{mapGetters ,mapState} from 'vuex'
import * as api from '../api/company'
    /* 前提是已经安装了 ydui-district */
    export default {
        beforeMount(){
          api.getTreeList('dub').then(res=>{
              console.log(res)
              this.distri = JSON.parse(JSON.stringify(res.list))
              console.log(this.dis1,1)
              console.log(this.distri,2)
          })
        },
        data() {
            return {
                show2: false,
                model2: '新疆 乌鲁木齐市 天山区',
                distri:[]
            }
        },
        methods: {
            result2(ret) {
                console.log(ret)
                this.model2 = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3
            }
        },
        computed:{
           ...mapState(['company_list','project_list']),
           ...mapGetters(['company_list','project_list']),
           dis1(){
              let c = this.company_list
              let p =this.project_list
              let towArr = new Array(p.length).fill().map((item,i)=>({v :p[i].pk_id, n:p[i].name ,pid: p[i].pid ,c: [ {v: '1', n: '城区'}] }))
              let oneArr = new Array(c.length).fill().map((item,i)=>({c:towArr.filter((item1,index)=>c[i].pk_id == item1.pid),  n:c[i].name ,v :c[i].pk_id }))
              return oneArr
           }  
        }
    }
</script>