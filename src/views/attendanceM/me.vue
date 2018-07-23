<template>
  <div class="me">
      <div class="item-list" >
        <p class="list">
            <b>总考勤</b>
            <span>{{100}} 天</span>
        </p>
        <p class="list">
            <span>白班</span>
            <span>{{100}} 天</span>
        </p>
        <p class="list">
            <span>夜班</span>
            <span>{{100}}天</span>
        </p>
        <p class="list">
            <span>连班</span>
            <span>{{100}}天</span>
        </p>
        <p class="list">
            <span>半天</span>
            <span>{{100}}天</span>
        </p>
        <p class="list">
            <span>试用期</span>
            <span>{{100}}天</span>
        </p>
      </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            data:[{},{}]
        }
    }
}
    
</script>

<style lang='scss' scoped>
.me{
    background: #fff;
}
.item-list{
    border-bottom: 0.01rem solid #ddd;
}
.list{
    height:1rem;
    line-height: 1rem;
    font-size: 0.32rem;
    margin: 0 0.3rem;
    border-bottom: 0.01rem solid #ddd;
}
.list b:first-child,.list span:first-child{
    width:30%;
    display: inline-block;
}
</style>
