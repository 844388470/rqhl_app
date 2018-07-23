let state = {
    orderInfo: {},
    order_base: {},
    order_charge: [],
    order_goods: [],
    order_service: [],
    change_orders: [],
    total: '', //产品金额总计
    has_pay: '' //收费金额总计



}

let actions = {
    setTotal({ commit }, i) {
        commit('SET_TOTAL', i)

    },
    setHasPay({ commit }, i) {
        commit('SET_HAS_PAY', i)

    },
    setOrederInfo({ commit }, i) {
        commit('SET_ORDER_INFO', i)

    },
    setOrederBase({ commit }, i) {
        commit('SET_ORDER_BASE', i)

    },
    setOrederCharge({ commit }, i) {
        commit('SET_ORDER_CHARGE', i)

    },
    setOrederGoods({ commit }, i) {
        commit('SET_ORDER_GOODS', i)

    },
    setOrederService({ commit }, i) {
        commit('SET_ORDER_SERVICE', i)

    },
    setChangeOrders({ commit }, i) {
        commit('SET_CHANGE_ORDERS', i)

    },





}

let mutations = {
    SET_TOTAL(state, i) {
        state.total = i
    },

    SET_HAS_PAY(state, i) {
        state.has_pay = i
    },

    SET_CHANGE_ORDERS(state, i) {
        state.change_orders = i
    },
    SET_ORDER_INFO(state, i) {
        state.orderInfo = i
    },
    SET_ORDER_BASE(state, i) {
        state.order_base = i
    },
    SET_ORDER_CHARGE(state, i) {
        state.order_charge = i
    },
    SET_ORDER_GOODS(state, i) {
        state.order_goods = i
    },
    SET_ORDER_SERVICE(state, i) {
        state.order_service = i
    },


}

let getters = {
    orderInfo: state => ({
        order_base: state.order_base,
        order_charge: state.order_charge,
        order_goods: state.order_goods,
        order_service: state.order_service,
        change_orders: state.change_orders
    }),
    order_base: state => state.order_base,
    order_charge: state => state.order_charge,
    order_goods: state => state.order_goods,
    order_service: state => state.order_service,
    change_orders: state => state.change_orders,
    total: state => state.total,
    has_pay: state => state.has_pay,


}

export default {
    state,
    actions,
    mutations,
    getters
}