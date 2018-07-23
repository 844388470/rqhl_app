import axios from 'axios'

//日报数据提交
const common_data = (data) => {
    return axios.post('/common_data/commit', data)
}