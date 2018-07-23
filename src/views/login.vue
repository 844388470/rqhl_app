<!-- 主页 -->
<template>
  <div class="login">
    <img src="../assets/img/rqhl.png" v-if="isrqhl">
    <img src="../assets/img/rqwy.png" v-if="!isrqhl">
    <div class="loginbox">
      <div class="userInput"> <input type="email" v-model="user.staff_no" /></div>
      <div class="pwdInput "> <input  type="password" v-model="user.password"/></div>
     <button type="button" @click="login">登录</button>
    </div>
    <div class="binfo">
      <span>福建瑞康信息科技有限公司©All rights reserved</span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
 import * as api from '@/api'
  export default {
    data() {
      return {
        user:{
          staff_no:'',//6666666666
          password:'' //111111
        }
      }
    },
    created () {
      //this.judge()
    },
    mounted () {
     this.user.staff_no = localStorage.username || ''
    },
    methods: {
      ...mapActions(['setCompany_list','setProject_list','setauthModulesList']),
      login() {
        
        api.login(this.user).then(res=>{
         if(!res.code){
           this.setCompany_list()
           this.setProject_list()
            localStorage.ORDER_INFO = '{}'
            this.getUserInfo().then(res=>{
               this.auth_modules()

          })
           
         }else{
           this.error('账号密码出错')
         }
        })
      },

      auth_modules(){
        api.auth_modules().then(res=>{
          // let arr = _.chunk(res.data,6)
          this.setauthModulesList(res.data)  

          localStorage.username = this.user.staff_no
             
          this.$router.push('/layout')
        })

      },
    
      
      


     

      
    }
  }

</script>
<style lang='scss' scoped>
  .login{
    padding-top:30%; 
    width: 100%;
    height: 100%;
    min-height: 900px;
    background: url('../assets/img/Group Copy@3x.png') no-repeat bottom #fff;
    background-size: 100% ;
    position: relative;
  }
  img{
    display: block;
    width: 308px;
    height: auto;
    margin: 0px auto;
    
  }
  .loginbox{
    font-size: 28px;
    color: #5b6a78;
    padding-top:25%; 
    text-align: center;
     input{
      float: left;
      outline: none;
      border: none;
      border-bottom:1px solid #efefef; 
      width: 100%;

     }
    .userInput{
      margin: 0 auto;
      width: 70%;
      height: 40px;
      padding-left: 100px;
      background: url('../assets/img/user@3x.png') left no-repeat ;
      background-size: 40px auto; 
    }
    .pwdInput{
      margin: 60px auto;
      width: 70%;
      height: 40px;
      padding-left: 100px;
      background: url('../assets/img/Combined Shape Copy@3x.png') left no-repeat ;
      background-size: 40px auto; 

    }
  }
  button{
    font-size: 36px;
    color: #5bacf9;
    border: none;
    outline: none;
    font-weight: 520;
    height: 40px;
    line-height: 40px;
    background: url('../assets/img/Group 4@3x.png') left no-repeat ;
    background-size: contain;
    padding: 0 70px;
    margin-top:10px;
  }
  .binfo{
    width: 100%;
    position: absolute;
    bottom: 20px;
    text-align: center;
    font-size: 20px;
    color: #fff;

  }

</style>
