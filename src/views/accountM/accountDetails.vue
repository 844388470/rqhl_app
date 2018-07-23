<!-- 结算确认详情 -->
<template>
  <div>
      <div>
        <yd-preview :buttons="[]">
            <yd-preview-header>
                <div slot="left" class="text black">基础信息</div>
                <div slot="right"></div>
            </yd-preview-header>

            <yd-preview-item>
                <div slot="left">订单号：</div>
                <div slot="right" class="black">HL1231231</div>
            </yd-preview-item>
            <yd-preview-item>
                <div slot="left">网点：</div>
                <div slot="right" class="black">北京怀柔医院</div>
            </yd-preview-item>
            <yd-preview-item>
                <div slot="left">科室：<span class="black">妇产科</span></div>
                <div slot="right">床位：<span class="black">D03床</span></div>
            </yd-preview-item>
            <yd-preview-item>
                 <div slot="left">开单日期：<span class="black">2018.02.02</span></div>
                <div slot="right">床位：<span class="black">2018.02.02</span></div>         
            </yd-preview-item>
        </yd-preview>
      </div>

      <div class="mt10">
        <yd-preview :buttons="[]">
            <yd-preview-header>
                <div slot="left" class="text black">产品信息</div>
                <div slot="right"></div>
            </yd-preview-header>

            <yd-preview-item>
                <div slot="left">产品：<span class="black">护院</span></div>
                <div slot="right">单价：<span class="black">¥300.00</span></div>
            </yd-preview-item>
            <yd-preview-item>
                 <div slot="left">起止时间：</div>
                <div slot="right"><span class="black">2018.03.03-2018.04.01</span></div>         
            </yd-preview-item>
            
            <yd-preview-item>
                 <div slot="left">护理者：<span class="black">张珍</span></div>
                <div slot="right">所得：<span class="black">620</span></div>         
            </yd-preview-item>
            
        </yd-preview>
      </div>

      <div class="mt10">
        <yd-preview :buttons="[]">
            <yd-preview-header>
                <div slot="left" class="text black">服务信息</div>
                <div slot="right"></div>
            </yd-preview-header>

            <yd-preview-item>
                <div slot="left">产品：<span class="black">护院</span></div>
                <div slot="right">数量：<span class="black">3</span></div>
            </yd-preview-item>
            <yd-preview-item>
                 <div slot="left">数量：<span class="black">2.00</span></div>
                <div slot="right">小计：<span class="black">¥600</span></div>         
            </yd-preview-item>
            
            <yd-preview-item>
                 <div slot="left">浮动：<span class="black">¥10</span></div>
                <div slot="right">实收：<span class="black">620</span></div>         
            </yd-preview-item>
            <yd-preview-item>
                 <div slot="left">业务员：<span class="black">王五</span></div>
                <div slot="right">抽成：<span class="black">0.00 </span></div>         
            </yd-preview-item>
        </yd-preview>
      </div>

      <div class="mt10">
        <yd-preview :buttons="[]">
            <yd-preview-header>
                <div slot="left" class="text black">收费信息</div>
                <div slot="right"></div>
            </yd-preview-header>

            <yd-preview-item>
                <div slot="left">收费时期：<span class="black">2018.03.03</span></div>
                <div slot="right">上缴日期：<span class="black">2018.04.01</span></div>
            </yd-preview-item>
            
            
            <yd-preview-item>
                 <div slot="left">金额：<span class="black">¥100.00</span></div>
                <div slot="right">收款方式：<span class="black">现金</span></div>         
            </yd-preview-item>
              <yd-preview-item>
                 <div slot="left">收费服务：<span class="black">收费</span></div>
                <div slot="right">流水号：<span class="black">6200000</span></div>         
            </yd-preview-item>
              <yd-preview-item>
                 <div slot="left">收款人：<span class="black">张珍</span></div>
                <div slot="right"></div>         
            </yd-preview-item>
            
        </yd-preview>
      </div>

      <div class="mt10">
        <yd-preview :buttons="[]">
            <yd-preview-header>
                <div slot="left" class="text black">汇总</div>
                <div slot="right"></div>
            </yd-preview-header>  

            <yd-preview-item>
                 <div slot="left">产品金额：<span class="black">¥100.00</span></div>
                <div slot="right">已收：<span class="black">¥620</span></div>         
            </yd-preview-item>
              <yd-preview-item>
                 <div slot="left">结算方式：<span class="black">日结</span></div>
                <div slot="right">管理费：<span class="black">¥620</span></div>         
            </yd-preview-item>
                       
        </yd-preview>
      </div>

       <div class="tc mt40 pb40">
            <yd-button :bgcolor="blue" color="#FFF" class="w30p" >编辑订单</yd-button>
            <yd-button  :bgcolor="blue" color="#FFF" class="w30p" >(取消) 结算审核</yd-button>
       </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
}

</script>
<style lang='scss' scoped>
.text{
  font-size: 0.32rem;
}
</style>