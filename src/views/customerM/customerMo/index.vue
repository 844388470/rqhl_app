<template>
  <div class="">
    <div>
    <div class="c_box">
      <h3>基础信息</h3>
      <yd-cell-group>
        <yd-cell-item>
            <span class="name" slot="left">客户姓名</span>
            <yd-input slot="right" :on-blur="duplicate" ref="a_name" type="text" v-model="formData.name" required placeholder="请输入客户姓名"></yd-input>
        </yd-cell-item>
          <yd-cell-item>
            <span class="name" slot="left">联系电话</span>
            <yd-input  slot="right" :on-blur="duplicate" ref="a_mobile" type="number" required v-model="formData.mobile" placeholder="请输入联系电话"></yd-input>
        </yd-cell-item>
        <yd-cell-item class="" v-show="isrqhl">
          <span slot="left" class="name ">性别</span>
          <yd-radio-group  slot="left"  :color="blue" v-model="formData.sex">
            <yd-radio :val="1">男</yd-radio>
              <yd-radio :val="2">女</yd-radio>
              
          </yd-radio-group>
        </yd-cell-item>
        <yd-cell-item>
            <span class="name" slot="left">出生日期</span>
            <yd-datetime type="date"  start-date="1900-01-01" :init-emit="false" v-model="formData.birth_day" slot="right"></yd-datetime>
        </yd-cell-item>
      
        <div class="img_box">
          <div class=" mt10">
                   <yd-button :bgcolor="blue" @click.native="add_pic(1,0)" color="#fff">添加拍照信息</yd-button>
                   <div >
                     <img v-for="(item , i ) in formData.image" @click="add_pic(1,1,i)" :key="i" :src="item" alt="">
                          
                   </div>                  
              </div>
        </div>
        
         
          <yd-accordion class="yd_acc_customer">
        <yd-accordion-item class="yd_a_span"  ref="accordion" >
           
            
            <div>
                   <yd-cell-item>
                      <span class="name" slot="left">身份证</span>
                      <input slot="right" type="text" v-model="formData.id_card" placeholder="请输入身份证">
                  </yd-cell-item>
                  <yd-cell-item>
                      <span class="name" slot="left">邮箱</span>
                      <input slot="right" type="text" v-model="formData.email" placeholder="请输入邮箱">
                  </yd-cell-item>
                  
                  <yd-cell-item>
                      <span class="name" slot="left">微信</span>
                      <input slot="right" type="text" v-model="formData.wechat" placeholder="请输入微信">
                  </yd-cell-item>
                  <yd-cell-item class="" arrow @click.native="showAddress(1)">
                      <span class="name"  slot="left">省市</span>
                      <span slot="left">{{formData.address_name}}</span>
                  </yd-cell-item>
                  
                <yd-cell-item class="no-center">
                      <span class="name" slot="left">地址</span>
                      <yd-textarea slot="right" v-model="formData.address" placeholder="请输入地址" maxlength="100"></yd-textarea>
                  </yd-cell-item>
                  
                
                    <yd-cell-item class="no-center">
                      <span class="name" slot="left">备注</span>
                      <yd-textarea slot="right" v-model="formData.remark" placeholder="请输入备注" maxlength="100"></yd-textarea>
                  </yd-cell-item>
            </div>
        </yd-accordion-item>
       
          </yd-accordion>

      
         <div @click="showMore" class="more yd-accordion-head-arrow" > <span class="mr5">更多</span></div>
      </yd-cell-group>

      <yd-tab  class="mt10"  v-if="!isrqhl"  :callback="tabCBK"	 :active-color="blue">
            <yd-tab-panel label="分娩信息" tabkey="1"></yd-tab-panel>
            <yd-tab-panel label="新生儿" tabkey="2"></yd-tab-panel>
            <yd-tab-panel label="亲属" tabkey="3"></yd-tab-panel>
            
        </yd-tab>
    
    
         <div class="mt10" v-if="!isrqhl" v-show="tabtabkey==1" >
          <h3>分娩信息</h3>
           <div class="infoList">
             <div class="content">
                <div class="content_item" v-for="(item , i ) in formData.birth_info" :key="i">
                  <div class="tr">
                    <span @click="optionFromItem(1,1,i)" class="info">详情</span>
                    <!-- <span class="del">删除</span> -->
                  </div>
                  <div class="flex flex-m">
                    <div class="flex-1">预产期：</div>
                     <div class="flex-2">{{item.expect_time}}</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">分娩类型：</div>
                     <div class="flex-2">{{item.type | birthType}}</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">分娩日期：</div>
                     <div class="flex-2">{{item.birth_time}}</div>
                  </div>    
                  </div>      
             </div>
             <div class="tc mt10">       
                   <yd-button :bgcolor="blue" @click.native="optionFromItem(1,0)"  color="#fff">添加分娩信息</yd-button>
              </div>
           </div>
        </div>

        <div class="mt10" v-if="!isrqhl" v-show="tabtabkey==2" >
          <h3>新生儿</h3>
           <div class="infoList">
             <div class="content">
                <div class="content_item" v-for="(item , i ) in formData.baby_info" :key="i">
                  <div class="tr">
                    <span @click="optionFromItem(2,1,i)" class="info">详情</span>
                    <!-- <span class="del">删除</span> -->
                  </div>
                  <div class="flex flex-m">
                    <div class="flex-1">姓名：</div>
                     <div class="flex-2">{{item.name}}</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">身高：</div>
                     <div class="flex-2">{{item.height }}cm</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">体重：</div>
                     <div class="flex-2">{{item.weight}}g</div>
                  </div>    
                  </div>      
             </div>
             <div class="tc mt10">       
                   <yd-button :bgcolor="blue" @click.native="optionFromItem(2,0)"  color="#fff">添加新生儿</yd-button>
              </div>
           </div>
        </div>

        <div class="mt10" v-show="tabtabkey==3 || isrqhl" >
          <h3>亲属</h3>
           <div class="infoList">
             <div class="content">
                <div class="content_item" v-for="(item , i ) in formData.family_info" :key="i">
                  <div class="tr">
                    <span @click="optionFromItem(3,1,i)" class="info">详情</span>
                    <!-- <span class="del">删除</span> -->
                  </div>
                  <div class="flex flex-m">
                    <div class="flex-1">姓名：</div>
                     <div class="flex-2">{{item.name}}</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">关系：</div>
                     <div class="flex-2">{{item.relation }}</div>
                  </div>

                  <div class="flex flex-m">
                    <div class="flex-1">电话：</div>
                     <div class="flex-2">{{item.mobile}}</div>
                  </div>    
                  </div>      
             </div>
             <div class="tc mt10">       
                   <yd-button :bgcolor="blue" @click.native="optionFromItem(3,0)"  color="#fff">添加亲属</yd-button>
              </div>
           </div>
        </div>


    </div>


   
     </div>
    <div class="footer">
       <yd-button @click.native="submit" shape="circle">保存</yd-button>
        <yd-button @click.native="saveOpen" shape="circle">保存并开单</yd-button>
      <yd-button shape="circle" @click.native="assessment">护理评估</yd-button>
    </div>

      <!-- 图片上传弹出框 -->
   <yd-popup v-model="show" position="center" width="90%" class="img_popup" >
       <!-- 图片上传 -->
       <div class="pt20 pr15 pl15 pb15 bgfff1">
            <simpleUpload :apiMethod="api.getOss" :picUrl='picUrl' @success="upload_success"/>
            <div class="mt20 tc">
                <yd-button class="w30p"  v-if="picisEdit" type="danger"  @click.native="delChange_orders_item">删除</yd-button>
                <yd-button class="w30p"  v-if="!picisEdit" :bgcolor="blue" color="#fff" @click.native="canlChange_orders_item">取消</yd-button>
                <yd-button class="w30p" :bgcolor="blue" color="#fff" @click.native="suerChange_orders_item">确定</yd-button>
            </div>  
       </div>  
    </yd-popup>

       <!-- 分娩信息弹出框 -->
   <yd-popup v-model="birthShow" position="center" width="90%" class="img_popup" >
       <div class="pt20 pr15 pl15  pb15 bgfff">
             <yd-cell-group >
                 <yd-cell-item arrow>
                      <span slot="left">预产期：</span>
                      <yd-datetime type="date" :init-emit="false" v-model="birth_item.expect_time" slot="right"></yd-datetime>
                  </yd-cell-item>

                  <yd-cell-item class="">
                      <span slot="left" >分娩类型：</span>
                      <yd-radio-group  slot="left"  :color="blue" v-model="birth_item.type">
                          <yd-radio val="1">顺</yd-radio>
                          <yd-radio val="2">剖</yd-radio>
                      </yd-radio-group>
                    </yd-cell-item>

                   <yd-cell-item arrow>
                        <span slot="left">分娩日期：</span>
                        <yd-datetime type="date" :init-emit="false"  v-model="birth_item.birth_time" slot="right"></yd-datetime>
                    </yd-cell-item>
            </yd-cell-group>
            <div class="mt20 tc">
                <yd-button class="w30p"  v-if="isEdit" @click.native="del_form" type="danger"  >删除</yd-button>
                <yd-button class="w30p"  v-if="!isEdit" @click.native="cancel_form" :bgcolor="blue" color="#fff" >取消</yd-button>
                <yd-button class="w30p" v-if="!isEdit" @click.native="sure_form" :bgcolor="blue"  color="#fff">确定</yd-button>
                <yd-button class="w30p" v-if="isEdit" @click.native="update_form" :bgcolor="blue"  color="#fff">确定</yd-button>
            </div>  
       </div>  
    </yd-popup>

  <!-- 添加新生儿 -->
    <yd-popup v-model="babyShow" position="bottom" height="90%"  class="m_modal img_popup " >
       <div class="pt20 pr15 pl15 pb15 bgfff">
             <yd-cell-group >
                 <yd-cell-item >
                      <span slot="left">姓名：</span>
                      <yd-input slot="right" ref="b_name"  required v-model="baby_item.name"  placeholder="请输入姓名"></yd-input>
                  </yd-cell-item>

                  <yd-cell-item class="">
                      <span slot="left" >性别：</span>
                      <yd-radio-group  slot="left"  :color="blue" v-model="baby_item.sex">
                          <yd-radio :val="1">男</yd-radio>
                          <yd-radio :val="2">女</yd-radio>
                      </yd-radio-group>
                    </yd-cell-item>

                  <yd-cell-item >
                      <span slot="left">身高(cm)：</span>
                      <yd-input slot="right" ref="b_height"  type="number" required v-model="baby_item.height"  placeholder="请输入身高"></yd-input>
                  </yd-cell-item>

                  <yd-cell-item >
                      <span slot="left">体重(g)：</span>
                      <yd-input slot="right" ref="b_weight" type="number" required v-model="baby_item.weight"  placeholder="请输入体重"></yd-input>
                  </yd-cell-item>

                   <yd-cell-item arrow >
                        <span slot="left">出生日期：</span>
                        <yd-datetime  type="date" :init-emit="false"  v-model="baby_item.birth_day" slot="right"></yd-datetime>
                    </yd-cell-item>
                    

                     <yd-cell-item class="no-center">
                        <span slot="left">备注：</span>
                        <yd-textarea slot="right" v-model="baby_item.remark"  placeholder="请输入备注" maxlength="100"></yd-textarea>
                    </yd-cell-item>

                        <div class="img_box">
                            <div class=" mt10">
                                    <yd-button :bgcolor="blue" @click.native="add_pic(2,0)" color="#fff">添加拍照信息</yd-button>
                                    <div class="img_hig" >
                                      <img v-for="(item , i ) in baby_item.image" @click="add_pic(2,1,i)" :key="i" :src="item" alt="">
                                            
                                    </div>                  
                                </div>
                          </div>

            </yd-cell-group>
            <div class="mt20 tc ">
                <yd-button class="w30p"  v-if="isEdit" @click.native="del_form" type="danger"  >删除</yd-button>
                <yd-button class="w30p"  v-if="!isEdit" @click.native="cancel_form" :bgcolor="blue" color="#fff" >取消</yd-button>
                <yd-button class="w30p" v-if="!isEdit" @click.native="sure_form" :bgcolor="blue"  color="#fff">确定</yd-button>
                <yd-button class="w30p" v-if="isEdit" @click.native="update_form" :bgcolor="blue"  color="#fff">确定</yd-button>
            </div>  
       </div>  
    </yd-popup>


 <!-- 添加亲属 -->
    <yd-popup v-model="familyShow" height="100%" position="bottom"  class="m_modal img_popup" >
       <div class="pt20 pr15 pl15  pb15 bgfff ">
             <yd-cell-group >
                 <yd-cell-item >
                      <span slot="left">姓名：</span>
                      <yd-input slot="right" ref="f_name"  required v-model="family_item.name"  placeholder="请输入姓名"></yd-input>
                  </yd-cell-item>

                  <yd-cell-item class="">
                      <span slot="left" >性别：</span>
                      <yd-radio-group  slot="left"  :color="blue" v-model="family_item.sex">
                          <yd-radio :val="1">男</yd-radio>
                          <yd-radio :val="2">女</yd-radio>
                      </yd-radio-group>
                    </yd-cell-item>
                    <yd-cell-item >
                          <span slot="left">联系电话：</span>
                          <!--  regex="mobile" -->
                          <yd-input slot="right"  ref="f_mobile" type="number" required v-model="family_item.mobile"  placeholder="请输入联系电话"></yd-input>
                      </yd-cell-item>

                  <yd-cell-item >
                      <span slot="left">关系：</span>
                      <yd-input slot="right" ref="f_relation"   v-model="family_item.relation"  placeholder="请输入关系"></yd-input>
                  </yd-cell-item>

                   <yd-cell-item arrow>
                        <span slot="left">出生日期：</span>
                        <yd-datetime type="date" :init-emit="false"  v-model="family_item.birth_day" slot="right"></yd-datetime>
                    </yd-cell-item>

                     

                       <yd-cell-item >
                          <span slot="left">身份证：</span>
                          <yd-input slot="right"   v-model="family_item.id_card"  placeholder="请输入身份证"></yd-input>
                      </yd-cell-item>

                      <yd-cell-item >
                          <span slot="left">邮箱：</span>
                          <yd-input slot="right"   v-model="family_item.email"  placeholder="请输入邮箱"></yd-input>
                      </yd-cell-item>

                      <yd-cell-item >
                          <span slot="left">微信：</span>
                          <yd-input slot="right"   v-model="family_item.wechat"  placeholder="请输入微信"></yd-input>
                      </yd-cell-item>

                      <yd-cell-item class="" arrow @click.native="showAddress(2)">
                          <span  slot="left">省市：</span>
                          <span slot="left">{{family_item.address_name}}</span>
                      </yd-cell-item>

                       <yd-cell-item class="no-center">
                            <span slot="left">地址：</span>
                            <yd-textarea slot="right" v-model="family_item.address"  placeholder="请输入地址" maxlength="100"></yd-textarea>
                        </yd-cell-item> 

                     <yd-cell-item class="no-center">
                        <span slot="left">备注：</span>
                        <yd-textarea slot="right" v-model="family_item.remark"  placeholder="请输入备注" maxlength="100"></yd-textarea>
                    </yd-cell-item>

                       

            </yd-cell-group>
            <div class="mt20 tc ">
                <yd-button class="w30p"  v-if="isEdit" @click.native="del_form" type="danger"  >删除</yd-button>
                <yd-button class="w30p"  v-if="!isEdit" @click.native="cancel_form" :bgcolor="blue" color="#fff" >取消</yd-button>
                <yd-button class="w30p" v-if="!isEdit" @click.native="sure_form" :bgcolor="blue"  color="#fff">确定</yd-button>
                <yd-button class="w30p" v-if="isEdit" @click.native="update_form" :bgcolor="blue"  color="#fff">确定</yd-button>
            </div>  
       </div>  
    </yd-popup>

   <!-- 省市联级 -->
    <yd-cityselect v-model="address_show" ref="cityselectDemo" :callback="addressCBK" :items="district" ></yd-cityselect>
  </div>
