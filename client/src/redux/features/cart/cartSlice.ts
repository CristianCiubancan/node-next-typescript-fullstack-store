import { createSlice, current } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Attribute, Product, Variation } from "../../../types/product";

export interface CartItem {
  variationSku: string;
  productSku: string;
  variationName: string;
  productName: string;
  quantity: number;
  price: string;
  stock: number;
  attributes: Attribute[];
  image: string;
  placeholderUrl: string;
}

export interface Cart {
  cartItems: CartItem[];
  totalPrice: number;
}

interface CartState {
  value: Cart;
}

export const initialState: CartState = {
  value: { cartItems: [], totalPrice: 0 },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.value = action.payload;
    },
    addItemToCart(state, action) {
      const product: Product = action.payload.product;
      const variation: Variation = action.payload.variation;
      const image: string = action.payload.image;
      const stock: number = action.payload.variation.stock;
      const placeholderUrl: string = action.payload?.placeholderUrl;

      const currentState = current(state).value;
      const otherItems = currentState.cartItems.filter(
        (cartItem) => cartItem.variationSku !== variation.sku
      );
      const currentItem: CartItem = currentState.cartItems.filter(
        (cartItem) => cartItem.variationSku === variation.sku
      )[0];

      const newCartItems = [
        currentItem
          ? { ...currentItem, quantity: currentItem.quantity + 1 }
          : {
              productName: product.name,
              variationName: variation.name,
              productSku: product.sku,
              variationSku: variation.sku,
              image,
              stock,
              placeholderUrl,
              attributes: variation.attributes,
              price: (
                variation.price * parseFloat(variation.discountMultiplier)
              ).toFixed(2),
              quantity: 1,
            },
        ...otherItems,
      ];

      state.value = {
        totalPrice: parseFloat(
          newCartItems
            .map((item) =>
              parseFloat((parseFloat(item.price) * item.quantity).toFixed(2))
            )
            .reduce((partialSum, a) => partialSum + a, 0)
            .toFixed(2)
        ),
        cartItems: newCartItems,
      };
    },
    increaseItemQuantity(state, action) {
      const { idx, variationSku } = action.payload;
      const currentItem = current(state).value.cartItems.filter(
        (item) => item.variationSku === variationSku
      )[0];
      const otherItems = current(state).value.cartItems.filter(
        (item) => item.variationSku !== variationSku
      );
      const newItem = { ...currentItem, quantity: currentItem.quantity + 1 };
      const newCartItems = [...otherItems, newItem];

      state.value.totalPrice = parseFloat(
        newCartItems
          .map((item) =>
            parseFloat((parseFloat(item.price) * item.quantity).toFixed(2))
          )
          .reduce((partialSum, a) => partialSum + a, 0)
          .toFixed(2)
      );
      state.value.cartItems[idx] = newItem;
    },
    decreaseItemQuantity(state, action) {
      const { idx, variationSku } = action.payload;
      const currentItem = current(state).value.cartItems.filter(
        (item) => item.variationSku === variationSku
      )[0];
      const otherItems = current(state).value.cartItems.filter(
        (item) => item.variationSku !== variationSku
      );

      const newItem = { ...currentItem, quantity: currentItem.quantity - 1 };

      const newCartItems = [...otherItems, newItem];
      state.value.totalPrice = parseFloat(
        newCartItems
          .map((item) =>
            parseFloat((parseFloat(item.price) * item.quantity).toFixed(2))
          )
          .reduce((partialSum, a) => partialSum + a, 0)
          .toFixed(2)
      );
      state.value.cartItems[idx] = newItem;
    },
    removeItem(state, action) {
      const { variationSku } = action.payload;

      const otherItems = current(state).value.cartItems.filter(
        (item) => item.variationSku !== variationSku
      );
      const newCartItems = otherItems;

      state.value = {
        totalPrice: parseFloat(
          newCartItems
            .map((item) =>
              parseFloat((parseFloat(item.price) * item.quantity).toFixed(2))
            )
            .reduce((partialSum, a) => partialSum + a, 0)
            .toFixed(2)
        ),
        cartItems: newCartItems,
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(HYDRATE, (state, action: any) => {
      if (action.payload.cart) {
        state.value = action.payload.cart.value;
      }
    });
  },
});

export const {
  setCart,
  addItemToCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItem,
} = cartSlice.actions;
export default cartSlice.reducer;
