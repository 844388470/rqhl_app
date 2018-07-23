// 订单管理api
import axios from 'axios'

//获取订单列表
export const getOrderList = (data) =>{
    return axios.post('/mobile/orders/order_list',data)
}

//删除订单
export const ordersDelete = (pk_id) => {
    return axios.post(`/mobile/orders/delete`, { pk_id })
}
//获取产品类别
export const getGoodsType = () =>{
    return axios.post(`/data_dictionary_list`,{page:1,limit:100,sort:'created_time',sort_type:'desc',module:'goods',key_name:'goods_category'})
}