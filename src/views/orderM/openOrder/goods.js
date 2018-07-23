//商品服务
import * as utils from '@/utils'
import * as api from '@/api'
export default {
    data() {
        return {
            goodsIndex: '',
            goods_item: {
                order_id: '',
                goods_description: '',//展示用
                pk_id: '',//订单产品id 
                goods_id: '',//产品id
                price: '0',//产品单价
                num: '',//产品数量
                real_total: '0',//金额小计  (（price+discount）*real_combo_num) + total_discount
                combo_num: '0',//服务总天/次数
                staff_pay: '',//每单位数量护工所得
                staff_pay_total: '',//单件护工总所得
                per_price: '',//每单位数量单价 real_total/real_combo_num
                virtual_good_id: '',//虚拟的订单产品id 
                discount: '0',// 单价浮动
                total_discount: '0',// 总价浮动
                goods_name: '',//产品名
                description: '',//产品描述
                goodssn: '',//产品编号
                combo_type: '',//单位
                real_combo_num: '0',//订单产品实际数量
                commission: '',//业务抽成
                saleman: '0',//业务员ID
                saleman_name: '', //业务员名字
                type: ''   ,   //产品类型   1：服务计时  2：实物产品   3：计量产品

               serverArr:[] , //存放对应服务信息
            },
            floadPriceM:false, //浮动金额弹窗
            floadPrice:"",//浮动金额
            oneOrAll:"",//修改的浮动金额是单或总
            floadPriceIndex:"", //修改浮动金额下标


        }
    },
    mounted() {

    },
    computed:{
        total(){
          let total = 0
          let arr = this.order_data.order_goods.map(i=>i.real_total)
          if(!arr.length){return 0.00}
         // console.log(arr,11)
          arr.forEach(i=>{
              let num = (isNaN(i) || !i) ? 0 : parseFloat( i) 
              total+=num
          })
          return total
        }
    },

    methods: {
        //打开浮动金额弹窗
        per_price_Modal(index,price,YorN){
           console.log(index,price,YorN)
            this.oneOrAll = YorN
            this.floadPrice = price?price:0
            console.log(this.floadPrice)
            this.floadPriceIndex = index
            this.floadPriceM = true
        },
        // //确定浮动金额
        // sureChange_per_price(i,price,key,value){
        //     console.log(i,price,key,value)
        //     this.change_per_price(i,price,key,value)
        // },
        addForm_goods() {
            if (this.order_data.order_base.fk_hpl_id) {
              this.order_data.order_goods.push(JSON.parse(JSON.stringify(this.goods_item)))
                  this.showSearch_goods_name(this.order_data.order_goods.length-1)   
            } else {
                this.error('请选择网点')
            }

        },

        delForm_goods(i) {
            console.log(1111111)
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除该产品，以及其包含的服务吗？',
                opts: () => {
                    this.order_data.order_goods.splice(i, 1)
                    this.$dialog.toast({ mes: '删除成功', timeout: 1000 })
                    
                }
            })
        },

        //展示产品搜索框
        showSearch_goods_name(i) {
            this.goodsIndex = i
            if (this.order_data.order_base.fk_hpl_id) {
               if(this.order_data.order_goods[i].serverArr==0){
                this.getGoods().then(res => {
                    let searchData = {
                        result: res.data,
                        searchKey: 'goods_id',
                        name: 'goods_description'
                    }
                    this.showSearch(searchData)
                })
               }else{
                this.error('已存在服务不能修改')
               }
              
            } else {
                this.error('请选择网点')
            }
        },

        //展示业务员搜索框
        showSearch_staffs(i) {
            this.goodsIndex = i
        
            if (this.order_data.order_base.fk_hpl_id) {
                this.getStaffs().then(res => {
                    let searchData = {
                        result: res.data,
                        searchKey: 'staff_id',
                        name: 'name'
                    }
                    this.showSearch(searchData)
                })
            } else {
                this.error('请选择网点')
            }
        },

        //获取产品信息
        getGoods() {
            return api.getGoods(this.order_data.order_base.fk_hpl_id).then(res => {
                return res
            })
        },

        //获取业务员
        getStaffs() {
            let fk_hpl_id = this.order_data.order_base.fk_hpl_id
            return api.getStaffs({ fk_hpl_id }).then(res => {
                return res
            })
        },

        //改变单价
        change_per_price(i, per_price,key,value) {
            // if (!event.target.value) {
            //     event.target.value = 0
            //     // this.form[i].real_combo_num=0
            // }
          console.log(111111)
           if(key){
            this.order_data.order_goods[i].discount = value
           }else{

            this.order_data.order_goods[i].total_discount = value
            
           }
            
         
            if (!this.order_data.order_goods[i].discount || this.order_data.order_goods[i].discount == 0) {
                this.order_data.order_goods[i].discount = 0
            }

            if (!this.order_data.order_goods[i].total_discount || this.order_data.order_goods[i].total_discount == 0) {
                this.order_data.order_goods[i].total_discount = 0
            }

            //不改变
            let order_service = this.order_data.order_service
            let id = this.order_data.order_goods[i].virtual_good_id || this.order_data.order_goods[i].pk_id
            if (!order_service.length) {

            }
            setTimeout(()=>{
                this.server_change_per_price()
            },100) 
            // console.log(order_service)
            let arr = order_service.filter(i => {
                return (i.virtual_good_id == id || i.order_goods_id == id)
            })
            // console.log(arr)
            if (!arr.length) {

            } else {
              //  this.error('该产品对应的服务信息的实际单价发生改变！')


            }
            //改变父级 监听单价改变次数 事件
            // this.watchChangeNum(id ,per_price)

           
            this.floadPriceM =false
        },
         
        //改变订单产品实际数量
        change_real_combo_num(i){
            this.order_data.order_goods.forEach((item,i)=>{
                let real_combo_num = 0 
                
                if(item.type!=2){
                    item.serverArr.forEach((it,index)=>{
                        if( !it.time || it.time==0){
                            this.order_data.order_goods[i].serverArr[index].time=0
                        }  
                        real_combo_num = real_combo_num + parseFloat(it.time || 0 )
                      
                       })
                       this.order_data.order_goods[i].real_combo_num = real_combo_num 

                }
                
                //this.order_data.order_goods[i].num = this.order_data.order_goods[i].real_combo_num
                
                setTimeout(()=>{
                    this.server_change_per_price()
                },100) 

                
            })
        },
      

        //改变服务金额
        server_change_per_price(){
            this.order_data.order_goods.forEach((item,i)=>{
                
                let per_price = item.per_price
               // console.log(per_price,item,item.per_price)
                item.serverArr.forEach((it,index)=>{
                
                     this.order_data.order_goods[i].serverArr[index].per_price=per_price
                             
                })
   

                
            })
             
        }

       

    }
}