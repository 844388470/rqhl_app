import axios from 'axios'

// 统计首页(手机端)
export const operation_data = (data) => {
    return axios.post('/mobile/operation_data', data)
}

//手机端财务经营数据
export const finance_operation = (data) => {
    return axios.post('/mobile/finance_operation', data)
}

//经营数据项目列表数据
export const finance_detail = (data) => {
    return axios.post('/mobile/finance_detail', data)
}

//经营数据项目明细数据
export const finance_detail_show = (data) => {
    return axios.post('/mobile/finance_detail/show', data)
}

//收费查询
export const getChargeQuery = (data) => {
    return axios.post('/mobile/charge_query_by_day', data)
}

//收费列表
export const getChargeQueryList = (data) => {
    return axios.post('/mobile/charge_detail', data)
}

//收费品类明细
export const getChargeQueryDetail = (data) => {
    return axios.post('/mobile/charge_query_detail', data)
}

//收费科室明细
export const getChargeQueryDetailByDub = (data) => {
    return axios.post('/mobile/change_query_detail_by_dub', data)
}

//收入查询
export const getIncomeQuery = (data) => {
    return axios.post('/mobile/income_query', data)
}

//收入列表
export const getIncomeQueryList = (data) => {
    return axios.post('/mobile/income_detail', data)
}

//收入品类明细
export const getIncomeQueryDetail = (data) => {
    return axios.post('/mobile/income_detail_by_class_type', data)
}

//收入科室明细
export const getIncomeQueryDetailByDub = (data) => {
    return axios.post('/mobile/income_detail_by_dub', data)
}