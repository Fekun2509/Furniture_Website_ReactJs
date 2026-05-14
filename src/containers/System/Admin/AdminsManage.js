import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Cursor from '../../Cursor/Cursor';
class AdminsManage extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
    }


    render() {
        return (
            <div className='admins-manage'>
                <Cursor></Cursor>
                <div className="title" >Administrators</div>
                <div className='admins-manage-body'>
                    <div>Danh sách quản trị viên</div>
                </div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(AdminsManage);
