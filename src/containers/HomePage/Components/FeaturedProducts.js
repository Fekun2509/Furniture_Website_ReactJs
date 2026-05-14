import { Component } from 'react';
import './FeaturedProducts.scss';

const PRODUCTS = [
    {
        id: 1,
        bgClass: 'gg-img-bg-1',
        tag: { label: '-15%', type: 'sale' },
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&auto=format&fit=crop',
        name: 'Bàn Carbon APEX',
        price: '₫8.990.000',
        delay: '',
    },
    {
        id: 2,
        bgClass: 'gg-img-bg-2',
        tag: null,
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&auto=format&fit=crop',
        name: 'Ghế ZENITH THRONE',
        price: '₫12.490.000',
        delay: 'reveal-delay-1',
    },
    {
        id: 3,
        bgClass: 'gg-img-bg-3',
        tag: { label: 'Mới nhất', type: 'new' },
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop',
        name: 'Combo Commander Tối Thượng',
        price: '₫32.000.000',
        delay: 'reveal-delay-2',
    },
    {
        id: 4,
        bgClass: 'gg-img-bg-4',
        tag: null,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
        name: 'Cánh Tay RGB PHOTON',
        price: '₫2.290.000',
        delay: 'reveal-delay-3',
    },
];

const CartIcon = () => (
    <svg viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

class FeaturedProducts extends Component {
    render() {
        return (
            <section className="gg-featured" id="featured">
                <div className="gg-section-head">
                    <div className="section-title-group">
                        <div className="sec-overline"><span>●</span> Sản phẩm nổi bật</div>
                        <div className="sec-title">Đơn vị nổi bật</div>
                    </div>
                    <a href="#" className="gg-view-all">Xem danh mục →</a>
                </div>

                <div className="gg-products-row">
                    {PRODUCTS.map((p) => (
                        <div key={p.id} className={`gg-prod-card reveal ${p.delay}`}>
                            <div className={`gg-prod-img ${p.bgClass}`}>
                                {p.tag && (
                                    <div className={`gg-prod-tag ${p.tag.type === 'sale' ? 'gg-tag-sale' : 'gg-tag-new'}`}>
                                        {p.tag.label}
                                    </div>
                                )}
                                <div
                                    className="gg-cat-inline-art"
                                    style={{ backgroundImage: `url(${p.image})` }}
                                />
                            </div>
                            <div className="gg-prod-body">
                                <div className="gg-prod-name">{p.name}</div>
                                <div className="gg-prod-footer">
                                    <div className="gg-prod-price-main">{p.price}</div>
                                    <button className="gg-add-cart-btn" aria-label="Thêm vào giỏ">
                                        <CartIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }
}

export default FeaturedProducts;
