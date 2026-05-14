import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash'

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fullname: '',
            address: '',
            phone: '',
            gender: '',
            role: ''
        }
    }



    componentDidMount() {
        let user = this.props.currentUser
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hardcode',
                fullname: user.fullname,
                address: user.address,
                phone: user.phone,
                gender: user.gender,
                role: user.role
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true
        let arrInput = ['email', 'password', 'fullname', 'address']
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false
                alert('Missing parameter: ' + arrInput[i])
                break
            }
        }
        return isValid;
    }

    handleSaveUSer = () => {

        let isValid = this.checkValidateInput()
        if (isValid === true) {
            this.props.editUser(this.state);
        }

    }



    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={() => { this.toggle() }} className={'modal-user-container'} size='lg'>
                <ModalHeader toggle={() => { this.toggle() }}>Edit a new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input type="text" onChange={(event) => { this.handleOnchangeInput(event, "email") }} value={this.state.email} disabled />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type="password" onChange={(event) => { this.handleOnchangeInput(event, "password") }} value={this.state.password} disabled />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Fullname</label>
                            <input type="text" onChange={(event) => { this.handleOnchangeInput(event, "fullname") }} value={this.state.fullname} />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Address</label>
                            <input type="text" onChange={(event) => { this.handleOnchangeInput(event, "address") }} value={this.state.address} />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Phone</label>
                            <input type="text" onChange={(event) => { this.handleOnchangeInput(event, "phone") }} value={this.state.phone} />
                        </div>
                        <div className='input-container'>
                            <label>Gender</label>
                            <select id="inputGender" className="form-select" value={this.state.gender} onChange={(e) => this.setState({ gender: e.target.value })}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className='input-container'>
                            <label>Role</label>
                            <select id="inputRole" className="form-select" value={this.state.role} onChange={(e) => this.setState({ role: e.target.value })}>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="customer">Customer</option>
                            </select>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={() => { this.handleSaveUSer() }}>
                        Save changes
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={() => { this.toggle() }}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);




