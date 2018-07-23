<!-- 我的 -->
<template>
  <div>
      <div class="header">
         <img class="avatar" :src="userinfo.avatar"  >
         <p class="name">{{userinfo.name}}</p>      
      </div>

      <yd-cell-group>
       

        <yd-cell-item arrow @click.native="$router.push('/myinfo/openMode')">
            <img slot="icon" src="../../assets/img/Page1Copy@3x.png">
            <span slot="left">开单模式</span>   
        </yd-cell-item>

        <yd-cell-item  @click.native="checkSiteInfo" >
        
          <yd-icon slot="icon" size="0.45rem" :color="blue" name="setting"></yd-icon>        
            <span slot="left">版本号</span>   
              <span slot="right">{{h5_version}}</span>        
        </yd-cell-item>

        
        <yd-cell-item v-show="ANGENT=='web'" arrow @click.native="handelLogout">
            <yd-icon slot="icon" size="0.45rem" :color="blue" name="error"></yd-icon>
            <span slot="left">退出登录</span>
           
        </yd-cell-item>

         <yd-cell-item v-show="ANGENT=='dingding'" arrow @click.native="handelLogout_dingding">
            <yd-icon slot="icon" size="0.45rem" :color="blue" name="error"></yd-icon>
            <span slot="left">钉钉解绑</span>
           
        </yd-cell-item>
        <yd-cell-item v-show="ANGENT=='weixin'" arrow @click.native="handelLogout_weixin">
          <yd-icon slot="icon" size="0.45rem" :color="blue" name="error"></yd-icon>    
            <span slot="left">微信解绑</span>     
        </yd-cell-item>

         
    </yd-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ANGENT: sessionStorage.ANGENT || '',
      h5_version:localStorage.h5_version || ''
    }
  },
  computed:{
    userinfo(){
      return this.$store.getters.userinfo
    }
  },
  mounted () {
    this.h5_version = localStorage.h5_version || ''
    
  },
  methods:{
    //处理推迟登录
    handelLogout(){
      this.$dialog.confirm({
                    title: '提示',
                    mes: '确定退出登录吗？',
                    opts: () => {
                        this.logout()
                    }
           })
    
    },

    //处理微信解绑
    handelLogout_weixin(){
       this.$dialog.confirm({
                    title: '提示',
                    mes: '确定解绑微信账号吗？',
                    opts: () => {
                        this.unbind_wechat()
                    }
           })

    },

    //处理钉钉解绑
    handelLogout_dingding(){
       this.$dialog.confirm({
                    title: '提示',
                    mes: '确定解绑钉钉账号吗？',
                    opts: () => {
                        this.unbind_dingding()
                    }
           })
    },



    //退出登录
    logout(){
     this.api.logout().then(res=>{
       sessionStorage.clear()
        localStorage.ORDER_INFO = '{}'
       this.$router.push('/login?go=1')
     })
    },
   
   //微信解绑
    unbind_wechat(){
     this.api.unbind_wechat().then(res=>{
       sessionStorage.clear()
       this.$router.push('/login?go=1')
     })
    },

    //钉钉解绑
    unbind_dingding(){
     this.api.unbind_dingding().then(res=>{
       sessionStorage.clear()
       this.$router.push('/login?go=1')
     })
    },

    //版本号更新
    checkSiteInfo(){
         this.site_info()

     

    }
    



    
  }
}
</script>
<style lang='scss' scoped>
.name {
  text-align: center;
  color: #fff;
  font-size: 0.32rem;
}
.header {
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  position: relative;
  background: #5bacf9;
  .avatar {
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    display: block;

    margin: 0rem auto 0.25rem auto;
  }
}
</style>