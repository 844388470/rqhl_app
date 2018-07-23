// 将对象置为空(form 表单重置)
export const emptyObject =(obj) =>{
    let o = JSON.parse(JSON.stringify(obj))
    for(let i in o){
        o[i] = ( o[i] instanceof Array) ? [] :''
    }
    return o  
}

// obj1 的值覆盖到obj上 , （编辑表单时候用）
export const coverObj = (obj,obj1) =>{
    let o = JSON.parse(JSON.stringify(obj))
    let o1 = JSON.parse(JSON.stringify(obj1))
     for(let i in o ){
         if(o1[i] !='undefined'){
             o[i] = o1[i]
         }else{
            o[i] = ( o[i] instanceof Array) ? [] :''
         }
     }
   return o
}

//obj（改变） 的值 从 obj1 里面拿
export const copyObj = (obj,obj1) =>{
    let o = JSON.parse(JSON.stringify(obj))
    let o1 = JSON.parse(JSON.stringify(obj1))
    let keyArr = Object.keys(o)
    let keyArr1 = Object.keys(o1)
    keyArr1.forEach((item,i)=>{
        if(keyArr.includes(item)){
            o[item] = o1[item]
        }
    })

   return o
}

//数组去重
export const arrNotReapt = (arr) =>{
    let a = JSON.parse(JSON.stringify(arr))
   return [...new Set(a)]
}

export function getYearMonthDay(date) {
  if(date){
    if(typeof date==='string'){
        return date
    }else{
        return date.getFullYear()+'-'+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))+'-'+(date.getDate()<10?'0'+date.getDate():date.getDate())
    }
  }else{
    return ''
  }
}
