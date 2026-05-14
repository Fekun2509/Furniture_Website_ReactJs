import { Component } from 'react';
import './CaroulImage.scss';

const SLIDES = [
    { bg: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1800&auto=format&fit=crop' },
    { bg: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1800&auto=format&fit=crop' },
    { bg: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1800&auto=format&fit=crop' },
    { bg: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1800&auto=format&fit=crop' },
];

class CaroulImage extends Component {
    constructor(props) {
        super(props);
        this.state = { current: 0 };
        this._timer = null;
    }

    componentDidMount() {
        this._startAuto();
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    _goTo = (idx) => {
        const len = SLIDES.length;
        this.setState({ current: ((idx % len) + len) % len });
    };

    _startAuto() {
        this._timer = setInterval(() => {
            this.setState((prev) => ({
                current: (prev.current + 1) % SLIDES.length,
            }));
        }, 5000);
    }

    _resetAuto() {
        clearInterval(this._timer);
        this._startAuto();
    }

    _handlePrev = () => { this._goTo(this.state.current - 1); this._resetAuto(); };
    _handleNext = () => { this._goTo(this.state.current + 1); this._resetAuto(); };
    _handleDot = (i) => { this._goTo(i); this._resetAuto(); };

    render() {
        const { current } = this.state;
        return (
            <section className="gg-CaroulImage">

                {/* IMAGE CAROUSEL */}
                <div className="gg-CaroulImage-carousel">
                    <div className="gg-CaroulImage-carousel-track">
                        {SLIDES.map((s, i) => (
                            <div
                                key={i}
                                className={`gg-CaroulImage-slide${i === current ? ' active' : ''}`}
                                style={{ backgroundImage: `url(${s.bg})` }}
                            />
                        ))}
                    </div>

                    <button className="gg-carousel-btn prev" aria-label="Ảnh trước" onClick={this._handlePrev}>
                        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button className="gg-carousel-btn next" aria-label="Ảnh tiếp" onClick={this._handleNext}>
                        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>

                    <div className="gg-carousel-dots">
                        {SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className={`gg-carousel-dot${i === current ? ' active' : ''}`}
                                onClick={() => this._handleDot(i)}
                            />
                        ))}
                    </div>
                </div>

                {/* Decorative layers */}
                <div className="gg-CaroulImage-bg" />
                <div className="gg-CaroulImage-floor" />
                <div className="gg-CaroulImage-bg-text">PREMIUM</div>
                <div className="gg-particle" />
                <div className="gg-particle" />
                <div className="gg-particle" />
                <div className="gg-particle" />

                {/* Content */}
                <div className="gg-CaroulImage-content">
                    <div className="gg-CaroulImage-tag">Gaming Setup · Iron Series</div>
                    <h1>
                        XÂY DỰNG<br />
                        <span className="accent">KHÔNG GIAN</span><br />
                        GAMING ĐỈNH CAO
                    </h1>
                    <p className="gg-CaroulImage-sub">
                        Được chế tác vì hiệu suất. Thiết kế vì sự thoải mái tuyệt đối.
                        Chân trời của phần cứng immersive bắt đầu từ đây.
                    </p>
                    <div className="gg-CaroulImage-btns">
                        <a href="#categories" className="btn-solid">Mua ngay</a>
                        <a href="#featured" className="btn-outline">Khám phá setup</a>
                    </div>
                </div>
            </section>
        );
    }
}

export default CaroulImage;
