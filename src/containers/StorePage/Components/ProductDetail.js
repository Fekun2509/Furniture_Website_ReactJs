import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions';
import './ProductDetail.scss';

// Map hex → tên màu (dùng cho hiển thị)
const COLOR_MAP = {
    '#1C1C1E': 'Phantom Black',
    '#FFFFFF': 'Glacier White',
    '#D85A30': 'Ember Red',
    '#378ADD': 'Void Blue',
    '#3B6D11': 'Forest Green',
    '#BA7517': 'Titan Gold',
    '#993556': 'Neon Pink',
    '#B4B2A9': 'Steel Gray',
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const StarSVG = ({ filled }) => (
    <svg viewBox="0 0 12 12" className={`pd-star${filled ? ' on' : ''}`}>
        <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.5,11 6,9 2.5,11 3.5,7.5 1,5 4.5,4.5" />
    </svg>
);

const ArrowLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);
const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);
const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);
const TruckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v4h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);
const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
);
const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null,
            images: [],
            relatedProducts: [],
            activeThumb: 0,
            activeTab: 'desc',
            quantity: 1,
        };
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────

    componentDidMount() {
        this.props.fetchProductRedux();
        this.props.fetchCategoryRedux();
        this._loadProduct(this.props);
        window.scrollTo(0, 0);
    }

    componentDidUpdate(prevProps) {
        const idChanged = prevProps.match?.params?.id !== this.props.match?.params?.id;
        const productsLoaded = prevProps.listProducts !== this.props.listProducts;
        if (idChanged || productsLoaded) {
            this._loadProduct(this.props);
            if (idChanged) window.scrollTo(0, 0);
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    _loadProduct(props) {
        const { match, location, listProducts } = props;
        const id = match?.params?.id;
        let product = location?.state?.product;
        if (!product && listProducts?.length > 0) {
            product = listProducts.find(p => String(p.id) === String(id));
        }
        if (product) {
            const images = this._parseImages(product);
            const relatedProducts = (listProducts || [])
                .filter(p => p.category_id === product.category_id && String(p.id) !== String(id))
                .slice(0, 4);
            this.setState({ product, images, relatedProducts, activeThumb: 0 });
        }
    }

    _parseImages(product) {
        if (Array.isArray(product.image)) return product.image;
        if (typeof product.image === 'string') {
            try { return JSON.parse(product.image); } catch { return []; }
        }
        return [];
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

    getCategoryName(product) {
        const { listCategories } = this.props;
        if (!product || !listCategories) return '';
        return listCategories.find(c => String(c.id) === String(product.category_id))?.name || '';
    }

    getRatingBars(review) {
        const r = Math.round(parseFloat(review) || 0);
        if (r >= 5) return [72, 18, 7, 2, 1];
        if (r >= 4) return [45, 35, 12, 6, 2];
        if (r >= 3) return [20, 25, 35, 14, 6];
        if (r >= 2) return [5, 10, 20, 45, 20];
        return [2, 5, 15, 25, 53];
    }

    getChips(product) {
        const chips = [];
        if (product.material) chips.push({ label: product.material, hi: true });
        if (product.style) chips.push({ label: product.style, hi: true });
        if (product.weight) chips.push({ label: `${product.weight}g`, hi: false });
        if (product.stock_qty) chips.push({ label: `Còn ${product.stock_qty} sp`, hi: false });
        chips.push({ label: 'BH 36 tháng', hi: false });
        return chips;
    }

    renderStars(review) {
        const r = Math.round(parseFloat(review) || 0);
        return [1, 2, 3, 4, 5].map(i => <StarSVG key={i} filled={i <= r} />);
    }

    // ── Handlers ────────────────────────────────────────────────────────────

    handleRelatedClick = (p) => {
        this.props.history.push(`/product/${p.id}`, { product: p });
    };

    // ── Gallery ─────────────────────────────────────────────────────────────

    renderGallery() {
        const { images, activeThumb, product } = this.state;
        const discount = this.getDiscount(product.base_price, product.sell_price);
        const mainImg = images[activeThumb] || null;
        const LABELS = ['Front', 'Side', 'Detail', 'Setup'];

        return (
            <div className="pd-gallery">

                {/* Main image */}
                <div className="pd-gallery-main">
                    <div className="pd-grid-overlay" />
                    <div className="pd-glow-overlay" />
                    <div className="pd-scan-line" />
                    <div className="pd-corner tl" /><div className="pd-corner tr" />
                    <div className="pd-corner bl" /><div className="pd-corner br" />

                    {discount !== null
                        ? <div className="pd-img-badge badge-sale">−SALE</div>
                        : <div className="pd-img-badge badge-new">MỚI</div>
                    }

                    {mainImg ? (
                        <div className="pd-main-img" style={{ backgroundImage: `url(${mainImg})` }} />
                    ) : (
                        <div className="pd-no-img">
                            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8">
                                <rect x="4" y="4" width="40" height="40" rx="3" />
                                <circle cx="16" cy="16" r="5" />
                                <path d="M44 32L30 18 18 30 12 24 4 32" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="pd-thumbs">
                    {[0, 1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={`pd-thumb${activeThumb === i ? ' active' : ''}${!images[i] ? ' pd-thumb-empty' : ''}`}
                            onClick={() => images[i] && this.setState({ activeThumb: i })}
                        >
                            {images[i] ? (
                                <div className="pd-thumb-img" style={{ backgroundImage: `url(${images[i]})` }} />
                            ) : (
                                <div className="pd-thumb-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                </div>
                            )}
                            <span className="pd-thumb-label">{LABELS[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Info panel ──────────────────────────────────────────────────────────

    renderInfo() {
        const { product, quantity } = this.state;
        const discount    = this.getDiscount(product.base_price, product.sell_price);
        const catName     = this.getCategoryName(product);
        const chips       = this.getChips(product);
        const colorName   = COLOR_MAP[product.color] || product.color || null;
        const inStock     = (parseInt(product.stock_qty) || 0) > 0;
        const rating      = parseFloat(product.review || 0);
        const hasRating   = rating > 0;

        return (
            <div className="pd-info">

                {/* Category + SKU */}
                <div className="pd-cat-row">
                    <div className="pd-cat-dot" />
                    <span className="pd-cat-label">{catName}</span>
                    <span className="pd-sku">SKU: SG-{String(product.id || '000').padStart(3, '0')}</span>
                </div>

                {/* Product name */}
                <h1 className="pd-prod-name">{product.name}</h1>

                {/* Rating row */}
                <div className="pd-rating-row">
                    {hasRating ? (
                        <>
                            <div className="pd-stars">{this.renderStars(rating)}</div>
                            <span className="pd-rating-val">{rating.toFixed(1)}</span>
                            <div className="pd-rating-sep" />
                        </>
                    ) : (
                        <span className="pd-no-rating">Chưa được đánh giá</span>
                    )}
                    <div className={`pd-stock-tag${inStock ? ' in' : ' out'}`}>
                        <div className="pd-stock-dot" />
                        {inStock ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                </div>

                {/* Price block */}
                <div className="pd-price-block">
                    <span className="pd-price-sell">{this.formatPrice(product.sell_price)}</span>
                    {discount !== null && (
                        <>
                            <span className="pd-price-base">{this.formatPrice(product.base_price)}</span>
                            <span className="pd-price-save">−{discount}%</span>
                        </>
                    )}
                </div>

                {/* Description */}
                {product.description && (
                    <p className="pd-description">{product.description}</p>
                )}

                {/* Feature chips */}
                {chips.length > 0 && (
                    <div className="pd-chips">
                        {chips.map((c, i) => (
                            <span key={i} className={`pd-chip${c.hi ? ' hi' : ''}`}>{c.label}</span>
                        ))}
                    </div>
                )}

                <div className="pd-divider" />

                {/* Color */}
                {product.color && (
                    <div className="pd-color-block">
                        <div className="pd-opt-label">
                            Màu sắc — <span className="pd-color-name">{colorName}</span>
                        </div>
                        <div className="pd-colors">
                            <div
                                className="pd-color-dot active"
                                style={{ background: product.color }}
                                title={colorName}
                            />
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div className="pd-qty-row">
                    <span className="pd-qty-label">Số lượng</span>
                    <div className="pd-qty-ctrl">
                        <button
                            className="pd-qty-btn"
                            onClick={() => this.setState(s => ({ quantity: Math.max(1, s.quantity - 1) }))}
                        >−</button>
                        <div className="pd-qty-val">{quantity}</div>
                        <button
                            className="pd-qty-btn"
                            onClick={() => this.setState(s => ({ quantity: Math.min(10, s.quantity + 1) }))}
                        >+</button>
                    </div>
                    <span className="pd-qty-note">Tối đa 10 / đơn</span>
                </div>

                {/* Action buttons */}
                <div className="pd-action-btns">
                    <button
                        className="pd-btn-cart"
                        disabled={!inStock}
                        onClick={() => this.props.cartAddItem(product, quantity)}
                    >
                        <CartIcon />
                        {inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                    </button>
                    <button className="pd-btn-icon" aria-label="Yêu thích">
                        <HeartIcon />
                    </button>
                    <button className="pd-btn-icon" aria-label="Chia sẻ">
                        <ShareIcon />
                    </button>
                </div>

                {/* Shipping */}
                <div className="pd-shipping">
                    <div className="pd-ship-row">
                        <TruckIcon />
                        <span>Giao hàng <em>miễn phí</em> toàn quốc</span>
                    </div>
                    <div className="pd-ship-row">
                        <RefreshIcon />
                        <span>Đổi trả trong <em>30 ngày</em></span>
                    </div>
                    <div className="pd-ship-row">
                        <ShieldIcon />
                        <span>Bảo hành chính hãng <em>36 tháng</em></span>
                    </div>
                </div>
            </div>
        );
    }

    // ── Tabs ────────────────────────────────────────────────────────────────

    renderTabs() {
        const { activeTab, product } = this.state;
        const rating = parseFloat(product.review || 0);
        const bars   = this.getRatingBars(rating);
        const catName = this.getCategoryName(product);

        const TABS = [
            { key: 'desc',    label: 'Mô Tả' },
            { key: 'specs',   label: 'Thông Số' },
            { key: 'reviews', label: 'Đánh Giá' },
        ];

        const specRows = [
            ['Vật liệu',    product.material],
            ['Phong cách',  product.style],
            ['Màu sắc',     COLOR_MAP[product.color] || product.color],
            ['Khối lượng',  product.weight ? `${product.weight}g` : null],
            ['Tồn kho',     product.stock_qty != null ? `${product.stock_qty} sản phẩm` : null],
            ['Danh mục',    catName],
        ].filter(([, v]) => v);

        const RatingPanel = () => (
            <div className="pd-rating-panel">
                <div className="pd-score-wrap">
                    <div className="pd-score-big">{rating > 0 ? rating.toFixed(1) : '—'}</div>
                    <div className="pd-score-stars">{this.renderStars(rating)}</div>
                    <div className="pd-score-sub">{rating > 0 ? 'Điểm đánh giá' : 'Chưa đánh giá'}</div>
                </div>
                <div className="pd-rating-bars">
                    {[5, 4, 3, 2, 1].map((star, i) => (
                        <div key={star} className="pd-bar-row">
                            <span className="pd-bar-label">{star}★</span>
                            <div className="pd-bar-track">
                                <div className="pd-bar-fill" style={{ width: `${bars[i]}%` }} />
                            </div>
                            <span className="pd-bar-pct">{bars[i]}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="pd-tabs-section">
                <div className="pd-tabs-nav">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            className={`pd-tab-btn${activeTab === t.key ? ' active' : ''}`}
                            onClick={() => this.setState({ activeTab: t.key })}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="pd-tab-body">

                    {/* Mô Tả */}
                    {activeTab === 'desc' && (
                        <div className="pd-desc-content">
                            <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                            {product.material && (
                                <p>
                                    <strong>Vật liệu:</strong> {product.material}.{' '}
                                    {product.style && <><strong>Phong cách:</strong> {product.style}.</>}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Thông Số */}
                    {activeTab === 'specs' && (
                        <div className="pd-tab-grid">
                            <div className="pd-specs-table">
                                {specRows.map(([label, value]) => (
                                    <div key={label} className="pd-spec-row">
                                        <span className="pd-spec-label">{label}</span>
                                        <span className="pd-spec-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <RatingPanel />
                        </div>
                    )}

                    {/* Đánh Giá */}
                    {activeTab === 'reviews' && (
                        <div className="pd-tab-grid">
                            <RatingPanel />
                            <div className="pd-no-reviews">
                                <div className="pd-no-reviews-icon">✦</div>
                                <p className="pd-no-reviews-title">Chưa có đánh giá từ khách hàng</p>
                                <p className="pd-no-reviews-sub">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    }

    // ── Related products ────────────────────────────────────────────────────

    renderRelated() {
        const { relatedProducts } = this.state;
        if (!relatedProducts.length) return null;
        const BG = ['pd-rel-bg1', 'pd-rel-bg2', 'pd-rel-bg3', 'pd-rel-bg4'];

        return (
            <div className="pd-related">
                <div className="pd-related-head">
                    <div className="sec-overline"><span>●</span> Có thể bạn thích</div>
                    <div className="sec-title">Sản Phẩm Liên Quan</div>
                </div>
                <div className="pd-related-grid">
                    {relatedProducts.map((p, i) => {
                        const imgs = this._parseImages(p);
                        const disc = this.getDiscount(p.base_price, p.sell_price);
                        return (
                            <div
                                key={p.id || i}
                                className="pd-rel-card"
                                onClick={() => this.handleRelatedClick(p)}
                            >
                                <div className={`pd-rel-img-wrap ${BG[i % 4]}`}>
                                    {disc !== null
                                        ? <div className="pd-rel-badge badge-sale">SALE</div>
                                        : <div className="pd-rel-badge badge-new">MỚI</div>
                                    }
                                    {imgs[0] ? (
                                        <div className="pd-rel-thumb" style={{ backgroundImage: `url(${imgs[0]})` }} />
                                    ) : (
                                        <div className="pd-rel-no-img">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="pd-rel-body">
                                    <div className="pd-rel-name">{p.name}</div>
                                    <div className="pd-rel-footer">
                                        <div className="pd-rel-stars">{this.renderStars(p.review)}</div>
                                        <span className="pd-rel-price">{this.formatPrice(p.sell_price)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────

    render() {
        const { product } = this.state;

        if (!product) {
            return (
                <div className="pd-loading">
                    <div className="pd-loading-spinner" />
                    <p>Đang tải sản phẩm...</p>
                </div>
            );
        }

        const catName = this.getCategoryName(product);

        return (
            <div className="pd-page">

                {/* Breadcrumb */}
                <div className="pd-breadcrumb">
                    <a href="/home" className="pd-crumb-item">Trang chủ</a>
                    <span className="pd-crumb-sep">›</span>
                    <a href="/store" className="pd-crumb-item">Cửa hàng</a>
                    {catName && (
                        <>
                            <span className="pd-crumb-sep">›</span>
                            <span className="pd-crumb-item">{catName}</span>
                        </>
                    )}
                    <span className="pd-crumb-sep">›</span>
                    <span className="pd-crumb-item pd-crumb-current">{product.name}</span>
                </div>

                <button className="pd-back-btn" onClick={() => this.props.history.push('/store')}>
                    <ArrowLeft />
                    Quay lại cửa hàng
                </button>

                {/* Main grid */}
                <div className="pd-layout">
                    {this.renderGallery()}
                    {this.renderInfo()}
                </div>

                {/* Tabs */}
                {this.renderTabs()}

                {/* Related */}
                {this.renderRelated()}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    listProducts: state.product.products,
    listCategories: state.product.categories,
});

const mapDispatchToProps = dispatch => ({
    fetchProductRedux: () => dispatch(actions.fetchAllProductStart()),
    fetchCategoryRedux: () => dispatch(actions.fetchCategoryStart()),
    cartAddItem: (product, quantity) => dispatch(actions.cartAddItem(product, quantity)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductDetail));
