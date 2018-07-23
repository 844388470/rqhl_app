<!-- 筛选框 -->
<template>
  <div class='mb5 mselect'>
    <!-- ↓↓↓↓ 搜索的组件 -->
    <mSearch :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey" />
    <!-- ↑↑↑↑ 搜索的组件 -->
    <div class="flex flex-m m_noBottom"  style="background-color:#fff;">
      <!-- <yd-cell-item class="flex-2 m_slotR" v-if="showItem.includes('search')"> -->
      <yd-cell-item class="flex-2 m_slotR" >
        <!-- <b slot="left">搜索</b> -->
        <input class="searchInput" v-on:keyup.13="submit()" @focus="sea_focus" @blur="sea_blur" slot="right" v-model="form.search" type="text" placeholder="">
        <!-- <yd-icon slot="right" name="qrscan" ></yd-icon> -->
        <yd-icon slot="left" v-show="true" @click.native="ScanQRCode" name="qrscan"></yd-icon>
      </yd-cell-item>
      <yd-button class="mr5" type="hollow" @click.native="show1=true">筛选</yd-button>
    </div>
    <yd-popup v-model="show1" position="center" width="90%">
      <div style="background-color:#fff;">
        <div style="padding: .24rem;" class="m_cell_item">
          <yd-cell-group>
            <yd-cell-item v-if="showItem.includes('fk_hpl_id')" @click.native="showSearchBox(PROJECT_LIST,'fk_hpl_id')">
              <b slot="left">网点</b>
              <i slot="left">{{name.fk_hpl_id |empitSelect}}</i>
            </yd-cell-item>

            <yd-cell-item v-if="showItem.includes('fk_dub_id')" @click.native="getSearchList('getDubList','fk_dub_id')">
              <b slot="left">科室</b>
              <i slot="left">{{name.fk_dub_id |empitSelect}}</i>
            </yd-cell-item>

            <yd-cell-item v-if="showItem.includes('group_id')" @click.native="getSearchList('getGroupList','group_id')">
              <b slot="left">组别</b>
              <i slot="left">{{name.group_id |empitSelect}}</i>
            </yd-cell-item>
            <yd-cell-item v-if="showItem.includes('patient_name')">
              <b slot="left">客户</b>
              <input slot="right" v-model="form.patient_name" type="text" placeholder="">
            </yd-cell-item>
            <yd-cell-item v-if="showItem.includes('patient_phone')">
              <b slot="left">手机</b>
              <input slot="right" v-model="form.patient_phone" type="text" placeholder="">
            </yd-cell-item>
            <!-- <yd-cell-item v-if="showItem.includes('search')">
              <b slot="left">搜索</b>
              <input @focus="sea_focus" @blur="sea_blur" slot="right" v-model="form.search" type="text" placeholder="">
              
              <yd-icon slot="right" v-show="isShowScanQRCode" @click.native="ScanQRCode" name="qrscan"></yd-icon>
            </yd-cell-item> -->
            <div v-if="timeShow">
              <yd-cell-item v-if="showItem.includes('start')">
                <b slot="left">签约日期</b>
                <div slot="left" class="flex">
                  <yd-datetime placeholder="开始时间" :init-emit='false' type="date" v-model="form.start"></yd-datetime>
                  <span class="pl10 pr10">-</span>
                  <yd-datetime placeholder="结束时间" :init-emit='false' :start-date="form.start" type="date" v-model="form.end"></yd-datetime>

                </div>
              </yd-cell-item>
              <yd-cell-item v-if="showItem.includes('server_start')">
                <b slot="left">服务起止</b>
                <div slot="left" class="flex">
                  <yd-datetime placeholder="开始时间" :init-emit='false' type="date" v-model="form.server_start"></yd-datetime>
                  <span class="pl10 pr10">-</span>
                  <yd-datetime placeholder="结束时间" :init-emit='false' type="date" v-model="form.server_end"></yd-datetime>

                </div>
              </yd-cell-item>

            </div>

            <yd-cell-item v-if="showItem.includes('order_no')">
              <b slot="left">订单号</b>
              <input slot="right" v-model="form.order_no" type="number" placeholder="">
            </yd-cell-item>
            <yd-cell-item v-if="showItem.includes('is_end')">
              <b slot="left">是否结算</b>
              <yd-radio-group slot="left" :color="blue" size="16" v-model="form.is_end">
                <yd-radio val="1">已结算</yd-radio>
                <yd-radio val="0">未结算</yd-radio>
                <yd-radio val="">全部</yd-radio>
              </yd-radio-group>
            </yd-cell-item>
            <yd-cell-item arrow type="label" v-show="!isrqhl" v-if="showItem.includes('good_cate')">
              <span slot="left">产品类别：</span>
              <select slot="right" v-model="form.good_cate">
                <option value="">请选择产品类别</option>
                <option v-for="(item,index) in goodTypeList" :key="index" :value="item.key_id">{{item.key_value}}</option>
              </select>
            </yd-cell-item>

            <yd-cell-item v-if="showItem.includes('order_status')" @click.native="showStatusList">
              <b slot="left">订单状态</b>
              <i slot="left">{{form.order_status | CNstatus}}</i>
            </yd-cell-item>

          </yd-cell-group>
          <div class="tc">
            <yd-button @click.native="reset" :bgcolor="blue" color="#FFF" class="w30p">重置</yd-button>
            <yd-button @click.native="submit" :bgcolor="blue" color="#FFF" class="w30p">搜索</yd-button>
          </div>
        </div>
      </div>
    </yd-popup>

    <button v-show="false" id="_setScanResult" @click="AndroidScanResul">安卓二维码t</button>
    <!-- 订单状态弹框 -->
    <yd-popup v-model="showStatus" position="bottom" height="40%">
      <yd-cell-group @click="showStatus=false">
        <yd-cell-item type="radio">
          <span slot="left">全部</span>
          <input slot="right" type="radio" value="0" v-model="form.order_status" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="left">待服务</span>
          <input slot="right" type="radio" value="1" v-model="form.order_status" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="left">服务中</span>
          <input slot="right" type="radio" value="2" v-model="form.order_status" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="left">待结算</span>
          <input slot="right" type="radio" value="3" v-model="form.order_status" />
        </yd-cell-item>
        <yd-cell-item type="radio">
          <span slot="left">已完成</span>
          <input slot="right" type="radio" value="4" v-model="form.order_status" />
        </yd-cell-item>
      </yd-cell-group>
      <yd-tabbar slot="tabbar">
        <div class="w100p tc pt5 pb5">
          <yd-button :bgcolor="blue" color="#FFF" class="w30p">取消</yd-button>
          <yd-button :bgcolor="blue" color="#FFF" class="w30p">确定</yd-button>
        </div>
      </yd-tabbar>

    </yd-popup>
  </div>
