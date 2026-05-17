import actionTypes from '../actions/actionTypes';

const initialState = {
    items: [],
    isOpen: false,
};

const getFirstImage = (product) => {
    if (Array.isArray(product.image)) return product.image[0] || null;
    if (typeof product.image === 'string') {
        try {
            const arr = JSON.parse(product.image);
            return arr[0] || null;
        } catch { return null; }
    }
    return null;
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.CART_ADD_ITEM: {
            const { product, quantity } = action.payload;
            const existing = state.items.find(i => i.id === product.id);
            if (existing) {
                return {
                    ...state,
                    isOpen: true,
                    items: state.items.map(i =>
                        i.id === product.id
                            ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
                            : i
                    ),
                };
            }
            return {
                ...state,
                isOpen: true,
                items: [
                    ...state.items,
                    {
                        id: product.id,
                        name: product.name,
                        sell_price: product.sell_price,
                        image: getFirstImage(product),
                        color: product.color || null,
                        quantity,
                    },
                ],
            };
        }

        case actionTypes.CART_REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.payload.id),
            };

        case actionTypes.CART_UPDATE_QUANTITY: {
            const { id, quantity } = action.payload;
            if (quantity < 1) {
                return { ...state, items: state.items.filter(i => i.id !== id) };
            }
            return {
                ...state,
                items: state.items.map(i =>
                    i.id === id ? { ...i, quantity: Math.min(10, quantity) } : i
                ),
            };
        }

        case actionTypes.CART_CLEAR:
            return { ...state, items: [] };

        case actionTypes.CART_TOGGLE_DRAWER:
            return { ...state, isOpen: !state.isOpen };

        default:
            return state;
    }
};

export default cartReducer;
