import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
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

const INITIAL_STATE = {
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
    previews: [],
    files: [],
    uploadLabel: 'Nhấn để tải ảnh lên hoặc kéo thả vào đây',
    lightboxOpen: false,
    photoIndex: 0,
    isSubmitting: false,
};

class ModalNewProduct extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, categoryArr: [] };
    }

    componentDidMount() {
        this.props.getCategoryStart();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.categoryRedux !== this.props.categoryRedux) {
            const cats = this.props.categoryRedux || [];
            this.setState({
                categoryArr: cats,
                category_id: cats.length > 0 ? cats[0].id : '',
            });
        }

        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen) {
            this.resetForm();
        }
    }

    resetForm = () => {
        this.setState({
            ...INITIAL_STATE,
            categoryArr: this.state.categoryArr,
            category_id: this.state.categoryArr.length > 0 ? this.state.categoryArr[0].id : '',
        });
    }

    onChangeInput = (e, field) => {
        this.setState({ [field]: e.target.value });
    }

    handleFiles = (files) => {
        const fileArr = Array.from(files).slice(0, 6);
        const urls = fileArr.map(f => URL.createObjectURL(f));
        this.setState({
            previews: urls,
            files: fileArr,
            uploadLabel: `${fileArr.length} file đã chọn`,
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

    handleSubmit = async () => {
        if (!this.checkValidate()) return;
        this.setState({ isSubmitting: true });
        try {
            let imageUrls = [];
            if (this.state.files.length > 0) {
                const formData = new FormData();
                this.state.files.forEach(f => formData.append('images', f));
                const uploadRes = await productService.uploadImage(formData);
                if (uploadRes && uploadRes.errCode === 0) {
                    imageUrls = uploadRes.urls;
                }
            }

            await this.props.createNewProduct({
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
                image: JSON.stringify(imageUrls),
            });

            this.props.toggleFromParent();
            if (this.props.onCreated) this.props.onCreated();
        } catch (e) {
            console.error(e);
        } finally {
            this.setState({ isSubmitting: false });
        }
    }

    render() {
        const { isOpen, toggleFromParent } = this.props;
        const { categoryArr, previews, uploadLabel, lightboxOpen, photoIndex, isSubmitting } = this.state;
        const discount = this.getDiscount();

        return (
            <Modal
                isOpen={isOpen}
                toggle={toggleFromParent}
                className="modal-new-product"
                size="xl"
                backdrop="static"
            >
                <div className="mnp-header">
                    <div className="mnp-header-left">
                        <i className="fas fa-box-open mnp-header-icon" />
                        <div>
                            <div className="mnp-header-title">
                                <FormattedMessage id="product.title" defaultMessage="Thêm sản phẩm mới" />
                            </div>
                            <div className="mnp-header-sub">
                                <FormattedMessage id="product.subtitle" defaultMessage="Điền thông tin chi tiết sản phẩm bên dưới" />
                            </div>
                        </div>
                    </div>
                    <button className="mnp-close-btn" onClick={toggleFromParent} title="Đóng">
                        <i className="fas fa-times" />
                    </button>
                </div>

                <ModalBody>
                    <div className="pf-wrap">
                    <div className="pf-grid">

                        <p className="pf-section-label">
                            <FormattedMessage id="product.basic-info" defaultMessage="Thông tin cơ bản" />
                        </p>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.category" defaultMessage="Danh mục" /> <span>*</span>
                            </label>
                            <select value={this.state.category_id} onChange={e => this.onChangeInput(e, 'category_id')}>
                                {categoryArr.map((c, i) => (
                                    <option key={i} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.product-name" defaultMessage="Tên sản phẩm" /> <span>*</span>
                            </label>
                            <input
                                type="text"
                                value={this.state.name}
                                onChange={e => this.onChangeInput(e, 'name')}
                                placeholder="VD: Bàn gaming đời mới..."
                                maxLength={120}
                            />
                        </div>

                        <div className="pf-group pf-full">
                            <label className="pf-label">
                                <FormattedMessage id="product.description" defaultMessage="Mô tả" />
                            </label>
                            <textarea
                                value={this.state.description}
                                onChange={e => this.onChangeInput(e, 'description')}
                                placeholder="Mô tả chi tiết sản phẩm..."
                                maxLength={2000}
                            />
                        </div>

                        <p className="pf-section-label">
                            <FormattedMessage id="product.price-and-stock" defaultMessage="Giá & Tồn kho" />
                        </p>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.base-price" defaultMessage="Giá gốc" /> <span>*</span>
                            </label>
                            <div className="pf-prefix">
                                <span className="pf-prefix-sym">₫</span>
                                <input type="number" value={this.state.base_price} onChange={e => this.onChangeInput(e, 'base_price')} placeholder="0" min={0} step={1000} />
                            </div>
                        </div>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.sell-price" defaultMessage="Giá bán" /> <span>*</span>
                            </label>
                            <div className="pf-prefix">
                                <span className="pf-prefix-sym">₫</span>
                                <input type="number" value={this.state.sell_price} onChange={e => this.onChangeInput(e, 'sell_price')} placeholder="0" min={0} step={1000} />
                            </div>
                        </div>

                        {discount && (
                            <div className="pf-full">
                                <p className="pf-discount-msg visible">{discount}</p>
                            </div>
                        )}

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.stock" defaultMessage="Tồn kho" /> <span>*</span>
                            </label>
                            <input type="number" value={this.state.stock_qty} onChange={e => this.onChangeInput(e, 'stock_qty')} placeholder="Số lượng..." min={0} />
                        </div>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.weight" defaultMessage="Khối lượng" />
                            </label>
                            <div className="pf-prefix">
                                <span className="pf-prefix-sym pf-prefix-sym--sm">g</span>
                                <input type="number" value={this.state.weight} onChange={e => this.onChangeInput(e, 'weight')} placeholder="0" min={0} style={{ paddingLeft: '28px' }} />
                            </div>
                        </div>

                        <p className="pf-section-label">
                            <FormattedMessage id="product.attribute" defaultMessage="Thuộc tính" />
                        </p>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.material" defaultMessage="Chất liệu" />
                            </label>
                            <input type="text" value={this.state.material} onChange={e => this.onChangeInput(e, 'material')} placeholder="VD: Nhôm, thép, nhựa ABS..." maxLength={120} />
                        </div>

                        <div className="pf-group">
                            <label className="pf-label">
                                <FormattedMessage id="product.style" defaultMessage="Phong cách" />
                            </label>
                            <input type="text" value={this.state.style} onChange={e => this.onChangeInput(e, 'style')} placeholder="VD: Gaming, Minimalist..." maxLength={120} />
                        </div>

                        <div className="pf-group pf-full">
                            <label className="pf-label">
                                <FormattedMessage id="product.color" defaultMessage="Màu sắc" />
                            </label>
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
                                <input
                                    type="text"
                                    className="pf-color-input"
                                    value={this.state.color}
                                    onChange={e => this.onChangeInput(e, 'color')}
                                    placeholder="#hex hoặc tên màu"
                                />
                            </div>
                        </div>

                        <p className="pf-section-label">
                            <FormattedMessage id="product.image" defaultMessage="Hình ảnh" />
                        </p>

                        <div className="pf-group pf-full">
                            <label className="pf-label">
                                <FormattedMessage id="product.product-image" defaultMessage="Ảnh sản phẩm" />
                            </label>
                            <label className="pf-upload" htmlFor="mnp-image-input">
                                <svg className="pf-upload-icon" viewBox="0 0 32 32" fill="none">
                                    <rect x="2" y="6" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="10" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M2 22l7-6 5 5 4-4 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M22 6V2M22 2l-2.5 2.5M22 2l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p className="pf-upload-text">{uploadLabel}</p>
                                <p className="pf-upload-hint">PNG, JPG, WEBP tối đa 5MB — khuyến nghị 800×800px</p>
                                <input
                                    type="file"
                                    id="mnp-image-input"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={e => this.handleFiles(e.target.files)}
                                />
                            </label>
                            {previews.length > 0 && (
                                <div className="pf-preview-row">
                                    {previews.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt=""
                                            className="pf-preview-img"
                                            onClick={() => this.setState({ lightboxOpen: true, photoIndex: i })}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    </div> {/* pf-wrap */}

                    {lightboxOpen && (
                        <Lightbox
                            open={lightboxOpen}
                            close={() => this.setState({ lightboxOpen: false })}
                            index={photoIndex}
                            slides={previews.map(src => ({ src }))}
                        />
                    )}
                </ModalBody>

                <ModalFooter>
                    <button className="btn-cancel" onClick={toggleFromParent} disabled={isSubmitting}>
                        Huỷ
                    </button>
                    <button className="btn-submit" onClick={this.handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Đang lưu...' : 'Tạo sản phẩm →'}
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
    createNewProduct: (data) => dispatch(actions.createNewProduct(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewProduct);
