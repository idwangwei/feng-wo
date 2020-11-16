const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    auth: state => state.user.authArr,
    pubkey: state => state.app.pubkey,
    name: state => state.user.name
};
export default getters;
