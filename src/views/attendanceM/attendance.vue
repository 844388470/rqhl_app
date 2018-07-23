<template>
  <div class="attendance">
   
   <mSearch  :show.sync="searchShow" @search="handleSearch" :result="searchResult" :searchKey="searchKey"/>
    <div class="header">
     <organSelect  :defalutTitle="defalutTitle" :ready="organSelectReady" @click.native="openOrganSelect" :show.sync="organSelectShow" :items="dataTree" @organSelectsuccess="organSelectsuccess"/>
       <div class="pb10">
          <datepicker :markData="has_attendanceArr" :moment="form.date" v-on:picked="dateTimeCBK" @nextTimeCBK="nextTimeCBK" />
         
       </div>
       
    </div>
    <div class="radios">
      <div class="radios-title">
        <span style="width:18%;display:inline-block;">姓名</span>
        <span style="width:65%;display:inline-block">
          <span class="title-item" >白</span>
          <span class="title-item" >夜</span>
          <span class="title-item" >连</span>
          <span class="title-item" >半</span>
          <span class="title-item" >试</span>
         
          
        </span>
        <span style="width:14%;display:inline-block;">操作</span>
      </div>
      <ul>

        <!-- 一个item -->
        <li class="radioList" v-for="(item ,i) in form.attendance" :key="i">
          <div @click="openSearchBox(i)" style="width:21%;display:inline-block">
             <span class="text " >{{item.fk_stf_id_name | name}}</span>
          </div>
          <div style="width:65%;display:inline-block;height:0.5rem;line-height:0.5rem;" >
            <yd-radio-group v-model="item.type" color="#5bacf9">
              <yd-radio val="1">&nbsp;</yd-radio>
              <yd-radio val="2">&nbsp;</yd-radio>
              <yd-radio val="3">&nbsp;</yd-radio>
              <yd-radio val="4">&nbsp;</yd-radio>
              <yd-radio val="5">&nbsp;</yd-radio>
              
            </yd-radio-group>
          </div>
          <div @click="delAttendance(i)" style="width:10%;display:inline-block;textAlign:center;height:1rem;line-height:1rem;">
            <button >
              <yd-icon name="delete" size="20px" color="#f00"></yd-icon>
            </button>
          </div>
        </li>


      </ul>
       <div class="btn"><yd-button @click.native="addAttendance" class="addBtn" size="small" bgcolor="#5bacf9" color="#FFF" >增加人员</yd-button></div>
    </div>
    <div class="footer">
      <p>考勤总班次：<span>{{total_type}}</span></p>
      <p>
        <span>白班 {{type1}}</span>
        <span>夜班 {{type2}}</span>
        <span>连班 {{type3}}</span>
        <span>半天 {{type4}}</span>
        <span>试用期班 {{type5}}</span>
      </p>
       <div class="img" @click="show_pic">
         <img v-show="form.url" :src="form.url">
       </div>
      
      <div class="btn">
        <yd-button v-show="!form.pk_id" class="sureBtn" @click.native="sureClick(0)"  bgcolor="#5bacf9" color="#FFF" >新增</yd-button>
         <yd-button v-show="!!form.pk_id" class="sureBtn" @click.native="sureClick(1)"  bgcolor="#5bacf9" color="#FFF" >修改</yd-button>
      </div>
    </div>

<!-- 图片上传弹出框 -->
   <yd-popup v-model="show" position="center" width="90%" class="img_popup" >
       <!-- 图片上传 -->
       <div class="pt20 pr15 pl15 pb15">
            <simpleUpload imgType="attendance" :apiMethod="p_api.getOss" :picUrl='form.url' @success="upload_success"/>
             

            <div class="mt20 tc">        
                <yd-button  class="w30p" @click.native="show=false" :bgcolor="blue" color="#fff">确定</yd-button>
               
            </div>  
       </div>  
    </yd-popup>


  </div>
</template>

<script>
import moment from 'moment'
import datepicker from "../../components/datepicker";
import * as p_api from "@/api";
import * as api from "@/api/attendance";
import { mapGetters } from "vuex";
import simpleUpload from "@/components/simpleUpload";
import mSearch from "@/components/mSearch";

