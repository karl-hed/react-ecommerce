import React from 'react';
import { IndividualCartProduct } from './individualCartProduct';

export const CartProducts = ({ cartProducts }) => {
     //console.log(cartProducts);
    return cartProducts.map((cartProduct) => {
        return <IndividualCartProduct key={cartProduct.ID} cartProduct={cartProduct} />
    })
}