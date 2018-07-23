//收付明细
import moment from 'moment'
import * as api from '@/api'
export default {
    data() {
        return {
            chargeIndex:'',
            charge_item: {
                pk_id: '',// 订单收付id
                order_id: '',// 订单id
                price: '0',// 金额  必填
                charge_time: moment().format('YYYY-MM-DD'),//  收付日期  必填
                charge_type: '1',// 收付类型 1:收费 2:退费 3:付费   必填
                pay_type: '1',// 付款方式   1:现金 2:银行转账 3:微信 4:支付宝 5:其他   必填
                fk_stf_c_id: this.$store.state.userinfo.pk_id,//收银员id    必填
                fk_stf_c_id_name: this.$store.state.userinfo.name, //收银员名字
                pay_status: '0',// 付款状态   0：未支付  1：已支付   
                trans_no: '',  //流水号
                item: '', //备注

            }
        }
    },
    computed: {
        has_pay() {
            let arr = this.order_data.order_charge.map(i => i.price)
            if (!arr.length) { return 0.00 }
            return arr.reduce((total, num) => {
                num = isNaN(num) ? 0 : num
                num = num || 0
                return parseFloat(total) + parseFloat(num)
            })
        }
    },

    methods: {
        //添加收费明细表单
        addForm_charge() {
            this.order_data.order_charge.push(JSON.parse(JSON.stringify(this.charge_item)))
        },
        //删除收费明细表单
        delForm_charge(i){
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除该项吗',
                opts: () => {
                  this.order_data.order_charge.splice(i,1)
                  this.$dialog.toast({ mes: '删除成功', timeout: 1000 }) 
                }
            })
            
        },
        //显示 操作员 搜索框
        showSearch_fk_stf_c_id_name(i) {
            this.chargeIndex = i
            let fk_hpl_id = this.order_data.order_base.fk_hpl_id
            if(!fk_hpl_id){
                this.error('请选择网点')
                return
            }
            this.getStaffs(fk_hpl_id).then(res => {
                let searchData = {
                    result: res.data,
                    searchKey: 'fk_stf_p',
                    name: 'name'
                }
                this.showSearch(searchData)
            })
        },
        //获取操作员 信息 
        getStaffs(fk_hpl_id) {
            return api.getStaffs({ fk_hpl_id }).then(res => res)
        },
        //监听金额改变
        change_price(e, i) {
            // console.log(i)
            if (!this.order_data.order_charge[i].price) {
                this.order_data.order_charge[i].price = 0
            }
            if (this.order_data.order_charge[i].charge_type == 1) {
                if (parseFloat(this.order_data.order_charge[i].price) < 0) {
                    this.order_data.order_charge[i].price = 0
                }
            }
            else if (this.order_data.order_charge[i].charge_type == 2 || this.order_data.order_charge[i].charge_type == 3) {
                if (parseFloat(this.order_data.order_charge[i].price) > 0) {
                    this.order_data.order_charge[i].price = -this.order_data.order_charge[i].price
                }
            }
        },
        
       

    },
  


}