import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Images/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';
import { auth } from '../Config/Config';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ user, totalProduits }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      //navigate.push('/login');
      navigate('/login');
    });
  }

  return (
    <>
      <div className='navbar'>
        <div className='leftside'>
          <div className='logo'>
            <img src={logo} alt='logo' />
          </div>
        </div>
      
        <div className='rightside'>

          {!user && <>
            <div><Link className='navlink' to="signup">SIGN UP</Link></div>
            <div><Link className='navlink' to="login">LOGIN</Link></div>
          </>}
          {user && <>
            <div><Link className='navlink' to="/">{user}</Link></div>
            <div className='cart-menu-btn'>
              <Link className='navlink' to="/cart">
                <Icon icon={shoppingCart} size={20}/>
              </Link>
              <span className='cart-indicator'>{totalProduits}</span>
            </div>
            <div className='btn btn-danger btn-md' onClick={handleLogout}>LOGOUT</div>
          </>}
        </div>
      </div>
    </>
  )
}
