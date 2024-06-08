import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Products } from './Products';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
//import { FirebaseAuth } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

let userCopyEmail = "";
let name = "";

export const Home = () => {

  const navigate = useNavigate();

  // getting current user uid

  function GetUserUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUid(user.uid);
        }
      })
    }, [])
    return uid;
  }

  const uid = GetUserUid();

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

  const users = GetCurrentUser(); // this send all users in the db, not the current user
  // uid in Auth db is not the same as uid user in firestore db
  let newUser = [];
  if (users) {
    users.forEach(element => {
      //console.log(element.Email);
    });
    newUser = users.filter(element => element.Email === userCopyEmail)
  }
  
  //console.log(newUser[0].FullName);
  
  // console.log(users);
  //console.log(userCopyEmail);
  //console.log(newUser[Object.keys(newUser)[0]]);
  //console.log(Object.values(newUser).find(element => element.FullName));

  var sortedKeys = Object.keys(newUser).sort();
  var first = newUser[sortedKeys[0]];
  //console.log(first);

  //console.log(newUser['FullName']);
  Object.values(newUser).forEach(element => {
    //console.log(element.FullName);
    // https://stackoverflow.com/a/58467739
    name = element.FullName;
  });
  //console.log(Object.values(newUser));
  /*
  users.forEach((u) => {
    console.log(u);
  });
*/

// state of products
const [products, setProducts] = useState([]);

// getting products function
const getProducts = async () => {
  const productsCollectionRef = collection(fs, "Products");
  const data = await getDocs(productsCollectionRef);
  //console.log(data);
  setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};

/*
const getProducts = async () => {
  const products = await collection(fs, "products");
  console.log(products);
  const productsArray = [];
  for (var snap of products) {
    console.log(snap.data());
    var data = snap.data();
  }
}
*/
useEffect(() => {
  getProducts();
  //console.log(products);
}, []);

let Product;
const addToCart = (product) => {
  if (uid !== null) {
    console.log(product);
    Product = product;
    Product['qty'] = 1;
    Product['TotalProductPrice'] = Product.qty * Product.price;
    const docRef = addDoc(collection(fs, 'Cart ' + uid), { Product }).then(() => {
      console.log("Successfully added to cart");
    });
  } else {
    navigate('/login');
  }
  
}

  return (
    <>
        <Navbar user={name} />
        <br></br>
        {products.length > 0 && (
          <div className='container-fluid'>
            <h1 className='text-center'>Products</h1>
            <div className='products-box'>
              <Products products={products} addToCart={addToCart} />
            </div>
          </div>
        )}
        {products.length < 1 && (
          <div className='container-fluid'>Please wait</div>
        )}
    </>
  )
}
