<!-- 开单 -->
<template>
  <div >
       <mSearch  :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey" :name="searchName"/>
       <div class="pb12">
            <yd-tab v-show="isOpenshow&&!isprint"  :active-color="blue" :callback="tabCBK"  class="businessOpen mb5">
             <yd-tab-panel label="基础信息"  :tabkey='0' :active='tabIndex==0'></yd-tab-panel>
             <yd-tab-panel  label="商品服务" :tabkey='1' :active='tabIndex==1'></yd-tab-panel>
             <yd-tab-panel  label="收付明细"  :tabkey='2' :active='tabIndex==2'></yd-tab-panel>
        </yd-tab>
        
       
        <div v-show="!isprint" class="orderBox">
             <!-- 基础信息 -->
            <div class="base_info" v-show="tabIndex==0">
                <yd-cell-group>
                    <yd-cell-item  @click.native="showCustomList">
                    <span slot="left" class="w80" >客户：</span>  
                    <input disabled slot="right" v-model="order_data.order_base.patient_name"  type="text" placeholder="请选择">
                    <!-- <div slot="right" @click="showCustomList"><i class="blue">详情/选择</i> </div> -->
                    </yd-cell-item>

                    <yd-cell-item @click.native="showSearch_fk_hpl" >
                        <b class="w80" slot="left">网点:</b>
                        <span slot='left'>{{order_data.order_base.fk_hpl_id |project_list}}</span>
                    </yd-cell-item>

                    <yd-cell-item v-show="fk_dub_list.length || order_data.order_base.dub_name " @click.native="showSearch_dub_name()" >
                        <b class="w80" slot="left" >科室:</b>
                        <span slot='left'>{{order_data.order_base.dub_name | empitSelect}}</span>
                    </yd-cell-item>

                    <yd-cell-item>
                        <b class="w80" slot="left">床位:</b>
                        <input slot="right" v-model="order_data.order_base.bed" ref="bedInput" type="text" placeholder="">
                        <span slot="right" v-show="order_data.order_base.bed" class="toN " @click="order_data.order_base.bed=''">+</span>
                     
                    </yd-cell-item>

                    <!-- <yd-cell-item>
                        <b class="w80"  slot="left">签约时间:</b>
                        <yd-datetime  type="date" :init-emit="false"   v-model="order_data.order_base.bill_time" slot="right"></yd-datetime>    
                    </yd-cell-item> -->

                    <yd-cell-item  type="label">
                        <b slot="left" class="w80" >护工模式：</b>
                        <yd-radio-group  slot="left" v-model="order_data.order_base.pattern" :color="blue">
                            <yd-radio :disabled="!!order_data.order_service.length" val="1">整体</yd-radio>
                            <yd-radio :disabled="!!order_data.order_service.length" val="2">一对一</yd-radio>
                        </yd-radio-group>
                    </yd-cell-item>

                    <yd-cell-item  type="label">
                        <b slot="left" class="w80">护工薪酬：</b>
                        <yd-radio-group  slot="left" v-model="order_data.order_base.work_type" :color="blue">
                            <yd-radio val="1">月结</yd-radio>
                            <yd-radio val="2">日结</yd-radio>
                        </yd-radio-group>
                    </yd-cell-item>

                    <yd-cell-item @click.native="showSearch_group_name()" v-if="order_data.order_base.pattern=='1'" >
                        <b slot="left" class="w80" >护理组:</b>
                        <span slot='left'>{{order_data.order_base.group_name | empitSelect}}</span>
                    </yd-cell-item>

                </yd-cell-group>

                
            </div>
             <!-- 商品服务 -->
            <div class="goods " v-show="tabIndex==1">
                <!-- {{total | toTow}} -->
                <div class="co_info bgf5">客户:{{order_data.order_base.patient_name}}({{order_data.order_base.patient_sex | sex}}) / {{order_data.order_base.patient_phone }} </div>
                <div>
                     <yd-cell-group class="mt5 mb0" v-for="(item,i) in order_data.order_goods" :key="i">
                        <yd-cell-item class="pro bgf1" >
                                <b slot="left" style="width:1.1rem">产品({{i+1}}):</b>
                                <!-- <span slot="left" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">{{item.goods_description }}</span> -->
                                <span style="color:red"  slot="right" @click.stop='delForm_goods(i)' >删除</span>
                        </yd-cell-item>

                        <yd-cell-item class="pro" >
                                <b slot="left" >商品名称:</b>
                             <span slot="left" @click="showSearch_goods_name(i)" style="width:100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">{{item.goods_description | lv1AndPrice}}</span>
                             <span slot="right">(<span style="color:red">{{item.discount | nozero}}</span>)</span> 
                                <!-- <span style="color:#5BACF9" slot="right" @click="change_per_price(i,item.per_price,1)">浮动</span> -->
                                <span style="color:#5BACF9" slot="right" @click="per_price_Modal(i,item.per_price,1)">浮动</span>
                        </yd-cell-item>

                         <yd-cell-item v-show="false">
                            <div slot="left" class="w80">
                            <b >单价浮动:</b>   
                            </div>
                            <input slot="right" @change="change_per_price(i,item.per_price,1)" type="number" v-model="item.discount"  >
                        </yd-cell-item>

                        <!-- 服务 -->
                        <div class="server" v-if="severShow">
                            
                             <yd-cell-group class="mt10 mb0" v-for="(item_s,index) in item.serverArr" :key="index" >
                                <yd-cell-item class="pro bgf1" >
                                        <b slot="left" style="width:1.1rem">服务({{index+1}})</b>         
                                        <yd-icon  slot="right" @click.stop.native='delForm_server(i,index)' class="pl20 pr10" color="#333" size="0.4rem" name="delete" ></yd-icon>
                                </yd-cell-item>
                                <yd-cell-item class="m_startTime">
                                        <b slot="left">起止时间:</b>
                                        <yd-datetime class="flex-2" type="date"  v-model="item_s.start"  slot="right"></yd-datetime>
                                        <span class="" slot="right">—</span>
                                        <div slot="right" class="ml10 flex flex-m  flex-3" v-show="item_s.time!=0||item_s.time"> <span class="bgf1">{{item_s.end=getEndTime(item_s)}}</span> </div>
                                </yd-cell-item>
                                   <yd-cell-item  type="label">
                                        <b slot="left">计时方式：</b>
                                        <yd-radio-group  slot="left" v-model="item_s.count_type" :color="blue">
                                            <yd-radio  v-show="item_s.vir_type=='1'" val="1" class="mr20">12个小时</yd-radio>
                                            <yd-radio  v-show="item_s.vir_type=='1'" val="2">24小时</yd-radio>
                                            <yd-radio v-show="item_s.vir_type!='1'" val="3">计量方式</yd-radio>
                                        </yd-radio-group>   
                                    </yd-cell-item>

                                    <yd-cell-item>
                                            <div slot="left">
                                                <b >服务数量({{item_s.vir_combo_type | vir_combo_type}}):</b>
                                            </div>     
                                             <input slot="right" @input="notMinus" @change="change_time(i,item_s,index,item)"  type="number"  v-model="item_s.time" >  
                                    </yd-cell-item>

                                     <!-- <yd-cell-item>
                                            <b slot="left">结束时间:</b>
                                            <span class="_span" slot="left">
                                            <span v-show="item_s.time!=0||item_s.time">  {{item_s.end=getEndTime(item_s)}}</span>
                                            </span>
                                    </yd-cell-item> -->

                                    <!-- <yd-cell-item >
                                            <b slot="left">服务金额小计：</b>
                                            <span class="_span ml15" slot="left">{{item_s.server_amount=(item_s.per_price * Math.ceil(parseFloat(item_s.time))).toFixed(2) | NaNf}}</span>         
                                    </yd-cell-item> -->

                                     <yd-cell-item  @click.native='showSearch_fk_stf(i,index,item_s)'>
                                            <b slot="left"  >护工/护理组:</b>
                                            <span class="_span" slot="left" >{{item_s.fk_stf_id_name}}</span>
                                    </yd-cell-item>

                                     <yd-cell-item>
                                            <b slot="left">护工所得:</b>
                                            <input   slot="right" type="number"  v-model="item_s.staff_pay" >
                                    </yd-cell-item>

                             </yd-cell-group>

                            <div class="mt5 tr">
                                 <yd-button  v-show="item.type!=2" :bgcolor="blue" @click.native="addForm_server(item,i)" color="#fff"> 添加服务</yd-button>
                            </div>


                        </div>
                        <!-- 服务 end -->
                       <yd-cell-item v-if="item.type==2">
                            <div slot="left" class="w80">
                            <b >数量:</b>   
                            </div>
                            <input slot="right"   type="number" v-model="item.real_combo_num"  >
                        </yd-cell-item>
                        
                        <yd-cell-item v-show="false">
                            <div slot="left" class="w80">
                            <b >总价浮动:</b>   
                            </div>
                            <input slot="right" @change="change_per_price(i,item.per_price,0)" type="number" v-model="item.total_discount"  >
                        </yd-cell-item>

                             <yd-cell-item>      
                                <div slot="left" class="w80">
                                    <b >金额小计:</b>
                                </div>
                                <span slot="left" class="pr10">                         
                                    {{item.real_total=(((parseFloat(item.price)+parseFloat(item.discount))*(parseFloat(item.real_combo_num)/parseFloat(item.combo_num)))+parseFloat(item.total_discount)).toFixed(2) | NaNf}} 
                                </span>
                                <span>{{item.per_price=item.real_combo_num?((parseFloat(item.real_total)/parseFloat(item.real_combo_num))):0}}</span>
                                <!-- <span slot="right" style="color:#5BACF9" @click="change_per_price(i,item.per_price,0)">浮动</span> -->
                                <span slot="right" style="color:#5BACF9" @click="per_price_Modal(i,item.per_price,0)">浮动</span>
                            </yd-cell-item>

                               <yd-cell-item @click.native="showSearch_staffs(i)" > 
                                <div  slot="left" class="w80" >
                                    <b >业务员:</b>
                                </div>
                                 <span slot="left" class="_span" >{{item.saleman_name}}</span>
                                 </yd-cell-item>
                                  <yd-cell-item v-show="item.saleman_name">
                                <div slot="left" class="w80">
                                <b >抽成:</b>   
                                </div>
                                 <input slot="right"  type="number" v-model="item.commission" >
                            </yd-cell-item>
                     </yd-cell-group>   
                </div>
                <div class="tl mt5">
                     <yd-button class="w40p"  :bgcolor="blue" @click.native="addForm_goods" color="#fff"> 添加产品</yd-button>
                </div>
                 

            </div>
            <!-- 收费明细 -->
            <div class="charge " v-show="tabIndex==2">
                 <yd-cell-group class="mb0">
                    <yd-cell-item class="bgf1">
                        <h4 slot="left" class="title">收费总额:{{has_pay | NaNf}}(元)</h4>
                        <div slot="right" v-show="false" class="pr10 pl20" ><span  class="icon_add">+</span></div>
                    </yd-cell-item>
                </yd-cell-group>

                  <yd-cell-group class="mt5 mb0" v-for="(item,i) in order_data.order_charge" :key="i">
                        <yd-cell-item class="bgf1">
                            <span slot="left">收款({{i+1}})</span>
                            <yd-icon @click.stop.native='delForm_charge(i)'  slot="right" class="pl20 pr10" color="#333" size="0.4rem" name="delete"></yd-icon>
                        </yd-cell-item>
                          <yd-cell-item>
                            <b slot="left" class="w80"  >收费日期:</b>
                            <yd-datetime type="date" v-model="item.charge_time" slot="right"></yd-datetime>
                        </yd-cell-item>
                        <yd-cell-item  type="label">
                            <b  class="w80"  slot="left">类型：</b>
                             <select slot="right" v-model="item.charge_type">
                                <option value="1">收费</option>
                                <option value="2">退款</option>
                                <option value="3">付费</option>
                            </select>
                            
                        </yd-cell-item>
                        <yd-cell-item>
                            <b class="w80"  slot="left">金额(元)：</b>
                            <input slot="right" type="number" @change="change_price($event,i)" v-model="item.price">
                            <!-- <img style="width:0.4rem;height:0.4rem" slot="right" src="@/assets/img/input_icon2.png" alt=""> -->
                        </yd-cell-item>
                    
                      
                    <yd-cell-item  type="label">
                            <b class="w80" slot="left">付款方式：</b>
                             <!-- <select slot="right" v-model="item.pay_type"> -->
                             <select slot="right" v-model="item.charge_type">
                                <!-- <option value="1">现金</option>
                                <option value="2">银行卡</option>
                                <option value="3">微信</option>
                                <option value="4">支付宝</option> -->
                                <option value="1">现金</option>
                                <option value="2">银行转账</option>
                                <option value="3">微信</option>
                                <option value="4">支付宝</option>
                                <option value="5">其他</option>
                            </select>
                        </yd-cell-item>  
                     
                        <yd-cell-item v-show="item.pay_type!=1">
                            <b class="w80" slot="left">流水号:</b>
                            <input slot="right" type="text" v-model="item.trans_no">
                        </yd-cell-item>
                    
                        <yd-cell-item  class="remark">
                            <b class="w80"   slot="left">备注:</b>
                            <yd-textarea slot="right" v-model="item.item" placeholder="请输入备注" maxlength="100"></yd-textarea>
                        </yd-cell-item>
                    
                        <yd-cell-item v-show="false">
                            <b slot="left" class="w80" @click='showSearch_fk_stf_c_id_name(i)' >操作人:</b>
                            <span class="_span" @click='showSearch_fk_stf_c_id_name(i)' slot="left" >{{item.fk_stf_c_id_name}}</span>
                        
                        </yd-cell-item>
                  </yd-cell-group>
                 <div class="mt10 tc ">
                    <yd-button :bgcolor="blue" @click.native="addForm_charge" color="#fff"> 添加收费</yd-button>
                </div>
            </div>
            <!-- 图片上传 -->
            
        </div>
        <div class="" v-show="isprint">
              <!--  打印  -->
        <div v-show="isprint" >
          
          <div class="print" id="print">
            <h1 class="title bor">生活护理服务票据</h1>
            <div class="bor bcodeF">
                <p >订单号：{{order_data.order_base.order_no}}</p>
                <img id="bcode" class="bcode"/>

            </div>
          
            <!-- 基础 -->
            <div class="bor base">
              
              <!-- <p>开单日期：{{order_data.order_base.bill_time}}</p> -->
                <p><b class="blod">商户</b>：{{order_data.order_base.fk_hpl_id | project_to_companys }}</p>
               <div class="flex">
                 
                  <p><b class="blod">网点</b>：{{order_data.order_base.fk_hpl_id | project_list }}</p>
                  <!-- 科室 -->
                 <p  class="ml10"> {{order_data.order_base.dub_name  }}  </p>
                 <!-- 床位 -->
                 <p class="ml10">{{order_data.order_base.bed }}床</p>
    
               </div>

                <div class="flex mt5 flex-m">
                 <p ><b class="blod">客户：</b>{{order_data.order_base.patient_name  }} ({{order_data.order_base.patient_sex | sex}})</p>
                 <!-- 电话 -->
                 <p class="ml10"> {{ order_data.order_base.patient_phone  }} </p>
                 <!-- 生日 -->
                  <p class="ml10">生日:{{ order_data.order_base.birth_day  }} </p>
               
               </div>
             
            </div>

              <!-- 产品 -->
              <div v-show="order_data.order_goods.length">
                <div class="bor base">
                  <div class="flex">
                      <p class="flex-3 tl "><b class="blod">产品</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">单价</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                  </div>

                  <div class="flex flex-m" v-for="(item ,i ) in order_data.order_goods" :key="i">
                      <!-- <p class="flex-3">产品{{i+1}}</p> -->
                      <!-- 产品 -->
                      <div class="flex-3 ">
                        <!-- {{item.goods_description}} -->
                        <!-- <p>{{sliceStr(item.goods_description,1)}}</p> -->
                        <p>{{sliceStr(item.goods_description,0)}}</p>
                        
                       </div>
                      <p class="flex-2 tl  pr10">{{item.price | toTow}}元/{{item.combo_type}} </p>
                      <!-- 数量 -->
                      <p class="flex-1 tl  pr10">{{item.real_combo_num}} {{item.combo_type | vir_combo_type}}</p>
                      <!-- 金额 -->
                      <p class="flex-1 tl  pr10">{{((item.real_combo_num/item.combo_num)*item.price).toFixed(2) | NaNf}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">浮动金额:</p>
                        <p class="flex-1 tr">{{fu_total | toTow}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">应付金额:</p>
                        <p class="flex-1 tr">{{total | toTow}}</p>
                  </div>
                </div>
                
               </div>

                  
               <!-- 钱 -->
               <div class="base bor" v-show="order_data.order_charge.length">
                  <div class="flex">
                      <p class="flex-2 pr10"><b class="blod">收付日期</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">方式</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                      <p class="flex-4 tl pr10"><b class="blod">流水号</b></p>
                  </div>
                 <div class="bor3 flex flex-m"  v-show="item.charge_type!=3" v-for="(item ,i ) in order_data.order_charge" :key="i">
                    <!-- <p class="flex-3">收费{{i+1}}</p> -->
                   <div class="flex-2 pr10"  > {{item.charge_time}}  </div>
                    <div class="flex-1 tl pr10">   {{item.charge_type | charge_type}}</div>
                   <div class="flex-1 tl pr10">  {{item.price| toTow }}  </div>
                    <div class="flex-4 tl pr10"> {{item.trans_no}} </div>
                 </div>

                 <div class="flex flex-m mt5" >
                   <p class="blod mr10">收付合计:</p>
                    <p >{{has_pay | toTow}}</p>
                 </div>

               </div>

               <!-- 服务 -->
                
               <div>
                 <!-- <div class="bor"> 服务明细</div> -->
                 <div class="bor base  "  v-show="order_data.order_service.length">

                    <div class="flex">
                      <p class="flex-3 tl "><b class="blod">服务项目</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">服务起止</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">护理员</b></p>
                  </div>

                    <div class="flex  flex-m "  v-for="(item ,i ) in order_data.order_service" :key="i">
                       <!--  服务产品-->
                      <div class="flex-3 tl">
                        <!-- {{item.vir_goods_description}} -->
                        <!-- <p>{{sliceStr(item.vir_goods_description,1)}}</p> -->
                        <!-- <p>{{sliceStr(item.vir_goods_description,0)}}</p> -->
                         <p>{{sliceStr(item.vir_goods_description,2)}}</p> 
                      </div>
                      <div class="flex-2 tl pr10">
                        {{item.start}} {{item.end | Time}}
                      </div>
                      <!-- 服务数量 -->
                      <p class="flex-1 tl pr10">{{item.time}} {{item.vir_combo_type | vir_combo_type}}</p>
                      <!--  护工/护理组 -->
                      <div class="flex-1 tl pr10">
                        <p>{{item.fk_stf_id_name}}</p>
                        <!-- <p class="fs12">9999999999</p> -->
                      </div>
                  
  
                 </div>
                 </div>
                  <p class="tip bor"> 
                    请阅读背面服务协议，签字即同意该协议。
                 </p>
                  <p class="bor1 tip1">
                    开单人员：{{order_data.order_base.fk_stf_q_id_name| empitSelect}}
                  </p>

                   <div class="bor1 tip2">
                    <p>客户或代理</p>
                    <p>人签字：</p>
                  </div>

                   <div class="bor1 tip2">
                    <p>护理员签字：</p>
                  </div>
                  <div class=" base">
                     <div class=""> 打印时间：{{nowDate}} </div>
                     <div  class="">打印单号：{{ print_no }}</div>

                  </div>
               </div>          
          </div>
        </div>

        </div>

        <div v-show="!isOpenshow || isprint">
                <yd-list  theme="4">
                    <yd-list-item @click.native="add_pic(0)">
                            <img slot="img" src="../../../assets/img/upload_add.png">
                            <span slot="title" class="add_pic">添加图片</span>  
                    </yd-list-item>

                    <yd-list-item v-for="(item, key ) in order_data.change_orders"  @click.native="add_pic(1,key)" :key="key">
                            <img slot="img" :src="item.path">
                            <span slot="title">{{item.order_no}}</span>
                            <yd-list-other slot="other">
                                {{item.bill_time}}
                            </yd-list-other>
                    </yd-list-item>         
                </yd-list>
            </div>

       </div>
      


          <!-- 非打印按钮 -->
             <div class="footed">
                 <div v-show="!isprint">
                     <!-- 电子开单 -->
                    <div v-show="isOpenshow">
                      <yd-button  class="w15p" :bgcolor="blue" v-show="tabIndex==0"  @click.native="$router.go(-1)"  color="#FFF">返回</yd-button>    
                        <yd-button  class="w15p" v-show="tabIndex!=0" :bgcolor="blue" @click.native="prev()"   color="#FFF">上一步</yd-button>
                        <yd-button  class="w15p" v-show="tabIndex!=2" :bgcolor="blue"  @click.native="next()"  color="#FFF">下一步</yd-button>
                        <yd-button  class="w15p" :bgcolor="blue" v-show="tabIndex==2"  @click.native="printView"  color="#FFF">打印预览</yd-button>    
                        <yd-button  class="w15p" v-show="tabIndex==2" :bgcolor="blue" @click.native="submitOrder(0)"  color="#FFF">保存</yd-button>
                    </div>  

                      <!-- 手动开单 -->
                     <div v-show="!isOpenshow">           
                        <yd-button  class="w20p"  :bgcolor="blue" @click.native="submitOrder(0)"  color="#FFF">保存</yd-button>
                    </div>   

                 </div>
                   <div v-show="isprint">  
                        <yd-button  class="w20p" :bgcolor="blue" @click.native="printViewPrev"  color="#FFF">编辑</yd-button>   
                        <yd-button  class="w20p" :disabled="printDisable"  @click.native="submitOrder(1)" :bgcolor="banColor"  color="#FFF">打印<span v-show="printDisable">{{i}}</span></yd-button>    
                        <yd-button  class="w20p" :bgcolor="blue"  @click.native="submitOrder()"  color="#FFF">完成</yd-button>
                    </div>

                
            </div>    
             <div v-show="isprint&&printShow" >
          
          <div class="print1" id="print1">
            <h1 class="title bor">生活护理服务票据</h1>
            <div class="bor bcodeF">
                <p >订单号：{{order_data.order_base.order_no}}</p>
                <img id="bcode" class="bcode"/>

            </div>
          
            <!-- 基础 -->
            <div class="bor base">
              
              <!-- <p>开单日期：{{order_data.order_base.bill_time}}</p> -->
               <p><b class="blod">商户</b>：{{order_data.order_base.fk_hpl_id | project_to_companys }}</p>
               <div class="flex">
                  <p><b class="blod">网点</b>：{{order_data.order_base.fk_hpl_id | project_list }}</p>
                  <!-- 科室 -->
                 <p  class="ml10"> {{order_data.order_base.dub_name  }}  </p>
                 <!-- 床位 -->
                 <p class="ml10">{{order_data.order_base.bed }}床</p>
    
               </div>

                <div class="flex mt5 flex-m">
                 <p ><b class="blod">客户：</b>{{order_data.order_base.patient_name  }} ({{order_data.order_base.patient_sex | sex}})</p>
                 <!-- 电话 -->
                 <p class="ml10"> {{ order_data.order_base.patient_phone  }} </p>
                 <!-- 生日 -->
                  <p class="ml10"> 生日:{{ order_data.order_base.birth_day  }} </p>
               
               </div>
             
            </div>

              <!-- 产品 -->
              <div v-show="order_data.order_goods.length">
                <div class="bor base">
                  <div class="flex">
                      <p class="flex-3 tl "><b class="blod">产品</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">单价</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">金额</b></p>
                  </div>

                  <div class="flex flex-m" v-for="(item ,i ) in order_data.order_goods" :key="i">
                      <!-- <p class="flex-3">产品{{i+1}}</p> -->
                      <!-- 商品 -->
                      <div class="flex-3 tl ">
                        <!-- {{item.goods_description}} -->
                        <!-- <p>{{sliceStr(item.goods_description,1)}}</p> -->
                        <p>{{sliceStr(item.goods_description,0)}}</p>
                      </div>
                      <p class="flex-2 tl pr10">{{item.price | toTow}}元/{{item.combo_type}} </p>
                      <!-- 数量 -->
                      <p class="flex-1 tl pr10">{{item.real_combo_num}} {{item.combo_type | vir_combo_type}} </p>
                      <!-- 金额 -->
                      <p class="flex-1 tl pr10">{{((item.real_combo_num/item.combo_num)*item.price).toFixed(2) | NaNf}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">浮动金额:</p>
                        <p class="flex-1 tr">{{fu_total | toTow}}</p>
                  </div>

                   <div class="flex mt15 blod"> 
                       <p class="flex-1 ">应付金额:</p>
                        <p class="flex-1 tr">{{total | toTow}}</p>
                  </div>
                </div>
                
               </div>

                  
              
                   
               <!-- 钱 -->
               <div class="base bor" v-show="order_data.order_charge.length">
                  <div class="flex">
                      <p class="flex-2 tl pr10"><b class="blod">收付日期</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">方式</b></p>
                      <p class="flex-1 tl pr10 pl5"><b class="blod">金额</b></p>
                      <p class="flex-4 tl pr10"><b class="blod">流水号</b></p>
                  </div>
                 <div class="bor3 flex flex-m" v-for="(item ,i ) in order_data.order_charge" :key="i">
                    <!-- <p class="flex-3">收费{{i+1}}</p> -->
                   <div class="flex-2 tl pr10"  > {{item.charge_time}}  </div>
                    <div class="flex-1 tl pr10">   {{item.charge_type | charge_type}}</div>
                   <div class="flex-1 tl pr10 pl5">  {{item.price | toTow }}  </div>
                    <div class="flex-4 tl pr10"> {{item.trans_no}} </div>
                 </div>

                    <div class="flex flex-m mt5" >
                   <p class="blod mr10">收付合计:</p>
                    <p >{{has_pay | toTow}}</p>
                 </div>

               </div>

               <!-- 服务 -->
                
               <div>
                 <!-- <div class="bor"> 服务明细</div> -->
                 <div class="bor base  "  v-show="order_data.order_service.length">

                    <div class="flex">
                      <p class="flex-3 tl "><b class="blod">服务项目</b></p>
                      <p class="flex-2 tl pr10"><b class="blod">服务起止</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">数量</b></p>
                      <p class="flex-1 tl pr10"><b class="blod">护理员</b></p>
                  </div>

                    <div class="flex  flex-m "  v-for="(item ,i ) in order_data.order_service" :key="i">
                       <!--  服务产品-->
                      <div class="flex-3 tl ">
                        <!-- {{item.vir_goods_description}} -->
                          <p>{{sliceStr(item.vir_goods_description,2)}}</p>
                        <!-- <p>{{sliceStr(item.vir_goods_description,1)}}</p>
                        <p>{{sliceStr(item.vir_goods_description,0)}}</p> -->
                      </div>
                      <div class="flex-2 tl pr10">
                        {{item.start}} {{item.end| Time}}
                      </div>
                      <!-- 服务数量 -->
                      <p class="flex-1 tl pr10">{{item.time}} {{item.vir_combo_type | vir_combo_type}}</p>
                      <!--  护工/护理组 -->
                      <div class="flex-1 tl pr10">
                        <p>{{item.fk_stf_id_name}}</p>
                        <!-- <p class="fs12">9999999999</p> -->
                      </div>
                  
  
                 </div>
                 </div>
                  <p class="tip bor"> 
                   请阅读背面服务协议，签字即同意该协议。
                 </p>
                  <p class="bor1 tip1">
                    开单人员：{{order_data.order_base.fk_stf_q_id_name| empitSelect}}
                  </p>

                   <div class="bor1 tip2">
                    <p>客户或代理</p>
                    <p>人签字：</p>
                  </div>

                   <div class="bor1 tip2">
                    <p>护理员签字：</p>
                  </div>
                   <div class=" base">
                     <div class=""> 打印时间：{{nowDate}} </div>
                     <div  class="">打印单号：{{ print_no }}</div>

                  </div>
                
                

               </div>
            
          </div>
          

        
        

        
   
  
  </div>
            
             

      <!-- 选择客户 -->
       <yd-popup v-model="customShow" position="bottom" height="60%">
                <div class="flex  m_button">
                <yd-search style="width:100%"  cancel-text='搜索' :on-cancel="customSearchHandler"  class="searchInput " v-model="customSearch" :on-submit="customSearchHandler"></yd-search>
                <div style=""><yd-button @click.native="$router.push('/addCustomerMo')" style="width:20% ;right:0"  class="addBtn " size="large" bgcolor="#5BACF9"  color="#FFF">新增用户</yd-button></div>
                </div>
             <yd-infinitescroll  :callback="loadList" ref="infinitescrollDemo">
               <yd-list theme="1" slot="list">
                <div class="searchInputM" >
                  <div class="flex flex-m customList" @click="checkCustom(item)" v-for="(item , i) in pageData" :key="i" :buttons="[]" >       
                            <div  class="flex-1" >{{item.name}}</div>
                            <div   class="flex-1">{{item.sex | sex}}</div>
                            <div  class="flex-1">{{item.mobile}}</div>               
                    </div>
                 </div>
               </yd-list>
            </yd-infinitescroll> 

       </yd-popup>

          <!-- 图片上传弹出框 -->
       <yd-popup  v-model="upLoadShow" position="center" width="90%" class="img_popup" >
       <!-- 图片上传 -->
        <div class="pt20 pr15 pl15 pb15">
                <simpleUpload imgType="orders"  :apiMethod="api.getOss" :picUrl='picUrl' @success="upload_success"/>
                <yd-cell-group class="mt20">
                    <yd-cell-item>
                        <span slot="left">票据单号：</span>
                        <input id="orderNO" slot="right" type="text" v-model="change_orders_item.order_no"  placeholder="请输入变更单号">
                    <yd-icon slot="right" v-show="isShowScanQRCode" @click.native="ScanQRCode" name="qrscan"></yd-icon>
                    </yd-cell-item>

                    <yd-cell-item arrow>
                        <span slot="left">变更日期：</span>
                        <yd-datetime type="date" v-model="change_orders_item.bill_time" slot="right"></yd-datetime>
                    </yd-cell-item>
                </yd-cell-group>   

                <div class="mt20 tc">
                    <yd-button class="w30p"  v-if="isEdit" type="danger"  @click.native="delChange_orders_item">删除</yd-button>
                    <yd-button class="w30p"  v-if="!isEdit" :bgcolor="blue" color="#fff" @click.native="canlChange_orders_item">取消</yd-button>
                    <yd-button class="w30p" :bgcolor="blue" color="#fff" @click.native="suerChange_orders_item">确定</yd-button>
                </div>  
        </div>  
     </yd-popup>
      <yd-popup class="m_modal2"  v-model="floadPriceM" position="center" width="90%">
            <div  style="background-color:#fff;padding:20px;">
              <!-- <div class="tc">
              <input type="text" v-model.number="floadPrice" placeholder="请输入浮动金额">
              <button @click=>确定</button>
              </div> -->
              <yd-cell-item >
                 <span slot="left">浮动金额：</span>
                 <yd-input slot="right"  v-model.number="floadPrice"  placeholder="请输入浮动金额"></yd-input>
                 <yd-button @click.native="change_per_price(floadPriceIndex,floadPrice,oneOrAll,floadPrice)" slot="right" size="small" bgcolor="#5BACF9" color="#FFF">确定</yd-button>
              </yd-cell-item>
            </div>
        </yd-popup>

      <button v-show="false" id="_setScanResult" @click="AndroidScanResul">安卓二维码t</button>
  </div>
</template>

<script>
import moment from "moment";
import mSearch from "@/components/mSearch";
import simpleUpload from "@/components/simpleUpload";
import { mapState, mapGetters, mapActions } from "vuex";
import * as api from "@/api/index";
import m_base from "./base.js";
import m_charge from "./charge.js";
import m_upload from "./imgUpload.js";
import m_goods from "./goods.js";
import m_server from "./server.js";
import m_orderOption from "./orderOption.js";
import m_doOpotion from "./doOpotion.js";
import _weixin from '../../../minix/weixin'
export default {
  components: { mSearch, simpleUpload },
  mixins: [m_base, m_charge, m_upload, m_goods, m_server, m_orderOption,m_doOpotion,_weixin],
  data() {
    return {
      searchShow: false, //搜索框展示
      searchKey: "",
      searchResult: [], //搜索展示项
      searchData: "", //搜索返回的值
      searchName: "name", //默认展示的字段属性

      //搜索返回的值
      searchID: "",
      searchKEY: "",
      searchNAME: "",
      tabIndex: 0, //标签页

      pk_id: this.$route.query.id || "", //用户的pk_id
      isSubmit: false,
      isOpenshow: false, //根据开单模式改变  //1 : 手工开单  0:电子开单
     

      //订单数据
      order_data: {
        change_orders: [],
        order_charge: [],
        order_goods: [],
        order_service: [],
        order_base: {
          birth_day: "", //获取
          custom_id: "", //客户选中id
          order_no: "", //订单号
          pk_id: "", //订单ID
          fk_hpl_id: "", //网点 必填
          fk_dub_id: "0", //科室ID
          bed: "", //床位
          patient_name: "", //客户姓名 必填
          patient_sex: "", //性别
          patient_phone: "", //客户手机
          family_phone: "", //家属手机
          endtime: "", //结算日期
          pattern: "1", //护理模式  1：整体 2：一对一  当护理模式为1，必填护理组，否则禁用护理组
          work_type: "1", //护工薪酬  1：月 2：日结
          group_id: "0", //护理组

          bill_time: moment().format("YYYY-MM-DD"), //开单时间

          total: "", //产品金额总计
          has_pay: "", //收费金额总计
          group_name: "", //护理组名字
          dub_name: "", //科室名字
        }
      }
    };
  },
  computed: {
    ...mapState(["PROJECT_LIST", "company_list"]),
    ...mapGetters(["PROJECT_LIST", "company_list"])
  },
  filters:{
    nozero(v){
      if(v){
        let n = parseFloat(v)
      return n 
      }else{
        return 0
      }
    },
    lv1AndPrice(v){
      if(v){
        let a = v.split('/')
        let lvOne = a[1]
        let price = a.pop()
        return lvOne+'/'+price
      }else{
        return ''
      }
    }
  },

  mounted() {
    if (this.$route.query.custom_id) {
      sessionStorage.custom_id = this.$route.query.custom_id;
    }
     window.ORDER_this =   this
    let has_new = localStorage.has_new || "";
    if (!has_new) {
      this.isSubmit = true;
      this.$router.push("/myinfo/openMode");
      return false;
    }
    //1 : 手工开单  0:电子开单
    if (has_new == "0") {
      this.isOpenshow = false;
    } else if (has_new == "1") {
      this.isOpenshow = true;
    }
    if (this.pk_id) {
      //编辑
      this.isprint= true
      this.getOrderInfo().then(res => {
        setTimeout(() => {
          this.printView()
           this.initOrderDataMethod()
        }, 200);
        
       
        
      });
    } else {
      //新增
      setTimeout(() => {
         this.initOrderDataMethod();
      }, 200);
    }
  },

  methods: {
    //处理搜索结果
    handleSearch(data, key) {
      //console.log(data,key)
      this.searchData = JSON.stringify({
        searchData: data,
        key: key
      });
    },
    //显示搜索框
    showSearch(info) {
      this.searchData = "{}";
      this.searchKey = info.searchKey;
      this.searchResult = info.result;
      this.searchName = info.name || "name";
      this.searchShow = true;
    },
    //标签回调
    tabCBK(l, k) {
      this.tabIndex = k;
      console.log(k)
      if(k == 1){
        this.order_data.order_goods.forEach((item,i)=>{
          if(!item.goods_description){
            this.showSearch_goods_name(i)
          }
        })
      }
    },
    //上一步
    prev() {
      this.tabIndex = parseInt(this.tabIndex) - 1;
    },
    //下一步
    next() {
      this.tabIndex = parseInt(this.tabIndex) + 1;
    },

    //不能输入负数
    notMinus(event) {
      event.target.value = event.target.value.replace(/\-/g, "");
    }
  },
  watch: {
    //处理返回的值
    searchData(v) {
      v = JSON.parse(v);
      //console.log(v , '搜索返回的值')
      if (v.key == "fk_hpl_id") {
        this.order_data.order_base.fk_hpl_id = v.searchData.pk_id || 0;
        //清空下级数据
        this.order_data.order_base.fk_dub_id = 0;
        this.order_data.order_base.dub_name = "";
        this.order_data.order_base.group_id = 0;
        this.order_data.order_base.group_name = "";
        if (this.order_data.order_base.fk_hpl_id) {
          this.getDubList().then(res => {
            if (this.fk_dub_list.length) {
              this.showSearch_dub_name();
            } else {
            }
          });
        }
      } else if (v.key == "fk_dub_id") {
        this.order_data.order_base.fk_dub_id = v.searchData.pk_id || 0;
        this.order_data.order_base.dub_name = v.searchData.name;
        console.log(v);
        //改变科室 如果服务无数据 则 修改修理护理模式
        if (!this.$store.getters.order_service.length) {
          this.order_data.order_base.pattern = v.searchData.pattern || 1;
        }
        // pattern:'1' , //护理模式  1：整体 2：一对一  当护理模式为1，必填护理组，否则禁用护理组
        // console.log(11)
        //护理模式为1 默认护理组信息
       
        if (this.order_data.order_base.pattern == 1) {
          this.order_data.order_base.group_id = v.searchData.group_id;
          this.order_data.order_base.group_name = v.searchData.group_name;
        }
        this.$refs.bedInput.focus();
      } else if (v.key == "group_id") {
        this.order_data.order_base.group_id = v.searchData.pk_id || 0;
        this.order_data.order_base.group_name = v.searchData.name;
      } else if (v.key == "fk_stf_q_id_name") {
        //   console.log(v, 'fanhiu')
        this.order_data.order_base.fk_stf_q_id = v.searchData.pk_id || 0;
        this.order_data.order_base.fk_stf_q_id_name = v.searchData.name;
      } else if (v.key == "fk_stf_p") {
        this.order_data.order_charge[this.chargeIndex].fk_stf_c_id_name =
          v.searchData.name;
        this.order_data.order_charge[this.chargeIndex].fk_stf_c_id =
          v.searchData.pk_id || 0;
      } else if (v.key == "goods_id") {
        this.order_data.order_goods[
          this.goodsIndex
        ].order_id = this.order_data.order_base.pk_id;
        this.order_data.order_goods[this.goodsIndex].virtual_good_id =
          this.goodsIndex + 1;
        this.order_data.order_goods[this.goodsIndex].goods_id =
          v.searchData.goods_id;
        this.order_data.order_goods[this.goodsIndex].goods_name =
          v.searchData.goods_name;
        this.order_data.order_goods[this.goodsIndex].goods_description =
          v.searchData.goods_description;
        this.order_data.order_goods[this.goodsIndex].combo_num =
          v.searchData.combo_num;
        this.order_data.order_goods[this.goodsIndex].combo_type =
          v.searchData.combo_type;
        this.order_data.order_goods[this.goodsIndex].commission =
          v.searchData.commission;
        this.order_data.order_goods[this.goodsIndex].description =
          v.searchData.description;
        this.order_data.order_goods[this.goodsIndex].goodssn =
          v.searchData.goodssn;
        this.order_data.order_goods[this.goodsIndex].per_price =
          v.searchData.per_price;
        this.order_data.order_goods[this.goodsIndex].price = v.searchData.price;
        this.order_data.order_goods[this.goodsIndex].staff_pay =
          v.searchData.staff_pay;
        this.order_data.order_goods[this.goodsIndex].staff_pay_total =
          v.searchData.staff_pay_total;
        this.order_data.order_goods[this.goodsIndex].type = v.searchData.type;
      } else if (v.key == "staff_id") {
        this.order_data.order_goods[this.goodsIndex].saleman_name = v.searchData.name;
        this.order_data.order_goods[this.goodsIndex].saleman = v.searchData.pk_id || 0;
      } else if (v.key == "fk_stf") {
        this.order_data.order_goods[this.goodsIndex].serverArr[ this.serverIndex ].fk_stf_id_name =   v.searchData.name;
        this.order_data.order_goods[this.goodsIndex].serverArr[this.serverIndex ].fk_stf_id =  v.searchData.pk_id || 0;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.bgfff {
  background: #fff;
  min-height: 100%;
}
.bgf1{
  background: #F1F1F1;
  min-height: 100%;
}
.customList {
  padding: 0.3rem 0.1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.31rem;
}
.searchInput {
  position: fixed;
  width: 100%;
  z-index: 9999;
}
.addBtn{
  position: fixed;
  width: 100%;
  z-index: 9999;
}
.searchInputM {
  padding-top: 1.2rem;
}
.orderBox {
//   
}
.pb12{
  padding-bottom: 1.2rem;
}

.footed {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 1rem;
  background: #fff;
  border-top: 1px solid #eee;
  text-align: center;
  line-height: 1rem;
  z-index: 20;
}

.charge .title {
  font-size: 0.32rem;
  font-weight: 400;
}
.add_pic {
  display: block;
  text-align: center;
  margin-top: 0.6rem;
  font-size: 0.36rem;
}

.co_info {
  padding: 0.2rem;
  font-size: 0.3rem;
}
.server {
  padding: 0.1rem;
  background: #f1f1f1;
}

// 打印

.print {
  background: #fff;
  padding: 0.3rem;
}
.bor {
  
  border-bottom: 4px solid #999;
 
}

.bcode{
  width: 80%;
  height: auto;
}

.title{
  font-size: 0.37rem;
  text-align: center;
  padding-bottom: 0.2rem;
   padding-top: 0.1rem;
  
  
}
.bcodeF{
  padding: 0.1rem;
  p{
    padding-left: 0.1rem;
    font-size: 0.29rem;
  }
}
.blod{
  font-weight: bold;
}
.base{
  padding: 0.2rem 0;
  font-size: 0.27rem;
}
.tip{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.36rem;
}
.tip1{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.31rem;
  
}

.tip2{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.31rem;
  height: 1.2rem;
}

.bor1{
  
  border-bottom: 4px dashed #999;
}

.bor3{
  padding-bottom: 0.1rem;
  padding-top: 0.1rem;
   border-bottom: 4px dashed #999;
}
.bor3:last-child{
   border-bottom:none !important;
}
.pritimg{
  width: 1100px;
  height: auto;
}

.print1{
   background: #fff;
   padding: 0.3rem;
   width: 1200px;
   
   .base{
     font-size: 0.45rem;
   }
   .tip{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.56rem;
}
.tip1{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.45rem;
  
}

.tip2{
  padding: 0.1rem 0;
  font-weight: bold;
  font-size: 0.54rem;
  height: 2.4rem;
}
.title{
  font-size: 0.6rem;
  text-align: center;
  padding-bottom: 0.2rem;
   padding-top: 0.1rem;
}
.bcodeF{
  p{
 font-size: 0.45rem;
  }
 

}

}
.ban{
 background: #5bacf966
}
.toN{
    transform: rotate(45deg);
    color: #D2D2D2;
    font-size: 0.36rem
}

</style>