import React, { Component } from 'react';
import { connect } from 'react-redux';

import './HomeHeader.scss'
import { LANGUAGES } from '../../../utils'
import { changeLanguageApp, cartToggleDrawer, processLogout } from '../../../store/actions';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { scrolled: false, userMenuOpen: false };
        this.userMenuRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('scroll', this._onScroll);
        document.addEventListener('mousedown', this._onClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._onScroll);
        document.removeEventListener('mousedown', this._onClickOutside);
    }

    _onScroll = () => {
        this.setState({ scrolled: window.scrollY > 40 });
    };

    _onClickOutside = (e) => {
        if (this.userMenuRef.current && !this.userMenuRef.current.contains(e.target)) {
            this.setState({ userMenuOpen: false });
        }
    };

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    toggleUserMenu = () => {
        this.setState(s => ({ userMenuOpen: !s.userMenuOpen }));
    }

    render() {
        const { scrolled, userMenuOpen } = this.state;
        const { language, isLoggedIn, userInfo, cartCount, cartToggleDrawerRedux, processLogoutRedux } = this.props;

        return (
            <nav className={`gg-nav${scrolled ? ' scrolled' : ''}`}>
                <a href="/home" className="gg-nav-logo">
                    GAMING<span>_</span>GEAR
                </a>

                <ul className="gg-nav-links">
                    <li><a href="#categories">Bàn</a></li>
                    <li><a href="#categories">Ghế</a></li>
                    <li><a href="#featured">Combo</a></li>
                    <li><a href="#features">Thông số</a></li>
                </ul>

                <div className="gg-nav-right">
                    <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                        <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                    </div>
                    <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                        <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                    </div>

                    {/* Cart */}
                    <div className="gg-nav-icon gg-cart-icon" onClick={cartToggleDrawerRedux}>
                        <svg viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        {cartCount > 0 && <span className="gg-cart-badge">{cartCount}</span>}
                    </div>

                    {/* User */}
                    {isLoggedIn ? (
                        <div className="gg-user-menu" ref={this.userMenuRef}>
                            <button className="gg-user-btn" onClick={this.toggleUserMenu}>
                                <div className="gg-user-avatar">
                                    {userInfo?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="gg-user-name">{userInfo?.fullname || 'User'}</span>
                                <svg className={`gg-user-chevron${userMenuOpen ? ' open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {userMenuOpen && (
                                <div className="gg-user-dropdown">
                                    <div className="gg-user-dropdown-info">
                                        <div className="gg-user-dropdown-name">{userInfo?.fullname}</div>
                                        <div className="gg-user-dropdown-email">{userInfo?.email}</div>
                                    </div>
                                    <div className="gg-user-dropdown-divider" />
                                    <button className="gg-user-dropdown-item" onClick={processLogoutRedux}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login" className="gg-login-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M20 21a8 8 0 10-16 0" />
                            </svg>
                            <span>Đăng nhập</span>
                        </a>
                    )}
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
    cartCount: state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
});

const mapDispatchToProps = dispatch => ({
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    cartToggleDrawerRedux: () => dispatch(cartToggleDrawer()),
    processLogoutRedux: () => dispatch(processLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
