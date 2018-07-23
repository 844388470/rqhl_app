//图片上传
export default {
    data() {
        return {
            show: false, //图片弹框
            picUrl: "", //编辑时的图片地址
            cachePic: "", //上传完成缓存图片地址
            picisEdit:"" , //图片处于编辑状态
        }
    },
    methods: {
        //添加图片(显示弹框)
        add_pic(key, picisEdit, index) {
            this.picisEdit = !!picisEdit;
            this.show_key = key;

            if (this.picisEdit) {
                //编辑
                this.index = index;
                if (this.show_key == 1) {
                    //基础信息
                    this.picUrl = this.formData.image[index];
                } else if (this.show_key == 2) {
                    //添加新生儿信息
                    this.picUrl = this.baby_item.image[index];
                }
            } else {
                //添加
            }
            this.show = true;
        },

        //图片上传成功
        upload_success(res) {
            console.log(res);
            this.cachePic = res.url;
        },

        //取消 图片
        canlChange_orders_item() {
            // this.picUrl = " 1 ";
            this.show = false;
        },

        //删除图片
        delChange_orders_item() {
            if (this.show_key == 1) {
                //基础信息
                this.formData.image.splice(this.index, 1);
            } else if (this.show_key == 2) {
                //添加新生儿信息
                this.baby_item.image.splice(this.index, 1);
            }

            this.show = false;
        },

        //添加/修改图片
        suerChange_orders_item() {

            if (!this.cachePic) {
                this.show = false;
                return
            }
            if (this.show_key == 1) {
                //基础信息
                if (this.picisEdit) {
                    this.formData.image.splice(this.index, 1, this.cachePic);
                } else {
                    this.formData.image.push(this.cachePic)
                }
            } else if (this.show_key == 2) {
                //添加新生儿信息
                if (this.picisEdit) {
                    this.baby_item.image.splice(this.index, 1, this.cachePic);
                } else {
                    this.baby_item.image.push(this.cachePic)
                }
            }
            this.show = false;
        }
    },
    filters: {

    },
    watch:{
        show(v) {
            if (!v) {
              if (this.picUrl == "") {
                this.picUrl = 0;
              } else {
                this.picUrl = "";
              }
              this.cachePic = "";
            }
          }
    }
}