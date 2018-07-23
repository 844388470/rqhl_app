<!-- by your name -->
<template>
 <div style="height: 100%;">
 <yd-layout class="box"> 
          
          <router-view></router-view>
          <yd-tabbar slot="tabbar" :activeColor='blue'>
            <yd-tabbar-item title="首页" link="" @click.native="$router.push('/layout/home')" :active="$route.path.includes('/layout/home')">
                <yd-icon name="home" slot="icon"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="统计" link=""  @click.native="$router.push('/layout/count')" :active="$route.path.includes('/layout/count')">
                <yd-icon name="time" slot="icon"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="我的" link="" @click.native="$router.push('/layout/myinfo')" :active="$route.path.includes('/layout/myinfo')">
                <yd-icon  name="ucenter-outline" slot="icon"></yd-icon>
            </yd-tabbar-item>
        </yd-tabbar>

 </yd-layout> 
 </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods:{
  
  }
}

</script>
<style lang='scss' scoped>
.box{
  height: 100%;
}
</style>