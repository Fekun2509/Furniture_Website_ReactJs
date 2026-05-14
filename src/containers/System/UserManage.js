import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import userService from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
import Cursor from '../Cursor/Cursor';

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

    /* 
        Life cycle
        Run component:
        1.Run contructor -> init state
        2. Didmount() -> Set State
        3. render()
    
    
    
    */
    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className="users-container">
                {/* <Cursor></Cursor> */}
                <ModalUser isOpen={this.state.isOpenModalUser} toggleFromParent={this.toggleUserModal} createNewUser={this.createNewUser}>

                </ModalUser>

                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser isOpen={this.state.isOpenModalEditUser} toggleFromParent={this.toggleEditModal} currentUser={this.state.userEdit}
                        editUser={this.doEditUser}>

                    </ModalEditUser>
                }
                <div className='title text-center'>Manage users with Leo</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={() => this.handleAddNewUser()}><i className="fas fa-plus px-1"></i>Add new user</button>
                </div>

                <div className='usersTable mt-3 mx-1'>
                    <table>
                        <tbody>
                            <tr>
                                <th className='col-2'>Email</th>
                                <th className='col-2'>Full name</th>
                                <th className='col-2'>Address</th>
                                <th className='col-2'>Phone number</th>
                                <th className='col-1'>Gender</th>
                                <th className='col-1'>Role</th>
                                <th className='col-1'>Action</th>

                            </tr>

                            {
                                arrUsers && arrUsers.map((item, index) => {
                                    return (
                                        <tr className='divClass'>
                                            <td >{item.email}</td>
                                            <td >{item.fullname}</td>
                                            <td >{item.address}</td>
                                            <td >{item.phone}</td>
                                            <td >{item.gender}</td>
                                            <td >{item.role}</td>
                                            <td >
                                                <button className='btn-edit' onClick={() => this.handleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                                <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>



                    </table>

                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