</template>
<script>
import District from "ydui-district/dist/gov_province_city_id.js";
import simpleUpload from "@/components/simpleUpload";
import * as api from "@/api/index";
import uploadMinx from "./minx/upload"; //图片上传方法
import optionMinx from "./minx/formOption"; //
import moment from "moment";
import * as c_api from "../../../api/customs";
export default {
  name: "customerMo",
  components: { simpleUpload },
  mixins: [uploadMinx, optionMinx],
  data() {
    return {
     isOpen:false,  //折叠
      tabtabkey:'1',
      api,
      id: this.$route.query.id || sessionStorage.custom_id || '',
      address_show: false, //省市弹框
      show_key: "1", // 1为基础信息 2为弹出框信息
      isEdit: false, //是否处于编辑状态
      isSubmit: false, // 是否提交完页面跳转

      district: District,
      _formData: {},
      formData: {
        name: "", //客户姓名
        mobile: "", //	手机号码
        sex: 2, //性别 1:男 2:女
        birth_day: "", //生日
        id_card: "", //	身份证
        image: [], //	图片集
        email: "", //邮箱
        wechat: "", //微信号
        province: "", //省
        city: "", //市
        address_name: "", //展示的字段
        address: "", //	地址
        remark: "", //	备注
        family_info: [], //家属信息
        baby_info: [], //婴儿信息
        birth_info: [] //	分娩信息
      },
      family_item: {
        name: "",
        mobile: "",
        sex: 1, //性别 1:男 2:女
        id_card: "",
        relation: "", //关系
        birth_day: "",
        province: "",
        city: "",
        address_name: "", //展示的字段
        area: "",
        address: "",
        wechat: "",
        email: "",
        remark: ""
      }, //家属信息

      baby_item: {
        name: "",
        sex: 1, // 性别 1:男 2:女
        height: "", //身高
        weight: "", //体重
        birth_day: moment().format("YYYY-MM-DD"), //出生日期
        image: [], //图片
        remark: "" //备注
      }, //婴儿信息

      birth_item: {
        type: 1, //1 顺   2剖
        expect_time: moment().format("YYYY-MM-DD"), //预产期
        birth_time: moment().format("YYYY-MM-DD") // 分娩日期
      } //分娩信息
    };
  },
  mounted() {
    window.C_this = this;
    if (this.id) {
      this.custom_show().then(res => {
        this.rememberData()
        sessionStorage.removeItem('custom_id')
      });
    } else {
      this.rememberData()
       sessionStorage.removeItem('custom_id')
    }
  },
  beforeRouteLeave: async (to, from, next) => {
    console.log(window.C_this.isSubmit);
    if (window.C_this.isSubmit) {
      next();
      return;
    }

    let noChange = window.C_this.noDataChange();
   // console.log(noChange);
    if (!noChange) {
      next(confirm("确认不保存修改直接离开么？"));
    } else {
      next();
    }
  },
  methods: {
    //展示更多数据
    showMore(){
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
          this.$refs.accordion.openItem();
        } else {
          this.$refs.accordion.closeItem();
          }
      
    },

    //显示省市联级
    showAddress(key) {
      this.show_key = key;
      this.$refs.cityselectDemo.$emit("ydui.cityselect.reset");
      this.address_show = true;
    },
    //省市联级回调
    addressCBK(ret) {
      console.log(ret);
      if (this.show_key == 1) {
        //基础信息
        this.formData.address_name = ret.itemName1 + " " + ret.itemName2;
        this.formData.province = ret.itemValue1;
        this.formData.city = ret.itemValue2;
      } else if (this.show_key == 2) {
        //添加家属
        this.family_item.address_name = ret.itemName1 + " " + ret.itemName2;
        this.family_item.province = ret.itemValue1;
        this.family_item.city = ret.itemValue2;
      }
    },
    //检测客户是否重复
    duplicate(){
      if(this.id){return}
      let d = this.isNall()
      if(d.falg){
        c_api.duplicate(this.formData).then(res=>{
          if(res.data._status==1){
            this.$dialog.confirm({
                    title: '提示',
                    mes: '存在用户信息，是否进行开单',
                    opts: () => {
                       this.formData.name = res.data.name
                        this.formData.pk_id = res.data.pk_id
                        this.formData.sex = res.data.sex
                        this.formData.birth_day = res.data.birth_day
                        this.isSubmit = true
                         this.$router.push(`/businessOpen?custom_id=${res.data.pk_id}&&name=${res.data.name}&&mobile=${this.formData.mobile}&&sex=${res.data.sex}&&birth_day=${res.data.birth_day}`)
                       
                    }
                })       
          } 
        })
      }
    },
    //判断客户姓名、电话不为空
    isNall(){
       let falg = true
       let msg = {a_name:'请填写姓名',a_mobile:'请填写联系电话'}
       let msgArr=[]
            let validateArr =Object.keys(msg)
            validateArr.forEach(i=>{
                if(!this.$refs[i].valid){
                    msgArr.push(msg[i])
                    falg = false
                }
            })   
            return {falg,msgArr}
    },
    //修改/保存
    submit() {
      let d = this.isNall()
      console.log(d)
      if(!d.falg){
        this.error(d.msgArr[0])
        return 
      }
      if (this.id) {
        //修改
        this.custom_update();
      } else {
        //保存
        this.custom_add().then(res => {
          this.success("保存成功！");
          this.CB();
        })
      }
    },
    //保存并开单
    saveOpen(){
       if (this.id) {
         if(this.noDataChange()){
              this.goBusinessOpen() 
         }else{
              c_api.custom_update(this.formData).then(res => {
                   this.goBusinessOpen()               
              })        
         }
         
      } else {
        this.custom_add().then(res => {
          this.isSubmit = true
          this.$router.push(`/businessOpen?custom_id=${res.data.pk_id}&&name=${res.data.name}&&mobile=${res.data.mobile}&&sex=${res.data.sex}&&birth_day=${res.data.birth_day}`)
        })
      }
     
    },
    //跳转护理评估
    assessment() {
      if (this.id) {
         if(this.noDataChange()){
              this.goAssessment() 
         }else{
           this.$dialog.confirm({
                    title: '提示',
                    mes: '信息有变化，是否保存后跳转？',
                    opts: [
                        {
                            txt: '保存',
                            color: false,
                            callback: () => {
                              c_api.custom_update(this.formData).then(res => {
                               this.goAssessment() 
                              
                            });                    
                            }
                        },
                        {
                            txt: '不保存',
                             color: false,
                            callback: () => {
                                this.goAssessment() 
                            }
                        },
                        {
                            txt: '取消',
                            color: false,
                            callback: () => {
                              
                            }
                        }
                    ]
                })
         }
         
      } else {
        this.custom_add().then(res => {
          this.isSubmit = true
          this.$router.push(`assessment?custom_id=${res.data.pk_id}&&name=${res.data.name}`)
        })
      }
    },

    //护理跳转链接
    goAssessment(){
      this.isSubmit = true
      this.$router.push(`/assessment?custom_id=${this.id}&&name=${this.formData.name}`)

    },

    //开单跳转
    goBusinessOpen(){
       this.isSubmit = true
      this.$router.push(`/businessOpen?custom_id=${this.id}&&name=${this.formData.name}&&mobile=${this.formData.mobile}&&sex=${this.formData.sex}&&birth_day=${this.formData.birth_day}`) 
    },

    //客户添加
    custom_add() {
      return c_api.custom_add(this.formData).then(res => {
        this.isSubmit = true
        return res
      })
    },

    //客户修改
    custom_update() {
      if (this.noDataChange()) {
        this.success("保存成功！");
        this.CB();
        return;
      }
      Object.assign(this.formData, { pk_id: this.id });

      c_api.custom_update(this.formData).then(res => {
        this.isSubmit = true;
          this.success("保存成功！");
        this.CB();
      });
    },

    //客户详情获取
    custom_show() {
      return c_api.custom_show(this.id).then(res => {
        this.formData = res.data;
        return res;
      });
    },
    noDataChange() {
      return JSON.stringify(this._formData) == JSON.stringify(this.formData);
    },
    rememberData() {
      setTimeout(() => {
        this._formData = JSON.parse(JSON.stringify(this.formData));
      }, 200)
    },

    tabCBK(lable,key){
     // console.log(lable,key)
      this.tabtabkey = key

    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.yd-cell-box {
  padding: 0;
  margin: 0;
}

.childbirth {
  // padding-bottom:0.5rem;
  background: #fff;
}
h3 {
  height: 1rem;
  line-height: 1rem;
  font-size: 0.32rem;
  background: #fff;
  // border-bottom: 0.01rem solid #eee;
  padding-left: 0.3rem;
}
.name {
  display: inline-block;
  width: 2rem;
  color: #aaa;
}
.yd-cell-item {
  // height: 1rem;
  // line-height: 1rem;
  font-size: 0.3rem;
  // border-top: 0.01rem solid #eee;
}
.ydcellitem {
  height: 1rem;
  line-height: 1rem;
}
.sexname,
.birthtype {
  margin-left: 0.1rem;
}
.address {
  position: unset;
  border-top: 0.01rem solid #eee;
}
.no-border {
  border-top: unset;
  // border-bottom: 0.01rem solid #eee;
}
.footer {
  position: fixed;
  bottom: 0;
  z-index: 99;
  width: 100%;
  text-align: center;
  padding: 0.2rem 0;
  background: #fff;
}
.footer .yd-btn-circle {
  font-size: 0.3rem;
  width: 1.6rem;
  height: 0.7rem;
  background: #5bacf9;
  padding: 0 0.3rem;
}
/// ------ ------
.c_box {
  padding-bottom: 1.5rem;
}

.infoList {
  margin-top: 0.1rem;
  padding: 0.2rem;

  background: #fff;
  .content {
    min-height: 1rem;
    font-size: 0.32rem;
    line-height: 0.55rem;
    color: #555;
  }
  .content_item {
    margin-top: 0.2rem;
    border: 1px solid #eee;
    padding: 0.2rem;
  }
  .info {
    padding: 0 0.15rem;
    color: #5bacf9;
    margin-right: 0.05rem;
  }
  .del {
    padding: 0 0.15rem;
    color: red;
  }
}

.img_box {
  padding-left: 0.2rem;
  img {
    width: 2rem;
    height: 2rem;
    margin-top: 0.2rem;
    margin-right: 0.2rem;
    border: 1px solid #eee;
  }
  .img_hig {
    min-height: 2.5rem;
  }
}
.bgfff {
  background-color: #fff;
}
.bgfff1 {
  background-color: #fffffc;
  border: 1px solid #eee;
}
.f_foot {
  width: 100%;
  position: fixed;
  z-index: 9999;
  bottom: 0;
  padding-bottom: 0.14rem;
  background: #fff;
}
.fpb {
  padding-bottom: 1rem;
}
.bgeee {
  background-color: #eee;
}
.more{
  font-size: 0.32rem;
  padding: 0.2rem;
}
</style>
