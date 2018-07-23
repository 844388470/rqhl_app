<template>
  <div class="bed">
        <div class="header">
            <div  style="width:61%;display:inline-block;"><organ-select ></organ-select></div>
            <div  style="width:38%;display:inline-block">
                <yd-search v-model="value1" :on-submit="submitHandler"></yd-search>
            </div>
        </div>
        <div class="tab">
            <yd-tab :active-color="blue" >
                <yd-tab-panel label="总床位" ><allBed ></allBed></yd-tab-panel>
                <yd-tab-panel label="服务中"><serverBed></serverBed></yd-tab-panel>
                <yd-tab-panel label=" 空闲"><freeBed></freeBed></yd-tab-panel>
                <yd-tab-panel label="非空闲"><unfreeBed></unfreeBed></yd-tab-panel>
            </yd-tab>
        </div>
  </div>
</template>
<script>
import allBed from './allBed.vue'
import serverBed from './serverBed.vue'
import freeBed from './freeBed.vue'
import unfreeBed from './unfreeBed.vue'
    export default {
        name:'bed',
        components:{allBed,serverBed,freeBed,unfreeBed},
        data(){
            return{
                value1: '',
            }
        },
        methods: {
            submitHandler(value) {
                this.$dialog.toast({mes: `搜索：${value}`});
            }
        }
    }
</script>
<style lang="scss" scoped>
.yd-search{
    background: unset;
}
.yd-search-input{
    background: unset;
}

</style>

