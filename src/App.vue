<template>
  <div id="app">
      <yd-navbar v-if='showTop' :title="$route.meta.title" :bgcolor='whiteww' color='#000'>
        <div v-if="!$route.path.includes('layout/home')"  @click=" $router.go(-1)" slot="left"  >
            <yd-navbar-back-icon color='#000'></yd-navbar-back-icon>
        </div>   
    </yd-navbar>  
    <keep-alive include="orderList">
       <router-view :class="{app_content:showTop}"></router-view>
    </keep-alive>
   
  </div>
</template>

<script>
import { angent } from './utils/judgeUserAgent'
export default {
  name: 'app',
  data(){
    return{
      title:'index',
      showTop:true,
      noShowTopArr:['dingding','weixin']
    }
  },
  mounted(){
    document.getElementById('Loding').style.display='none'
    this.changeShowTop()
    localStorage.h5_version='1.1.21'
   
  },
  methods: {
    
     changeShowTop (){
      let ANGENT = sessionStorage.getItem('ANGENT')
      
      if (!ANGENT) {
        ANGENT =  angent()
        sessionStorage.setItem('ANGENT',ANGENT)
       // sessionStorage.ANGENT = ANGENT
       }
      let noShowTopArr = this.noShowTopArr.indexOf(ANGENT) != -1
     
      if(noShowTopArr){  
         
        this.showTop=false
      }
      
       
    }
  }
}
</script>

<style>
#app{
  height: 100%;
}
.app_content{
  box-sizing: border-box;
  margin-top:-1rem; 
  padding-top:1rem; 
}
</style>
