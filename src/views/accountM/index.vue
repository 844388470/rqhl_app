<!-- 结算管理 - 结算确认  -->
<template>
  <div>
    <mSearch  :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey"/>
       <div>
          <yd-accordion>
            <yd-accordion-item class="mselect">
                  <div slot="title">
                    <span class="titlew"></span>
                    <yd-button :bgcolor="blue" color="#FFF" ><yd-icon class="mr5" size="0.28rem" name="search"></yd-icon>筛选</yd-button>
                  </div>

                <div style="padding: .24rem;">
                     <yd-cell-group>
                       
                        <yd-cell-item @click.native="openSearchBox('fk_hpl_id')"> 
                            <span slot="left">网点：</span>
                            <span slot="left">{{searchData.fk_hpl_id | project_list  }}</span>
                        </yd-cell-item>

                         <yd-cell-item arrow>
                            <span slot="left">开始月份：</span>
                            <yd-datetime type="month"  v-model="datetime3" slot="right"></yd-datetime>
                        </yd-cell-item>

                        <yd-cell-item arrow>
                            <span slot="left">结束月份：</span>
                            <yd-datetime type="month" v-model="datetime3" slot="right"></yd-datetime>
                        </yd-cell-item>

                        <yd-cell-item >
                          <b slot="left">是否结算：</b>
                          <yd-radio-group slot="left" :color="blue" size="16" v-model="radio">
                              <yd-radio val="1">是</yd-radio>
                              <yd-radio val="0">否</yd-radio>
                          </yd-radio-group>
                      </yd-cell-item>  

                      <yd-cell-item >
                          <b slot="left">是否确认：</b>
                          <yd-radio-group slot="left" :color="blue" size="16" v-model="radio">
                              <yd-radio val="1">是</yd-radio>
                              <yd-radio val="0">否</yd-radio>
                          </yd-radio-group>
                      </yd-cell-item>  
                        </yd-cell-group> 

                                     
                </div>

                <div class="tc mb10">
                     <yd-button @click.native="reset" :bgcolor="blue" color="#FFF" class="w30p" >重置</yd-button>
                      <yd-button @click.native="submit" :bgcolor="blue" color="#FFF" class="w30p" >筛选</yd-button>
                  </div>
            </yd-accordion-item>
          </yd-accordion>

          <div>
            <yd-preview :buttons="[]" >
                <yd-preview-header class="text">
                    <div slot="left"><span class="black">订单号：HL382828282</span></div>
                    <div @click="$router.push('/accountDetails')" slot="right" ><span class="blue">详情</span></div>
                </yd-preview-header>

                <yd-preview-item>
                    <div slot="left">客户：<span class="black">张三</span></div>
                    <div slot="right">电话：<span class="black">1333333333</span></div>
                </yd-preview-item>
               
               <yd-preview-item>
                    <div slot="left">订单产品：<span class="black">护院</span></div>
                    <div slot="right">订单总额：<span class="black">8000元</span></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left">开单日期：<span class="black">2018-1-1</span></div>
                    <div slot="right">结算日期：<span class="black">2018-1-1</span></div>
                </yd-preview-item>
                <yd-preview-item>
                    <div slot="left">确定状态：<span class="black">未确认</span></div>
                    <div slot="right"></div>
                </yd-preview-item>
            </yd-preview>

          </div>
      </div>

  </div>
</template>

<script>
import mSearch from '../../components/mSearch'
import {mapGetters} from 'vuex'
export default {
  components: {mSearch},
  computed: {
     ...mapGetters(['project_list']) 
  },
  data () {
    return {
      // 搜索组件参数
      searchShow:false,
      searchKey:'key',
      searchResult:[],
      _searchData:{},
       searchData:{
          fk_hpl_id:0
      },
      datetime3:'', 
      radio:''  
    }
  },
    mounted () {
      this._searchData = JSON.parse(JSON.stringify(this.searchData))
  },
  methods:{
    //搜索 后返回
      handleSearch(res,key){
           if(key == 'fk_hpl_id'){
              this.searchData.fk_hpl_id = res.pk_id || 0        
          }     
      },
      submit(){
          console.log(this.searchData)
      },

      reset(){
          this.searchData=JSON.parse(JSON.stringify(this._searchData))
      },

      //打开搜索面板
      openSearchBox(v){
         if(v=='fk_hpl_id'){
             this.searchResult = JSON.parse(JSON.stringify(this.project_list))
             this.searchKey = v
         }
         this.searchShow=true
      },
  }

}

</script>
<style lang='scss' scoped>
.text{
  font-size: 0.32rem;
}
</style>