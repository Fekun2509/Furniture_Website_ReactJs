import { Component } from 'react';
import './Testimonials.scss';

const TESTIMONIALS = [
    {
        iconVariant: '',
        icon: (
            <svg viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8m-4-4v4" />
            </svg>
        ),
        quote:
            '"Bàn Apex là một kiệt tác cấu trúc. Hệ thống quản lý dây của tôi chưa bao giờ đẹp đến vậy, và bề mặt có cảm giác chạm tay rất hoàn hảo."',
        name: 'Marcus V.',
        role: 'Pro Streamer',
        delay: '',
    },
    {
        iconVariant: 'purple-ic',
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
        ),
        quote:
            '"Cuối cùng đã có một chiếc ghế thực sự hỗ trợ tư thế của tôi trong các giải đấu. Ghế ZENITH Throne hoàn hảo như cách nó uy nghi."',
        name: 'Sarah K.',
        role: 'Vận Động Viên Esports',
        delay: 'reveal-delay-1',
    },
    {
        iconVariant: '',
        icon: (
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
            </svg>
        ),
        quote:
            '"SYNTH_GEAR là một đẳng cấp riêng. Thiết kế công nghiệp tự nói lên tất cả trong setup workstation gaming cao cấp của tôi."',
        name: 'David L.',
        role: 'Tech Enthusiast',
        delay: 'reveal-delay-2',
    },
];

class Testimonials extends Component {
    render() {
        return (
            <section className="gg-testimonials">
                <div className="section-title-group">
                    <div className="sec-overline"><span>●</span> Người dùng nói gì</div>
                    <div className="sec-title">Đánh Giá Thực Tế</div>
                </div>

                <div className="gg-testi-grid">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className={`gg-testi-card reveal ${t.delay}`}>
                            <div className={`gg-testi-icon ${t.iconVariant}`}>{t.icon}</div>
                            <div className="gg-testi-quote">{t.quote}</div>
                            <div className="gg-testi-author">
                                <div className="gg-testi-name">{t.name}</div>
                                <div className="gg-testi-role">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }
}

export default Testimonials;
