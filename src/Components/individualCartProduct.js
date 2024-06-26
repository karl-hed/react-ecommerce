import React from 'react';
import { CartProducts } from './CartProducts';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';
import { minus } from 'react-icons-kit/feather/minus';
import { auth, fs } from '../Config/Config';
import { doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const IndividualCartProduct = ({ cartProduct, cartProductIncrease, cartProductDecrease }) => {
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

    const handleCartProductDecrease = () => {
        cartProductDecrease(cartProduct);
    }

    const deleteProduct = async (user) => {
        const produitsDoc = doc(fs, "Cart " + user.uid, cartProduct.ID);
        await deleteDoc(produitsDoc);
    }

    const handleCartProductDelete = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                deleteProduct(user);
            } else {
              console.log("utilisateur non connecté");
            }
          });
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
                    <Icon icon={minus} size={20} onClick={handleCartProductDecrease} />
                </div>
                <div>{qty}</div>
                <div className='action-btn plus' >
                    <Icon icon={plus} size={20} onClick={handleCartProductIncrease} />
                </div>
            </div>
            <div className='product-text cart-price'>$ {totalProductPrice}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleCartProductDelete}>ENLEVER</div>
        </div>
        
    )
}