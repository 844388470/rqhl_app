<template>
  <div class="detailMo">
        <div class="basic">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left"><h3>基础信息</h3></span>
                    <span slot="right">
                        <yd-button class="btn">业务办理</yd-button>
                        <yd-button class="btn" @click.native="$router.push('addCustomerMo')">编辑</yd-button>
                    </span>
                </yd-cell-item>
                <yd-cell-item>
                    <span class="title" slot="left"><b>{{name}}</b>{{this.changePhone(this.phone)}}</span>
                    <span slot="right">{{sex}}</span>
                </yd-cell-item>
            </yd-cell-group>
            <div class="basic-item">
                <p>
                    <span class="name" slot="left">生日</span>
                    <span slot="right">1993.03.19</span>
                </p>
                <p>
                    <span class="name" slot="left">地址</span>
                    <span slot="right">北京北京</span>
                </p>
                <div class="item">
                    <p>
                        <span class="name" slot="left">家属</span>
                        <span slot="right">土豪</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">家属手机</span>
                        <span slot="right">{{this.changePhone(this.phone)}}</span>
                    </p>
                </div>
                <p>
                    <span class="name" slot="left">项目</span>
                    <span slot="right">
                        <span>北京怀柔医院</span>
                        <span>妇产科</span>
                        <span>D-11床</span>
                    </span>
                </p>
            </div>           
        </div>
        <div class="birth" v-if="birthData">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left"><h3>分娩信息</h3></span>
                </yd-cell-item>
            </yd-cell-group>
            <div class="birth-item">
                <div class="item">
                    <p>
                        <span class="name" slot="left">预产期</span>
                        <span slot="right">2018.03.19</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">分娩时间</span>
                        <span slot="right">2018.03.19</span>
                    </p>
                </div>
                <div class="item">
                    <p>
                        <span class="name" slot="left">宝宝</span>
                        <span slot="right">小土豪</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">分娩方式</span>
                        <span slot="right">顺产</span>
                    </p>
                </div>
                <yd-cell-group>
                    <yd-cell-item >
                        <span class="name" slot="left" >备注</span>
                        <yd-textarea slot="right" readonly v-model="remarks" maxlength="100"></yd-textarea>
                    </yd-cell-item>
                </yd-cell-group>
            </div>    
        </div>
        <ul class="order">
            <li class="birth-item" v-for="(item,index) in unpayList" :key="index">
                <div class="item">
                    <p>
                        <span class="name" slot="left">订单号</span>
                        <span slot="right">10001</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">产品</span>
                        <span slot="right">院护、乳护</span>
                    </p>
                </div>
                <div class="item">
                    <p>
                        <span class="name" slot="left">订单总额</span>
                        <span slot="right">1000</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">已付</span>
                        <span slot="right">300</span>
                    </p>
                </div>
                <div class="item">
                    <p style="width:100%;">
                        <span style="display:inline-block;width:1.2rem;" slot="left">待付</span>
                        <span style="color:#ff6666" slot="right">600</span>
                        <yd-button class="pay">支付</yd-button>
                    </p>
                </div>
            </li>            
        </ul>
        <ul class="order">
            <li class="birth-item" v-for="(item,index) in payList" :key="index">
                <div class="item">
                    <p>
                        <span class="name" slot="left">订单号</span>
                        <span slot="right">10001</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">产品</span>
                        <span slot="right">院护、乳护</span>
                    </p>
                </div>
                <div class="item">
                    <p>
                        <span class="name" slot="left">订单总额</span>
                        <span slot="right">1000</span>
                    </p>
                    <p>
                        <span class="phone" slot="left">已付</span>
                        <span slot="right">1000</span>
                    </p>
                </div>
            </li>            
        </ul>
  </div>
</template>
<script>
    export default {
            name:'detailMo',
        data(){
            return{
                birthData:true,
                sex:'1',
                name:'张三',
                phone:'14562365478',
                remarks:'大家阿福卡复活卡大富科技按时还款时间啊哈空间斯卡迪和房价肯定撒火炬大厦',
                unpayList:[{},{}],
                payList:[{},{}]
            }
        },
        mounted(){
        },
        methods: {
            changePhone(num) {
                console.log(num)
                return ('' + num).replace(/(\d{1,4})(?=(\d{4})+(?:$|\.))/g, '$1  ')
            }
        }
    }
</script>
<style lang="scss" scoped>
.yd-cell-box{
    margin-bottom:0;
}

.h3{
    font-size: 0.3rem;
    display: inline-block;
}
.btn{
    width: 1.6rem;
    background: #ddd;
    color: #fff;
    font-size: 0.3rem;
}
.title{
    font-size: 0.3rem;
}
.title b{
    font-size: 0.48rem;
    display: inline-block;
    margin:0 0.4rem 0 0;
    font-weight: normal;
}
.basic,.birth,.order{
    border-bottom: 0.2rem solid #eee;
}
.basic-item{
    font-size: 0.3rem;
    background: #fff;
    padding:0 0 0.3rem 0;
}
.basic-item > p,.item{
    height:0.7rem;
    line-height:0.7rem;
    margin:0 0.3rem;
}
.basic-item > p span span{
    display: inline-block;
    margin:0 0.3rem 0 0;
}
.item p{
    // width: 40%;
    display: inline-block;
}
.item p:first-child{
    width: 45%;
    // display: inline-block;
}
.item p:last-child .phone{
    color: #aaa;
    display: inline-block;
    width:1.5rem;
    text-align: center;
}
.name{
    color: #aaa;
    display: inline-block;
    width:1rem;
    // text-align: center;
}

.birth{
    border-bottom: 0.2rem solid #eee;
}
.birth-item{
    font-size: 0.3rem;
    background: #fff;
    padding:0.1rem 0 0.3rem 0;
    border-top: 0.01rem solid #eee;
}
.birth-item > p,.item{
    height:0.7rem;
    line-height:0.7rem;
    margin:0 0.3rem;
}
.birth-item p .name{
    color: #aaa;
    display: inline-block;
    width:1.2rem;
    // text-align: center;
}
.pay{
    background: #f5a623;
    font-size: 0.3rem;
    width: 1.6rem;
    height:0.7rem;
    right:0;
    float: right;
}

</style>

