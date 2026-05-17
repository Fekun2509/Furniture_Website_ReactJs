import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/dist/styles.css';
import * as actions from '../../../store/actions';
import productService from '../../../services/productService';
import './product-form.scss';

const SWATCHES = [
    { hex: '#1C1C1E', label: 'Đen' },
    { hex: '#FFFFFF', label: 'Trắng', isWhite: true },
    { hex: '#D85A30', label: 'Cam đỏ' },
    { hex: '#378ADD', label: 'Xanh dương' },
    { hex: '#3B6D11', label: 'Xanh lá' },
    { hex: '#BA7517', label: 'Vàng đồng' },
    { hex: '#993556', label: 'Hồng đậm' },
    { hex: '#B4B2A9', label: 'Xám' },
];

class ModalEditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryArr: [],
            category_id: '',
            name: '',
            description: '',
            base_price: '',
            sell_price: '',
            material: '',
            style: '',
            weight: '',
            color: '',
            stock_qty: '',
            existingImages: [],
            newFiles: [],
            newPreviews: [],
            uploadLabel: 'Tải ảnh mới lên (sẽ thay thế ảnh cũ)',
            lightboxOpen: false,
            photoIndex: 0,
            lightboxSlides: [],
            isSubmitting: false,
        };
    }

    componentDidMount() {
        this.props.getCategoryStart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.categoryRedux !== this.props.categoryRedux) {
            this.setState({ categoryArr: this.props.categoryRedux || [] });
        }

        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen && this.props.product) {
            this.fillForm(this.props.product);
        }
    }

    fillForm(p) {
        let existingImages = [];
        try {
            const parsed = typeof p.image === 'string' ? JSON.parse(p.image) : p.image;
            existingImages = Array.isArray(parsed) ? parsed : [];
        } catch { }

        this.setState({
            category_id: p.category_id || '',
            name: p.name || '',
            description: p.description || '',
            base_price: p.base_price || '',
            sell_price: p.sell_price || '',
            material: p.material || '',
            style: p.style || '',
            weight: p.weight || '',
            color: p.color || '',
            stock_qty: p.stock_qty || '',
            existingImages,
            newFiles: [],
            newPreviews: [],
            uploadLabel: 'Tải ảnh mới lên (sẽ thay thế ảnh cũ)',
            isSubmitting: false,
        });
    }

    onChangeInput = (e, field) => {
        this.setState({ [field]: e.target.value });
    }

    handleFiles = (files) => {
        const fileArr = Array.from(files).slice(0, 6);
        const urls = fileArr.map(f => URL.createObjectURL(f));
        this.setState({
            newPreviews: urls,
            newFiles: fileArr,
            uploadLabel: `${fileArr.length} ảnh mới đã chọn`,
        });
    }

    getDiscount() {
        const base = parseFloat(this.state.base_price) || 0;
        const sell = parseFloat(this.state.sell_price) || 0;
        if (base > 0 && sell > 0 && sell < base) {
            const pct = Math.round((1 - sell / base) * 100);
            const save = (base - sell).toLocaleString('vi-VN');
            return `Giảm ${pct}% — tiết kiệm ${save}₫`;
        }
        return null;
    }

    checkValidate = () => {
        const required = ['category_id', 'name', 'base_price', 'sell_price', 'stock_qty'];
        for (let field of required) {
            if (!this.state[field]) {
                alert('Thiếu thông tin: ' + field);
                return false;
            }
        }
        return true;
    }

    openLightbox = (slides, index) => {
        this.setState({ lightboxOpen: true, photoIndex: index, lightboxSlides: slides });
    }

    handleSubmit = async () => {
        if (!this.checkValidate()) return;
        this.setState({ isSubmitting: true });
        try {
            let imageJson;
            if (this.state.newFiles.length > 0) {
                const formData = new FormData();
                this.state.newFiles.forEach(f => formData.append('images', f));
                const uploadRes = await productService.uploadImage(formData);
                imageJson = uploadRes && uploadRes.errCode === 0
                    ? JSON.stringify(uploadRes.urls)
                    : JSON.stringify(this.state.existingImages);
            } else {
                imageJson = JSON.stringify(this.state.existingImages);
            }

            const res = await this.props.editProduct({
                id: this.props.product.id,
                category_id: this.state.category_id,
                name: this.state.name,
                description: this.state.description,
                base_price: this.state.base_price,
                sell_price: this.state.sell_price,
                stock_qty: this.state.stock_qty,
                weight: this.state.weight,
                material: this.state.material,
                style: this.state.style,
                color: this.state.color,
                image: imageJson,
            });

            if (res && res.errCode === 0) {
                this.props.toggleFromParent();
                if (this.props.onEdited) this.props.onEdited();
            } else {
                alert('Lưu thất bại, vui lòng thử lại.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.setState({ isSubmitting: false });
        }
    }

    render() {
        const { isOpen, toggleFromParent } = this.props;
        const { categoryArr, existingImages, newPreviews, uploadLabel,
            lightboxOpen, photoIndex, lightboxSlides, isSubmitting } = this.state;
        const discount = this.getDiscount();

        const existingSlides = existingImages.map(src => ({ src }));
        const newSlides = newPreviews.map(src => ({ src }));

        return (
            <Modal isOpen={isOpen} toggle={toggleFromParent} className="modal-new-product" size="xl" backdrop="static">

                <div className="mnp-header">
                    <div className="mnp-header-left">
                        <i className="fas fa-pencil-alt mnp-header-icon" />
                        <div>
                            <div className="mnp-header-title">Chỉnh sửa sản phẩm</div>
                            <div className="mnp-header-sub">Cập nhật thông tin sản phẩm bên dưới</div>
                        </div>
                    </div>
                    <button className="mnp-close-btn" onClick={toggleFromParent} title="Đóng">
                        <i className="fas fa-times" />
                    </button>
                </div>

                <ModalBody>
                    <div className="pf-wrap">
                        <div className="pf-grid">

                            <p className="pf-section-label">Thông tin cơ bản</p>

                            <div className="pf-group">
                                <label className="pf-label">Danh mục <span>*</span></label>
                                <select value={this.state.category_id} onChange={e => this.onChangeInput(e, 'category_id')}>
                                    {categoryArr.map((c, i) => (
                                        <option key={i} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pf-group">
                                <label className="pf-label">Tên sản phẩm <span>*</span></label>
                                <input type="text" value={this.state.name} onChange={e => this.onChangeInput(e, 'name')} maxLength={120} />
                            </div>

                            <div className="pf-group pf-full">
                                <label className="pf-label">Mô tả</label>
                                <textarea value={this.state.description} onChange={e => this.onChangeInput(e, 'description')} maxLength={2000} />
                            </div>

                            <p className="pf-section-label">Giá & Tồn kho</p>

                            <div className="pf-group">
                                <label className="pf-label">Giá gốc <span>*</span></label>
                                <div className="pf-prefix">
                                    <span className="pf-prefix-sym">₫</span>
                                    <input type="number" value={this.state.base_price} onChange={e => this.onChangeInput(e, 'base_price')} min={0} step={1000} />
                                </div>
                            </div>

                            <div className="pf-group">
                                <label className="pf-label">Giá bán <span>*</span></label>
                                <div className="pf-prefix">
                                    <span className="pf-prefix-sym">₫</span>
                                    <input type="number" value={this.state.sell_price} onChange={e => this.onChangeInput(e, 'sell_price')} min={0} step={1000} />
                                </div>
                            </div>

                            {discount && (
                                <div className="pf-full">
                                    <p className="pf-discount-msg visible">{discount}</p>
                                </div>
                            )}

                            <div className="pf-group">
                                <label className="pf-label">Tồn kho <span>*</span></label>
                                <input type="number" value={this.state.stock_qty} onChange={e => this.onChangeInput(e, 'stock_qty')} min={0} />
                            </div>

                            <div className="pf-group">
                                <label className="pf-label">Khối lượng (g)</label>
                                <div className="pf-prefix">
                                    <span className="pf-prefix-sym pf-prefix-sym--sm">g</span>
                                    <input type="number" value={this.state.weight} onChange={e => this.onChangeInput(e, 'weight')} min={0} style={{ paddingLeft: '28px' }} />
                                </div>
                            </div>

                            <p className="pf-section-label">Thuộc tính</p>

                            <div className="pf-group">
                                <label className="pf-label">Chất liệu</label>
                                <input type="text" value={this.state.material} onChange={e => this.onChangeInput(e, 'material')} maxLength={120} />
                            </div>

                            <div className="pf-group">
                                <label className="pf-label">Phong cách</label>
                                <input type="text" value={this.state.style} onChange={e => this.onChangeInput(e, 'style')} maxLength={120} />
                            </div>

                            <div className="pf-group pf-full">
                                <label className="pf-label">Màu sắc</label>
                                <div className="pf-color-row">
                                    {SWATCHES.map(sw => (
                                        <div
                                            key={sw.hex}
                                            className={['pf-swatch', sw.isWhite ? 'pf-swatch--white' : '', this.state.color === sw.hex ? 'active' : ''].filter(Boolean).join(' ')}
                                            style={{ background: sw.hex }}
                                            title={sw.label}
                                            onClick={() => this.setState({ color: sw.hex })}
                                        />
                                    ))}
                                    <input type="text" className="pf-color-input" value={this.state.color} onChange={e => this.onChangeInput(e, 'color')} placeholder="#hex hoặc tên màu" />
                                </div>
                            </div>

                            <p className="pf-section-label">Hình ảnh</p>

                            <div className="pf-group pf-full">
                                {existingImages.length > 0 && newPreviews.length === 0 && (
                                    <>
                                        <label className="pf-label">Ảnh hiện tại</label>
                                        <div className="pf-preview-row">
                                            {existingImages.map((src, i) => (
                                                <img key={i} src={src} alt="" className="pf-preview-img"
                                                    onClick={() => this.openLightbox(existingSlides, i)} />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <label className="pf-label" style={{ marginTop: existingImages.length > 0 ? '1rem' : 0 }}>
                                    {existingImages.length > 0 ? 'Thay thế ảnh' : 'Ảnh sản phẩm'}
                                </label>
                                <label className="pf-upload" htmlFor="mep-image-input">
                                    <svg className="pf-upload-icon" viewBox="0 0 32 32" fill="none">
                                        <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="10" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M2 22l7-6 5 5 4-4 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    </svg>
                                    <p className="pf-upload-text">{uploadLabel}</p>
                                    <p className="pf-upload-hint">PNG, JPG, WEBP — tối đa 6 ảnh</p>
                                    <input type="file" id="mep-image-input" accept="image/*" multiple style={{ display: 'none' }}
                                        onChange={e => this.handleFiles(e.target.files)} />
                                </label>

                                {newPreviews.length > 0 && (
                                    <div className="pf-preview-row" style={{ marginTop: '0.5rem' }}>
                                        {newPreviews.map((src, i) => (
                                            <img key={i} src={src} alt="" className="pf-preview-img"
                                                onClick={() => this.openLightbox(newSlides, i)} />
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {lightboxOpen && (
                        <Lightbox
                            open={lightboxOpen}
                            close={() => this.setState({ lightboxOpen: false })}
                            index={photoIndex}
                            slides={lightboxSlides}
                        />
                    )}
                </ModalBody>

                <ModalFooter>
                    <button className="btn-cancel" onClick={toggleFromParent} disabled={isSubmitting}>Huỷ</button>
                    <button className="btn-submit" onClick={this.handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi →'}
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    categoryRedux: state.product.categories,
});

const mapDispatchToProps = dispatch => ({
    getCategoryStart: () => dispatch(actions.fetchCategoryStart()),
    editProduct: (data) => dispatch(actions.editProduct(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditProduct);
