const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    auth: state => state.user.authArr,
    name: state => state.user.name
};
export default getters;
