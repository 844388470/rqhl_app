<!--弹出搜索框 -->
<template>
    <div class="_com_yd-popup-content">
        <yd-popup v-model="myshow"  :position="position" width="90%" height="60%">
            <div class="searchBox">
                <yd-layout >
                        <yd-search slot="top"  v-model="searchValue" cancel-text="重置" :on-cancel="reset"></yd-search>
                        <yd-checklist align="right" v-model="checkData" :callback="changeData">
                            <yd-checklist-item v-for="(item , i ) in searchResult" :key="i" :val="item.pk_id">
                                <div style="height: 50px;line-height: 50px;">{{item[name]}}</div>
                            </yd-checklist-item>
                        </yd-checklist>
                        <yd-tabbar slot="tabbar" >
                            <div class="w100p tc pt5 pb5"> 
                                <yd-button  :bgcolor="blue" color="#FFF" class="w20p" @click.native="allCheck">{{checkText}}</yd-button>
                                <yd-button  :bgcolor="blue" color="#FFF" class="w20p" @click.native="resetData">取消</yd-button>
                                <yd-button  :bgcolor="blue" color="#FFF" class="w20p" @click.native="okSearch" >确定</yd-button>
                            </div>  
                        </yd-tabbar>
                </yd-layout>
            </div>
        </yd-popup>
    </div>
</template>

<script>
export default {
  props:{
      //显示
      position:{
        default:'bottom'
      },
      show:{
        required:true
         
      },
      //搜索项
      result:{
         required:true   
      },
      //已选中
      yxz:{
            type: Array,
            default(){
                return []
            }
        },
      //搜索返回的key
      searchKey:{
        default:'key'
      },
      //展示的字段
      name:{

        default:'name'
      }
  },
  mounted(){
   
  },
  data () {
    return {
        myshow :false,
        searchValue:'',  //搜索框字段
        searchResult:[] , //搜索匹配字段
        checkData:[],
        allData:[],
       // checkText:'全选'
    }
  },
  computed:{
   checkText(){
       if(this.checkData.length==this.searchResult.length){
           return '取消全选'
       }else{
            return '全选'
       }
   }
  },
  methods:{
    //重置按钮
    reset(){
       this.searchValue=''
    },
    okSearch(){
        let list=this.result.filter(res=>this.allData.indexOf(res.pk_id)!==-1)
        this.$emit('search',list,this.searchKey)
        this.resetData()
    },
    
    //全选
    allCheck(){
        if(this.checkData.length==this.searchResult.length){
          this.checkData = []
         // this.checkText='全选'
        }else{
          
           this.checkData = this.searchResult.map(i=>i.pk_id)
          // this.checkText='取消全选'
        }
     
    //  console.log(this.checkData)
    },
  
    resetData(){
     this.myshow=false
     this.searchResult=JSON.parse(JSON.stringify(this.result))
     this.checkData=[]
     this.allData=[]
    },
    changeData(){
        if(this.searchValue||this.searchValue===0){
            this.searchResult.forEach(res=>{                        //当前list
                if(this.checkData.indexOf(res.pk_id)!==-1){             //当前是否选中
                    if(this.allData.indexOf(res.pk_id)===-1){           //是否在all中
                        this.allData.push(res.pk_id)
                    }
                }else{
                    if(this.allData.indexOf(res.pk_id)!==-1){
                        this.allData.splice(this.allData.indexOf(res.pk_id),1)
                    }
                }
            })
        }else{
            this.allData=JSON.parse(JSON.stringify(this.checkData))
        }
    }
  },
  watch:{
    //搜索字监听
    searchValue(v,n){
        this.searchResult = this.result.filter(item => item[this.name].includes(v))
        if((v||v===0)&&!n){
            this.allData=JSON.parse(JSON.stringify(this.checkData))
        }else if(!v&&v!==0){
            this.checkData=JSON.parse(JSON.stringify(this.allData))
        }
    },
    result(v){
      this.searchResult = v
    },
    show(v){
        this.myshow=v
        if(this.yxz.length){
            this.checkData=this.yxz
        }else{
            this.checkData=[]
        }
    },
    myshow(v){
      if(!v){
        this.searchValue=''
        this.allData=[]
      }
     this.$emit('update:show',v)
    }
    
  }
}

</script>
<style lang='scss' scoped>
.searchBox{
    width: 100%;
    height: 100%;
    
}
</style>