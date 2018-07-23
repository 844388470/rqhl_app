<template>
  <div class="detail">
        <div class="header tc">
            <h3>{{info.title}}</h3>
            <p><span>{{info.created_at}}</span></p>
        </div>
        <div class="message">
            <p>
                {{info.content}}
            </p>
        </div>
  </div>
</template>
<script>
import * as api from '@/api'
    export default {
        data(){
            return{
               pk_id:this.$route.query.pk_id,  
               info:{}
            }
        },
        mounted () {
            this.show_notices()
        },
        methods:{
           show_notices(){
               api.show_notices(this.pk_id).then(res=>{
                   this.info = res.data
               })
           }
        }
    }
</script>
<style lang="scss" scoped>
.detail{
    height: 100%;
    background: #fff;
}
.header{
    padding: 0.3rem 0.3rem 0.5rem 0.3rem;
}
.header h3{
    font-size: 0.4rem;
}
.header p{
    font-size: 0.24rem;
    padding: 0.2rem 0 0 0;
    color: #bbbbbb;
}
.message{
    padding: 0 0.3rem;
    font-size: 0.3rem;
}
.message p{
    text-indent: 0.4rem;
    padding: 0.2rem 0 0 0;
    font-size: 0.3rem;
}
.message p:first-child span{
    padding: 0 0.3rem;
}
</style>

