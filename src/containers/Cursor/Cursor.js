import { Component } from 'react';
import './Cursor.scss';

class Cursor extends Component {
    constructor(props) {
        super(props);
        this.cursorRef = null;
        this.ringRef = null;
        this._mx = 0;
        this._my = 0;
        this._rx = 0;
        this._ry = 0;
        this._rafId = null;
    }

    componentDidMount() {
        document.addEventListener('mousemove', this._onMouseMove);
        this._animRing();
        this._addHoverListeners();
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this._onMouseMove);
        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._removeHoverListeners();
    }

    _onMouseMove = (e) => {
        this._mx = e.clientX;
        this._my = e.clientY;
        if (this.cursorRef) {
            this.cursorRef.style.left = this._mx + 'px';
            this.cursorRef.style.top = this._my + 'px';
        }
    };

    _animRing = () => {
        this._rx += (this._mx - this._rx) * 0.12;
        this._ry += (this._my - this._ry) * 0.12;
        if (this.ringRef) {
            this.ringRef.style.left = this._rx + 'px';
            this.ringRef.style.top = this._ry + 'px';
        }
        this._rafId = requestAnimationFrame(this._animRing);
    };

    _addHoverListeners() {
        const sel = 'a,button,.cat-card,.prod-card,.gg-nav-icon,.gg-social-btn';
        document.querySelectorAll(sel).forEach((el) => {
            el.addEventListener('mouseenter', this._onEnter);
            el.addEventListener('mouseleave', this._onLeave);
        });
    }

    _removeHoverListeners() {
        const sel = 'a,button,.cat-card,.prod-card,.gg-nav-icon,.gg-social-btn';
        document.querySelectorAll(sel).forEach((el) => {
            el.removeEventListener('mouseenter', this._onEnter);
            el.removeEventListener('mouseleave', this._onLeave);
        });
    }

    _onEnter = () => {
        if (!this.cursorRef || !this.ringRef) return;
        this.cursorRef.style.transform = 'translate(-50%,-50%) scale(2.5)';
        this.ringRef.style.width = '48px';
        this.ringRef.style.height = '48px';
        this.ringRef.style.borderColor = 'rgba(0,232,213,0.8)';
    };

    _onLeave = () => {
        if (!this.cursorRef || !this.ringRef) return;
        this.cursorRef.style.transform = 'translate(-50%,-50%) scale(1)';
        this.ringRef.style.width = '32px';
        this.ringRef.style.height = '32px';
        this.ringRef.style.borderColor = 'rgba(0,232,213,0.5)';
    };

    render() {
        return (
            <>
                <div className="gg-cursor" ref={(el) => (this.cursorRef = el)} />
                <div className="gg-cursor-ring" ref={(el) => (this.ringRef = el)} />
            </>
        );
    }
}

export default Cursor;
