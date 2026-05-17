import { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './Categories.scss';

// Visual data only — images, labels, background classes
const CATEGORY_VISUALS = [
    {
        bgClass: 'gg-cat-bg-desk',
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&auto=format&fit=crop',
        eyebrow: 'Bộ sưu tập chuyên nghiệp',
    },
    {
        bgClass: 'gg-cat-bg-chair',
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop',
        eyebrow: 'Tiêu chuẩn giải đấu',
    },
    {
        bgClass: 'gg-cat-bg-acc',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop',
        eyebrow: 'Trang bị hoàn chỉnh',
    },
];

class Categories extends Component {
    componentDidMount() {
        this.props.fetchCategoryRedux();
    }

    render() {
        const { categories } = this.props;

        return (
            <section className="gg-categories" id="categories">
                <div className="gg-cat-grid">

                    {/* Regular category cards — link to store filtered by category */}
                    {CATEGORY_VISUALS.map((visual, i) => {
                        const cat = categories[i];
                        const to = cat
                            ? `/store?category=${cat.id}`
                            : '/store';

                        return (
                            <Link
                                key={i}
                                to={to}
                                className={`gg-cat-card gg-cat-card--link reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}
                            >
                                <div className={`gg-cat-bg ${visual.bgClass}`}>
                                    <div
                                        className="gg-cat-inline-art"
                                        style={{ backgroundImage: `url(${visual.image})` }}
                                    />
                                </div>
                                <div className="gg-cat-info">
                                    <div className="gg-cat-eyebrow">{visual.eyebrow}</div>
                                    <div className="gg-cat-name">
                                        {cat ? cat.name : visual.eyebrow}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {/* Bundle card — link to store without filter */}
                    <Link
                        to="/store"
                        className="gg-cat-card gg-cat-bundle gg-cat-card--link reveal"
                    >
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
                    </Link>

                </div>
            </section>
        );
    }
}

const mapStateToProps = state => ({
    categories: state.product.categories,
});

const mapDispatchToProps = dispatch => ({
    fetchCategoryRedux: () => dispatch(actions.fetchCategoryStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
