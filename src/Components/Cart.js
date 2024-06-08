import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { CartProducts } from './CartProducts';

let userCopyEmail = "";
let name = "";

export const Cart = () => {

    const usersCollectionRef = collection(fs, "users");

    

  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userCopyEmail = user.email;
          //console.log(userCopyEmail);
          //console.log(user.email);
          const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          };
      
          getUsers();
          /*
            v8 firebase: fs.collection('users').doc(user.uid).get().then(snapshot => {
              setUser(snapshot.data().FullName);
            });
            v9 firebase: ????
          */
        } else {
          setUser(null);
        }
      })
    }, []);

    return user;
  }

  const users = GetCurrentUser();

  let newUser = [];
  if (users) {
    newUser = users.filter(element => element.Email === userCopyEmail)
  }

  Object.values(newUser).forEach(element => {
    //console.log(element.FullName);
    // https://stackoverflow.com/a/58467739
    name = element.FullName;
  });

  const [cartProducts, setCartProducts] = useState([]);

  // chercher les produits du firestore
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const produitsCollectionRef = collection(fs, "Cart " + user.uid);
            //console.log(produitsCollectionRef);
            onSnapshot(produitsCollectionRef, snapshot => {
                const newCartProduct = snapshot.docs.map((doc) => ({
                    ID: doc.id,
                    ...doc.data(),
                }));
                setCartProducts(newCartProduct);
            });
        } else {
            console.log('utilisateur non inscrit');
        }
    });
  }, []);

  //console.log(cartProducts);

  // global variable
  let Product;


  // cart product increase function
  const cartProductIncrease = (cartProduct) => {

    const updateProduct = async (user) => {
      /*
      Product = cartProduct;
      Product['qty'] = Product['qty'] + 1;
      Product['TotalProductPrice'] = Product.qty * Product.price;
      const docRef = updateDoc(doc(fs, 'Cart ' + user.uid, Product.ID), { Product }).then(() => {
        console.log("Successfully updated cart");
      });
      */
      
      //ProductObject = cartProduct;
      let ProductObject = {
        price: 0,
        qty: 0,
        totalProductPrice: 0,
        description: "",
        downloadURL: "",
        id: "",
        title: ""
      };
      let price = 0;
      let qty = 0;
      let totalProductPrice = 0;
      Object.values(cartProduct).forEach(element => {
        ProductObject.price = element.price;
        ProductObject.qty = element.qty + 1;
        ProductObject.totalProductPrice = Number(element.price) * Number(element.qty);
        ProductObject.title = element.title;
        ProductObject.description = element.description;
        ProductObject.id = element.id;
        ProductObject.downloadURL = element.downloadURL;
        // console.log(element);
      });
      console.log(`ProductObject['qty']: ${ProductObject['qty']}, ProductObject['price']: ${ProductObject['price']}, ProductObject['totalProductPrice']: ${ProductObject['totalProductPrice']}`);
      console.log(`ProductObject['title']: ${ProductObject['title']}, ProductObject['description']: ${ProductObject['description']}, ProductObject['id']: ${ProductObject['id']}, ProductObject['downloadURL']: ${ProductObject['downloadURL']}`);
      console.log(`cartProduct.ID = ${cartProduct.ID}`);
      /*
      console.log(`cartProduct = ${cartProduct}`);
      console.log(`cartProduc.price = ${cartProduct.price}`);
      console.log(`Product.ID = ${Product.ID}, Product.qty = ${Product.qty}, Product.TotalProductPrice = ${Product.TotalProductPrice}`);
      */
      //Product.qty = Product.qty + 1;
      //Product.TotalProductPrice = Number(Product.qty) * Number(Product.price);
      // console.log(`Product.ID = ${Product.ID}, Product.qty = ${Product.qty}, Product.TotalProductPrice = ${Product.TotalProductPrice}`);
      const produitsDoc = doc(fs, "Cart " + user.uid, cartProduct.ID);
      //console.log(`produitsDoc = ${produitsDoc}`);
      // const newFields = {age: age + 1};
      Product = ProductObject
      await updateDoc(produitsDoc, { Product });
    };

    // console.log(cartProduct);

    // updating in database
    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateProduct(user);
      } else {
        console.log();
      }
    });
  }

    return (
        <>
            <Navbar user={name} />
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts} cartProductIncrease={cartProductIncrease} />
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid'>Aucun produit</div>
            )}
        </>
    )
}