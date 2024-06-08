import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './Components/Home';
import { Signup } from "./Components/Signup";
import { Login } from "./Components/Login";
import { NotFound } from "./Components/NotFound";
import { AddProducts } from "./Components/AddProducts";
import { Cart } from "./Components/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={< Home />} />
        <Route path="/signup" element={< Signup />} />
        <Route path="/login" element={< Login />} />
        <Route path="/add-products" element={< AddProducts />} />
        <Route path="/cart" element={< Cart />} />
        <Route element={< NotFound />} />
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
