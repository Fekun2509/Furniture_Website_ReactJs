import { Component } from 'react';
import './TransformBanner.scss';

class TransformBanner extends Component {
    render() {
        return (
            <section className="gg-transform-section">
                <div className="gg-transform-bg" />

                {/* Tunnel animation */}
                <div className="gg-tunnel">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="gg-tunnel-line" />
                    ))}
                </div>

                <div className="gg-persp-lines" />

                <div className="gg-transform-text reveal">
                    <h2>
                        BIẾN ĐỔI <em>THỰC TẠI</em>
                        <br />
                        CỦA BẠN
                    </h2>
                </div>

                <a href="#" className="gg-transform-cta reveal">
                    Xem bộ sưu tập setup
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8l4 4-4 4" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                </a>
            </section>
        );
    }
}

export default TransformBanner;
