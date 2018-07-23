import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
export default {
    components: {Swipeout, SwipeoutItem,  SwipeoutButton },
    data() {
        return {
            Orderid:'', //自定义id
            orderIndex:'', //序号
            isReHome:true
        }
    },
    activated(){
        try {
          //记录位置
          let  id = this.Orderid   
          document.getElementById(id).scrollIntoView()
         
       
        } catch (error) {   
        }
        this.changeOrderGoods()
        if(this.$route.query.custom_id){
            this.custom_id = this.$route.query.custom_id
            this.search()
            this.custom_id = ''
            this.isReHome=true
        }
        if(this.$route.query.forHome && this.isReHome){
                this.search()
                this.isReHome=false
        }else{
            
        }

        
       
     },
    methods:{
    
  //下啦刷新
    downloadList(){
        this.search()
    },
      //路由跳转
      goRouter(id,i){
        this.Orderid  = 'order'+i
        this.orderIndex = i
       this.$router.push(`businessOpen?id=${id}`)
   },
   //计算商品总价
   computedTotal(v,n){
     let v1 = parseFloat(v)
     let n1 = parseFloat(n)
     //console.log(v,n)
     return v1*n1
   },
   
   //改变数据
   changeOrderGoods(){
       let orderKey = sessionStorage.orderKey  || ''
       let order_goods = sessionStorage.order_goods  || ''
       if(order_goods){
           if(orderKey=='edit'){ 
               this.pageData[this.orderIndex].bill_time = JSON.parse(order_goods).bill_time
               this.pageData[this.orderIndex].patient_name = JSON.parse(order_goods).patient_name
               this.pageData[this.orderIndex].patient_sex = JSON.parse(order_goods).patient_sex
               this.pageData[this.orderIndex].dub_name = JSON.parse(order_goods).dub_name
               this.pageData[this.orderIndex].bed = JSON.parse(order_goods).bed
               this.pageData[this.orderIndex].patient_phone = JSON.parse(order_goods).patient_phone
               this.pageData[this.orderIndex].goods = JSON.parse(order_goods).goods
           } 
           else if(orderKey=='add' ){
               this.pageData.unshift(JSON.parse(order_goods))
           }       
       }

       sessionStorage.orderKey=''
       sessionStorage.order_goods=''

   }

  
   
    }
}