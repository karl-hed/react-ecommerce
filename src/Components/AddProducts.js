import React, { useState } from 'react';
import { storage, fs, ref } from '../Config/Config';
// import { ref } from 'firebase/database';
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 

export const AddProducts = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState('');

    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];
    const handleProductImg = (e) => {
        let fichier = e.target.files[0];
        if (fichier) {
            if (fichier && types.includes(fichier.type)) {
                setImage(fichier);
                setImageError('');
            } else {
                setImage(null);
                setImageError('Image non valide');
            }
        } else {
            console.log('Choisir un fichier');
        }
    }

    const handleAjouterProduit = (e) => {
        e.preventDefault();
        // console.log(title, description, price);
        // console.log(image);
        const storageRef = ref(storage, `product-images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        //console.log('Upload is paused');
                        break;
                    case 'running':
                        //console.log('Upload is running');
                        break;
                    default:
                        //console.log('Default');
                    }
            }, error => setUploadError(error.message), () => {
                // getting product url and if success then storing te product in db
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //console.log('File available at', downloadURL);
                    
                    const docRef = addDoc(collection(fs, 'Products'), {
                        title,
                        description,
                        price: Number(price),
                        downloadURL
                    });
                    //console.log("Document written with ID: ", docRef.id);
                }).then(() => {
                    setSuccessMsg('Produit ajoute');
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    document.getElementById('file').value = '';
                    setImageError('');
                    setUploadError('');
                    setTimeout(() => {
                        setSuccessMsg('');
                    }, 3000);
                }).catch(error => setUploadError(error.message));
            }
        );
    }

  return (
    <div className='container'>
        <br></br>
        <br></br>
        <h1>Ajouter des produits</h1>
        <hr></hr>
        {successMsg && <>
            <div className='success-msg'>{successMsg}</div>
            <br></br>
        </>}
        <form autoComplete='off' className='form-group' onSubmit={handleAjouterProduit}>
            <label>Produit</label>
            <input type='text' className='form-control' required onChange={(e) => setTitle(e.target.value)} value={title}></input>
            <br></br>
            <label>Description du produit</label>
            <input type='text' className='form-control' required onChange={(e) => setDescription(e.target.value)} value={description}></input>
            <br></br>
            <label>Prix</label>
            <input type='number' className='form-control' required onChange={(e) => setPrice(e.target.value)} value={price}></input>
            <br></br>
            <label>Choisir une image</label>
            <input type='file' id='file' className='form-control' required onChange={handleProductImg}></input>
            {imageError && <>
                <br></br>
                <div className='error-msg'>{imageError}</div>
            </>}
            <br></br>
            <div style={{display:'flex', justifyContent:'flex-end'}}>
                <button type='submit' className='btn btn-success btn-md'>
                    SUBMIT
                </button>
            </div>
        </form>
        {uploadError && <>
            <br></br>
            <div className='error-msg'>{uploadError}</div>
        </>}
    </div>
  )
}
