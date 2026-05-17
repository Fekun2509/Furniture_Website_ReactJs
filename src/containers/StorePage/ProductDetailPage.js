import React, { Component } from 'react';
import { HomeHeader, Cursor } from '../HomePage/Components';
import { ProductDetail } from './Components';

class ProductDetailPage extends Component {
    render() {
        return (
            <div>
                <HomeHeader />
                <Cursor />
                <ProductDetail />
            </div>
        );
    }
}

export default ProductDetailPage;
