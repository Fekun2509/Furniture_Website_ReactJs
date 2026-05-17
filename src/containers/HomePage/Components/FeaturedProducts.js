import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions';
import './FeaturedProducts.scss';

const BG_CLASSES = ['gg-img-bg-1', 'gg-img-bg-2', 'gg-img-bg-3', 'gg-img-bg-4'];
const DELAYS     = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'];

const CartIcon = () => (
    <svg viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

class FeaturedProducts extends Component {
    componentDidMount() {
        this.props.fetchProductRedux();
    }

    getFirstImage(product) {
        if (Array.isArray(product.image)) return product.image[0] || null;
        if (typeof product.image === 'string') {
            try { return JSON.parse(product.image)[0] || null; } catch { return null; }
        }
        return null;
    }

    formatPrice(price) {
        return (parseFloat(price) || 0).toLocaleString('vi-VN') + '₫';
    }

    getDiscount(base, sell) {
        const b = parseFloat(base) || 0;
        const s = parseFloat(sell) || 0;
        if (b > 0 && s > 0 && s < b) return Math.round((1 - s / b) * 100);
        return null;
    }

    handleCardClick = (product) => {
        this.props.history.push(`/product/${product.id}`, { product });
    }

    handleAddCart = (e, product) => {
        e.stopPropagation();
        this.props.cartAddItem(product, 1);
    }

    render() {
        const { listProducts } = this.props;
        const featured = (listProducts || []).slice(0, 4);

        return (
            <section className="gg-featured" id="featured">
                <div className="gg-section-head">
                    <div className="section-title-group">
                        <div className="sec-overline"><span>●</span> Sản phẩm nổi bật</div>
                        <div className="sec-title">Đơn vị nổi bật</div>
                    </div>
                    <a href="/store" className="gg-view-all">Xem tất cả →</a>
                </div>

                <div className="gg-products-row">
                    {featured.length === 0 ? (
                        /* Skeleton khi chưa load xong */
                        [0, 1, 2, 3].map(i => (
                            <div key={i} className={`gg-prod-card gg-prod-skeleton reveal ${DELAYS[i]}`}>
                                <div className="gg-prod-img gg-skeleton-img" />
                                <div className="gg-prod-body">
                                    <div className="gg-skeleton-line" />
                                    <div className="gg-skeleton-line short" />
                                </div>
                            </div>
                        ))
                    ) : (
                        featured.map((p, i) => {
                            const image    = this.getFirstImage(p);
                            const discount = this.getDiscount(p.base_price, p.sell_price);
                            const inStock  = (parseInt(p.stock_qty) || 0) > 0;

                            return (
                                <div
                                    key={p.id}
                                    className={`gg-prod-card reveal ${DELAYS[i]}`}
                                    onClick={() => this.handleCardClick(p)}
                                >
                                    <div className={`gg-prod-img ${BG_CLASSES[i]}`}>
                                        {discount !== null && (
                                            <div className="gg-prod-tag gg-tag-sale">-{discount}%</div>
                                        )}
                                        {!inStock && (
                                            <div className="gg-prod-tag gg-tag-out">Hết hàng</div>
                                        )}
                                        {image ? (
                                            <div
                                                className="gg-cat-inline-art"
                                                style={{ backgroundImage: `url(${image})` }}
                                            />
                                        ) : (
                                            <div className="gg-prod-no-img">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <path d="M21 15l-5-5L5 21" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="gg-prod-body">
                                        <div className="gg-prod-name">{p.name}</div>
                                        <div className="gg-prod-footer">
                                            <div className="gg-prod-prices">
                                                <span className="gg-prod-price-main">
                                                    {this.formatPrice(p.sell_price)}
                                                </span>
                                                {discount !== null && (
                                                    <span className="gg-prod-price-base">
                                                        {this.formatPrice(p.base_price)}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className="gg-add-cart-btn"
                                                aria-label="Thêm vào giỏ"
                                                disabled={!inStock}
                                                onClick={(e) => this.handleAddCart(e, p)}
                                            >
                                                <CartIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({
    listProducts: state.product.products,
});

const mapDispatchToProps = dispatch => ({
    fetchProductRedux: () => dispatch(actions.fetchAllProductStart()),
    cartAddItem: (product, qty) => dispatch(actions.cartAddItem(product, qty)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FeaturedProducts));
