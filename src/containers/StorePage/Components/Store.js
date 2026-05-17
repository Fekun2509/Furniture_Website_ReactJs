import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../store/actions';
import './Store.scss';

const PAGE_SIZE = 12;
const MAX_PRICE = 50000000;

const SORT_OPTIONS = [
    { value: 'default',    label: 'Mặc định' },
    { value: 'price-asc',  label: 'Giá: thấp → cao' },
    { value: 'price-desc', label: 'Giá: cao → thấp' },
    { value: 'name-asc',   label: 'Tên: A → Z' },
];

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
);

const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const GridIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
);

const ListIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="4" width="18" height="2" rx="1" />
        <rect x="3" y="11" width="18" height="2" rx="1" />
        <rect x="3" y="18" width="18" height="2" rx="1" />
    </svg>
);

const ChevronIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

class Store extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // form state (pending — applied on button click)
            searchInput: '',
            priceMin: 0,
            priceMax: MAX_PRICE,

            // applied filter state
            search: '',
            selectedCategory: 'ALL',
            appliedPriceMin: 0,
            appliedPriceMax: MAX_PRICE,
            sortBy: 'default',

            viewMode: 'grid',
            page: 1,
            products: [],
            categories: [],
        };
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────

    componentDidMount() {
        this.props.fetchProductRedux();
        this.props.fetchCategoryRedux();
        this._applyUrlFilter(this.props.location);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listProducts !== this.props.listProducts) {
            this.setState({ products: this.props.listProducts, page: 1 });
        }
        if (prevProps.listCategories !== this.props.listCategories) {
            this.setState({ categories: this.props.listCategories });
        }
        if (prevProps.location.search !== this.props.location.search) {
            this._applyUrlFilter(this.props.location);
        }
    }

    _applyUrlFilter(location) {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        if (cat) this.setState({ selectedCategory: cat, page: 1 });
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    getImages(product) {
        if (Array.isArray(product.image)) return product.image;
        if (typeof product.image === 'string') {
            try { return JSON.parse(product.image); } catch { return []; }
        }
        return [];
    }

    formatPrice(price) {
        const num = parseFloat(price) || 0;
        return num.toLocaleString('vi-VN') + '₫';
    }

    formatPriceLabel(price) {
        const num = parseFloat(price) || 0;
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(0) + 'Tr';
        if (num === 0) return '0';
        return (num / 1000).toFixed(0) + 'K';
    }

    getDiscount(base, sell) {
        const b = parseFloat(base) || 0;
        const s = parseFloat(sell) || 0;
        if (b > 0 && s > 0 && s < b) return Math.round((1 - s / b) * 100);
        return null;
    }

    getCategoryCount(catId) {
        const { products } = this.state;
        if (catId === 'ALL') return products.length;
        return products.filter(p => String(p.category_id) === String(catId)).length;
    }

    getFilteredProducts() {
        const { search, selectedCategory, appliedPriceMin, appliedPriceMax, sortBy, products } = this.state;

        let result = products.filter(p => {
            const matchName = !search ||
                (p.name && p.name.toLowerCase().includes(search.toLowerCase()));
            const matchCat =
                selectedCategory === 'ALL' || String(p.category_id) === String(selectedCategory);
            const price = parseFloat(p.sell_price) || 0;
            const matchPrice = price >= appliedPriceMin && price <= appliedPriceMax;
            return matchName && matchCat && matchPrice;
        });

        switch (sortBy) {
            case 'price-asc':
                result = result.slice().sort((a, b) =>
                    (parseFloat(a.sell_price) || 0) - (parseFloat(b.sell_price) || 0));
                break;
            case 'price-desc':
                result = result.slice().sort((a, b) =>
                    (parseFloat(b.sell_price) || 0) - (parseFloat(a.sell_price) || 0));
                break;
            case 'name-asc':
                result = result.slice().sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '', 'vi'));
                break;
            default:
                break;
        }

        return result;
    }

    buildPageNumbers(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = [1];
        if (current > 3) pages.push('…');
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push('…');
        pages.push(total);
        return pages;
    }

    renderStars(review) {
        const rating = Math.max(0, Math.min(5, Math.round(parseFloat(review) || 0)));
        return [1, 2, 3, 4, 5].map(i => (
            <span key={i} className={`gg-star${i <= rating ? ' filled' : ''}`}>★</span>
        ));
    }

    // ── Handlers ────────────────────────────────────────────────────────────

    handleApplyFilter = () => {
        this.setState(prev => ({
            search: prev.searchInput,
            appliedPriceMin: prev.priceMin,
            appliedPriceMax: prev.priceMax,
            page: 1,
        }));
    };

    handleResetAll = () => {
        this.setState({
            searchInput: '', search: '',
            selectedCategory: 'ALL',
            priceMin: 0, priceMax: MAX_PRICE,
            appliedPriceMin: 0, appliedPriceMax: MAX_PRICE,
            sortBy: 'default', page: 1,
        });
    };

    handleCategory = (catId) => this.setState({ selectedCategory: catId, page: 1 });

    handlePriceMin = (e) => {
        const val = Math.min(Number(e.target.value), this.state.priceMax);
        this.setState({ priceMin: Math.max(0, val) });
    };

    handlePriceMax = (e) => {
        const val = Math.max(Number(e.target.value), this.state.priceMin);
        this.setState({ priceMax: Math.min(MAX_PRICE, val) });
    };

    handlePage = (p) => {
        this.setState({ page: p });
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    // ── Render ───────────────────────────────────────────────────────────────

    render() {
        const {
            searchInput, priceMin, priceMax,
            selectedCategory, sortBy, viewMode,
            page, categories,
        } = this.state;

        const filtered   = this.getFilteredProducts();
        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        const currentPage = Math.min(page, totalPages);
        const paged      = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        const pageNums   = this.buildPageNumbers(currentPage, totalPages);
        const minPct     = (priceMin / MAX_PRICE) * 100;
        const maxPct     = (priceMax / MAX_PRICE) * 100;

        return (
            <div className="gg-store-page">

                {/* ── Hero ──────────────────────────────────────────────── */}
                <div className="gg-store-hero">
                    <div className="gg-store-breadcrumb">
                        <a href="/home">Trang chủ</a>
                        <span className="gg-bc-sep">›</span>
                        <span>Cửa hàng</span>
                    </div>
                    <h1 className="gg-store-title">
                        Cửa hàng <em>Gaming</em>
                    </h1>
                    <div className="gg-store-title-line" />
                    <p className="gg-store-subtitle">
                        Hiển thị <strong>{filtered.length}</strong> sản phẩm
                    </p>
                </div>

                <div className="gg-store-body">

                    {/* ── Sidebar ──────────────────────────────────────── */}
                    <aside className="gg-sidebar">

                        <div className="gg-sidebar-head">
                            <span className="gg-sidebar-title">Bộ lọc</span>
                            <button className="gg-sidebar-reset" onClick={this.handleResetAll}>
                                Xoá tất cả
                            </button>
                        </div>

                        {/* Search */}
                        <div className="gg-sidebar-block">
                            <div className="gg-sidebar-label">— Tên sản phẩm</div>
                            <div className="gg-sidebar-search">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={searchInput}
                                    onChange={e => this.setState({ searchInput: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && this.handleApplyFilter()}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="gg-sidebar-block">
                            <div className="gg-sidebar-label">— Danh mục</div>
                            <button
                                className={`gg-sidebar-cat${selectedCategory === 'ALL' ? ' active' : ''}`}
                                onClick={() => this.handleCategory('ALL')}
                            >
                                <span>Tất cả</span>
                                <span className="gg-cat-badge">{this.getCategoryCount('ALL')}</span>
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`gg-sidebar-cat${String(selectedCategory) === String(cat.id) ? ' active' : ''}`}
                                    onClick={() => this.handleCategory(cat.id)}
                                >
                                    <span>{cat.name}</span>
                                    <span className="gg-cat-badge">{this.getCategoryCount(cat.id)}</span>
                                </button>
                            ))}
                        </div>

                        {/* Price range */}
                        <div className="gg-sidebar-block">
                            <div className="gg-sidebar-label">— Mức giá (VNĐ)</div>

                            <div className="gg-price-inputs">
                                <div className="gg-price-field">
                                    <label>Từ</label>
                                    <input
                                        type="number"
                                        value={priceMin}
                                        min={0}
                                        max={MAX_PRICE}
                                        step={10000}
                                        onChange={this.handlePriceMin}
                                    />
                                </div>
                                <div className="gg-price-field">
                                    <label>Đến</label>
                                    <input
                                        type="number"
                                        value={priceMax}
                                        min={0}
                                        max={MAX_PRICE}
                                        step={10000}
                                        onChange={this.handlePriceMax}
                                    />
                                </div>
                            </div>

                            <div className="gg-range-wrap">
                                {/* Track */}
                                <div className="gg-range-track">
                                    <div
                                        className="gg-range-fill"
                                        style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                                    />
                                </div>
                                {/* Dual sliders */}
                                <input
                                    type="range" className="gg-range gg-range-lo"
                                    min={0} max={MAX_PRICE} step={10000}
                                    value={priceMin}
                                    onChange={this.handlePriceMin}
                                />
                                <input
                                    type="range" className="gg-range gg-range-hi"
                                    min={0} max={MAX_PRICE} step={10000}
                                    value={priceMax}
                                    onChange={this.handlePriceMax}
                                />
                            </div>

                            <div className="gg-range-labels">
                                <span>{this.formatPriceLabel(priceMin)}đ</span>
                                <span>{this.formatPriceLabel(priceMax)}đ</span>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="gg-sidebar-block">
                            <div className="gg-sidebar-label">— Sắp xếp</div>
                            <div className="gg-sidebar-select-wrap">
                                <select
                                    value={sortBy}
                                    onChange={e => this.setState({ sortBy: e.target.value, page: 1 })}
                                >
                                    {SORT_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                <ChevronIcon />
                            </div>
                        </div>

                        <button className="gg-sidebar-apply" onClick={this.handleApplyFilter}>
                            Áp dụng bộ lọc
                        </button>
                    </aside>

                    {/* ── Main ─────────────────────────────────────────── */}
                    <div className="gg-store-main">

                        {/* Toolbar */}
                        <div className="gg-store-toolbar">
                            <span className="gg-toolbar-info">
                                Tìm thấy <strong>{filtered.length}</strong> sản phẩm
                            </span>
                            <div className="gg-view-toggle">
                                <button
                                    className={`gg-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                                    onClick={() => this.setState({ viewMode: 'grid' })}
                                    aria-label="Chế độ lưới"
                                >
                                    <GridIcon />
                                </button>
                                <button
                                    className={`gg-view-btn${viewMode === 'list' ? ' active' : ''}`}
                                    onClick={() => this.setState({ viewMode: 'list' })}
                                    aria-label="Chế độ danh sách"
                                >
                                    <ListIcon />
                                </button>
                            </div>
                        </div>

                        {/* Product grid */}
                        {paged.length > 0 ? (
                            <div className={`gg-prod-grid${viewMode === 'list' ? ' is-list' : ''}`}>
                                {paged.map((p, i) => {
                                    const discount = this.getDiscount(p.base_price, p.sell_price);
                                    const images   = this.getImages(p);
                                    const thumb    = images[0] || null;
                                    const catName  = categories.find(
                                        c => String(c.id) === String(p.category_id)
                                    )?.name || null;

                                    return (
                                        <div
                                            key={p.id || i}
                                            className="gg-prod-card"
                                            onClick={() => this.props.history.push(`/product/${p.id}`, { product: p })}
                                        >

                                            {/* Image */}
                                            <div className="gg-prod-img">
                                                {discount
                                                    ? <div className="gg-prod-badge gg-badge-sale">-SALE</div>
                                                    : <div className="gg-prod-badge gg-badge-new">MỚI</div>
                                                }
                                                {thumb ? (
                                                    <div
                                                        className="gg-prod-thumb"
                                                        style={{ backgroundImage: `url(${thumb})` }}
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

                                            {/* Info */}
                                            <div className="gg-prod-info">
                                                {catName && (
                                                    <div className="gg-prod-cat">{catName}</div>
                                                )}
                                                <div className="gg-prod-name">{p.name}</div>
                                                <div className="gg-prod-stars">
                                                    {this.renderStars(p.review)}
                                                    {p.review > 0 && (
                                                        <span className="gg-star-label">({p.review})</span>
                                                    )}
                                                </div>
                                                <div className="gg-prod-footer">
                                                    <div className="gg-prod-pricing">
                                                        {discount && (
                                                            <span className="gg-price-old">
                                                                {this.formatPrice(p.base_price)}
                                                            </span>
                                                        )}
                                                        <span className="gg-price-sell">
                                                            {this.formatPrice(p.sell_price)}
                                                        </span>
                                                    </div>
                                                    <button className="gg-cart-btn" aria-label="Thêm vào giỏ">
                                                        <CartIcon />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="gg-store-empty">
                                <div className="gg-empty-ring" />
                                <p className="gg-empty-title">Không tìm thấy sản phẩm</p>
                                <p className="gg-empty-sub">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="gg-pagination">
                                <button
                                    className="gg-page-btn gg-page-arrow"
                                    disabled={currentPage === 1}
                                    onClick={() => this.handlePage(currentPage - 1)}
                                >←</button>

                                {pageNums.map((n, i) =>
                                    n === '…' ? (
                                        <span key={`e${i}`} className="gg-page-ellipsis">…</span>
                                    ) : (
                                        <button
                                            key={n}
                                            className={`gg-page-btn${n === currentPage ? ' active' : ''}`}
                                            onClick={() => this.handlePage(n)}
                                        >{n}</button>
                                    )
                                )}

                                <button
                                    className="gg-page-btn gg-page-arrow"
                                    disabled={currentPage === totalPages}
                                    onClick={() => this.handlePage(currentPage + 1)}
                                >→</button>
                            </div>
                        )}

                    </div>
                </div>
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Store));
