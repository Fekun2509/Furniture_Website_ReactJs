import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import './CartDrawer.scss';

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const EmptyCartIcon = () => (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M8 8h4l8 32h28l6-22H18" />
        <circle cx="26" cy="52" r="3" />
        <circle cx="44" cy="52" r="3" />
    </svg>
);

class CartDrawer extends Component {

    formatPrice(price) {
        return (parseFloat(price) || 0).toLocaleString('vi-VN') + '₫';
    }

    getTotal() {
        return this.props.cartItems.reduce(
            (sum, item) => sum + (parseFloat(item.sell_price) || 0) * item.quantity,
            0
        );
    }

    render() {
        const { isOpen, cartItems, cartToggleDrawer, cartRemoveItem, cartUpdateQuantity, cartClear } = this.props;

        return (
            <>
                {/* Overlay */}
                <div
                    className={`cart-overlay${isOpen ? ' visible' : ''}`}
                    onClick={cartToggleDrawer}
                />

                {/* Drawer */}
                <div className={`cart-drawer${isOpen ? ' open' : ''}`}>

                    {/* Header */}
                    <div className="cart-header">
                        <div className="cart-title">
                            <span className="cart-title-text">GIỎ HÀNG</span>
                            {cartItems.length > 0 && (
                                <span className="cart-count">{cartItems.length}</span>
                            )}
                        </div>
                        <button className="cart-close-btn" onClick={cartToggleDrawer} aria-label="Đóng">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="cart-body">
                        {cartItems.length === 0 ? (
                            <div className="cart-empty">
                                <div className="cart-empty-icon"><EmptyCartIcon /></div>
                                <p className="cart-empty-title">Giỏ hàng trống</p>
                                <p className="cart-empty-sub">Thêm sản phẩm để bắt đầu mua sắm</p>
                                <button className="cart-continue-btn" onClick={cartToggleDrawer}>
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        ) : (
                            <ul className="cart-items">
                                {cartItems.map(item => (
                                    <li key={item.id} className="cart-item">
                                        {/* Thumbnail */}
                                        <div className="cart-item-img">
                                            {item.image ? (
                                                <div
                                                    className="cart-item-thumb"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                />
                                            ) : (
                                                <div className="cart-item-no-img">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <path d="M21 15l-5-5L5 21" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            {item.color && (
                                                <div className="cart-item-color">
                                                    <span
                                                        className="cart-item-color-dot"
                                                        style={{ background: item.color }}
                                                    />
                                                </div>
                                            )}
                                            <div className="cart-item-bottom">
                                                <div className="cart-qty-ctrl">
                                                    <button
                                                        className="cart-qty-btn"
                                                        onClick={() => cartUpdateQuantity(item.id, item.quantity - 1)}
                                                    >−</button>
                                                    <span className="cart-qty-val">{item.quantity}</span>
                                                    <button
                                                        className="cart-qty-btn"
                                                        onClick={() => cartUpdateQuantity(item.id, item.quantity + 1)}
                                                    >+</button>
                                                </div>
                                                <span className="cart-item-price">
                                                    {this.formatPrice((parseFloat(item.sell_price) || 0) * item.quantity)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => cartRemoveItem(item.id)}
                                            aria-label="Xóa"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="cart-footer">
                            <div className="cart-total-row">
                                <span className="cart-total-label">TỔNG CỘNG</span>
                                <span className="cart-total-val">{this.formatPrice(this.getTotal())}</span>
                            </div>
                            <button className="cart-checkout-btn">
                                THANH TOÁN
                            </button>
                            <button className="cart-clear-btn" onClick={cartClear}>
                                Xóa toàn bộ giỏ hàng
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    isOpen: state.cart.isOpen,
    cartItems: state.cart.items,
});

const mapDispatchToProps = dispatch => ({
    cartToggleDrawer: () => dispatch(actions.cartToggleDrawer()),
    cartRemoveItem: (id) => dispatch(actions.cartRemoveItem(id)),
    cartUpdateQuantity: (id, qty) => dispatch(actions.cartUpdateQuantity(id, qty)),
    cartClear: () => dispatch(actions.cartClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartDrawer);
