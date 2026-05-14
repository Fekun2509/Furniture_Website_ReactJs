import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { userService } from '../../services/';
import Cursor from '../Cursor/Cursor';


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

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await userService.handleLogin(this.state.username, this.state.password)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode == 0) {
                //todo
                this.props.userLoginSuccess(data.user)
                console.log('Login Success')
            }
        } catch (error) {

            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }

            console.log('error nay', error.response)
        }

    }


    handleShowHidPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
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
