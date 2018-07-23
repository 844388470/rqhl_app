<!--弹出搜索框 -->
<template>
  <div class="_com_yd-popup-content">
     
     <yd-popup v-model="myshow"  :position="position" width="90%" height="60%">
           <div class="searchBox">
                 <yd-layout >
                        <yd-search slot="top"  v-model="searchValue" cancel-text="重置" :on-cancel="reset"></yd-search>
                         <yd-cell-group >
                            <yd-cell-item type="radio">
                                <span slot="left">请选择</span>
                                <input slot="right" type="radio" :value="{}" v-model="checkData"/>
                            </yd-cell-item>
                            <yd-cell-item type="radio" v-for="(item , i ) in searchResult" :key="i">
                                <span slot="left">{{item[name]}}</span>
                                <input slot="right" type="radio" :value="item" v-model="checkData"/>
                            </yd-cell-item>
                        </yd-cell-group>

                        <yd-tabbar slot="tabbar" >
                           <div class="w100p tc pt5 pb5"> 
                             <yd-button  :bgcolor="blue" color="#FFF" class="w30p" @click.native="resetData">取消</yd-button>
                             <yd-button  :bgcolor="blue" color="#FFF" class="w30p" @click.native="okSearch" >确定</yd-button>
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
    this.searchResult=this.result?this.result:[]
  },
  data () {
    return {
        myshow :false,
        searchValue:'',  //搜索框字段
        searchResult:[] , //搜索匹配字段
        checkData:{}
    }
  },
  computed:{
   
  },
  methods:{
    //重置按钮
    reset(){
       this.searchValue=''
    },
    okSearch(){
     this.$emit('search',this.checkData,this.searchKey)
     this.resetData()
    },
  
    resetData(){
     this.myshow=false
     this.searchResult=JSON.parse(JSON.stringify(this.result))
     this.checkData={}
    }
    
  },
  watch:{
    //监听选中的值
    checkData(v){
      if(Object.keys(v).length){
          this.okSearch()
      }
     // console.log(v, 111)
     
    },
    
    //搜索字监听
    searchValue(v){
     this.searchResult = this.result.filter(item => item[this.name].includes(v))
    }, 
    result(v){
      this.searchResult = v
    },
    show(v){
        this.myshow=v
    },
    myshow(v){
      if(!v){
        this.searchValue=''
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