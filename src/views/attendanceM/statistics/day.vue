<template>
    <div class="day">
        <ul>
          <li v-for="(item,index) in dataList" :key="index">
            <p class="title">
              <span>{{item.day}}</span>
              <span> 总考勤: {{item.stf_all_type}}天</span>
              <b @click="$router.push({path:'/attendanceM/detail',query:{info:'day', item:JSON.stringify(item)}})">详情</b></p>
            <p class="item">
              <span>白班 <b>{{item.type1}}天</b></span>
              <span>半天班 <b>{{item.type4}}天</b></span>
              <span>连班 <b>{{item.type3}}天</b></span>
              <span>夜班 <b>{{item.type2}}天</b></span>
              <span>试用班 <b>{{item.type5}}天</b></span>
            </p>
          </li>
        </ul>
    </div>
</template>
<script>
export default {
  name:'day',
  props: ['dataList'],
  data () {
    return {
     
        
    }
  }
}
</script>
<style  lang='scss' scoped>
.day{
  // margin:0 0.34rem;
}
ul{
  margin:0 0 1rem 0;
}
ul li{
  border-bottom:0.01rem solid #ddd;
}
.title,.item{
  margin:0.3rem;
}
.title span:first-child{
  font-size: 0.4rem;
  margin:0 0.5rem 0 0;
  text-align: left;
  display: inline-block;
}
.title span:nth-child(2){
  font-size: 0.32rem;
}
.title b{
  float: right;
  font-weight: normal;
  font-size: 0.3rem;
  color:#5bacf9;
}
.item span{
  
  font-size: 0.32rem;
  width:30%;
  margin:0 1% 0 0;
  height:0.8rem;
  line-height: 0.8rem;
  display: inline-block;
  color: #aaa;
  text-align: left;
}

.item span b{
  color:#000;
  // float: right;
  text-align: right;
  //width:1rem;
  display: inline-block;
}
</style>
