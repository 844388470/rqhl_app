// 分娩信息 心生儿 亲属 操作
export default {
    data() {
        return {
            birthShow: false, //分娩
            familyShow: false, // 家属
            babyShow: false, //婴儿
            formKey: '3', // 1分娩 2 新生儿 3 亲属
            _family_item: {}, //还原 家属信息
            _baby_item: {},  //还原 婴儿信息
            _birth_item: {}, //还原  分娩信息
            index:'-1' , //

        }
    },
    mounted() {
  
        this._family_item = JSON.parse(JSON.stringify(this.family_item))
        this._baby_item = JSON.parse(JSON.stringify(this.baby_item))
        this._birth_item = JSON.parse(JSON.stringify(this.birth_item))
    },
    methods: {
        //显示弹框
        optionFromItem(formKey, isEdit, index) {
            this.formKey = formKey
            this.isEdit = !!isEdit
            this.index = index 

            if (formKey == 1) {
                if (this.isEdit) {
                    //分娩编辑
                    this.birth_item = JSON.parse(JSON.stringify(this.formData.birth_info[this.index]))
                    
                }
                this.birthShow = true

            } else if (this.formKey == 2) {
                if (this.isEdit) {
                    // 新生儿编辑
                    this.baby_item = JSON.parse(JSON.stringify(this.formData.baby_info[this.index]))
                }
                this.babyShow = true
            } else if (formKey == 3) {
                if (this.isEdit) {
                    //亲属编辑
                    this.family_item = JSON.parse(JSON.stringify(this.formData.family_info[this.index]))
                }
                this.familyShow = true


            }
        },

        //删除
        del_form() {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除吗！',
                opts: () => {
                    if (this.formKey == 1) {
                        //分娩 
                         this.formData.birth_info.splice(this.index,1)
                         this.birthShow = false
                    } else if (this.formKey == 2) {
                        // 新生儿
                        this.formData.baby_info.splice(this.index,1)
                        this.babyShow = false
                    } else if (this.formKey == 3) {
                        //亲属
                        this.formData.family_info.splice(this.index,1)
                        this.familyShow = false
                    }

                }
            })





        },

        //取消
        cancel_form() {
            if (this.formKey == 1) {
                //分娩        
                this.birthShow = false
            } else if (this.formKey == 2) {
                // 新生儿
                this.babyShow = false

            } else if (this.formKey == 3) {
                //亲属
                this.familyShow = false
            }

        },

        //修改
        update_form() {
            if (this.formKey == 1) {
                //分娩       
                this.formData.birth_info.splice(this.index,1,this.birth_item)
                 this.birthShow = false 

            } else if (this.formKey == 2) {
                // 新生儿
                this.formData.baby_info.splice(this.index,1,this.baby_item)
                 this.babyShow = false


            } else if (this.formKey == 3) {
                //亲属
                this.formData.family_info.splice(this.index,1,this.family_item)
                 this.familyShow = false

            }


        },



        //确定/添加 
        sure_form() {
            if (this.formKey == 1) {
                //分娩      
                if (!this.validate_birth()) {
                    return
                }
                this.formData.birth_info.push(this.birth_item)
                this.birthShow = false

            } else if (this.formKey == 2) {
                // 新生儿
                if (!this.validate_baby()) {
                    return
                }
                this.formData.baby_info.push(this.baby_item)
                this.babyShow = false


            } else if (this.formKey == 3) {
                //亲属
                if (!this.validate_family()) {
                    return
                }
                this.formData.family_info.push(this.family_item)
                this.familyShow = false

            }

        },

        //验证分娩信息
        validate_birth() {
            let falg = this.birth_item.expect_time && this.birth_item.birth_time
            if (!falg) {
                this.error('请完整填写信息')
            }
            return falg
        },

        //验证婴儿信息
        validate_baby() {
            let falg = true
            let msg = {b_name:'请填写姓名',b_height:'请填写身高',b_weight:'请填写体重'}
            let msgArr=[]
            let validateArr =Object.keys(msg)
            validateArr.forEach(i=>{
                if(!this.$refs[i].valid){
                    msgArr.push(i)
                    falg = false
                }
            })
            if (!falg) {
                this.error(msg[msgArr[0]])
            }
            return falg
        },
       
        validate_family() {
            let falg = true
            let msgArr=[]
            let msg = {f_name:'请填写姓名',f_relation:'请填写关系',f_mobile:'请填写正确电话'}
            let validateArr =Object.keys(msg)
            validateArr.forEach(i=>{
                if(!this.$refs[i].valid){
                    msgArr.push(i)
                    falg = false
                }
            })
            if (!falg) {
                this.error(msg[msgArr[0]])
            }
            return falg
        }


    },
    watch: {
        birthShow(v) {
            if (!v) {
                this.birth_item = JSON.parse(JSON.stringify(this._birth_item))
            }   
        },
        familyShow(v) {
            if (!v) {
                this.family_item = JSON.parse(JSON.stringify(this._family_item))
            }
        },
        babyShow(v) {
            if (!v) {
                this.baby_item = JSON.parse(JSON.stringify(this._baby_item))
            }
        },

    },
    filters: {
        birthType(v) {
            if (v == 1) { return '顺产' }
            if (v == 2) { return '剖腹产' }
        }


    },
}