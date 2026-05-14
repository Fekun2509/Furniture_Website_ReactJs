import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Cursor from '../../Cursor/Cursor';
import './product-form.scss';
import * as actions from '../../../store/actions';
// import userService from '../../services/userService';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/dist/styles.css';
import productService from '../../../services/productService';

const CATEGORIES = [
    { value: '1', label: 'Thời trang nam' },
    { value: '2', label: 'Thời trang nữ' },
    { value: '3', label: 'Phụ kiện' },
    { value: '4', label: 'Giày dép' },
    { value: '5', label: 'Túi xách' },
];

const MATERIALS = [
    { value: 'cotton', label: 'Cotton 100%' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'wool', label: 'Len' },
    { value: 'silk', label: 'Lụa' },
    { value: 'leather', label: 'Da thật' },
    { value: 'synthetic-leather', label: 'Da tổng hợp' },
    { value: 'canvas', label: 'Canvas' },
    { value: 'denim', label: 'Denim' },
    { value: 'other', label: 'Khác' },
];

const STYLES = [
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'streetwear', label: 'Streetwear' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'sporty', label: 'Sporty' },
    { value: 'bohemian', label: 'Bohemian' },
    { value: 'smart-casual', label: 'Smart Casual' },
];

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

const RATING_LABELS = ['Chưa đánh giá', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

const INITIAL_FORM = {
    category_id: '',
    name: '',
    description: '',
    base_price: '',
    sell_price: '',
    material: '',
    style: '',
    weight: '',
    color: '',
    stock: '',
    review: 0,
};

class NewProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form: { ...INITIAL_FORM },
            previews: [],
            uploadLabel: 'Nhấn để tải ảnh lên hoặc kéo thả vào đây',
            categoryArr: [],
            files: [],
            isOpen: false,
            photoIndex: 0,

            category_id: '',
            name: '',
            description: '',
            base_price: '',
            sell_price: '',
            material: '',
            style: '',
            size: '',
            weight: '',
            color: '',
            stock_qty: '',
            image: ''
        }


    }



    handleChange = (field) => (e) => {
        this.setState((prev) => ({
            form: { ...prev.form, [field]: e.target.value },
        }));
    };

    /**
     * Tính % giảm giá từ base_price và sell_price
     * @returns {string|null}
     */
    getDiscount() {
        const { base_price, sell_price } = this.state.form;
        const base = parseFloat(base_price) || 0;
        const sell = parseFloat(sell_price) || 0;

        if (base > 0 && sell > 0 && sell < base) {
            const pct = Math.round((1 - sell / base) * 100);
            const save = (base - sell).toLocaleString('vi-VN');
            return `Giảm giá ${pct}% so với giá gốc (tiết kiệm ${save}₫)`;
        }
        return null;
    }

    // ── Handlers ────────────────────────────────────────────────────────────


    handleRating = (n) => {
        this.setState((prev) => ({
            form: { ...prev.form, review: n },
        }));
    };

    handleColorSwatch = (hex) => {
        this.setState({
            color: hex
        })
    };

    handleReset = () => {
        this.setState({
            form: { ...INITIAL_FORM },
            previews: [],
            uploadLabel: 'Nhấn để tải ảnh lên hoặc kéo thả vào đây',
        });
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['category_id', 'name', 'base_price', 'sell_price', 'stock_qty']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Missing input: ' + arrCheck[i])
                break;
            }
        }

        return isValid
    }

    handleFiles = (files) => {
        const fileArr = Array.from(files).slice(0, 6);
        const urls = fileArr.map((f) => URL.createObjectURL(f));
        this.setState({
            previews: urls,
            files: fileArr,         // ← lưu file gốc
            uploadLabel: `${fileArr.length} file đã chọn`,
        });
    };


    handleSubmit = async () => {
        let isValid = this.checkValidateInput()
        if (isValid === true) {
            console.log(this.state)

            try {
                // ── Upload ảnh lên Cloudinary qua backend ──
                let imageUrls = [];
                if (this.state.files.length > 0) {
                    const formData = new FormData();
                    this.state.files.forEach((file) => {
                        formData.append('images', file);
                    });

                    const uploadRes = await productService.uploadImage(formData); // ← gọi qua service
                    console.log('uploadRes:', uploadRes);


                    if (uploadRes && uploadRes.errCode === 0) {
                        imageUrls = uploadRes.urls; // ← dùng .data thay vì .json()
                        console.log('imageUrls:', imageUrls);
                    }
                }

                this.props.createNewProduct({
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
                    image: JSON.stringify(imageUrls)
                })
            } catch (e) {
                console.error('Upload error:', e);
            }

        } else {
            return
        }

        //fire redux action

    };



    componentDidMount() {
        this.props.getCategoryStart()

    }

    componentDidUpdate(prevProps, prveState, snapshop) {
        if (prevProps.categoryRedux !== this.props.categoryRedux) {
            let arrCategories = this.props.categoryRedux
            this.setState({
                categoryArr: this.props.categoryRedux,
                category_id: arrCategories && arrCategories.length > 0 ? arrCategories[0].id : ''
            })
        }
    }


    render() {
        const { form, previews, uploadLabel, categoryArr, isOpen, photoIndex } = this.state;
        const discount = this.getDiscount();
        // console.log('check state component', this.state)
        let { category_id, name, description, base_price, sell_price, material, style, size, weight, color, stock_qty, images } = this.state

        let categories = this.state.categoryArr
        return (
            <div className='pf-wrap'>
                {/* <Cursor></Cursor> */}
                {/* Header */}
                <div className="pf-header">
                    <div>
                        <h1 className="pf-title"><FormattedMessage id="product.title"></FormattedMessage></h1>
                        <p className="pf-subtitle"><FormattedMessage id="product.subtitle"></FormattedMessage></p>
                    </div>
                    <span className="pf-badge"><FormattedMessage id="product.draft"></FormattedMessage></span>
                </div>

                <div className="pf-grid">

                    {/* ── Thông tin cơ bản ───────────────────────────────── */}
                    <p className="pf-section-label"><FormattedMessage id="product.basic-info"></FormattedMessage></p>

                    {/* category_id */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="category_id">
                            <FormattedMessage id="product.category"></FormattedMessage> <span>*</span>
                        </label>
                        {/* <select
                            id="category_id"
                            value={form.category_id}
                            onChange={this.handleChange('category_id')}
                        >
                            <option value="" disabled><FormattedMessage id="product.select-category"></FormattedMessage></option>
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select> */}
                        <select onChange={(event) => { this.onChangeInput(event, 'category_id') }} >
                            {categories && categories.length > 0 && categories.map((item, index) => {

                                return (
                                    <option key={index} value={item.id}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    {/* name */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="name">
                            <FormattedMessage id="product.product-name"></FormattedMessage> <span>*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => { this.onChangeInput(event, 'name') }}
                            placeholder="VD: Bàn gaming đời mới..."
                            maxLength={120}
                        />
                        <span className="pf-char">{form.name.length}/120</span>
                    </div>

                    {/* description */}
                    <div className="pf-group pf-full">
                        <label className="pf-label" htmlFor="description"><FormattedMessage id="product.description"></FormattedMessage></label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => { this.onChangeInput(event, 'description') }}
                            placeholder={<FormattedMessage id="product.description-example"></FormattedMessage>}
                            maxLength={2000}
                        />
                        <span className="pf-char">{form.description.length}/2000</span>
                    </div>

                    {/* ── Giá & Tồn kho ──────────────────────────────────── */}
                    <p className="pf-section-label"><FormattedMessage id="product.price-and-stock"></FormattedMessage></p>

                    {/* base_price */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="base_price">
                            <FormattedMessage id="product.base-price"></FormattedMessage> <span>*</span>
                        </label>
                        <div className="pf-prefix">
                            <span className="pf-prefix-sym">₫</span>
                            <input
                                id="base_price"
                                type="number"
                                value={base_price}
                                onChange={(event) => { this.onChangeInput(event, 'base_price') }}
                                placeholder="0"
                                min={0}
                                step={1000}
                            />
                        </div>
                    </div>

                    {/* sell_price */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="sell_price">
                            <FormattedMessage id="product.sell-price"></FormattedMessage> <span>*</span>
                        </label>
                        <div className="pf-prefix">
                            <span className="pf-prefix-sym">₫</span>
                            <input
                                id="sell_price"
                                type="number"
                                value={sell_price}
                                onChange={(event) => { this.onChangeInput(event, 'sell_price') }}
                                placeholder="0"
                                min={0}
                                step={1000}
                            />
                        </div>
                    </div>

                    {/* Discount banner */}
                    {discount && (
                        <div className="pf-full">
                            <p className="pf-discount-msg visible">{discount}</p>
                        </div>
                    )}

                    {/* stock */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="stock">
                            <FormattedMessage id="product.stock"></FormattedMessage> <span>*</span>
                        </label>
                        <input
                            id="stock"
                            type="number"
                            value={stock_qty}
                            onChange={(event) => { this.onChangeInput(event, 'stock_qty') }}
                            placeholder="Số lượng..."
                            min={0}
                            step={1}
                        />
                    </div>

                    {/* weight */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="weight"><FormattedMessage id="product.weight"></FormattedMessage></label>
                        <div className="pf-prefix">
                            <span className="pf-prefix-sym pf-prefix-sym--sm">g</span>
                            <input
                                id="weight"
                                type="number"
                                value={weight}
                                onChange={(event) => { this.onChangeInput(event, 'weight') }}
                                placeholder="0"
                                min={0}
                                style={{ paddingLeft: '28px' }}
                            />
                        </div>
                    </div>

                    {/* ── Thuộc tính ─────────────────────────────────────── */}
                    <p className="pf-section-label"><FormattedMessage id="product.attribute"></FormattedMessage></p>

                    {/* material */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="material"><FormattedMessage id="product.material"></FormattedMessage></label>
                        <input
                            id="material"
                            type="text"
                            value={material}
                            onChange={(event) => { this.onChangeInput(event, 'material') }}
                            placeholder="VD: Gỗ ép, gỗ sồi ..."
                            maxLength={120}
                        />
                    </div>

                    {/* style */}
                    <div className="pf-group">
                        <label className="pf-label" htmlFor="style"><FormattedMessage id="product.style"></FormattedMessage></label>
                        <input
                            id="style"
                            type="text"
                            value={style}
                            onChange={(event) => { this.onChangeInput(event, 'style') }}
                            placeholder="VD: Cổ điển, hiện đại..."
                            maxLength={120}
                        />
                    </div>

                    {/* color */}
                    <div className="pf-group pf-full">
                        <label className="pf-label" htmlFor="color"><FormattedMessage id="product.color"></FormattedMessage></label>
                        <div className="pf-color-row">
                            {SWATCHES.map((sw) => (
                                <div
                                    key={sw.hex}
                                    className={[
                                        'pf-swatch',
                                        sw.isWhite ? 'pf-swatch--white' : '',
                                        form.color === sw.hex ? 'active' : '',
                                    ].filter(Boolean).join(' ')}
                                    style={{ background: sw.hex }}
                                    title={sw.label}
                                    onClick={() => this.handleColorSwatch(sw.hex)}
                                />
                            ))}
                            <input
                                id="color"
                                type="text"
                                className="pf-color-input"
                                value={color}
                                onChange={(event) => { this.onChangeInput(event, 'color') }}
                                placeholder={<FormattedMessage id="product.color-example"></FormattedMessage>}
                            />
                        </div>
                    </div>

                    {/* ── Hình ảnh ───────────────────────────────────────── */}
                    <p className="pf-section-label"><FormattedMessage id="product.image"></FormattedMessage></p>

                    {/* image */}
                    <div className="pf-group pf-full">
                        <label className="pf-label"><FormattedMessage id="product.product-image"></FormattedMessage></label>
                        <label className="pf-upload" htmlFor="image-input">
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
                                id="image-input"
                                name="image"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => this.handleFiles(e.target.files)}
                            />
                        </label>
                        {previews.length > 0 && (
                            <div className="pf-preview-row">
                                {previews.map((src, i) => (
                                    <img key={i} src={src} alt={`preview-${i}`} className="pf-preview-img" onClick={() => this.setState({ isOpen: true, photoIndex: i })} />
                                ))}
                            </div>
                        )}
                    </div>
                    {this.state.isOpen === true && (
                        <Lightbox
                            open={this.state.isOpen}
                            close={() => this.setState({ isOpen: false })}
                            index={this.state.photoIndex}
                            slides={previews.map((src) => ({ src }))}
                            portal={{ root: document.getElementById('root') }}
                        />
                    )}


                    {/* ── Đánh giá ───────────────────────────────────────── */}
                    {/* <p className="pf-section-label">Đánh giá</p> */}

                    {/* review */}
                    {/* <div className="pf-group pf-full">
                        <label className="pf-label">Điểm đánh giá</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="pf-rating-row">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <svg
                                        key={n}
                                        className={`star${form.review >= n ? ' on' : ''}`}
                                        viewBox="0 0 24 24"
                                        onClick={() => this.handleRating(n)}
                                    >
                                        <path d="M12 2l2.9 6.3L22 9.3l-5 5 1.2 7.1L12 18l-6.2 3.4L7 14.3l-5-5 7.1-1z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="pf-rating-val">{RATING_LABELS[form.review]}</span>
                        </div>
                    </div> */}

                    {/* ── Actions ────────────────────────────────────────── */}
                    <div className="pf-actions">
                        <button type="button" className="btn-cancel" onClick={this.handleReset}>
                            Huỷ
                        </button>
                        <button type="button" className="btn-submit" onClick={this.handleSubmit}>
                            Tạo sản phẩm →
                        </button>
                    </div>

                </div>

            </div>

        )
    }

}

const mapStateToProps = state => {
    return {
        categoryRedux: state.product.categories
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
        getCategoryStart: () => dispatch(actions.fetchCategoryStart()),
        createNewProduct: (data) => dispatch(actions.createNewProduct(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProduct);
