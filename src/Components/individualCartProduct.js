import React from 'react';
import { CartProducts } from './CartProducts';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';
import { minus } from 'react-icons-kit/feather/minus';

export const IndividualCartProduct = ({ cartProduct, cartProductIncrease }) => {
    let url = "";
    let title = "";
    let description = "";
    let price = "";
    let totalProductPrice = "";
    let qty = "";
    Object.values(cartProduct).forEach(element => {
        url = element.downloadURL;
        title = element.title;
        description = element.description;
        price = element.price;
        totalProductPrice = element.TotalProductPrice;
        qty = element.qty;
        if (element.downloadURL) {
            //console.log(element.downloadURL);
        }
    });
    //console.log(url);
    //console.log(cartProduct);


    const handleCartProductIncrease = () => {
        cartProductIncrease(cartProduct);
    }

    return (
        
        <div className='product'>
            <div className='product-img'>
                <img src={url} alt='cart product' />
            </div>
            <div className='product-text title'>{title}</div>
            <div className='product-text description'>{description}</div>
            <div className='product-text price'>{price}</div>
            <span>Quantité</span>
            <div className='product-text quantity-box'>
                <div className='action-btn minus' >
                    <Icon icon={minus} size={20} />
                </div>
                <div>{qty}</div>
                <div className='action-btn plus' >
                    <Icon icon={plus} size={20} onClick={handleCartProductIncrease} />
                </div>
            </div>
            <div className='product-text cart-price'>$ {totalProductPrice}</div>
            <div className='btn btn-danger btn-md cart-btn' >ENLEVER</div>
        </div>
        
    )
}