import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
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
            console.log(produitsCollectionRef);
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

    return (
        <>
            <Navbar user={name} />
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts} />
                    </div>
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid'>Aucun produit</div>
            )}
        </>
    )
}