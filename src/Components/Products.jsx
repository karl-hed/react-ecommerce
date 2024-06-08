import React from 'react';
import { IndividualProduct } from './IndividualProduct';

export const Products = ({ products, addToCart }) => {
  //console.log(products);
  products.map((product) => {
    //console.log(product);
  });

  return products.map((individualProduct) => {
    //console.log(individualProduct);
    // https://stackoverflow.com/a/52861298
    return <IndividualProduct key={individualProduct.id} individualProduct={individualProduct} 
            addToCart={addToCart}
           />
  })
}
