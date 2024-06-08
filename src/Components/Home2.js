import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Products } from './Products';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
//import { FirebaseAuth } from 'firebase/firestore';

export const Home = () => {

  const usersCollectionRef = collection(fs, "users");
  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {

          async function getUser() {
            const ref = doc(fs, "users", user.uid);
            const userDoc = await getDoc(ref);
            return userDoc.data();
          }
          /*
          console.log(user.uid);
          const ref = doc(fs, "users", user.uid);
          console.log(`ref = ${ref.uid}`);
          const getUser = async () => {
            const ref = doc(fs, "users", user.uid);
            console.log(`ref = ${ref.uid}`);
            const userDoc = await getDoc(ref);
            console.log(userDoc.data());
            //return userDoc.data();
          }
          */
          //getUser();
          getUser().then(snapshot => {
            console.log(snapshot);
          })
          console.log(getUser());
          //setUser(getUser());
          //console.log(userDoc.id);
          /*
          doc(fs, "users", user.uid).then(snapshot => {
            setUser(snapshot.data().FullName);
          });
          */
          
          /*
          const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            //console.log(usersCollectionRef.firestore.toJSON());
            //console.log(data);
            setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            
          };
          */
          //getUsers();
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  console.log(user);


  return (
    <>
        <Navbar/>
        <Products/>
    </>
  )
}
