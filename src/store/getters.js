const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    winHeight: state => state.app.winHeight,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    userInfo: state => state.user.userInfo,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes,
    access_token: state => state.user.access_token,
    refresh_token: state => state.user.refresh_token,
    expires_in: state => state.user.expires_in,
    permissions: state => state.user.permissions,
    menu: state => state.user.menu,
    menuAll: state => state.user.menuAll,
    oss_url: state => state.user.oss_url
}
export default getters
