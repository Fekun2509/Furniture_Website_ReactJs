import React, { Component } from 'react';
import { HomeHeader, Cursor } from '../HomePage/Components';
import { Store } from './Components';

class StorePage extends Component {
    render() {
        return (
            <div>
                <HomeHeader />
                <Cursor />
                <Store />
            </div>
        );
    }
}

export default StorePage;
