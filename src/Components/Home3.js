import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Products } from './Products';
import { auth, fs } from '../Config/Config';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
//import { FirebaseAuth } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const Home = () => {

  const usersCollectionRef = collection(fs, "users");
  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {


          let ref = "";
          async function getUser() {
            ref = doc(fs, "users", user.uid);
            console.log(ref);
            const userDoc = await getDoc(ref);
            console.log(userDoc.ref);
            return userDoc
            //return userDoc.data();
          }

          const userDoc = getUser();
          console.log(userDoc);
          userDoc.then(snapshot => {
            console.log(snapshot);
            //setUser(snapshot.data().FullName);
          });
          onSnapshot(usersCollectionRef, (snapshot) => {
            console.log(snapshot);
            console.log(user.uid);
            snapshot.forEach((snap) => {
              console.log(snap.id);
            });
          });
          //const firestore = fs;
          //const docPath = fs.doc('/users/' + auth.currentUser.uid)
          //const docPath = doc(fs, '/users/' + auth.currentUser.uid);
          //console.log(docPath.firestore.app.name);
          
          /*
          docPath.get().then((doc) => {
            if (doc && doc.exists) {
              console.log(doc);
              //this.nameOfUser = doc.data()
            }
          })
          */

          //const documentCollection = doc(fs, 'users', auth.currentUser.uid);
          
          //console.log(documentCollection.firestore.app);
          //console.log(documentCollection);
          /*
          const data = getDocs(usersCollectionRef).then((snapshot) => {
            snapshot.docs.map((u) => {
              if (u.id == user.uid) {

              } else {
                console.log(u.id);
              }
              //if (u.id ==)
            });
            //console.log(snapshot.docs);
          });
          */
          /*
          onSnapshot(usersCollectionRef, (snapshot) =>{
            console.log(snapshot);
            snapshot.docs.map((u) => {
              //console.log(u.id)
              //console.log(u.get());
              
              u.get().then((s) => {
                console.log(s)
              })
            })
            //console.log(auth.currentUser.displayName);
            //setUser(auth.currentUser.FullName);
          });
          */
          
        } else {
          setUser(null);
        }
      })
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  //console.log(user);


  return (
    <>
        <Navbar/>
        <Products/>
    </>
  )
}
