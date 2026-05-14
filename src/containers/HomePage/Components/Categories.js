import { Component } from 'react';
import './Categories.scss';

const CATEGORIES = [
    {
        bgClass: 'gg-cat-bg-desk',
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&auto=format&fit=crop',
        eyebrow: 'Bộ sưu tập chuyên nghiệp',
        name: 'Bàn Gaming',
    },
    {
        bgClass: 'gg-cat-bg-chair',
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop',
        eyebrow: 'Tiêu chuẩn giải đấu',
        name: 'Ghế Gaming',
    },
    {
        bgClass: 'gg-cat-bg-acc',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop',
        eyebrow: 'Trang bị hoàn chỉnh',
        name: 'Phụ Kiện',
    },
];

class Categories extends Component {
    render() {
        return (
            <section className="gg-categories" id="categories">
                <div className="gg-cat-grid">

                    {/* Regular category cards */}
                    {CATEGORIES.map((cat, i) => (
                        <div
                            key={cat.name}
                            className={`gg-cat-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}
                        >
                            <div className={`gg-cat-bg ${cat.bgClass}`}>
                                <div
                                    className="gg-cat-inline-art"
                                    style={{ backgroundImage: `url(${cat.image})` }}
                                />
                            </div>
                            <div className="gg-cat-info">
                                <div className="gg-cat-eyebrow">{cat.eyebrow}</div>
                                <div className="gg-cat-name">{cat.name}</div>
                            </div>
                        </div>
                    ))}

                    {/* Bundle card — full width */}
                    <div className="gg-cat-card gg-cat-bundle reveal">
                        <div className="gg-cat-bg gg-cat-bg-bundle">
                            <div
                                className="gg-cat-inline-art"
                                style={{
                                    backgroundImage:
                                        'url(https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&auto=format&fit=crop)',
                                }}
                            />
                        </div>
                        <div className="gg-cat-info">
                            <div className="gg-bundle-tag">Tích hợp hoàn chỉnh</div>
                            <div className="gg-cat-name">Combo Setup Toàn Bộ</div>
                            <div className="gg-bundle-sub">
                                Sự kết hợp hoàn hảo giữa thoải mái và công nghệ.
                                Tiết kiệm 15% với các cấu hình được tuyển chọn.
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }
}

export default Categories;
