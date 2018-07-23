// 订单管理

export default {
    data() {
        return {
            m_searchShow: false
        }
    },
    methods: {
        // 删除
        delForm(i) {
            this.$dialog.confirm({
                title: '提示',
                mes: '确定删除该项吗',
                opts: () => {
                    if (this.banDel && (!this.banDel(i))) {
                        this.error('服务已用到该产品，不能删除！')
                    } else {
                        this.form.splice(i, 1)
                        this.$dialog.toast({ mes: '删除成功', timeout: 1000 })
                    }

                }
            })
        },
        addForm() {
            this.form.push(JSON.parse(JSON.stringify(this.formItem)))
        },

        //不能输入负数
        notMinus(event) {
            event.target.value = event.target.value.replace(/\-/g, "");

        }
    },
    filters: {
        vir_combo_type(v) {
            if (v == '套') {
                return '次'
            } else if (v == '月') {
                return '天'

            } else {
                return v
            }
        }
    }
}