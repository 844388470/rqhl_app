import wx from 'weixin-js-sdk'
import * as api from '../api'
export default {
    methods: {
        //微信配置
        _wxpayConfig(ApiList) {
            return api
                .getConfigInfo()
                .then(res => {
                    console.log(res)
                    let data = res.data
                    wx.config({
                        debug:data.debug ,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: ['getLocation', 'chooseWXPay', 'openLocation','scanQRCode']
                    })
                    // ['getLocation', 'chooseWXPay', 'openLocation']
                   // alert('配置成功')
                    return res.data
                })
                .catch(err => {
                    console.log(err)
                })
        },

        //支付操作
        _setWxpayInfo(data, s, er) {
            this._wxpayConfig().then(() => {
                wx.chooseWXPay({
            
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(res) {
                        if (res.errMsg === 'chooseWXPay:ok') {
                            // window.alert('支付成功')
                            s(res)
                        } else {
                            //  window.alert(' 支付失败')
                            er(res)
                        }
                    },
                    cancel(res) {
                           
                      //  er(res)
                    },
                    error(res) {
                        //  window.alert('支付失败')
                        er(res)
                    }
                })
            })
        },

        //扫一扫
        _setScanQRCode(s, er) {
            this._wxpayConfig().then(() => {
                console.log(s,er)
                wx.scanQRCode({
            
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success(res) {
                       
                        s(res)
                    },
                    cancel(res) {
                           
                      //  er(res)
                    },
                    error(res) {
                        //  window.alert('支付失败')
                        er(res)
                    }
                })
            })
        },

        _setOpenLocation(data,s,er){
            this._wxpayConfig().then(() => {
                wx.openLocation({
            
                    latitude: 32.1756124785,
                    longitude: 103.9746093750,
                    name: 'name',
                    address:  'add',
                    scale: 1,
                    //infoUrl:'',
                    success(res) {
                        alert('成功')
                        alert(JSON.stringify(res))
                        s&&s(res)
                    },
                    cancel(res) {
                           
                      //  er(res)
                    },
                    fail(res) {
                        //  window.alert('支付失败')
                        alert('失败')
                        alert(JSON.stringify(res))
                        er&&er(res)
                    }
                })
            })


        },



    }
}
