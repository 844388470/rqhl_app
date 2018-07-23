//打印机 扫码
import JsBarcode from 'jsbarcode'
import moment from 'moment'
import domtoimage from 'dom-to-image';
export default {
    data() {
        return {
            nowDate:moment().format("YYYY-MM-DD   HH:mm"),
            i: 10,
            isAndroid: !!window.OMS,
            isprint: false, // 是否打印
            isShowScanQRCode: false,
            isShowScanQRCodeArr: ['weixin'], //需要扫码的环境
            banColor: '#5bacf9',
            print_no: '', //打印单号
            printDisable: false,
            printShow:false,
        }
    },
    computed:{
             //浮动金额(未完成)
      fu_total(){
        let total = 0
        let allTotal =0 //总价浮动
        let sTotal = 0  //单价浮动
        let arr = this.order_data.order_goods.map(i=>i.total_discount)
        if(!arr.length){return 0.00}
       // console.log(arr,11)
        arr.forEach(i=>{
            let num = (isNaN(i) || !i) ? 0 : parseFloat( i)  
            allTotal+=num
        })
        this.order_data.order_goods.forEach((item,i)=>{
           let  v = (isNaN(item.discount) || !item.discount) ? 0 : parseFloat(item.discount) 
           let num = (isNaN(item.real_combo_num) || !item.real_combo_num) ? 0 : parseFloat(item.real_combo_num) 
            sTotal+=v*num
        })
         
         
        return (allTotal+sTotal).toFixed(2)

      }
    },
    mounted() {
        this.isScanQRCode()
    },

    methods: {
        //是否显示扫码
        isScanQRCode() {
            let ANGENT = sessionStorage.ANGENT || ''
            if (this.isShowScanQRCodeArr.includes(ANGENT)) {
                this.isShowScanQRCode = true
            }
            if (this.isAndroid) {
                //安卓 
                this.isShowScanQRCode = true
            }
        },

        //微信扫一扫
        ScanQRCode() {
            if (sessionStorage.ANGENT == 'weixin') {
                this._setScanQRCode((res) => {
                    this.change_orders_item.order_no = res.resultStr.split(',')[1]
                    this.success('扫码成功')
                }, (res) => {
                    this.error('扫码失败')
                })
            } else if (this.isAndroid) {
                window.OMS.startCodeScan(3)
            }
        },

        //安卓二维码回掉
        AndroidScanResul() {
            let data = sessionStorage._setScanResult || '{}'
            data = JSON.parse(data)
            this.change_orders_item.order_no = data.data
        },

        //浏览打印
        printView() {
           this.order_data=this.getSubmitData(1)
            this.leverOrderDataMethod()

            this.isprint = true
            this.chanceCode()
        },

        //生成条形码
        chanceCode() {
            JsBarcode("#bcode", this.order_data.order_base.order_no, {
                format: "CODE128B",
                displayValue: false,
                height: 50,
            })
        },

     //截取产品字段 v 1 为一级 0为描述 2
      sliceStr(str,v){
        let arr = str.split('/')
        if(arr.length<5){
          return str
        }
        if(v==1){
          return arr[1]
        }else if(v==0){
          arr.shift()
          arr.pop()
          return arr.join('/')
        }else if(v==2){
           arr.shift()
         
          return arr.join('/')
 
        }
       },

           //打印机打印
    print(){
        //  this.printShow=true  //调试订单图片
        
          let IsOP = IsOpened()
          if(IsOP==1){
            this.printDisable = true
            let date = moment().format('YYYY-MM-DD')
             //打印操作
              //alert(111) 
            this.chanceImg()
           // PrintText(this.order_data,date)
           //  setTimeout(()=>{this.printDisable = false},5000)
            this.i = 10
            let time = setInterval(()=>{
                 this.i = this.i-1
                 if(this.i<=0){
                    this.printDisable = false
                   clearInterval(time)
                 }
                  
            },1000)
   
          }else{
            showDeviceList()
            
          }  
       },

        //变图片测试
    chanceImg(){
        //print
        // alert(222) 
        this.printShow=true
        let that = this
        let nodeDome = document.getElementById('print1')
         let pritimg = document.getElementById('pritimg')
        domtoimage.toPng(nodeDome,{ quality: 1 })
        .then(function (dataUrl) {
            
          //  console.log(dataUrl)
            // alert(dataUrl.length)
         
          // alert(dataUrl.length) 
          let status =  window.Printer.getstatus()  //0 打印准备就绪 1打印中 2缺纸 6打印机开盖  其他出错
          
          //alert(status)
          if(status==1){
            return 
          }else if(status!=0){
            window.Printer.Abort()
  
          }
          let num = sessionStorage.print_num || '2'
           let p =79.899
           let pageLeng = '1820' 
            if(that.isrqhl){
             // pageLeng = '1590' 
              pageLeng = (p*20.23)+''
            }else{
              pageLeng = '1820' 
            }
           window.Printer.printAreaSize("0","200","200",pageLeng,num)
           window.Printer.Expanded3("0","0",dataUrl,0);
         
          
          setTimeout(()=>{
           that.printShow=false
          },500)
             
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
  
      },



       //打印的上一步
    printViewPrev(){
        this.leverOrderDataMethod()
        this.isprint=false
      },

    },
}