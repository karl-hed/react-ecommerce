import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { CartProducts } from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';

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


  // state de totalProduits
  const [totalProduits, setTotalProduits] = useState(0);

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

                const qte = snapshot.docs.length;
                setTotalProduits(qte);
            });
        } else {
            console.log('utilisateur non inscrit');
        }
    });
  }, []);

  // console.log(cartProducts);
  
  // avoir les quantites de cartProducts dans un tableau separe
  // les 2 versions fonctionnent qty et quantite
  const qty = Object.values(cartProducts).map(cartProduct => { 
    //console.log(cartProduct.Product.qty);
    return cartProduct.Product.qty;
  });

  const quantite = cartProducts.map(cartProduct => {
    return cartProduct.Product.qty;
  });

  //console.log(qty);
  // console.log(quantite);

  // reducing quantite dans une seule valeur
  const reducerDeQuantite = (accumulateur, valeurCourante) => accumulateur + valeurCourante;

  const totalQuantite = qty.reduce(reducerDeQuantite, 0);

  // console.log(totalQuantite);

  // avoir le TotalProductPrice du cartProducts dans un tableau different
  const prix = cartProducts.map((cartProduct) => {
    return cartProduct.Product.TotalProductPrice;
  });

  // reducer pour le prix dans une variable
  const reducerPrix = (accumulateur, valeurCourante) => accumulateur + valeurCourante;

  const prixTotal = prix.reduce(reducerPrix, 0);

  // global variable
  let Product;

  // update Produit
  const updateProduct = async (user, cartProduct, quantite) => {

    let ProductObject = {
      price: 0,
      qty: 0,
      TotalProductPrice: 0,
      description: "",
      downloadURL: "",
      id: "",
      title: ""
    };

    // ici il n'y a qu'un seul cartProduct
    Object.values(cartProduct).forEach(element => {
      ProductObject.price = element.price;
      ProductObject.qty = element.qty + quantite;
      ProductObject.TotalProductPrice = element.price * ProductObject.qty;
      ProductObject.title = element.title;
      ProductObject.description = element.description;
      ProductObject.id = element.id;
      ProductObject.downloadURL = element.downloadURL;
    });
    //console.log(`ProductObject['qty']: ${ProductObject['qty']}, ProductObject['price']: ${ProductObject['price']}, ProductObject['TotalProductPrice']: ${ProductObject['TotalProductPrice']}`);
    //console.log(`ProductObject['title']: ${ProductObject['title']}, ProductObject['description']: ${ProductObject['description']}, ProductObject['id']: ${ProductObject['id']}, ProductObject['downloadURL']: ${ProductObject['downloadURL']}`);
    //console.log(`cartProduct.ID = ${cartProduct.ID}`);

    const produitsDoc = doc(fs, "Cart " + user.uid, cartProduct.ID);
    Product = ProductObject
    await updateDoc(produitsDoc, { Product });
  };

  // cart product increase function
  const cartProductIncrease = (cartProduct) => {

    //console.log(cartProduct);

    // updating in database
    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateProduct(user, cartProduct, 1);
      } else {
        console.log("utilisateur non connecté");
      }
    });
  }

  // cart product decrease functionnality
  const cartProductDecrease = (cartProduct) => {
    let quantite = 0;
    Object.values(cartProduct).forEach(element => {
      quantite = element.qty;
    });
    if (quantite > 1) {
      // updating in database
      onAuthStateChanged(auth, (user) => {
        if (user) {
          updateProduct(user, cartProduct, (-1));
        } else {
          console.log("utilisateur non connecté");
        }
      });
    }
  }

    return (
        <>
            <Navbar user={name} totalProduits={totalProduits} />
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts} 
                        cartProductIncrease={cartProductIncrease} 
                        cartProductDecrease={cartProductDecrease} />
                    </div>
                    <div className='summary-box'>
                      <h5>Contenu du panier</h5>
                      <br></br>
                      <div>
                        Nombre de produits: <span>{totalQuantite}</span>
                      </div>
                      <div>
                        Total à payer: <span>$ {prixTotal}</span>
                      </div>
                      <br></br>
                      <StripeCheckout>

                      </StripeCheckout>
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid'>Aucun produit</div>
            )}
        </>
    )
}