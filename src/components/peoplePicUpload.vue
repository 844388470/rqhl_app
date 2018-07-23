<!-- 简单图片上传 -->
<template>
    <div>
        <input v-show="false" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileChanged" ref="file" multiple="multiple">
        <div class="imgitem " >
            <div>
                <div class="img_box" >
                 <!--div class="mark"></div-->  
                    <div class="img" v-for="(item,index) in list" :key="item.allUrl">
                        <img class="img" :src="item.allUrl" @touchstart="showDeleteButton(index)" @touchend="clearLoop(index)">
                        <p class="tishi">{{!item.states?'已上传':(item.states==1?'正在上传中..':(item.states==2?'上传失败':''))}}</p>
                    </div>
                    <div class="img" v-show="iconstatus">
                        <i class="iconfont paizhao img"  @click="addbtn"></i>
                    </div>
                </div >
            </div>

            <!--div v-if="img">
                <div class="img_box" >
                    <div class="mark"></div> 
                        <img @click.prevent.stop="clickimg" :src="img" class="img">
                </div>
            </div-->
        </div>
    </div>
</template>

<script>
/**@augments
 * @function  success(res)  成功回调 
 * @function  error(res)    错误回调 
 *  
 */
import lrz from 'lrz'
import config from '@/config'
export default {
    props:{
        leng:{
            type: Number,
            default:-1
        },
        idx:{
            type: Number,
            default:-1
        },
        apiMethod:{
            required:true
        },
        lists:{
            type: Array,
            default(){
                return []
            }
        },
        imgType:{
         default:'other' 
      }
    },  
    data () {
        return {
            img:'',
            list:[],
            Loop:'',
            isDeleting:false,
            i:1,
            ossArr:['OSSAccessKeyId','policy','signature','x-oss-object-acl','success_action_status','expire'],
            iconstatus:true,
        }
    },
    mounted(){
        this.list=this.lists
        this.list.forEach(item=>{
            if(item.allUrl){
                this.iconstatus =false
            }
        })
    },
    methods: {
        fileChanged(){                              
            let len = this.$refs.file.files.length
            if(!len) return false
            let quality = this.$refs.file.files[0].size/1024>300? 0.8 : 1
            lrz(this.$refs.file.files[0],{quality}).then( rst=>{
                this.img = rst.base64
                if(this.leng===-1 || this.list.length<this.leng){
                    this.list.push({
                        allUrl:rst.base64,
                        states:1,
                        i:this.i
                    })
                    this.i++
                }else{
                    this.list.splice(this.leng-1,1)
                    this.list.push({
                        allUrl:rst.base64,
                        states:1,
                        i:this.i
                    })
                    this.i++
                }
                this.submit(rst,this.list.length-1) 
            })
        },
        showDeleteButton(index) {
            clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
            this.isDeleting = false;
            this.Loop=setTimeout(()=>{
                this.isDeleting = true;
                this.$dialog.confirm({
                    title: '警告',
                    mes: '是否删除该张图片?',
                    opts: () => {
                        if(this.list.filter(_=>_.states?_.states==1:false).length){
                            this.$dialog.toast({mes:'有图片正在上传中,不允许删除', timeout: 1000});
                            return
                        }
                        this.list.splice(index,1)
                    }
                });
            },1000);
        },
        clearLoop(index) {
            clearInterval(this.Loop);
            // if(!this.isDeleting){
            //     this.$emit('openpic', this.list,index)
            // }
        },
        addbtn(){
            if(this.leng!==0){
                this.$refs.file.click()
            }
        },
        submit(rst,index){
            // console.log(rst)
            // return
            this.apiMethod(this.imgType).then(data=>{
                let host=data.data   //根据自身需求
                let that = this
                let formData = new FormData()
                let name=Number(new Date().getTime()+''+Math.floor(Math.random()*1000000))+'.'+rst.file.type.substring(rst.file.type.indexOf('/')+1)
                 formData.append('key',`${host.key}${name}`)
            
                this.ossArr.forEach(i => {
                    formData.append(i,host[i])     
                })
                formData.append('file',rst.file)
                var xhr = new XMLHttpRequest()
                xhr.open('POST',host.host,true)
                
                xhr.timeout = 10000   //超时
                let indexs=this.list[index].i
                xhr.onload = ((res)=> {
                    if(indexs===this.list[index].i){
                        if (xhr.status === 200 || xhr.status === 304) {
                            this.list[index].states=0
                            this.list[index].fileurl=host.host+'/'+host.key+name
                            this.$emit('succ',this.idx,host.host+'/'+host.key+name)
                        }else{
                            this.list[index].states=2
                        }
                    }
                   this.iconstatus=false
                }
                )

                //错误上传
                xhr.onerror=((res)=>{
                    if(indexs===this.list[index].i){
                        this.list[index].states=2
                    }
                })
                xhr.send(formData)
            //   })
            })
        }
    },
    watch:{
        lists(v){
            this.list=v
        }
    }
}

</script>
<style lang='scss' scoped>
.img_box{
    position: relative;
    padding:10px 0 0;text-align: left;
}
.zhanshiimg{
    /*position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1502;
    background-color: #000;*/
}
.mark{
     position: absolute;
     width: 100%;
     height: 100%;
     z-index: 90px;
     background: black;
     opacity: 0;
}

.img{
     position:relative;
     display: inline-block;
     width: 2.2rem;
     height: 2.2rem;
     margin-right:0.15rem;
     margin-bottom:0.15rem;
     font-size: 1.5rem !important;
     text-align: center;
     line-height:2.2rem;
     vertical-align: top;
     background-color:rgb(250,250,250);
     color:rgb(199,199,199) !important;
     /*border: 1px solid #000;*/
     -webkit-touch-callout:none;  /*系统默认菜单被禁用*/  
      -webkit-user-select:none; /*webkit浏览器*/  
      -khtml-user-select:none; /*早期浏览器*/  
      -moz-user-select:none;/*火狐*/  
      -ms-user-select:none; /*IE10*/  
      user-select:none;
 }
 .tishi{
    position:absolute;width:100%;bottom:0;font-size:0.2rem;line-height:0.4rem;color:#fff;background-color:rgba(0,0,0,0.4)
 }
</style>