<!-- 组织机构选择 -->
<template>
  <div>
      <yd-cityselect v-model="myshow" :ready="ready" :callback="result" :items="district" title="选择机构"></yd-cityselect>
      <yd-cell-group>
            <yd-cell-item arrow  >
                 <span slot="left" v-show="!data" >{{defalutTitle | empty}}</span>
                <span slot="left" v-show="data" >{{data |empty}}</span>
            </yd-cell-item>
      </yd-cell-group>
  </div>
</template>

<script>
export default {
  props:{    
      show:{
        required:true
         
      },
      defalutTitle:{
          default:()=>{
              return ''
          }
      },

      ready:{
        required:true
         
      },
      //搜索项
      items:{
         required:true   
      },
      
     
  },
  data () {
    return {
        data:'',
        myshow:false,
      
    }
  },
  methods:{
      result(ret){        
        this.data = ret.itemName1 + ' > ' + ret.itemName2 
        this.data = `${ret.itemName1}${ret.itemName2?' > '+ret.itemName2:''}${ret.itemName3?' > '+ret.itemName3:''}` 
        this.$emit('organSelectsuccess',ret)
      }
  },
  computed: {
      district(){
          return this.items
      },
    //   ready(){
    //       if( this.items.length){
    //           return true
    //       }else{
    //           return false
    //       }
    //   }
  },
  filters:{
      empty(v){
          return v||'请选择'
      }
  },
  watch:{
    show(v){
        this.myshow=v
    },
    myshow(v){
     
     this.$emit('update:show',v)
    }
  }
  
}

</script>
<style lang='scss' scoped>
</style>