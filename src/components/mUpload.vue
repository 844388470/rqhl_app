<!-- by your name -->
<template>
  <div>
     <input v-show="false" type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
     <div class="imgbox">
      <div class="imgitem" v-for="(item , i ) in imgfile" :key="i" v-if="!!item" @click="showpic(i)" >
          {{item.del}}
        <img :src='item.base64' />
         <div class="progress" v-show="!item.done">
           <div class="progressmain" :style="{width:item.progress+'%'}"></div>
         </div>
        <button @click.stop="del(i)" class="del">×</button>
      </div> 

      <div class="imgitem"  @click="addbtn" >
          <div>
              <img src="../assets/img/upload_add.png">
          </div>
      </div>

      <!-- 全部上传 -->
      <div class="button" >
           <yd-button  class="fr"  bgcolor="#5bacf9" color="#FFF" @click.native='allUpload' :disabled='!ifUpload'>{{ifUpload?'上传':'正在上传'}}</yd-button>
           <yd-button  class="fr" type="danger" @click.native='allStop'>取消上传</yd-button>
      </div>
   </div>

   <!-- 展示区 -->
     <yd-popup v-model="picshow" position="center" width="90%" class="showpic" >
           <div >
               <img  :src="imgfile[index]?imgfile[index].base64:''">
           </div>
            <p style="text-align: center;">
                <yd-button @click.native="picshow = false">确定</yd-button>
                <yd-button @click.native="del(index)" type="danger" >删除</yd-button>
            </p>
        </yd-popup>
  </div>
</template>

