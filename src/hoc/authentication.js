import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false
});

// Chỉ admin và staff mới được vào /system — customer bị đá về /home
export const userIsAdminOrStaff = connectedRouterRedirect({
    authenticatedSelector: state => {
        const role = state.user.userInfo?.role;
        return role === 'admin' || role === 'staff';
    },
    wrapperDisplayName: 'UserIsAdminOrStaff',
    redirectPath: '/home',
});