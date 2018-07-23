<!-- 开单模式 -->
<template>
  <div class="box">
      <yd-cell-group>       
        <yd-cell-item arrow type="label">
            <span slot="left">开单模式：</span>
            <select slot="right" v-model="has_new">
                <option value="">请选择开单模式：</option>
                <option value="0">手工开单</option>
                <option value="1">电子开单</option>
            </select>
        </yd-cell-item>
    </yd-cell-group>
    
      <div class=" pl15 pr15 mt50">
            <yd-button size="large" color="#fff" @click.native="submit" :bgcolor="blue" >确认修改</yd-button>
        </div>
  </div>
 
</template>

<script>
export default {
  data () {
    return {
      has_new:localStorage.has_new || ''
    }
  },
  methods:{
    submit(){
      if(!this.has_new){
        this.error('请选择开单模式')
        return false
      }
      localStorage.has_new = this.has_new
      this.success('修改成功')
      
      setTimeout(()=>{
        this.$router.go(-1)
      },1000)
      
    }
  }
}

</script>
<style lang='scss' scoped>
.box{
   
}
</style>