<script>
import lrz from 'lrz'
export default {
  props:{
      //设置是否直接上传
      isnowUpload:{
          default:true
      },
      //获取oss值的api
      apiMethod:{
          required:true
      },
      //最多上传数量
      maxNum:{
          default:4
      },
      //上传成功回调    
      mSuccess:{},
      //上传错误回调
      mError:{},
      //上传中断回调
      mAbort:{}

  },
  data () {
    return {
        isAllUpload:false, //是否全部上传成功
        ifUpload:true, //显示上传 或者取消上传
        picshow:false, //莫弹框开关
        index:-1,
        imgfile:[],
        ossArr:['OSSAccessKeyId','policy','signature','x-oss-object-acl','success_action_status','expire']
    }
  },
  methods:{
      //添加按钮
      addbtn(){
         let len = this.imgfile.filter(i=>i).length || 0
  
         if(len>=this.maxNum){
             console.log('最多只能传'+this.maxNum+'张图片')
         }else{
            this.ifUpload&&this.$refs.file.click() 
         } 
        // !((len+check_len)>=this.maxNum)&&this.ifUpload&&this.$refs.file.click() 
      },
      //选择文件
      fileChanged(){      
          //小于300kb 不压缩
           let pic_len = this.imgfile.filter(i=>i).length || 0
        
          let len = this.$refs.file.files.length || 0
          console.log(len)
          if((len +pic_len)<=this.maxNum ){
                for(let i =0;i<len;i++){
                 let quality = this.$refs.file.files[i].size/2014>300? 0.8 : 1   
                lrz(this.$refs.file.files[i],{quality}).then((rst)=>{
                this.img = rst.base64
                rst.index = this.imgfile.length
                this.imgfile.push({
                    name:this.rename(rst),
                    base64:rst.base64,
                    progress:0,   //进度百分比
                    done:false,   //是否成功
                    xhr:null,
                    rst:rst 
                })  
                console.log(rst)     
                return rst
                }).then(rst=>{
                    this.isnowUpload&&this.submit(rst)
                }).catch(function (err) {
                    console.log(err)
                })
                }
          }else{
               console.log('最多只能传'+this.maxNum+'张图片')
          }       
      },
      
      submit(rst){
          this.apiMethod().then(res=>{
            res=res.data   //根据自身需求
            let that = this
            let formData = new FormData()
             formData.append('key',this.imgfile[rst.index].name)
           
            this.ossArr.forEach(i => {
                formData.append(i,res[i])     
            })
              formData.append('file',rst.file)
            var xhr = new XMLHttpRequest()
            xhr.open('POST',res.host,true)
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 304) {
                    console.log('success',this.response)

                   that.imgfile[rst.index].done = true
                   let len = that.imgfile.filter(i=>i).filter(i=>!i.done).length
                   !len&&(that.isAllUpload=true)
                   !len&&(that.ifUpload=true)
                   that.isnowUpload&&that.success&&that.success(that.imgfile[rst.index],that.imgfile.filter(i=>i))
                   !that.isnowUpload&&!len&&that.success&&that.success(that.imgfile.filter(i=>i))
                } else {
                    // 处理其他情况(错误)
                 that.isnowUpload&&that.error&&that.error(that.imgfile[rst.index],that.imgfile.filter(i=>i))
                 !that.isnowUpload&&that.error&&that.error(that.imgfile.filter(i=>i))
                }
            }

            //错误上传
            xhr.onerror = function(){
             console.log('上传错误')
            }  

            //上传中断
            xhr.onabort = function(){ 
             console.log('上传中断')   
            this.abort&&this.abort(this.imgfile[rst.index],this.imgfile.filter(i=>i))
            } 

            //上传进度条
            xhr.upload.onprogress = (e)=>{
             var percentComplete = ((e.loaded / e.total) || 0) *100
             console.log(percentComplete)
             this.imgfile[rst.index].progress =percentComplete
           }
            xhr.send(formData)
           this.imgfile[rst.index].xhr = xhr       
           return rst        
          })
      },
     //全部上传(点击上传)
     allUpload(){
         this.ifUpload = this.isAllUpload
         this.imgfile.forEach(i=>{
             if(i){
                 (!i.done)&&this.submit(i.rst)
             }
         })
     }, 
     //全部上传的中断上传
     allStop(){
         this.imgfile.forEach(i=>{
             if(i){
              this.imgfile[i.rst.index].xhr&&!this.imgfile[i.rst.index].done&&this.imgfile[i.rst.index].xhr.abort()
             }
         })
     },
      //删除中断
      del(i){
         this.imgfile[i].xhr&&!this.imgfile[i].done&&this.imgfile[i].xhr.abort()
         this.imgfile.splice(i,1,'')  
         this.picshow=false
     },
     //模态框展示图片
     showpic(i){
         this.index=i
         this.picshow=true
     },
    //生成名字
     rename(rst){
         return new Date().getTime() + (new Array(2).fill().map(i=>(~~(Math.random()*10))).join('')) +'.'+ rst.origin.name.split('.').reverse()[0]
     }

  },
  watch:{
      //判断是否上传成功
     imgfile(){
         let len =this.imgfile.filter(i=>i).filter(i=>!i.done).length
         this.isAllUpload=!len
     }, 
     isAllUpload(v){
         if(v){
         this.$refs.file.value=''
         }
     }
  }

}

</script>
<style lang='scss' scoped>

.imgbox{
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
   background: #fff;
    
}

.imgitem {   
    position: relative;
    background: #fff;
    display: inline-block;
    width: 25%;
    text-align: center;
    vertical-align: middle;
    height: 160px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right:5px;
    margin-bottom: 10px; 

    img{

        width: 100px;
        height: 100px;
        display: block;
        margin: 30px auto;
        
    }
    .del{
        font-size: 16px;
        line-height: 35px;
        border: 1px solid #716161;
        width: 35px;
        height: 35px;
        position: absolute;
        top: 0;
        right: 0px;   
        border-radius: 50%; 
    }
  
}
.progress{
    margin-top:6px;
    width: 100%;
    height: 10px;
    background: #eceaea;
    .progressmain{
        height: 100%;
        background: #FE5D51;
    
    }
}

.showpic{
   padding: 20px;
    text-align: center;
    img{
        margin-top:30px;
        margin-bottom:30px ;
        width: 80%;
        height: auto;
    }
    p{
        margin-bottom: 20px;
    }
    button{
        width: 30%;
    }
}
.button{
    width: 100%;
    padding: 5px 10px 5px 5px;
    text-align: right;
    button{
        width: 20%;
    }
}

</style>