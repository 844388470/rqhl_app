<!-- 护理评估 -->
<template>
  <div class="a_box" >
      <yd-cell-group class="mb5">
            <yd-cell-item>
                <span slot="left">被护理人：</span>
                <span slot="left">{{name}}</span>
            </yd-cell-item>
            <yd-cell-item>
                <span  slot="left">评估日期：</span>
                <yd-datetime type="date"  start-date="1960-01-01" :init-emit="false" v-model="formData.assess_day" slot="right"></yd-datetime>
            </yd-cell-item>
      </yd-cell-group>
      <div class="box tc">
          <div class="flex flex-m font-c">
              <div class="flex-1">项目</div>
              <div class="flex-1">完全独立</div>
                <div class="flex-1">需要部分帮助</div>
              <div class="flex-1">极大需要帮助</div>
              <div class="flex-1">完全依赖</div>
          </div>

           <div class="flex tc  flex-m" v-for="(item , i ) in dataValue " :key="i">
              <div class="flex-1">{{item.name}}</div>
               <yd-radio-group :color="blue" class="flex  flex-4" v-model="formData[item.key]">
                   
                    <yd-radio v-for="(it,index) in item.value" class="flex-1" :key="index" :disabled="it.dis" :val="it.v"><span></span></yd-radio>
                </yd-radio-group>
          </div>
      </div>
         <yd-cell-group class="mb5 mt5">
            <yd-cell-item>
                <span slot="left">评估得分：</span>
                <span slot="left">{{total}}</span>
            </yd-cell-item>
           
      </yd-cell-group>



     <yd-tabbar fixed > 
         <div class="tc w100p pt5 pb5">
            <yd-button @click.native="submit" :bgcolor="blue" class="w20p" color="#fff" >保存</yd-button>
            <yd-button :bgcolor="blue" class="w20p" @click.native="$router.go(-1)" color="#fff" >返回</yd-button>
            <yd-button :bgcolor="blue" class="w20p" @click.native="goAssList" color="#fff" >历史评估</yd-button>
            <!-- <yd-button v-show="pk_id"  type="danger" class="w20p" >删除</yd-button> -->

         </div>
        
    </yd-tabbar>
  </div>
</template>

<script>
import moment from 'moment'
import * as c_api from "../../../api/customs";
export default {
  data() {
    return {
      pk_id:this.$route.query.pk_id,  
      name:this.$route.query.name,
      formData: {
        custom_id: this.$route.query.custom_id, //客户ID
        assess_day: moment().format('YYYY-MM-DD'), //评估日期
        total_score: 0, //总评分
        eat: 'a', //进食
        bath: 'a', //洗澡
        dress: 'a', //穿衣
        embellish: 'a', //修饰
        control_shit: 'a', //控制大便
        control_piss: 'a', //控制小便
        toilet: 'a', //如厕
        move_stuff: 'a', //床椅转移
        move_on_ground: 'a', //平地行走
        up_down_stair: 'a', //上下楼梯
      },
      
      dataValue:[
          {key:'eat',name:'进食',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
          {key:'bath',name:'洗澡',value:[{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-2'},{dis:true,v:'-1'}]},
          {key:'embellish',name:'修饰',value:[{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-2'},{dis:true,v:'-1'}]},

          {key:'dress',name:'穿衣',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]}, 

          {key:'control_shit',name:'控制大便',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
          {key:'control_piss',name:'控制小便',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},
          {key:'toilet',name:'如厕',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]},

          {key:'move_stuff',name:'床椅转移',value:[{dis:false,v:15},{dis:false,v:10},{dis:false,v:5},{dis:false,v:0}]},
          {key:'move_on_ground',name:'平地行走',value:[{dis:false,v:15},{dis:false,v:10},{dis:false,v:5},{dis:false,v:0}]},
          {key:'up_down_stair',name:'上下楼梯',value:[{dis:false,v:10},{dis:false,v:5},{dis:false,v:0},{dis:true,v:'-1'}]}
          ]
    };
  },
  computed: {
      total(){
          let arr = ['eat' , 'bath' , 'dress' ,'embellish' ,'control_shit' , 'control_piss' ,'toilet' ,'move_stuff' ,'move_on_ground' ,'up_down_stair']
           let t = 0
           arr.forEach(item=>{
               let num = Number(this.formData[item])
               if(isNaN(num)){
                   num = 0
               }else{
                   t+=num
               }
           })
           return t
      }
  },
  mounted(){
      sessionStorage.custom_id = this.$route.query.custom_id
      if(this.pk_id){
          this.cbathel_show()
      }
  },
  methods:{
      //历史评估
      goAssList(){
       this.$router.push(`/assList?custom_id=${this.formData.custom_id}`)
      },
      //保存
      submit(){
       if(this.pk_id){
           this.cbathel_update()
       }else{
        this.cbathel_add()
       }
      },
      //评估明细
      cbathel_show(){
       return   c_api.cbathel_show(this.pk_id).then(res=>{
            this.formData = res.data
            return res
         })
      },

      //护理评估添加
      cbathel_add(){
        this.formData.total_score = this.total
        c_api.cbathel_add(this.formData).then(res=>{
            this.success('添加成功')
            setTimeout(()=>{
                this.$router.push(`/assList?custom_id=${this.formData.custom_id}`)
            },1000)       
         })
      },

      //护理评估修改
      cbathel_update(){
          this.formData.total_score = this.total
          c_api.cbathel_update(Object.assign(this.formData,{pk_id:this.pk_id})).then(res=>{
            this.success('修改成功')
            this.CB()
          
         })

      },
    
  }
};
</script>
<style lang='scss' scoped>
.box{
    background: #fff;
    
    font-size: 0.3rem;
    
    .flex{
       
        border-bottom: 1px solid #eee;
    }
    .flex-1{
         padding: 0.25rem 0;
        
    }
}
.a_box{
    padding-bottom: 1.3rem;
}
.font-c{
    font-size: 0.24rem;
}
</style>