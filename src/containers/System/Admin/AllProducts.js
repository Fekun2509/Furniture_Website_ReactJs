import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./AllProducts.scss"
import * as actions from '../../../store/actions';
import ModalNewProduct from './ModalNewProduct';
import ModalEditProduct from './ModalEditProduct';
import { ROLES } from '../../../utils/roles';

class AllProducts extends Component {

    constructor(props) {
        super(props)
        this.state = {
            productRedux: [],
            categoryRedux: [],
            isOpenModalProduct: false,
            isOpenModalEdit: false,
            productEdit: null,
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


    getCategoryName(categoryId) {
        const cat = this.state.categoryRedux.find(c => c.id === categoryId);
        return cat ? cat.name : '—';
    }

    getImages(item) {
        if (!item.image) return [];
        try {
            const parsed = typeof item.image === 'string' ? JSON.parse(item.image) : item.image;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    formatPrice(price) {
        if (price === null || price === undefined || price === '') return '—';
        return Number(price).toLocaleString('vi-VN') + ' ₫';
    }

    renderPrice(item) {
        const base = Number(item.base_price);
        const sell = Number(item.sell_price);
        const hasDiscount = sell > 0 && base > 0 && sell < base;
        const pct = hasDiscount ? Math.round((1 - sell / base) * 100) : 0;
        return (
            <div className="ap-price-cell">
                <span className="ap-sell-price">{this.formatPrice(sell || base)}</span>
                {hasDiscount && (
                    <>
                        <span className="ap-base-price">{this.formatPrice(base)}</span>
                        <span className="ap-discount-badge">-{pct}%</span>
                    </>
                )}
            </div>
        );
    }

    renderStock(stock) {
        if (stock === null || stock === undefined || stock === '') return <span className="ap-stock out">—</span>;
        const n = Number(stock);
        const cls = n === 0 ? 'out' : n <= 5 ? 'low' : 'in';
        const label = n === 0 ? '0' : `${n}`;
        return <span className={`ap-stock ${cls}`}>{label}</span>;
    }

    toggleModalProduct = () => {
        this.setState(prev => ({ isOpenModalProduct: !prev.isOpenModalProduct }));
    }

    toggleModalEdit = () => {
        this.setState(prev => ({ isOpenModalEdit: !prev.isOpenModalEdit }));
    }

    handleProductCreated = () => {
        this.props.fetchProductRedux();
    }

    handleEditClick = (product) => {
        this.setState({ productEdit: product, isOpenModalEdit: true });
    }

    handleDeleteClick = async (product) => {
        if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
        const res = await this.props.deleteProduct(product.id);
        if (res && res.errCode === 0) {
            this.props.fetchProductRedux();
        } else {
            alert('Xóa thất bại, vui lòng thử lại.');
        }
    }

    render() {
        const { filterCategoryId, filterPromo } = this.props;

        const arrProducts = filterPromo
            ? this.state.productRedux.filter(p => p.sell_price && Number(p.sell_price) < Number(p.base_price))
            : filterCategoryId
                ? this.state.productRedux.filter(p => String(p.category_id) === String(filterCategoryId))
                : this.state.productRedux;

        const categoryName = filterPromo
            ? 'On Sale'
            : filterCategoryId
                ? (this.state.categoryRedux.find(c => String(c.id) === String(filterCategoryId))?.name || '')
                : null;

        return (
            <div className="ap-page">
                <ModalNewProduct
                    isOpen={this.state.isOpenModalProduct}
                    toggleFromParent={this.toggleModalProduct}
                    onCreated={this.handleProductCreated}
                />
                <ModalEditProduct
                    isOpen={this.state.isOpenModalEdit}
                    toggleFromParent={this.toggleModalEdit}
                    product={this.state.productEdit}
                    onEdited={this.handleProductCreated}
                />

                <div className="ap-header">
                    <div className="ap-title">
                        {filterPromo
                            ? <>On <span>Sale</span></>
                            : categoryName
                                ? <>{categoryName}</>
                                : <>All <span>Products</span></>
                        }
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="ap-count">{arrProducts.length} items</div>
                        <button className="ap-add-btn" onClick={this.toggleModalProduct}>
                            <i className="fas fa-plus" />
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="ap-card">
                    <table className="ap-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrProducts && arrProducts.length > 0 ? arrProducts.map((item, index) => {
                                const images = this.getImages(item);
                                const previewImgs = images.slice(0, 2);
                                const extra = images.length - 2;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <span className="ap-category-badge">{this.getCategoryName(item.category_id)}</span>
                                        </td>
                                        <td className="ap-product-name">{item.name}</td>
                                        <td className="ap-desc">{item.description}</td>
                                        <td>{this.renderPrice(item)}</td>
                                        <td>{this.renderStock(item.stock_qty)}</td>
                                        <td>
                                            <div className="ap-images">
                                                {previewImgs.map((img, i) => (
                                                    <img key={i} className="ap-thumb" src={img} alt="" />
                                                ))}
                                                {extra > 0 && <div className="ap-thumb-more">+{extra}</div>}
                                                {images.length === 0 && <span style={{ color: '#333', fontSize: '0.7rem' }}>—</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ap-actions">
                                                <button className="ap-icon-btn edit" title="Sửa" onClick={() => this.handleEditClick(item)}>
                                                    <i className="fas fa-pencil-alt" />
                                                </button>
                                                <button className="ap-icon-btn delete" title="Xóa" onClick={() => this.handleDeleteClick(item)}>
                                                    <i className="fas fa-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr><td colSpan="7" className="ap-empty">No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    listProducts: state.product.products,
    listCategories: state.product.categories,
});

const mapDispatchToProps = dispatch => {
    return {
        fetchProductRedux: () => dispatch(actions.fetchAllProductStart()),
        fetchCategoryredux: () => dispatch(actions.fetchCategoryStart()),
        deleteProduct: (id) => dispatch(actions.deleteProduct(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts);
