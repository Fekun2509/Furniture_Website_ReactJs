import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import './ModalUser.scss';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            fullname: '',
            address: '',
            phone: '',
            gender: 'male',
            role: 'customer',
        };
    }

    componentDidMount() {
        this.fillFromProps(this.props.currentUser);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentUser !== this.props.currentUser) {
            this.fillFromProps(this.props.currentUser);
        }
    }

    fillFromProps(user) {
        if (!user) return;
        this.setState({
            id:       user.id       || '',
            email:    user.email    || '',
            fullname: user.fullname || '',
            address:  user.address  || '',
            phone:    user.phone    || '',
            gender:   user.gender   || 'male',
            role:     user.role     || 'customer',
        });
    }

    onChange = (e, field) => {
        this.setState({ [field]: e.target.value });
    }

    checkValidate = () => {
        if (!this.state.fullname) {
            alert('Thiếu thông tin: họ và tên');
            return false;
        }
        return true;
    }

    handleSubmit = () => {
        if (this.checkValidate()) {
            this.props.editUser(this.state);
        }
    }

    render() {
        const { isOpen, toggleFromParent, userRole } = this.props;
        const isStaff = userRole === 'staff';

        return (
            <Modal isOpen={isOpen} toggle={toggleFromParent} className="mu-modal" size="lg" backdrop="static">

                <div className="mu-header">
                    <div className="mu-header-left">
                        <i className="fas fa-user-edit mu-header-icon" />
                        <div>
                            <div className="mu-header-title">Chỉnh sửa người dùng</div>
                            <div className="mu-header-sub">{this.state.email}</div>
                        </div>
                    </div>
                    <button className="mu-close-btn" onClick={toggleFromParent}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                <ModalBody>
                    <div className="mu-form">

                        <div className="mu-section-label">Thông tin cá nhân</div>

                        <div className="mu-group mu-full">
                            <label className="mu-label">Email</label>
                            <input
                                type="email"
                                className="mu-input"
                                value={this.state.email}
                                disabled
                                style={{ opacity: 0.4, cursor: 'not-allowed' }}
                            />
                        </div>

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
                                { value: 'customer', label: 'Customer', sub: 'Khách hàng mua sắm',  icon: 'fas fa-shopping-bag' },
                                { value: 'staff',    label: 'Staff',    sub: 'Nhân viên quản lý',   icon: 'fas fa-headset' },
                                { value: 'admin',    label: 'Admin',    sub: 'Toàn quyền hệ thống', icon: 'fas fa-shield-alt' },
                            ].map(r => {
                                const isDisabled = isStaff && r.value !== 'customer';
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
                        <i className="fas fa-save" /> Lưu thay đổi
                    </button>
                </ModalFooter>

            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    userRole: state.user.userInfo?.role,
});

export default connect(mapStateToProps)(ModalEditUser);