export default {
  components: { mSearch, simpleUpload, datepicker },
  name: "attendance",
  computed: {
    ...mapGetters(["project_list"]),
    //白班
    type1() {
      return this.form.attendance.filter(i => i.type == 1).length;
    },
    //夜班
    type2() {
      return this.form.attendance.filter(i => i.type == 2).length;
    },
    //连班
    type3() {
      return this.form.attendance.filter(i => i.type == 3).length;
    },
    //半班
    type4() {
      return this.form.attendance.filter(i => i.type == 4).length;
    },
    //试用班
    type5() {
      return this.form.attendance.filter(i => i.type == 5).length;
    },
    //总考勤数
    total_type() {
      return this.type1 + this.type2 + this.type3 * 2 + this.type4 * 0.5;
    }
  },
  data() {
    return {
      p_api,
      show: false, //弹出框展示
      // 搜索组件参数
      searchShow: false,
      searchKey: "key",
      searchResult: [],

      //网点 科室 树形
      dataTree: [],
      organSelectReady: false, //异步
      organSelectShow: false,

      defalutTitle:'', //默认标题
      has_attendanceArr:[] , //有考勤日期

      form: {
        pk_id: "",
        url_id: "",
        group_id: 0,
        fk_hpl_id: 0,
        date: moment().format('YYYY-MM-DD'),
        url: "",
        attendance: []
      },

      attendance: {
        fk_stf_id: 0,
        type: "1",
        fk_stf_id_name: "请选择"
      },
      //人员列表
      staffs: []
    };
  },

  mounted() {
    this.getDubList()
    this.search_index().then(res=>{
      this.has_attendance()
    })
   
    
    

  },
  methods: {
    //打开图片详情
    show_pic() {
      this.show = true;
    },

    //图片上传成功
    upload_success(res) {
     // console.log(res);
      this.form.url = `${res.url}`;
    //  console.log(this.form.url);
    },

    //添加人员
    addAttendance() {
      if (!this.form.fk_hpl_id) {
        this.error("请选择机构");
        return false;
      }
      this.form.attendance.push(JSON.parse(JSON.stringify(this.attendance)));
    },

    //选择时间回调
    dateTimeCBK(data) {
       // this.form.date = data.data;
 
       this.form.date = moment(new Date(data.data)).format('YYYY-MM-DD')
   //   console.log(data.data, 111);
      if (this.form.fk_hpl_id) {
        this.search_attendance_day();
      }
    },
    //上个月，下个月回调
    nextTimeCBK(data) {
     // console.log(data);
       this.has_attendance(data.data)

    },

    //考勤查询
    search_attendance_day() {
     return api.search_attendance_day(this.form).then(res => {
        this.form.attendance = res.data.Attendance_info ;
        this.form.url = res.data.pic_url || ""
        this.form.pk_id = res.data.pk_id || ""
        this.form.picid = res.data.picid || ""
       // this.form.date = res.data.date 
         return res
        
      });
    },

    //获取日期有无考勤
    has_attendance(d){
      if(!this.form.fk_hpl_id||!this.form.group_id){return }
      let data = {
        fk_hpl_id:this.form.fk_hpl_id,
        group_id:this.form.group_id,
        date:d||this.form.date,
      }
      api.has_attendance(data).then(res=>{
         this.has_attendanceArr = res.data
      })
    },
    //删除人员
    delAttendance(i) {
      this.$dialog.confirm({
        title: "提示",
        mes: "确定删除吗？",
        opts: () => {
          this.form.attendance.splice(i, 1);
          this.success("删除成功");
        }
      });
    },

    //确定添加
    sureClick(isEdit) {
      isEdit = !!isEdit;
      if (!this.form.fk_hpl_id) {
        this.error("请选择机构");
        return false;
      }
      if (isEdit) {
        this.editAttendanceInfo(this.form);
      } else {
        this.addAttendanceInfo(this.form);
      }
    },

    //添加考勤信息
    addAttendanceInfo() {
      api.addAttendance(this.form).then(res => {
        this.success("添加成功");
        this.search_attendance_day().then(res=>{
          
        })
       
        this.has_attendanceArr.push(moment(this.form.date).format('YYYY-MM-DD'))
       
      });
    },
    
    //入口查询
    search_index(){
     return api.search_index().then(res=>{
        this.form.pk_id = res.data.pk_id
        this.form.group_id = res.data.group_id
        this.form.fk_hpl_id = res.data.fk_hpl_id
       // this.form.date = res.data.date
        this.form.attendance = res.data.Attendance_info || []
        this.defalutTitle = `${res.data.hpl_name}>${res.data.group_name}`
        return res
      })
    },

    //考勤修改信息
    editAttendanceInfo() {
      api.editAttendance(this.form).then(res => {
        this.success("修改成功");
        this.search_attendance_day();
      });
    },

    //搜索完成回调
    handleSearch(res, key) {
      console.log(res, key);
      this.form.attendance[key].fk_stf_id_name = res.name;
      this.form.attendance[key].fk_stf_id = res.pk_id;
    },

    //打开搜索矿
    openSearchBox(index) {
      if (!this.form.fk_hpl_id) {
        this.error("请选择机构");
        return false;
      }
      if (this.staffs.length) {
        this.searchKey = index;
        this.searchResult = this.staffs;
        this.searchShow = true;
      } else {
        this.getStaffs().then(res => {
          this.searchKey = index;
          this.searchResult = this.staffs;
          this.searchShow = true;
        });
      }
    },
    //打开连级框
    openOrganSelect() {
      //  if(this.form.attendance.length){
      //    this.error('已存在人员')
      //    return false
      //  }
      this.organSelectShow = true;
    },

    //联机返回的结果
    organSelectsuccess(ret) {
      console.log(ret);
      this.form.fk_hpl_id = ret.itemValue1 || 0;
      this.form.group_id = ret.itemValue2 || 0;
      this.staffs = [];
      this.form.url = "";
      this.search_attendance_day();
    },

    // 获取人员 （fk_psn_id :{0:13,1:32)}）
    getStaffs() {
      let data = {
        fk_hpl_id: this.form.fk_hpl_id,
        group_id: this.form.group_id,
        fk_psn_id: [13, 32],
        date: this.form.date
      };
      return p_api.getStaffs(data).then(res => {
        this.staffs = res.data;
        return res;
      });
    },

    //获取护理组列表
    getDubList() {
      p_api.getGroupList().then(res => {
        let dublist = res.data;
        let project_list = this.project_list;

        this.dataTree = new Array(project_list.length).fill().map((item, i) => {
          return {
            v: project_list[i].pk_id,
            n: project_list[i].name,
            c: new Array(
              dublist.filter(item1 => item1.pid == project_list[i].pk_id).length
            )
              .fill()
              .map((item2, i2) => {
                return {
                  v: dublist.filter(
                    item1 => item1.pid == project_list[i].pk_id
                  )[i2].pk_id,
                  n: dublist.filter(
                    item1 => item1.pid == project_list[i].pk_id
                  )[i2].name,
                  c: []
                };
              })
          };
        });
        //过滤没有护理组的网点
        this.dataTree = this.dataTree.filter(i => i.c.length);
        this.organSelectReady = true;
      });
    }
  },
  filters: {
    name(v) {
      if (!v) {
        return "请选择";
      }
      return v;
    }
  }
};
</script>
<style lang='scss' scoped>
.img {
  margin: 0.2rem;
  width: 1.92rem;
  height: 1.52rem;
  background: url("../../assets/img/picture default@3x.png") no-repeat;
  background-size: 100% 100%;
  img {
    width: 100%;
    height: 100%;
  }
}

