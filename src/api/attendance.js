//考勤

import axios from 'axios'

// 添加考勤
export const addAttendance = (data) => {
    return axios.post('/add_attendance', data)
}

//考勤修改
export const editAttendance = (data) => {
    return axios.post('/edit_attendance', data)
}

// 查询考勤
export const serachAttendance = (data) => {
    return axios.post('/serach_attendance', data)
}


//按天查询考勤
export const search_attendance_day = (data) => {
    return axios.post('/search_attendance_day', data)
}

//入口查询
export const search_index = (data) => {
    return axios.post('/search_index', data)
}


// 考勤按人详情查询
export const get_attendance_info_for_staff = (data) => {
    return axios.post('/get_attendance_info_for_staff', data)
}

// 考勤按天查询详情
export const get_attendance_info_for_day = (data) => {
    return axios.post('/get_attendance_info_for_day', data)
}

//获取日期有无考勤
export const has_attendance = (data) => {
    return axios.post('/has_attendance', data)
}


