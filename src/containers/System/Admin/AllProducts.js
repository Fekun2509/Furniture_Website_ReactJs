import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Cursor from '../../Cursor/Cursor';
import "./AllProducts.scss"
import * as actions from '../../../store/actions';
class AllProducts extends Component {

    constructor(props) {
        super(props)
        this.state = {
            productRedux: [],
            categoryRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchProductRedux()
        this.props.fetchCategoryredux()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listProducts !== this.props.listProducts) {
            this.setState({
                productRedux: this.props.listProducts
            })
        }

        if (prevProps.listCategories !== this.props.listCategories) {
            this.setState({
                categoryRedux: this.props.listCategories
            })
        }
    }


    render() {
        console.log('check all products', this.props.listProducts)
        console.log('check state', this.state.productRedux)
        console.log('check all categories', this.props.listCategories)
        console.log('check state categories', this.state.categoryRedux)
        let arrProducts = this.state.productRedux
        let arrCategories = this.state.categoryRedux

        return (
            <div className='all-products'>
                {/* <Cursor></Cursor> */}
                <div className="title" >All Products</div>

                <table>
                    <tbody>
                        <tr>
                            <th className='col-2'>Category</th>
                            <th className='col-2'>Name</th>
                            <th className='col-2'>Description</th>
                            <th className='col-5'>Images</th>
                            <th className='col-2'>Actions</th>

                        </tr>

                        {arrProducts && arrProducts.length > 0 &&

                            arrProducts.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {arrCategories && arrCategories.length > 0 &&
                                            arrCategories.map((c, i) => {
                                                if (item.category_id === c.id)
                                                    return (
                                                        <td >{c.name}</td>
                                                    )
                                            })
                                        }
                                        {/* <td >{item.category_id}</td> */}
                                        <td >{item.name}</td>
                                        <td >{item.description}</td>
                                        <td >{item.image && item.image.length > 0 &&
                                            item.image.map((image, i) => {
                                                return (
                                                    <img className='preview-image' key={i} src={image} />
                                                )

                                            })
                                        }</td>

                                        <td >
                                            <button className='btn-edit' ><i className="fas fa-pencil-alt"></i></button>
                                            <button className='btn-delete' ><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }



                    </tbody>



                </table>
            </div>

        )
    }

}

const mapStateToProps = state => {
    return {
        listProducts: state.product.products,
        listCategories: state.product.categories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchProductRedux: () => dispatch(actions.fetchAllProductStart()),
        fetchCategoryredux: () => dispatch(actions.fetchCategoryStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts);
