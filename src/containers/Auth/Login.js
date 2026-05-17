import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { userService } from '../../services/';
import Cursor from '../Cursor/Cursor';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const GoogleLoginBtn = ({ onSuccess, onError, loading }) => {
    const login = useGoogleLogin({ onSuccess, onError });
    return (
        <button className="lf-social-btn lf-social-google" onClick={() => login()} disabled={loading}>
            <GoogleIcon />
            <span>Đăng nhập với Google</span>
        </button>
    );
};


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
            loading: false
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }


    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    redirectByRole = (user) => {
        const role = user?.role;
        if (role === 'admin' || role === 'staff') {
            this.props.navigate('/system');
        } else {
            this.props.navigate('/home');
        }
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' });
        try {
            let data = await userService.handleLogin(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({ errMessage: data.message });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                this.redirectByRole(data.user);
            }
        } catch (error) {
            if (error.response?.data) {
                this.setState({ errMessage: error.response.data.message });
            }
        }
    }


    handleShowHidPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword })
    }

    handleGoogleSuccess = async (tokenResponse) => {
        try {
            let data = await userService.handleGoogleLogin(tokenResponse.access_token);
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                this.redirectByRole(data.user);
            } else {
                this.setState({ errMessage: data.message || 'Đăng nhập Google thất bại' });
            }
        } catch (e) {
            this.setState({ errMessage: 'Đăng nhập Google thất bại' });
        }
    }

    handleGoogleError = () => {
        this.setState({ errMessage: 'Đăng nhập Google thất bại' });
    }

    handleFacebookCallback = async (response) => {
        if (!response.accessToken) {
            this.setState({ errMessage: `Facebook: ${response.status || 'Đăng nhập thất bại'}` });
            return;
        }
        try {
            let data = await userService.handleFacebookLogin(response.accessToken, response.userID);
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
                this.redirectByRole(data.user);
            } else {
                this.setState({ errMessage: data.message || 'Đăng nhập Facebook thất bại' });
            }
        } catch (e) {
            this.setState({ errMessage: 'Đăng nhập Facebook thất bại' });
        }
    }

    render() {
        return (
            <>
                <Cursor></Cursor>
                <div className="lf-page">
                    {/* Background grid */}
                    <div className="lf-bg-grid" aria-hidden="true" />
                    {/* Bottom ambient glow */}
                    <div className="lf-glow" aria-hidden="true" />

                    <div className="lf-card">
                        {/* Top accent line */}
                        <div className="lf-card-top-line" aria-hidden="true" />

                        {/* ── Header ── */}
                        <header className="lf-header">
                            <a href="/" className="lf-logo">
                                GAMING<span>_</span>GEAR
                            </a>
                            <div className="lf-divider" aria-hidden="true">
                                <span />
                            </div>
                            <p className="lf-subtitle">● Đăng Nhập Hệ Thống</p>
                        </header>

                        {/* ── Form ── */}
                        {/* <form onSubmit={this.handleSubmit} noValidate> */}

                        {/* Username / Email */}
                        <div className="lf-field">
                            <label className="lf-label" htmlFor="identifier">
                                Tên đăng nhập
                            </label>
                            <div className="lf-input-wrap">
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    className="lf-input"
                                    placeholder="username hoặc email"
                                    // value={identifier}
                                    onChange={(event) => this.handleOnChangeUsername(event)}
                                // autoComplete="username"
                                />
                                <span className="lf-input-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="lf-field">
                            <label className="lf-label" htmlFor="password">
                                Mật khẩu
                            </label>
                            <div className="lf-input-wrap">
                                <input
                                    id="password"
                                    name="password"
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className="lf-input"
                                    // placeholder="••••••••"
                                    // value={password}
                                    placeholder='Enter your password'
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                // autoComplete="current-password"
                                />
                                <span
                                    type="button"
                                    className="lf-eye-btn"
                                    onClick={() => this.handleShowHidPassword()}
                                // aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                >
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"} style={{ color: '#333' }}></i>
                                </span>
                            </div>
                        </div>

                        {/* Error message */}
                        {this.state.errMessage && (
                            <p className="lf-error" role="alert">
                                {this.state.errMessage}
                            </p>
                        )}

                        {/* Forgot password */}
                        <div className="lf-forgot">
                            <a href="/forgot-password">Quên mật khẩu?</a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`lf-submit${this.state.loading ? ' lf-submit--loading' : ''}`}
                            disabled={this.state.loading} onClick={() => { this.handleLogin() }}
                        >
                            {this.state.loading ? <span className="lf-spinner" aria-hidden="true" /> : 'Đăng Nhập'}
                        </button>

                        {/* <div className='col-12'>
                                <button className={`lf-submit${this.state.loading ? ' lf-submit--loading' : ''}`} onClick={() => { this.handleLogin() }}>Login</button>
                            </div> */}
                        {/* </form> */}

                        {/* ── Social login ── */}
                        <div className="lf-social-divider">
                            <span>hoặc tiếp tục với</span>
                        </div>

                        <div className="lf-social-row">
                            <GoogleLoginBtn
                                onSuccess={this.handleGoogleSuccess}
                                onError={this.handleGoogleError}
                                loading={this.state.loading}
                            />
                            <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                                callback={this.handleFacebookCallback}
                                scope="public_profile,email"
                                fields="name,email"
                                render={renderProps => (
                                    <button
                                        className="lf-social-btn lf-social-facebook"
                                        onClick={renderProps.onClick}
                                        disabled={this.state.loading}
                                    >
                                        <FacebookIcon />
                                        <span>Đăng nhập với Facebook</span>
                                    </button>
                                )}
                            />
                        </div>

                        {/* ── Footer ── */}
                        <footer className="lf-footer">
                            <span>Chưa có tài khoản?</span>
                            <a href="/register">Đăng ký ngay →</a>
                        </footer>
                    </div>
                </div>
            </>

            // <div className='login-background'>
            //     <div className='login-container'>
            //         <div className='login-content row'>
            //             <div className='col12 text-login' >Login</div>
            //             <div className='col12 form-group login-input'>
            //                 <label>Username:</label>
            //                 <input type='text' className='form-control' placeholder='Enter your username' onChange={(event) => this.handleOnChangeUsername(event)} />
            //             </div>
            //             <div className='col12 form-group login-input'>
            //                 <label>Password:</label>
            //                 <div className='custom-input-password'>
            //                     <input type={this.state.isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Enter your password' onChange={(event) => this.handleOnChangePassword(event)} />
            //                     <span onClick={() => this.handleShowHidPassword()}><i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i></span>
            //                 </div>
            //             </div>
            //             <div className='col-12' style={{ color: 'red' }}>
            //                 {this.state.errMessage}
            //             </div>
            //             <div className='col-12'>
            //                 <button className='btn-login' onClick={() => { this.handleLogin() }}>Login</button>
            //             </div>

            //             <div className='col-12 text-center'>
            //                 <span className='forgot-passwords'>Forgot your password?</span>
            //             </div>
            //             <div className='col-12 text-center mt3'>
            //                 <span className='text-other-login'>Or login with:</span>
            //             </div>
            //             <div className='col-12 social-login'>
            //                 <i className="fab fa-google-plus-g google"></i>
            //                 <i className="fab fa-facebook-f facebook"></i>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),

        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
