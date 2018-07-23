import * as api from '@/api'
export default {
    data() {
        return {
            initOrderData: '', //记录初始数据
        }
    },
    beforeRouteLeave: async(to, from, next) => {
        // console.log(window.ORDER_this)
       if(window.ORDER_this.isSubmit) {
          next()
          return 
       }
       let noChange= await window.ORDER_this.leverOrderDataMethod()
       console.log(noChange)
        if(!noChange){
         next(confirm('确认不保存修改直接离开么？'))
        }else{
         next()
        }
         
      },
    methods: {

        //提交订单 (v有值不跳转页面)
        submitOrder(v) {
          
           
            //判断是否修改
            if (this.leverOrderDataMethod()) {
                if (v) {
                    this.print() //打印
                    return false
                } else {
                    this.success('保存成功')
                    setTimeout(() => {
                        this.isSubmit = true
                        this.$router.go(-1)
                    }, 1000)
                    return false
                }

            }
            let order_data = this.getSubmitData()
            if (this.pk_id) {
                this.updateOrderInfo({ order_data }, v).then(res => {
                    //打印
                    console.log(res)
                    if (!res) {
                        return false
                    }
                    this.printDataChange(res) //打印加新数据更新

                })
            } else {
                this.createOrder({ order_data }, v).then(res => {
                    //打印
                    console.log(res)
                    if (!res) {
                        return false
                    }
                    let data = res.data
                    this.pk_id = data.order_base.pk_id
                    if (!this.$route.id) {
                        this.order_data.order_base.pk_id = this.pk_id

                    }
                      this.printDataChange(res) //打印加新数据更新

                })
            }

        },
        //订单新增
        createOrder(data, v) {
            return api.createOrder(data).then(res => {
                let ORDER_INFO = {
                    dub_name: data.order_data.order_base.dub_name,
                    fk_hpl_id: data.order_data.order_base.fk_hpl_id,
                    fk_dub_id: data.order_data.order_base.fk_dub_id,
                    group_id: data.order_data.order_base.group_id,
                    group_name: data.order_data.order_base.group_name,
                    pattern: data.order_data.order_base.pattern,
                    work_type: data.order_data.order_base.work_type,
                }
                localStorage.ORDER_INFO = JSON.stringify(ORDER_INFO)
                if (v) {
                    //打印预览
                    return res
                } else {
                    this.success('添加成功')
                    console.log(res)
                    sessionStorage.orderKey = 'add'
                    let { pk_id, order_no, patient_name, patient_sex, patient_phone,dub_name, bed, bill_time } = res.data.order_base
                    let goods = res.data.order_goods
                    sessionStorage.order_goods = JSON.stringify({ pk_id, order_no,patient_phone, patient_name, patient_sex, dub_name, bed, bill_time, goods })
                    setTimeout(() => {
                        this.isSubmit = true
                        this.$router.go(-1)
                    }, 1000)
                    return false

                }

            })
        },

        //订单修改
        updateOrderInfo(data, v) {
            return api.updateOrderInfo(data).then(res => {
                if (v) {
                    //打印预览
                    console.log(v)
                    return res
                } else {
                    this.success('修改成功')
                    sessionStorage.orderKey = 'edit'
                    let { pk_id, order_no, patient_name,patient_phone, patient_sex, dub_name, bed, bill_time } = res.data.order_base
                    let goods = res.data.order_goods
                    sessionStorage.order_goods = JSON.stringify({ pk_id,patient_phone, order_no, patient_name, patient_sex, dub_name, bed, bill_time, goods })
                    console.log(JSON.parse(sessionStorage.order_goods))
                    setTimeout(() => {
                        this.isSubmit = true
                        this.$router.go(-1)
                    }, 1000)
                    return false
                }

            })
        },

        //获取订单明细
        getOrderInfo() {
            return api.getOrderInfo(this.pk_id).then(res => {
                console.log(res)
                try {
                    let data = res.data.data
                    this.order_data = res.data.data
                    this.order_data.order_goods.forEach((item, i) => {
    
                        let serverArr = this.order_data.order_service.filter(it => {
                            return it.goods_id == item.goods_id
                        })
                        console.log(serverArr)
                        this.order_data.order_goods[i].serverArr = serverArr
    
                    })
                    this.getDubList(JSON.parse(JSON.stringify(data.order_base)).fk_hpl_id)
                    this.print_no = data.print_no
                    
                } catch (error) {
                    
                }
              
                return res

            })
        },

        //变成提交的数据
        getSubmitData(v) {
            this.order_data.order_base.total = this.total
            this.order_data.order_base.has_pay = this.has_pay
            let order_data = JSON.parse(JSON.stringify(this.order_data))
            order_data.order_goods.forEach((item, i) => {
                let real_combo_num = 0
                if(item.type!=2){
                    item.serverArr.forEach((it, index) => {
                        real_combo_num = real_combo_num + parseFloat(it.time || 0)
                        order_data.order_service.push(it)
                    })
                    order_data.order_goods[i].real_combo_num = real_combo_num

                }
          
                order_data.order_goods[i].num = order_data.order_goods[i].real_combo_num / item.combo_num
               if(!v){
                delete order_data.order_goods[i].serverArr
               } 
            })
            return order_data
        },

        //变成提交的数据1 meiyong
        getSubmitData1(v) {
            this.order_data.order_base.total = this.total
            this.order_data.order_base.has_pay = this.has_pay
            let order_data = JSON.parse(JSON.stringify(this.order_data))
            order_data.order_goods.forEach((item, i) => {
                let real_combo_num = 0
                if(item.type!=2){
                    item.serverArr.forEach((it, index) => {
                        real_combo_num = real_combo_num + parseFloat(it.time || 0)
                        order_data.order_service.push(it)
                    })
                    order_data.order_goods[i].real_combo_num = real_combo_num

                }
          
                order_data.order_goods[i].num = order_data.order_goods[i].real_combo_num / item.combo_num
                // delete order_data.order_goods[i].serverArr
            })
            return order_data
        },

        //保存订单开始初使数据
        initOrderDataMethod() {
            this.initOrderData = JSON.stringify(this.order_data)
        },

         //离开订单判断改变
        leverOrderDataMethod(){ 
           
            return this.initOrderData==JSON.stringify(this.order_data)  
          
        },
          //打印时获取新数据后的数据更新赋值
    printDataChange(res){
        let data = res.data
         this.order_data = res.data
         this.print_no = data.print_no
         this.order_data.order_goods.forEach((item, i) => {
             let serverArr = this.order_data.order_service.filter(it => {
                 return it.goods_id == item.goods_id
             })
             console.log(serverArr)
             this.order_data.order_goods[i].serverArr = serverArr

         })

         this.getDubList(JSON.parse(JSON.stringify(data.order_base)).fk_hpl_id)

         this.print_no = data.print_no
 
         this.print() //打印
          setTimeout(()=>{
          this.initOrderDataMethod()
        },100) 
 
     },
    }
}