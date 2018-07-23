<template>
 <div style="height: 100%;">
     <keep-alive include="statistics,attendance">
       <router-view ></router-view>
     </keep-alive>
      
    <yd-tabbar fixed :activeColor='blue'>  
         <yd-tabbar-item title="首页"  link="" :active="$route.path.includes('/layout/home')" @click.native="routerPush('/layout/home')">
            <yd-icon name="home" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>   
        <yd-tabbar-item title="考勤"  link="" :active="$route.path.includes('/attendanceM/attendance')" @click.native="routerPush('/attendanceM/attendance')">
            <yd-icon name="home" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="统计" link="" :active="$route.path.includes('/statistics') || $route.path.includes('/detail') " @click.native="routerPush('/attendanceM/statistics')">
            <yd-icon name="shopcart" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="我的" link="" :active="$route.path.includes('/me')" @click.native="routerPush('/attendanceM/me')">
            <yd-icon name="ucenter-outline" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
    </yd-tabbar>
 </div> 
</template>

<script type="text/babel">
export default {
    name:'index',
    data () {
        return {
        }
    },
    methods:{
        routerPush(i){
            this.$router.push(i)
        }
    }
}
</script>
<style lang='scss' scoped>

</style>
