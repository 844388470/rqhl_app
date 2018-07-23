<template>
    <div class="allBed">
        <ul>
            <li class="bedList" v-for="(item,index) in data" :key="index" @click="fn()">
                <div class="item">
                    <span class="bedName">D001</span>
                    <span v-bind:class="item.isFree ? 'free' : (item.isUnfree ? 'unfree' : 'inService' )" class="state">{{item.stateName}}</span>
                </div>
                <div v-bind:class="item.isFree ? 'none' : (item.isUnfree ? 'none' : 'show' )" class="content" >
                    <p>
                        <span class="name">张三<b>|</b></span>
                        <span class="tel">{{12546325412}}</span>
                    </p>
                    <p>
                        <span class="project">服务产品</span>
                        <span class="title">院护 催乳</span>
                    </p>
                </div>
            </li>
        </ul>
        <yd-popup v-model="show1" position="center" width="90%">
            <yd-cell-group>
                <yd-cell-item>
                    <span class="title" slot="left">床号</span>
                    <yd-input slot="right" v-model="input1"  placeholder="请输入床号"></yd-input>
                </yd-cell-item>
                <yd-cell-item>
                    <span class="title" slot="left">状态</span>
                    <yd-input slot="right" v-model="input2" placeholder="请输入状态"></yd-input>
                </yd-cell-item>
                <yd-cell-item>
                    <span class="title" slot="left">客户</span>
                    <yd-input slot="right" v-model="input3" placeholder="请输入客户"></yd-input>
                </yd-cell-item>
                <yd-cell-item>
                    <span class="title" slot="left">手机号</span>
                    <yd-input slot="right" v-model="input4" regex="mobile" placeholder="请输入手机号码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
            <div class="yd-cell-item ydcellitem">
                <span slot="left" class="title sexname">性别</span>
                <yd-radio-group :color="blue" v-model="sexradio">
                    <yd-radio val="1">女</yd-radio>
                    <yd-radio val="2">男</yd-radio>
                </yd-radio-group>
            </div>
            <p style="text-align: center;height:1rem;line-height:1rem;">
                <yd-button :bgcolor="blue" style="color:#fff;width:1.6rem;height:0.6rem;margin:0 0.4rem;" @click.native="show1 = false">取消</yd-button>
                <yd-button :bgcolor="blue" style="color:#fff;width:1.6rem;height:0.6rem;margin:0 0.4rem;" @click.native="show1 = false">确认</yd-button>
            </p>
        </yd-popup>
    </div>
</template>
<script>
    export default {
        name:'allBed',
        data(){
            return{
                input1:'',
                input2:'',
                input3:'',
                input4:'',
                sexradio:'1',
                show1: false,
                show:true,
                hide:false,
                showBed:true,
                data:[
                    {stateName:'空闲',isFree:true,isUnfree:false},{stateName:'非空闲',isFree:false,isUnfree:true},{stateName:'服务中',isFree:false,isUnfree:false},
                    {stateName:'空闲',isFree:true,isUnfree:false},{stateName:'非空闲',isFree:false,isUnfree:true},{stateName:'服务中',isFree:false,isUnfree:false},
                    {stateName:'空闲',isFree:true,isUnfree:false},{stateName:'非空闲',isFree:false,isUnfree:true},{stateName:'服务中',isFree:false,isUnfree:false}
                ],
                phone:'15645845624'
            }
        },
        mounted(){
        },
        methods: {
            changePhone(num) {
                return ('' + num).replace(/(\d{1,4})(?=(\d{4})+(?:$|\.))/g, '$1  ')
            },
            fn(){
                this.show1 = true
                // this.$emit('showDet',true)
                // console.log(this.$emit('showDet',true))
            }
        }
    }
</script>
<style lang="scss" scoped>
.allBed{
    height: 100%;
}
.bedList{
    border-bottom: 0.01rem solid #eee;
}
ul li:first-child{
    border-top: 0.2rem solid #eee;
}
.item{
    height:0.88rem;
    line-height:0.88rem;
    margin:0 0.3rem;
}
.item .bedName,.item .state{
    display: inline-block;
}
.item .bedName{
    font-size: 0.36rem;
    color: #333333;
    margin: 0 0.3rem 0 0;
}
.item .state{
    height:0.4rem;
    line-height:0.4rem;
    // padding: 0 0.2rem;
    font-size: 0.24rem;
    width: 1.1rem;
    border-radius: 0.2rem;
    // border:0.01rem solid #f00;
    text-align: center;
}
.free{
    color: #7dbe3b;
    background: rgba(125,190,59,0.3);
}
.unfree{
    color: #fcb561;
    background: rgba(252,181,97,0.3);
}
.inService{
    color: #f17689;
    background: rgba(241,118,137,0.3);
}
.none{
    display: none;
}
.show{
    display: block;
}
.content{
    height:2rem;
    line-height:2rem;
    margin:0 0.3rem;
}
.content p{
    height:0.88rem;
    line-height:0.88rem;
}
.content .name{
    font-size: 0.36rem;
    color: #333333;
}
.content .tel{
    font-size: 0.3rem;
    color: #333333;
}
.content .name b{
    display: inline-block;
    padding:0 0.3rem;
}
.content p:last-child span{
    font-size: 0.3rem;
}
.content .project{
    color: #aaa;
    margin: 0 0.3rem 0 0;
}
.ydcellitem{
    height: 1rem;
    line-height: 1rem;
}
.title{
    margin-left: 0.1rem;
    display: inline-block;
    width: 2rem;
    font-size: 0.3rem;
}
.sexname{
    margin-left: 0.2rem;
}
.yd-tab-active,.yd-tab-panel-item{
    height:11rem;
}
</style>

