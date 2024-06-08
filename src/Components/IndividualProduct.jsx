//import { type } from '@testing-library/user-event/dist/type';
import React from 'react';


export const IndividualProduct = ({ individualProduct, addToCart }) => {
    //console.log(individualProduct.product);
    //console.log(typeof(individualProduct));
    //console.log(Object.values(individualProduct));
    //Object.values(individualProduct).forEach((element) => {
    //    console.log(element);
    //});
    //console.log('allo');

    const handleAddToCart = () => {
      addToCart(individualProduct);
    }

  return (
    <div className='product'>
        <div className='product-img'>
            <img src={individualProduct.downloadURL} alt='product-img' />
        </div>
        <div className='product-text title'>{individualProduct.title}</div>
        <div className='product-text description'>{individualProduct.description}</div>
        <div className='product-text price'>$ {individualProduct.price}</div>
        <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
    </div>
  )
}


/*
export const IndividualProduct = (props) => {
    console.log(props.individualProduct.downloadURL);
  return (
    <div className='product'>
        <div className='product-img'>
            <img src={props.individualProduct.downloadURL} alt='product-img' />
        </div>
        <div className='product-text title'>{props.individualProduct.title}</div>
        <div className='product-text description'>{props.individualProduct.description}</div>
        <div className='product-text price'>$ {props.individualProduct.price}</div>
        <div className='btn btn-danger btn-md cart-btn'>ADD TO CART</div>
    </div>
  )
}
*/