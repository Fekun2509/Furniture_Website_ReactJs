import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './HomeHeader.scss'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils'

import { changeLanguageApp } from '../../../store/actions';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = { scrolled: false };
    }

    componentDidMount() {
        window.addEventListener('scroll', this._onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._onScroll);
    }

    _onScroll = () => {
        this.setState({ scrolled: window.scrollY > 40 });
    };


    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
        console.log('check props: ', this.props)
        //fire redux event: actions
    }

    render() {
        const { scrolled } = this.state;
        let language = this.props.language;
        console.log('check userInfo: ', this.props.userInfo)
        return (
            <nav className={`gg-nav${scrolled ? ' scrolled' : ''}`}>
                <a href="#" className="gg-nav-logo">
                    GAMING<span>_</span>GEAR
                </a>

                <ul className="gg-nav-links">
                    <li><a href="#categories">Bàn</a></li>
                    <li><a href="#categories">Ghế</a></li>
                    <li><a href="#featured">Combo</a></li>
                    <li><a href="#features">Thông số</a></li>
                </ul>

                <div className="gg-nav-right">
                    {/* Cart icon */}
                    <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span></div>
                    <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                    <div className="gg-nav-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                    </div>
                    {/* User icon */}
                    <div className="gg-nav-icon">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 10-16 0" />
                        </svg>
                    </div>
                </div>
            </nav>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
