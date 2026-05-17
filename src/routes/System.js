import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import AllProducts from '../containers/System/Admin/AllProducts';
import Header from '../containers/Header/Header';
import Navigator from '../components/Navigator';
import Cursor from '../containers/Cursor/Cursor';
import { adminMenu, staffMenu } from '../containers/Header/menuApp';
import * as actions from '../store/actions';
import './System.scss';

class System extends Component {

    componentDidMount() {
        this.props.fetchCategoryStart();
    }

    defaultPath() {
        const { userInfo } = this.props;
        if (userInfo?.role === 'admin') return '/system/users/admin';
        if (userInfo?.role === 'staff') return '/system/users/customer';
        return '/system/all-products';
    }

    buildMenu(baseMenu, categories) {
        if (!categories || categories.length === 0) return baseMenu;

        const categorySubMenus = categories.map(c => ({
            rawName: c.name,
            link: `/system/products/category/${c.id}`,
        }));

        return baseMenu.map(group => {
            const isProductGroup = group.name === 'menu.admin.products-manage';
            if (!isProductGroup) return group;
            return {
                ...group,
                menus: [
                    ...group.menus,
                    {
                        name: 'menu.admin.sub-menus.products-manage-categories',
                        subMenus: categorySubMenus,
                    },
                ],
            };
        });
    }

    render() {
        const { userInfo, categories } = this.props;
        const role = userInfo?.role;
        const isAdmin = role === 'admin';
        const baseMenu = isAdmin ? adminMenu : staffMenu;
        const menu = this.buildMenu(baseMenu, categories);

        return (
            <div className="sys-layout">
                <Cursor />

                <aside className="sys-sidebar">
                    <div className="sys-brand">
                        <a href="/home" className="sys-brand-logo">
                            GAMING<em>_</em>GEAR
                        </a>
                        <span className="sys-brand-tag">{isAdmin ? 'ADMIN' : 'STAFF'}</span>
                    </div>
                    <nav className="sys-nav">
                        <Navigator menus={menu} />
                    </nav>
                </aside>

                <div className="sys-main">
                    <Header />
                    <div className="sys-content">
                        <Switch>
                            {/* User lists by role */}
                            <Route path="/system/users/admin"
                                render={() => isAdmin
                                    ? <UserManage filterRole="admin" />
                                    : <Redirect to={this.defaultPath()} />
                                }
                            />
                            <Route path="/system/users/staff"
                                render={() => isAdmin
                                    ? <UserManage filterRole="staff" />
                                    : <Redirect to={this.defaultPath()} />
                                }
                            />
                            <Route path="/system/users/customer"
                                component={() => <UserManage filterRole="customer" />}
                            />

                            {/* Promotions */}
                            <Route path="/system/products/promotions"
                                render={() => <AllProducts filterPromo />}
                            />

                            {/* Products by category */}
                            <Route path="/system/products/category/:categoryId"
                                render={({ match }) =>
                                    <AllProducts filterCategoryId={match.params.categoryId} />
                                }
                            />

                            {/* Legacy redirect */}
                            <Route path="/system/user-manage"
                                render={() => <Redirect to={isAdmin ? '/system/users/admin' : '/system/users/customer'} />}
                            />

                            <Route path="/system/all-products" component={AllProducts} />

                            <Route component={() => <Redirect to={this.defaultPath()} />} />
                        </Switch>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.user.userInfo,
    categories: state.product.categories,
});

const mapDispatchToProps = dispatch => ({
    fetchCategoryStart: () => dispatch(actions.fetchCategoryStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(System);
