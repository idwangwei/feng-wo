const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    statusList: state => state.app.merchantStatusList,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    role: state => state.user.role,
    isOperator: state => state.user.role === 'OPERATOR',
    commodityStatusList: state => {
        return state.commodity.commodityStatusList;
    },
    commodityBrandList: state => {
        return state.commodity.commodityBrandList;
    },
    carTypeList: state => {
        return state.commodity.carTypeList;
    }
};
export default getters;
