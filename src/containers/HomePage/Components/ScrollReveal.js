import { Component } from 'react';

/**
 * ScrollReveal
 * Wraps the page and activates `.reveal` elements via IntersectionObserver.
 * Use as a layout wrapper around your page content.
 */
class ScrollReveal extends Component {
    constructor(props) {
        super(props);
        this._observer = null;
    }

    componentDidMount() {
        this._observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add('visible');
                });
            },
            { threshold: 0.08 }
        );

        document.querySelectorAll('.reveal').forEach((el) =>
            this._observer.observe(el)
        );
    }

    componentWillUnmount() {
        if (this._observer) this._observer.disconnect();
    }

    render() {
        return this.props.children;
    }
}

export default ScrollReveal;
