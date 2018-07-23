<!-- 简单图片上传 -->
<template>
  <div>
     <input v-show="false" type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
     <div class="imgitem "  @click="addbtn"  >
          <div v-show="!img" >
              <div class="img_box" >
                 <div class="mark"></div>  
                 <img @click.prevent.stop="clickimg"  class="img" src="../assets/img/upload_add.png">
              </div >
          </div>

          <div v-if="img">
              <div class="img_box" >
                 <div class="mark"></div> 
                    <img @click.prevent.stop="clickimg" :src="img" class="img">
              </div>
          </div>
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
export default {
  props:{
    //获取oss值的api
      apiMethod:{
          required:true
      },  
      picUrl:{
          
      },
      imgType:{
         default:'other' 
      }
  },  
  data () {
    return {
        img:'',
        imgInfo:{
            url:''
        },
        xhr:'', 
        ossArr:['OSSAccessKeyId','policy','signature','x-oss-object-acl','success_action_status','expire']
        

    }
  },
  methods: {
      fileChanged(){
        let len = this.$refs.file.files.length
        if(!len || !this.$refs.file.files[0]) return false
        let quality = this.$refs.file.files[0].size/1024>300? 0.8 : 1
        lrz(this.$refs.file.files[0],{quality}).then( rst=>{
            this.img = rst.base64
            
            //ret.file  压缩后的文件
            this.submit(rst)
            
            
        }
     )


      },
      addbtn(){
         this.$refs.file.value='' //清空文件
         this.$refs.file.click() 
      },

      submit(rst){
          let that = this
          this.apiMethod(this.imgType).then(res=>{
            res=res.data   //根据自身需求
           // console.log(res)
            this.$dialog.loading.open('上传中...')
            let that = this
            let formData = new FormData()
            let name = this.rename(rst)
            console.log(name)
            formData.append('key',`${res.key}${name}`)
            
            this.ossArr.forEach(i => {
                formData.append(i,res[i])     
            })
            formData.append('file',rst.file)
            

            var xhr = new XMLHttpRequest()
            xhr.open('POST',res.host,true)
            xhr.timeout = 10000   //超时
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 304) {
                   // console.log('success',this.response)  
                    that.$dialog.loading.close() 
                    that.success('上传成功')           
                    that.imgInfo.url=`${res.host}${res.key?'/':''}${res.key}${name}`
                    console.log( that.imgInfo.url)
                    that.$emit('success',that.imgInfo)                  
                    }
            }

             //错误上传
            xhr.onerror = function(res){
             //console.log('上传错误')  
             that.$dialog.loading.close()  
             that.error('上传失败')      
             
             that.img=''
             that.$emit('error',res)
             
            } 
            
            //超时
            xhr.ontimeout = function(res){ 
                 that.$dialog.loading.close() 
                 that.error('上传超时')           
                 that.img=''             
            　　　that.$emit('error',res)           
            　}
            

              xhr.send(formData)
              

          })

      },

      //生成名字
     rename(rst){
         return new Date().getTime() + (new Array(2).fill().map(i=>(~~(Math.random()*10))).join('')) +'.'+ rst.origin.name.split('.').reverse()[0]
     },

     //阻止默认行为
     clickimg(){
         return false
     }
  },
  watch:{
      picUrl(v){
          console.log()
          this.img= this.picUrl
      }
  }
}

</script>
<style lang='scss' scoped>
.img_box{
    position: relative;
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
     
     
     display: block;
     width: 70%;
     height: auto;
     margin:0 auto;
     border: 1px solid #000;
 }
</style>