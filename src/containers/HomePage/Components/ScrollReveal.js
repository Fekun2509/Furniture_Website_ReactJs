import { Component } from 'react';

class ScrollReveal extends Component {
    componentDidMount() {
        this._io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('visible');
                });
            },
            { threshold: 0.08 }
        );

        this._observeNew();

        // Observe elements added dynamically (e.g. after async data loads)
        this._mo = new MutationObserver(() => this._observeNew());
        this._mo.observe(document.body, { childList: true, subtree: true });
    }

    _observeNew() {
        document.querySelectorAll('.reveal:not([data-sr])').forEach((el) => {
            el.setAttribute('data-sr', '1');
            this._io.observe(el);
        });
    }

    componentWillUnmount() {
        if (this._io) this._io.disconnect();
        if (this._mo) this._mo.disconnect();
    }

    render() {
        return this.props.children;
    }
}

export default ScrollReveal;