</template>

<script>
import moment from "moment";
import { getGoodsType } from "../api/orderM.js";
import { mapState, mapGetters } from "vuex";
import mSearch from "./mSearch";
import _weixin from "../minix/weixin";
export default {
  props: ["showItem"],
  components: { mSearch },
  mounted() {
    this.reform = JSON.parse(JSON.stringify(this.form));
    this.reName = JSON.parse(JSON.stringify(this.name));
    this.getgoodTypeList();
    this.isScanQRCode();
  },
  mixins: [_weixin],
  data() {
    return {
      show1:false,
      searchShow: false,
      searchKey: "",
      searchResult: [],
      reform: {}, //重置表单
      reName: {}, //重置名字
      isShowScanQRCodeArr: ["weixin"], //需要扫码的环境
      isShowScanQRCode: false,
      isAndroid: !!window.OMS,
      timeShow: true,
      //展示的名字
      name: {
        fk_hpl_id: "",
        fk_dub_id: "",
        group_id: ""
      },
      form: {
        is_end: "", //是否结算
        start: "", //开始时间
        end: moment().format("YYYY-MM-DD"), //结束时间
        order_no: "", //订单号
        fk_hpl_id: "", //网点id
        fk_dub_id: "", //科室id
        group_id: "", //护理组id
        patient_name: "", //客户姓名
        patient_phone: "", //客户电话
        search: "",
        server_start: "", //服务开始时间
        server_end: "", //服务结束时间
        order_status: "0", //订单状态
        good_cate: "" //产品类别
      },
      submitForm: {},
      showStatus: false, //订单状态下部弹窗
      goodTypeList: [] //产品类别
    };
  },
  computed: {
    ...mapState(["PROJECT_LIST", "company_list"]),
    ...mapGetters(["PROJECT_LIST", "company_list"])
  },

  filters: {
    CNstatus(s) {
      let status =
        s == "0"
          ? "全部"
          : s == "1"
            ? "待服务"
            : s == "2"
              ? "服务中"
              : s == "3" ? "待结算" : s == "4" ? "已完成" : "";
      return status;
    }
  },
  methods: {
    //返回搜索的字段
    submit() {
      let formKey = Object.keys(this.form);
      this.submitForm = {};
      formKey.forEach(i => {
        this.submitForm[i] = this.form[i];
      });
      // 搜索回调
      this.$emit("search", this.submitForm);
      // this.$refs.accordion.closeItem();
      this.show1=false
    },
    reset() {
      this.timeShow = false;

      this.form = JSON.parse(JSON.stringify(this.reform));
      this.name = JSON.parse(JSON.stringify(this.reName));
      setTimeout(i => {
        this.timeShow = true;
      }, 0);
    },
    //搜索框返回的值
    handleSearch(v, key) {
      console.log(v, key);
      if (Object.keys(v).length) {
        this.name[key] = v.name;
        this.form[key] = v.pk_id;
      } else {
        this.name[key] = "";
        this.form[key] = "";
      }
    },
    //微信扫一扫
    ScanQRCode() {
      if (sessionStorage.ANGENT == "weixin") {
        this._setScanQRCode(
          res => {
            this.form.search = res.resultStr.split(",")[1];
            this.success("扫码成功");
            this.submit()
          },
          res => {
            this.error("扫码失败");
          }
        );
      } else if (this.isAndroid) {
        window.OMS.startCodeScan(3);
      }
    },

    //安卓二维码回掉
    AndroidScanResul() {
      let data = sessionStorage._setScanResult || "{}";
      data = JSON.parse(data);
      this.form.search = data.data;
       this.submit()
    },
    //是否显示扫码
    isScanQRCode() {
      let ANGENT = sessionStorage.ANGENT || "";
      if (this.isShowScanQRCodeArr.includes(ANGENT)) {
        this.isShowScanQRCode = true;
      }
      if (this.isAndroid) {
        //安卓
        this.isShowScanQRCode = true;
        
      }
    },
    //显示订单状态下部弹窗
    showStatusList() {
      this.showStatus = true;
    },
    getgoodTypeList() {
      getGoodsType().then(res => {
        this.goodTypeList = res.data.data;
      });
    },
    sea_focus() {
      document.getElementById("lybox").classList.remove("h100");
    },
    sea_blur() {
      document.getElementById("lybox").classList.add("h100");
    }
  },
  watch: {
    "name.fk_hpl_id"(v) {
      this.form.fk_dub_id = "";
      this.name.fk_dub_id = "";
      this.form.group_id = "";
      this.name.group_id = "";
    },
    "form.order_status"(v) {
      this.showStatus = false;
    }
  }
};
</script>
<style lang='scss' scoped>
b {
  display: inline-block;
  width: 150px;
}

</style>