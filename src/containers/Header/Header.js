import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../utils';
import * as actions from '../../store/actions';
import './Header.scss';

class Header extends Component {

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <div className="adm-topbar">
                <div className="adm-topbar-left">
                    <span className="adm-welcome">
                        Xin chào, <strong>{userInfo?.fullname || 'Admin'}</strong>
                    </span>
                </div>

                <div className="adm-topbar-right">
                    <span
                        className={`adm-lang${language === LANGUAGES.VI ? ' active' : ''}`}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                    >VN</span>
                    <span className="adm-lang-sep">|</span>
                    <span
                        className={`adm-lang${language === LANGUAGES.EN ? ' active' : ''}`}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                    >EN</span>

                    <button className="adm-logout-btn" onClick={processLogout} title="Đăng xuất">
                        <i className="fas fa-sign-out-alt" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
