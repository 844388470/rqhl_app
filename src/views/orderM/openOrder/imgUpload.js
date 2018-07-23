//图片上传
import moment from 'moment'
export default {
    data() {
        return {
            upLoadShow: false,
            picUrl: '', //编辑时的图片地址
            isEdit: false, //是否处于编辑状态
            Imgindex:'',
            
            //订单图片里面的每一项
            change_orders_item: {
                pk_id: '', //订单变更id
                order_id: '',//订单id
                picid: '0',//图片id 
                path: '',//图片地址  必填
                order_no: '',//变更单号
                bill_time: moment().format('YYYY-MM-DD'),//变更日期  必填
            },
            _change_orders_item: {},
            isShowScanQRCode:false,
        }
    },
    mounted() {
        
        this._change_orders_item = JSON.parse(JSON.stringify(this.change_orders_item))

    },
    methods: {
        //添加图片 
        add_pic(isEdit, index) {
            this.isEdit = !!isEdit
            this.change_orders_item = JSON.parse(JSON.stringify(this._change_orders_item))

            this.picUrl = ''
            if (this.isEdit) {
                //编辑
                this.Imgindex = index
                this.change_orders_item = JSON.parse(JSON.stringify(this.order_data.change_orders[index]))
                this.picUrl = this.order_data.change_orders[index].path
            } else {
                //添加
            }
            this.upLoadShow = true
        },
        //图片上传成功
        upload_success(res) {
            console.log(res)
            this.change_orders_item.path = res.url
            this.change_orders_item.picid = '0'

        },
          //删除图片
      delChange_orders_item(){
        this.$dialog.confirm({
                title: '提示',
                mes: '确定删除该条记录吗？',
                opts: () => {
                     this.order_data.change_orders.splice(this.Imgindex,1)
                     this.upLoadShow=false 
                }
       })      
  },

      //取消 图片
      canlChange_orders_item(){
        
        this.picUrl = ' 1 '       
        this.upLoadShow=false
 
       },

            //添加/修改图片
      suerChange_orders_item(){
          console.log(this.change_orders_item)
        if(this.change_orders_item.path){
          
          if(this.isEdit){
           //编辑
           this.order_data.change_orders.splice(this.Imgindex,1,JSON.parse(JSON.stringify(this.change_orders_item)))

          }else{
              //添加
              this.order_data.change_orders.push(JSON.parse(JSON.stringify(this.change_orders_item)))
               
                
          }
           this.picUrl = ' 1 '
          
           this.upLoadShow=false

        }else{
            this.error('请选择图片上传')
        }
  },
    }
}