* {
  margin: 0%;
  padding: 0;
}
.text {
  display: block;
}
button {
  border: 0;
  outline: none;
}
.attendance {
  background: #ffffff;
}
.header {
  border-bottom: 0.2rem solid #eee;
}
.datatime {
  background: url("../../assets/img/daliy@2x.png") no-repeat right center;
  background-size: 40px 40px;
}
.radios {
  margin: 0.2rem 0;
  border-bottom: 0.2rem solid #eee;
}
.radios-title {
  // color:#5bacf9;
  font-size: 0.3rem;
}
.title-item {
  width: 18%;
  display: inline-block;
}
.radios span {
  font-size: 0.3rem;
  text-align: center;
}
.yd-radio {
  width: 18%;
  display: inline-block;
  text-align: center;
}

.radioList {
  height: 1.1rem;
  line-height: 1rem;
  // margin:0.3rem 0;
  border-bottom: 0.01rem solid #ddd;
}
.btn {
  margin: 0.3rem 0;
  width: 100%;
  text-align: center;
}
.addBtn {
  padding: 0 0.2rem;
}
.sureBtn {
  padding: 0 0.2rem;
  width: 2.6rem;
  height: 0.7rem;
  font-size: 0.3rem;
}
.footer {
  // margin:0.4rem 0;
  padding-bottom: 1rem;
}
.footer .img-upload {
  padding-bottom: 0.3rem;
  border-bottom: 0.2rem solid #eee;
}
.footer p {
  margin: 0.5rem 0.3rem;
}
.footer p,
.footer p span {
  font-size: 0.3rem;
}
.footer p span {
  display: inline-block;
  width: 30%;
  height: 0.5rem;
  line-height: 0.5rem;
}
</style>