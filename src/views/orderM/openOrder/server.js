import moment from 'moment'
import * as api from '@/api'
export default {
    data(){
        return {
            serverIndex: '',
            severShow:true,
            server_item:{
                order_id:'',  
                pk_id:'' , //订单服务id  
                virtual_good_id:'' , //虚拟的订单产品id   对应订单产品的虚拟id 
                order_goods_id:'' , //订单产品id 
                goods_id:'' , //产品id   必填 
                start:moment().format('YYYY-MM-DD') , //服务开始时间   必填
                end:'' , //服务结束时间
                time:'0' , //天数 
                fk_stf_id:'' , //护工id/护理组id   必填 
                staff_pay:'' , //护工所得 
                pattern:'' , //护理模式  
                per_price:'' , //每单位数量单价 
                price:'',
                server_amount:'' , //服务金额小计   per_price*time
                count_type:'1',  //计时方式   必填
                pay_type:'',    //结算方式    对应基础信息的护工薪酬    1：月结   2：日结
        
                vir_goods_description:'',  //展示的服务产品名
                vir_combo_type:'',         //单位   
                vir_staff_pay:'',          //每单位护工所得
                fk_stf_id_name:'',     //护工/护理组
                vir_type:'1'     //产品类型
        
                //
              }

        }
    },
    methods: {

        addForm_server(item,i){
           
            if(item.goods_description){
                let serverItem = JSON.parse(JSON.stringify(this.server_item))
                let order_base = this.order_data.order_base
                serverItem.pattern=order_base.pattern 
                serverItem.pay_type=order_base.work_type
                if(serverItem.pattern==1){
                    serverItem.fk_stf_id_name=order_base.group_name
                    serverItem.fk_stf_id=order_base.group_id || 0
                }
                serverItem.vir_goods_description=item.goods_description
                serverItem.order_id=item.order_id 
                serverItem.order_goods_id=item.pk_id
                serverItem.goods_id=item.goods_id
                serverItem.per_price=item.per_price
                serverItem.virtual_good_id=item.virtual_good_id
                serverItem.price=item.price
     
                serverItem.vir_combo_type=item.combo_type
                serverItem.vir_staff_pay=item.staff_pay
                serverItem.vir_type=item.type

                if(this.isrqhl){
                    serverItem.count_type= '1'
                }else{
                    serverItem.count_type= '2'
                }


                if(serverItem.vir_type==3){
                    serverItem.count_type= 3
                }
               //  console.log(serverItem)
                this.severShow = false
                this.order_data.order_goods[i].serverArr.push(serverItem)
                this.severShow = true
                console.log(item,i,this.order_data.order_goods[i].serverArr)

            }else{
                this.error('请选择产品')
            }
        },

        delForm_server(i,index){
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除该服务吗？',
                opts: () => {
                    this.order_data.order_goods[i].serverArr.splice(index, 1)
                    this.$dialog.toast({ mes: '删除成功', timeout: 1000 })
                    this.change_real_combo_num()
                }
            })

        },

        //显示护工/护理组搜索框
      showSearch_fk_stf(i,index,item){
        this.serverIndex=index
        this.goodsIndex = i
        //护理模式 pattern
        let pattern = item.pattern 
        
        if(pattern){
         this.getPatternList(pattern).then(res=>{
             console.log(res)

             let searchData={
                   result:res.data,
                   searchKey:'fk_stf',
                   name:'name'
               }
               this.showSearch(searchData)
             
         })


        }else{
            this.error('请选择服务产品')
        }
     },

      //获取护工/护理组 数据
      // 如果护理模式为1，fk_stf_id 获取的接口为护理组的
      //如果护理模式为2，fk_stf_id 获取的接口为护工的
      getPatternList(i){
       let order_base = this.order_data.order_base
        let fk_hpl_id =  order_base.fk_hpl_id 
        if(!fk_hpl_id){
            this.error('请先选择网点')
            return false
        }
        if(i==1){      
          return api.getGroupList([fk_hpl_id]).then(res=>res)
        }else if(i==2){
          return api.getStaffs({fk_hpl_id}).then(res=>res) 
        }

    },
    getEndTime(item_s){
        // {{item_s.end=(item_s.time==0||!item_s.time)? '': (item_s.count_type==1?(new Date(new Date(item_s.start).getTime() + Math.ceil(parseFloat(item_s.time-1))*864e5)):item_s.count_type==2?(new Date(new Date(item_s.start).getTime() +  Math.ceil(parseFloat(item_s.time))*864e5)):new Date(item_s.start)).toISOString().slice(0,10)}}
        
        let end = ''
        let time = Math.ceil(parseFloat(item_s.time))
        if(!time){
            return end
        }
        if(item_s.count_type==1){
            end=  moment(item_s.start).add(time-1,'days').format('YYYY-MM-DD')
        }else if(item_s.count_type==2){
            end=  moment(item_s.start).add(time,'days').format('YYYY-MM-DD')
        }else if(item_s.count_type==3){
            end=  moment(item_s.start).format('YYYY-MM-DD')
        }
        return end
    },
    
    //改变时间
    change_time(i,item_s,index,item){
        this.change_real_combo_num(i)
        this.order_data.order_goods[i].serverArr[index].staff_pay = (item_s.vir_staff_pay * Math.ceil(parseFloat(item_s.time))).toFixed(2)

    }
        
    },
    filters: {
        vir_combo_type(v) {
            if (v == '套') {
                return '次'
            } else if (v == '月') {
                return '天'

            } else {
                return v
            }
        }
    }
}