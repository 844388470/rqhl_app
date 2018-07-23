import router from './'
import { angent ,judgeOption} from '../utils/judgeUserAgent'



const setDocumentTitle = function(title) {
    document.title = title
    if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
        var i = document.createElement('iframe')
            //i.src = '/favicon.ico'
        i.style.display = 'none'
        i.onload = function() {
            setTimeout(function() {
                i.remove()
            }, 10)
        }
        document.body.appendChild(i)
    }
}

//路由拦截
router.beforeEach( (to, from, next) => {
    //改变标题
    setDocumentTitle(to.meta.title)
    let ANGENT = sessionStorage.ANGENT
    if (!ANGENT) {
        ANGENT =  angent()
        sessionStorage.ANGENT = ANGENT
    }
    
    if(to.path == '/login'){
       console.log(to) 
       if(to.query.go=='1'){
         next()
       }else{
        judgeOption(to, from,next)
       } 
    }else{
        next()
    }
   

})