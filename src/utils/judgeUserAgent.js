import * as api from '@/api/index'
import store from '@/store'
import router from '@/router'
import _ from 'lodash'
import appid from '../config/appId'
import config from '../config/index'

export function isApp() {
    if (window.wx && typeof window.wx.getUserNameFromApp === 'function') {
        return true
    } else {
        return false
    }
}


export function isDingDing() {
    let ua = navigator.userAgent
    if (ua.search('DingTalk') !== -1) {
        return true
    } else {
        return false
    }
}

export function isWeixn() {
    let ua = navigator.userAgent
    if (ua.search('MicroMessenger') !== -1 && ua.search('wxwork') === -1) {
        return true
    } else {
        return false
    }
}

export function angent() {
    if (isWeixn()) { return 'weixin' }
    if (isDingDing()) { return 'dingding' }
    if (isApp()) { return 'wxapp' }
    return 'web'
}


export function judgeOption(to,from,next) { 
    let ANGENT = sessionStorage.ANGENT || ''
    if(!ANGENT){ return }
    switch (ANGENT){
      case 'web' :{
       web_is_login(to,from,next)
       
       return false
       
      }
      case 'weixin':{
       console.log('weixin')
       weixin_is_login(to,from,next)
      
       return false
      }
      case 'dingding':{
          console.log('dingding')
          dingding_is_login(to,from,next)
          return false

      }
      default : {
        web_is_login(to,from,next)    
        return false

      }

    }

 }

 //web 端 检查是否登陆
 function web_is_login(to,from,next){
    console.log()
    api.is_login().then(res=>{
      if(res.data.is_login){
          addData(next)
      }else{
        next()
      }
    }).catch(res=>{ 
       next()
    })
  }

  //微信认证 
  function weixin_is_login(to,from,next){
      let code = location.search.split('&')[0].split('=')[1]
      if(!code){
        window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid[process.env.NODE_ENV].weixin}&redirect_uri=${encodeURIComponent(config[process.env.NODE_ENV].host+'mobile')}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      }else{
          api.wechat_code(code).then(res=>{
              if(!res.data.is_login){
                  next()
              }else{
                addData(next)
              }
          }).catch(res=>{
            next()
          })
      }
     
  }

  //钉钉认证
  function dingding_is_login(to,from,next){
     // alert('dingdingd')
      dd.ready(()=>{
        dd.runtime.permission.requestAuthCode({
            corpId: appid[process.env.NODE_ENV].dingding,
            onSuccess: function(result) {
              //  alert(result + 'succ')
            
            api.ding_talk(result.code).then(res=>{
                if(!res.data.is_login){
                   // alert(JSON.stringify(res) + '1')
                    next()
                    
                }else{
                 // alert(JSON.stringify(res) + '2')
                  addData(next)
                }
    
            }).catch(res=>{
                next()
            })
            },
            onFail : function(err) {
                console.log(err)
               // alert(err + '  err')
                next()
            }
         
        })

      })
    

  }


 //登陆后加载数据
 function addData(next) {
   store.dispatch('setCompany_list')
   store.dispatch('setProject_list')
   api.auth_modules().then(res=>{
  //  let arr = _.chunk(res.data,6)
    store.dispatch('setauthModulesList',res.data)
   // this.setauthModulesList(arr)   
   api.userinfo().then(res1=>{
    store.dispatch('setUserinfo',res1.data)
    next({path:'/layout'})
   
 })

       
   // this.$router.push('/layout')
  })

 }