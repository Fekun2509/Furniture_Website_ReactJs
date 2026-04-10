import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import userService from '../../services/userService';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: []
        }
    }

    async componentDidMount() {
        let response = await userService.getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            }, () => {
                console.log('check state user ', this.state.arrUsers)
            })
            console.log('check state user 1', this.state.arrUsers)
        }
        console.log('response: ', response.body)
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
                <div className='title text-center'>Manage users with Leo</div>
                <div className='usersTable mt-3 mx-1'>
                    <table>
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
                                            <button className='btn-edit'><i class="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete'><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }



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
