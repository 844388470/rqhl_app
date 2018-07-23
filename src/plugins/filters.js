//filter
import moment from 'moment'
export default {
    methods: {
        showMuen(v){
            let sessMuen = sessionStorage.getItem('authModulesList') || [] 
            

             return JSON.parse(sessMuen).filter(i=>i.description==v).length
        }
    },
    filters: {
        empitSelect(v) {
            return v || '请选择'
        },
        NaNf(v) {
            return isNaN(v) ? 0.00 : v
        },
        //数组分3个一个 逗号
        number_3_1(num) {
            let n = parseFloat(num).toLocaleString('en-US')
           
            let arr = n.split('.')
            if (arr.length == 1) {
                return n + '.00'
            } else {
                if (arr[1].length == 1) {
                    return n + '0'
                }
                return n
            }
        },

        number_3(num){        
            if(!num) return '0.00'
            num +=''     
           let arr = num.split('.')
            let reg=/\d{1,3}(?=(\d{3})+$)/g;   
            arr[0] = arr[0].replace(reg,'$&,')
            arr[1] = arr[1] || ''
            arr[1] = (arr[1]+'00').slice(0,2)
            return arr.join('.')        
        },

        number_3_2(num){
           
             if(!num) return '0.00'
             num =  parseFloat(num).toFixed(2)
             num +=''     
            let arr = num.split('.')
             let reg=/\d{1,3}(?=(\d{3})+$)/g;   
             arr[0] = arr[0].replace(reg,'$&,')
             arr[1] = arr[1] || ''
             arr[1] = (arr[1]+'00').slice(0,2)
             return arr.join('.')  

        },
        toTow(v){
            let n = parseFloat(v)
            if(isNaN(n)){
               return v
            }else{
                return n.toFixed(2)
            }
        },

        toInt(v){
            let n = parseInt(v)
            if(isNaN(n)){
               return v
            }else{
                return n
            }
        },
        

        //公司名字
        company_list(v,n) {
            if (!v) {
                return n?'':'请选择'
            } else {
                let company_list = sessionStorage.company_list || []
                if(!JSON.parse(company_list).length){return '请选择'}
                return JSON.parse(company_list).filter(i => i.pk_id == v)[0].name
            }
        },
        //简写公司
        short_company_list(v) {
            if (!v) {
                return '请选择'
            } else {
                let company_list = sessionStorage.company_list || []
                if(!JSON.parse(company_list).length){return '请选择'}
                return JSON.parse(company_list).filter(i => i.pk_id == v)[0].alias 
            }
        },
         //一个简写公司 或展示多公司
         short_company_list_more(v) {
            if (!v) {
                return ''
            } else {
                let company_list = sessionStorage.company_list || []
                if(!v.length){return ''}
                if(v.length>1){return '多公司'}
               let nameArr = JSON.parse(company_list).filter(i => i.pk_id == v[0]).map(i=>i.alias)
               return nameArr.join()
            }
        },
          //简写多公司
          short_companys_list(v) {
            if (!v.length) {
                return '请选择'
            } else {
                let company_list = sessionStorage.company_list || []
                 company_list = JSON.parse(company_list)
               
                 let nameArr = company_list.filter( i => v.indexOf(i.pk_id)!= -1).map(i=> i.alias)
                 return nameArr.join()

            }
        },
        //网点名字
        project_list(v,n) {
            try {
                if (!v) {
                    return n?'':'请选择'
                } else {
                    let project_list = sessionStorage.project_list || []
                    return JSON.parse(project_list).filter(i => i.pk_id == v)[0].name
                }
                
            } catch (error) {
                localStorage.ORDER_INFO = '{}'
                window.location.reload()
            }
          
        },
        
       //项目名字 找到公司名字
        project_to_companys(v,n){
            if (!v) {
                return n?'':'请选择'
            } else {
                let project_list = sessionStorage.project_list || []
                let id = JSON.parse(project_list).filter(i => i.pk_id == v)[0].pid
                let company_list = sessionStorage.company_list || []
                if(!JSON.parse(company_list).length){return '请选择'}
                return JSON.parse(company_list).filter(i => i.pk_id == id)[0].name
                
            }

        },

          //网点名字 展示多网点
          project_list_more(v,n) {
            if (!v) {
                return n?'':'请选择'
            } else {
                let project_list = sessionStorage.project_list || []
               
                if(!v.length || v[0] == '0'){return ''}
                if(v.length>1){return '> 多网点'}
               let nameArr = JSON.parse(project_list).filter(i => i.pk_id == v[0]).map(i=>i.name)
               return   '> ' + nameArr.join()
            }
        },

          //网点名字 展示多网点
          project_list_mores(v,n) {
            if (!v) {
                return n?'':'请选择'
            } else {
                let project_list = sessionStorage.project_list || []
               
                if(!v.length || v[0] == '0'){return ''}
                if(v.length>1){return '多网点'}
               let nameArr = JSON.parse(project_list).filter(i => i.pk_id == v[0]).map(i=>i.name)
               return   ' ' + nameArr.join()
            }
        },

         //网点名字(多)
         projects_list(v,n) {
            if (!v.length) {
                return '请选择'
            } else {
                let project_list = sessionStorage.project_list || []
                project_list = JSON.parse(project_list)
               
                 let nameArr = project_list.filter( i => v.indexOf(i.pk_id)!= -1).map(i=> i.name)
                 return  nameArr.join()

            }
        },


        //收费分类
        pay_type(v) {
            if (v == 1) { return '现金：' }
            if (v == 2) { return '银行卡：' }
            if (v == 3) { return '微信：' }
            if (v == 4) { return '支付宝：' }
            if (v == 5) { return '其他：' }
            return '其他'
        },

        //性别
        sex(v){
            if(v==1){return '男'}
            if(v==2){return '女'}
            return '未知'
        },

        //支付方式
        charge_type(v){
            if(v==1){return '现金'}
            if(v==2){return '银行转账'}
            if(v==3){return '微信'}
            if(v==4){return '支付宝'}
            if(v==5){return '其他'}
        },

        //时间
        Time(v){
            //  console.log(v)
             let tiem = moment(v).format('YYYY-MM-DD')
             if(tiem=='Invalid date'){
                 return ''
             }
             return '至'+tiem
        },

      



    }
}