import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { HomeHeader, CaroulImage, Cursor, Categories, FeaturedProducts, Features, Testimonials, TransformBanner, Footer, ScrollReveal } from '../HomePage/Components'



class HomePage extends Component {

    render() {

        return (
            <div>
                <ScrollReveal>
                    <HomeHeader></HomeHeader>
                    <Cursor></Cursor>
                    <CaroulImage></CaroulImage>
                    <Categories></Categories>
                    <FeaturedProducts></FeaturedProducts>
                    <TransformBanner></TransformBanner>
                    <Features></Features>
                    <Footer></Footer>
                </ScrollReveal>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
