import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import './ModalUser.scss';

const INITIAL_STATE = {
    email: '',
    password: '',
    fullname: '',
    address: '',
    phone: '',
    gender: 'male',
    role: 'customer',
};

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        this._clearHandler = () => this.setState({ ...INITIAL_STATE });
        emitter.on('EVENT_CLEAR_MODAL_DATA', this._clearHandler);
    }

    componentWillUnmount() {
        emitter.off('EVENT_CLEAR_MODAL_DATA', this._clearHandler);
    }

    onChange = (e, field) => {
        this.setState({ [field]: e.target.value });
    }

    checkValidate = () => {
        const required = ['email', 'password', 'fullname'];
        for (let field of required) {
            if (!this.state[field]) {
                alert('Thiếu thông tin: ' + field);
                return false;
            }
        }
        return true;
    }

    handleSubmit = () => {
        if (this.checkValidate()) {
            this.props.createNewUser(this.state);
        }
    }

    render() {
        const { isOpen, toggleFromParent } = this.props;
        return (
            <Modal isOpen={isOpen} toggle={toggleFromParent} className="mu-modal" size="lg" backdrop="static">

                <div className="mu-header">
                    <div className="mu-header-left">
                        <i className="fas fa-user-plus mu-header-icon" />
                        <div>
                            <div className="mu-header-title">Thêm người dùng</div>
                            <div className="mu-header-sub">Điền thông tin tài khoản mới</div>
                        </div>
                    </div>
                    <button className="mu-close-btn" onClick={toggleFromParent}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                <ModalBody>
                    <div className="mu-form">

                        <div className="mu-section-label">Tài khoản</div>

                        <div className="mu-row">
                            <div className="mu-group">
                                <label className="mu-label">Email <span>*</span></label>
                                <input
                                    type="email"
                                    className="mu-input"
                                    value={this.state.email}
                                    onChange={e => this.onChange(e, 'email')}
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div className="mu-group">
                                <label className="mu-label">Mật khẩu <span>*</span></label>
                                <input
                                    type="password"
                                    className="mu-input"
                                    value={this.state.password}
                                    onChange={e => this.onChange(e, 'password')}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="mu-section-label">Thông tin cá nhân</div>

                        <div className="mu-group mu-full">
                            <label className="mu-label">Họ và tên <span>*</span></label>
                            <input
                                type="text"
                                className="mu-input"
                                value={this.state.fullname}
                                onChange={e => this.onChange(e, 'fullname')}
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        <div className="mu-group mu-full">
                            <label className="mu-label">Địa chỉ</label>
                            <input
                                type="text"
                                className="mu-input"
                                value={this.state.address}
                                onChange={e => this.onChange(e, 'address')}
                                placeholder="Số nhà, đường, quận, thành phố..."
                            />
                        </div>

                        <div className="mu-row">
                            <div className="mu-group">
                                <label className="mu-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="mu-input"
                                    value={this.state.phone}
                                    onChange={e => this.onChange(e, 'phone')}
                                    placeholder="0901 234 567"
                                />
                            </div>
                            <div className="mu-group">
                                <label className="mu-label">Giới tính</label>
                                <select className="mu-input" value={this.state.gender} onChange={e => this.onChange(e, 'gender')}>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="mu-section-label">Phân quyền</div>

                        <div className="mu-role-row">
                            {[
                                { value: 'customer', label: 'Customer', sub: 'Khách hàng mua sắm', icon: 'fas fa-shopping-bag' },
                                { value: 'staff',    label: 'Staff',    sub: 'Nhân viên quản lý',  icon: 'fas fa-headset' },
                                { value: 'admin',    label: 'Admin',    sub: 'Toàn quyền hệ thống', icon: 'fas fa-shield-alt' },
                            ].map(r => {
                                const isDisabled = this.props.userRole === 'staff' && r.value !== 'customer';
                                return (
                                    <div
                                        key={r.value}
                                        className={[
                                            'mu-role-card',
                                            this.state.role === r.value ? 'active' : '',
                                            isDisabled ? 'disabled' : '',
                                        ].filter(Boolean).join(' ')}
                                        onClick={() => !isDisabled && this.setState({ role: r.value })}
                                    >
                                        <i className={`${r.icon} mu-role-icon`} />
                                        <div className="mu-role-name">{r.label}</div>
                                        <div className="mu-role-sub">
                                            {isDisabled ? 'Không có quyền' : r.sub}
                                        </div>
                                        {isDisabled && <i className="fas fa-lock mu-role-lock" />}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </ModalBody>

                <ModalFooter>
                    <button className="mu-btn-cancel" onClick={toggleFromParent}>Huỷ</button>
                    <button className="mu-btn-submit" onClick={this.handleSubmit}>
                        <i className="fas fa-user-plus" /> Tạo tài khoản
                    </button>
                </ModalFooter>

            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    userRole: state.user.userInfo?.role,
});

export default connect(mapStateToProps)(ModalUser);
