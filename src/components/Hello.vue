<template>
  <div class="hello">
     {{project_list}}
      
     <button @click='click' class="aa">变18</button>
  </div>
</template>

<script>
import { mapActions, mapState,mapMutations,mapGetters } from 'vuex'
import store from '../store'
import * as api from '../api'
export default {
  name: 'hello',
  data () {
    return {

     
    }
  },
  methods:{
   click(){
   this.setProject_list([1,2,3])
    
   },
    ...mapActions(['setProject_list','setCompany_list']), 
    ...mapMutations(['SET_PROJECT_LIST']) 
    

  },
  computed:{
    ...mapState(['project_list','company_list']),
    ...mapGetters(['project_list','company_list'])

  },
  mounted(){
   
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>



</style>
