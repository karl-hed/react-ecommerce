import React, { useState } from 'react';
import { auth, fs } from '../Config/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const usersCollectionRef = collection(fs, "users");

    const createUser = async () => {
        await addDoc(usersCollectionRef, {
            FullName: fullName,
            Email: email,
            Password: password
        });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // console.log(fullName, email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((credentials) => {
                console.log(credentials);
                createUser();
            }).then(() => {
                setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                setFullName('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/login');  
                }, 3000)
            }).catch(error=>setErrorMsg(error.message))
            .catch((error) => {
                setErrorMsg(error.message);
            })
    }

  return (
    <div className='container'>
        <br></br>
        <br></br>
        <h1>Sign Up</h1>
        <hr></hr>
        {successMsg &&
            <>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>
        }
        <form className='form-group' autoComplete='off' onSubmit={handleSignup}>
            <label>Full Name</label>
            <input type='text' className='form-control' required onChange={(e) => setFullName(e.target.value)} value={fullName}></input>
            <br></br>
            <label>Email</label>
            <input type='email' className='form-control' required onChange={(e) => setEmail(e.target.value)} value={email}></input>
            <br></br>
            <label>Password</label>
            <input type='password' className='form-control' required onChange={(e) => setPassword(e.target.value)} value={password}></input>
            <br></br>
            <div className='btn-box'>
                <span>Already have an account Login
                    <Link to="/login" className='link'> Here</Link>
                </span>
                <button type='submit' className='btn btn-success btn-md'>SIGN UP</button>
            </div>
        </form>
        {errorMsg &&
            <>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>
            </>
        }
    </div>
  )
}
