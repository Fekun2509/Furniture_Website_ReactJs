import { Component } from 'react';
import './Footer.scss';

const SUPPORT_LINKS = ['Bảo hành', 'Vận chuyển', 'Đổi trả', 'Liên hệ'];
const COMPANY_LINKS = ['Về chúng tôi', 'Blog', 'Tuyển dụng', 'Báo chí'];

class Footer extends Component {
    render() {
        return (
            <footer className="gg-footer">
                <div className="gg-footer-grid">

                    {/* Brand */}
                    <div>
                        <span className="gg-footer-logo">GAMING<span>_</span>GEAR</span>
                        <p className="gg-footer-desc">
                            Định nghĩa lại ranh giới vật lý của không gian kỹ thuật số.
                            Thiết bị chính xác cho nhà tiên phong hiện đại.
                        </p>
                    </div>

                    {/* Support */}
                    <div className="gg-footer-col">
                        <h4>Hỗ Trợ</h4>
                        <ul>
                            {SUPPORT_LINKS.map((l) => (
                                <li key={l}><a href="#">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="gg-footer-col">
                        <h4>Công Ty</h4>
                        <ul>
                            {COMPANY_LINKS.map((l) => (
                                <li key={l}><a href="#">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="gg-footer-col">
                        <h4>Kết Nối</h4>
                        <div className="gg-social-row">
                            {/* Twitter / X */}
                            <div className="gg-social-btn" aria-label="Twitter">
                                <svg viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </div>
                            {/* Discord */}
                            <div className="gg-social-btn" aria-label="Discord">
                                <svg viewBox="0 0 24 24">
                                    <path d="M21 2H3v16l4-4h14V2z" />
                                </svg>
                            </div>
                            {/* Instagram */}
                            <div className="gg-social-btn" aria-label="Instagram">
                                <svg viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </div>
                            {/* YouTube */}
                            <div className="gg-social-btn" aria-label="YouTube">
                                <svg viewBox="0 0 24 24">
                                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="gg-footer-bottom">
                    <p>© 2025 GAMING<span>_</span>GEAR HORIZON INDUSTRIAL. Bảo lưu mọi quyền.</p>
                    <p>Thiết kế cho <span>những người tiên phong</span></p>
                </div>
            </footer>
        );
    }
}

export default Footer;
