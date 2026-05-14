import { Component } from 'react';
import './Features.scss';

const FEATURES = [
    {
        iconVariant: '',
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 015 5v3a5 5 0 01-10 0V7a5 5 0 015-5z" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
        ),
        name: 'Xuất Sắc Về Ergonomic',
        desc: 'Hỗ trợ tư thế chính xác cho các session gaming 12+ giờ mà không ảnh hưởng đến hiệu suất.',
        delay: '',
    },
    {
        iconVariant: 'purple',
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        name: 'Vật Liệu Hạng A',
        desc: 'Sợi carbon hàng không vũ trụ và vải tổng hợp gia cố không stitching mang lại độ bền vượt trội.',
        delay: 'reveal-delay-1',
    },
    {
        iconVariant: 'white-icon',
        icon: (
            <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
        name: 'Thiết Kế Pro-Level',
        desc: 'Hợp tác với các chuyên gia esports hàng đầu để đạt lợi thế chiến thuật tối ưu.',
        delay: 'reveal-delay-2',
    },
    {
        iconVariant: '',
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        name: 'Giao Hàng Nhanh',
        desc: 'Hậu cần trong ngày cho phần cứng gaming tối thượng. Đặt hôm nay — nhận ngày mai.',
        delay: 'reveal-delay-3',
    },
];

class Features extends Component {
    render() {
        return (
            <section className="gg-features-sec" id="features">
                <div className="gg-feat-grid">
                    {FEATURES.map((f) => (
                        <div key={f.name} className={`gg-feat-item reveal ${f.delay}`}>
                            <div className={`gg-feat-icon ${f.iconVariant}`}>{f.icon}</div>
                            <div className="gg-feat-name">{f.name}</div>
                            <div className="gg-feat-desc">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }
}

export default Features;
