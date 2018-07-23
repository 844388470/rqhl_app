<template>
    <div class="message">
        <div class="header">
            <div class="top-title">
                  <yd-cell-group>
                        <yd-cell-item arrow type="label">
                            <span slot="left">消息筛选：</span>
                            <select slot="right" v-model="search_info.type" @change="handelSearch">
                                <option value="">全部消息</option>
                                <option v-for="(item,i) in serach_type" :key="i" :value="item.pk_id" >{{item.name}}</option>
                                
                            </select>
                        </yd-cell-item>
                    </yd-cell-group>
            </div>
            
        </div>
      
        <div class="notice">
            <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
               <yd-list theme="1" slot="list">

                  <yd-preview :class="[{ pt10:true}]" @click.native="$router.push(`/messageDet?pk_id=${item.pk_id}`)" v-for="(item , i) in pageData" :key="i" :buttons="[]" >
                            <yd-preview-item :class="[{no:!item.read_at}]">
                                <div slot="left"><h4 >{{item.title}}</h4></div>
                                <div slot="right"></div>
                            </yd-preview-item>
                            <yd-preview-item>
                                <div slot="left"><span>{{item.created_at}}</span></div>
                                <div slot="right"><span></span></div>
                            </yd-preview-item>
                        
                    </yd-preview>

               </yd-list>
            </yd-infinitescroll>
        </div>
    </div>
</template>
<script>
import * as api from '@/api/index'
export default {
        data(){
            return{             
                search_info:{
                    search:'',
                    type:''
                },
                serach_type:[],
            }
        },
        mounted () {
            this.notice_type().then(res=>{
                  this.get_notices()    

            })
             
        },
        methods: {
         
            loadList(){
              this.get_notices()
            },
             //
            get_notices(){
                let data = Object.assign(this.search_info,this.pageInfo)
               return api.notices(data).then(res=>{
                    this.handelScrollResult(res)               
                    return res
                })
            },

            //获取通知类型
            notice_type(){
              return  api.notice_type().then(res=>{
                    this.serach_type = res.data
                    return res
                })
            },

            //搜索
            handelSearch(){
              this.pageInfo.page=1  
              this.pageData=[]
              this.clearScrollResult()
              this.get_notices()
            }
            

            




        }
    }
</script>
<style lang="scss" scoped>
.message{
    background: #fff;
}

.top-title{
    height: 1.3rem;
    line-height: 1.2rem;
    border-bottom: 0.1rem solid #eee;
}
.top-title p{
    margin: 0 0.3rem;
    // padding: 0.2rem 0;
}
.title{
    font-size: 0.32rem;
    color: #333333;
    border: 0;
}
.select{
    color: #5bacf9;
    font-size: 0.3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    border: 0.01rem solid #5bacf9;
    display: inline-block;
    padding: 0 0.3rem;
}
.select i{
    right: 0;
    display: inline-block;
    padding: 0 0 0 0.1rem;
}
ul li{
    width: 100%;
    display: inline-block;
    border-bottom: 0.01rem solid #eee;
    text-align: center;
}
ul li span,.allMessage span{
    display: inline-block;
    width:1.4rem;
    height: 0.56rem;
    line-height: 0.56rem;
    border: 0.01rem solid #5bacf9;
    border-radius: 0.28rem;
    text-align: center;
    margin: 0.21rem 0.16rem;    
    color: #5bacf9;
}

.allMessage{
    border-bottom: 0.01rem solid #eee;
}
.allMessage span{
    display: inline-block;
    margin: 0.21rem 0.3rem;    
    background: #5bacf9;
    color: #fff;
}
.btn{
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    box-shadow:0 0.1rem 0.1rem #ddd;
}
.btn button{
    margin: 0 0.5rem;
    width: 1.8rem;
    height: 0.7rem;
    border-radius: 0.34rem;
    font-size: 0.3rem;
    border: 0.01rem solid #5bacf9;
}
.btn button:first-child{
    color: #5bacf9;
    background: #fff;
}
.btn button:last-child{
    color: #fff;
    background: #5bacf9;
}
</style>