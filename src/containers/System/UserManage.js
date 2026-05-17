import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import userService from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
import { ROLES } from '../../utils/roles';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {

            }
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }


    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    getAllUsersFromReact = async () => {
        let response = await userService.getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await userService.createNewUserService(data)
            if (response && response.errCode !== 0) {
                alert(response.message)
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }

        } catch (e) {

            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await userService.deleteUserService(user.id)
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.message)
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            let res = await userService.editUserService(user)
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })

                await this.getAllUsersFromReact()
            } else {
                alert(res.message)
            }
        } catch (e) {
            console.log(e)
        }

    }

    render() {
        const { userRole, filterRole } = this.props;
        const isAdmin = userRole === ROLES.ADMIN;

        const arrUsers = filterRole
            ? this.state.arrUsers.filter(u => u.role === filterRole)
            : this.state.arrUsers;

        const TITLE_MAP = {
            admin:    <><span>Admin</span> List</>,
            staff:    <><span>Staff</span> List</>,
            customer: <>Customer <span>List</span></>,
        };

        return (
            <div className="um-page">
                <ModalUser isOpen={this.state.isOpenModalUser} toggleFromParent={this.toggleUserModal} createNewUser={this.createNewUser} />

                {this.state.isOpenModalEditUser && (
                    <ModalEditUser isOpen={this.state.isOpenModalEditUser} toggleFromParent={this.toggleEditModal} currentUser={this.state.userEdit}
                        editUser={this.doEditUser} />
                )}

                <div className="um-header">
                    <div className="um-title">
                        {TITLE_MAP[filterRole] || <><span>User</span> Management</>}
                    </div>
                    <button className="um-add-btn" onClick={() => this.handleAddNewUser()}>
                        <i className="fas fa-plus" />
                        Add User
                    </button>
                </div>

                <div className="um-card">
                    <table className="um-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                {isAdmin && <th>Role</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.length > 0 ? arrUsers.map((item, index) => (
                                <tr key={index}>
                                    <td className="um-td-email">{item.email}</td>
                                    <td className="um-td-name">{item.fullname}</td>
                                    <td>{item.address}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        <span className={`um-gender-badge ${item.gender}`}>
                                            {item.gender}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <span className={`um-role-badge ${item.role}`}>
                                                {item.role}
                                            </span>
                                        </td>
                                    )}
                                    <td>
                                        <div className="um-actions">
                                            <button className="um-icon-btn edit" onClick={() => this.handleEditUser(item)} title="Edit">
                                                <i className="fas fa-pencil-alt" />
                                            </button>
                                            <button className="um-icon-btn delete" onClick={() => this.handleDeleteUser(item)} title="Delete">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={isAdmin ? 7 : 6} className="um-empty">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    userRole: state.user.userInfo?.role,
});

export default connect(mapStateToProps)(UserManage);
