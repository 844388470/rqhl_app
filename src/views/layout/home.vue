<!-- by your name -->
<template>
  <div>
      <div class="banner mb10">
          <yd-slider autoplay="3000">
        <yd-slider-item v-for="(item , i ) of adList" :key="i">
                <img  style="height:4.5rem; width:100%"  :src="item.img">     
        </yd-slider-item>
        
       
    </yd-slider>
      </div>
     <div class="menu">
        <yd-slider autoplay="0" :show-pagination="false" class="zoumadeng">
             <yd-slider-item v-for="(items , i) in homeMeun" :key="i">
                <yd-grids-group :rows="3" >
                    <yd-grids-item v-for="(item , index) in items" :key="index" @click.native="gotoRouter(item.path)">
                         <div slot="icon"  v-bind:class="[{icon:true} ,`icon_${item.path}`]"></div>
                        <span slot="text">{{item.name}}</span>
                    </yd-grids-item>    
                </yd-grids-group>
            </yd-slider-item>
            
        </yd-slider>
    </div> 

    <div class="notice mt10">
        <yd-cell-group >   
           
            <yd-cell-item arrow @click.native="$router.push('/message')">
                <img slot="icon" src="../../assets/img/notice@3x.png">
                <span slot="left">消息通知</span>         
            </yd-cell-item>
        </yd-cell-group>

         <yd-preview :class="[{ pt10:true}]" @click.native="$router.push(`/messageDet?pk_id=${item.pk_id}`)" v-for="(item , i) in notices" :key="i" :buttons="[]" >
                <yd-preview-item :class="[{no:!item.read_at}]">
                    <div slot="left"><h4 >{{item.title}}</h4></div>
                    <div slot="right"></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left"><span>{{item.created_at}}</span></div>
                    <div slot="right"><span></span></div>
                </yd-preview-item>
               
         </yd-preview>

 
       

    </div>
  </div>
</template>

<script>
import wx from '../../minix/weixin.js'
import * as api from '@/api/index'
import { mapGetters } from 'vuex'
export default {
 mixins:[wx],
  data () {
    return {
       notices:[],  //消息列表  
       adList:[]  //轮播图列表
    }
  },
  computed:{
   ...mapGetters(['homeMeun'])

  },
  mounted(){
     this.site_info().then(res=>{
          this.getAd().then(res=>{
         this.get_notices()
      })

     })
     
   
  },
  methods: {
      get_notices(){
         let data = {page:1,limit:5} 
         api.notices(data).then(res=>{
             this.notices = res.data.data
         })

      },
      gotoRouter(path){
        //   this.$dialog.toast({
        //             mes: '正在开发中，敬请期待',
        //             timeout: 1500
        //         })
        //   return false
        if(path =='orderM'){
            this.$router.push(`/${path}?forHome=1`)
        }else{
            this.$router.push(`/${path}`)
        }
      },
      getAd(){
         return this.api.ad().then(res=>{
            this.adList = res.data
            return res
          })
      },
  
     
  }
}

</script>

<style lang='scss' scoped>
    .zoumadeng {
        img{width:auto;}
        .yd-slider-item{
            height:3.92rem;
            background-color: #fff;
        }
        .icon_customerM{    
            background-image:url('../../assets/img/client@3x.png'); 
        }

        .icon_orderM{    
            background-image:url('../../assets/img/order@3x.png'); 
        }

        .icon_dataReport{    
            background-image:url('../../assets/img/date@3x.png'); 
        }

        .icon_attendanceM{    
            background-image:url('../../assets/img/Attendance@3x.png'); 
        }

        .icon_peopleM{    
            background-image:url('../../assets/img/Caregiver@3x.png'); 
        }

        .icon_bedM{    
            background-image:url('../../assets/img/bed@3x.png'); 
        }

        .icon_accountM{    
            background-image:url('../../assets/img/client@3x.png'); 
        }
        

        .icon{
            width: 50%;
            height: 120%;
            background-repeat:no-repeat;
            background-position:center;
            background-size:contain;


        }

    }
    


</style>