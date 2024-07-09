import React from 'react'
// import React, { useState } from 'react'
import css from './Navbar.module.css'
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Logo_without_BG from '../Assets/Image/logo_without_bg.png';

function Navbar(props) {

  // const leave = ()=>{
  //     const arrow = document.getElementById('arrowicon');

  //     arrow.animate([
  //         { transform: 'rotate(180deg)'},
  //         { transform: 'rotate(0deg)'}
  // ], {
  //   duration: 1000/2,
  //       }
  //     )
  // }

  const navigate = useNavigate();




  return (<>
    <div className={css.navbar}>
      <div className={css.navfirst}>
        <ul className={css.ul}>
            <Link to={localStorage.getItem("token")?"/user":"/"} className={css.link}>
              <li className={css.li}><img src={Logo_without_BG} alt="" srcset="" /></li>
            </Link>
        </ul>
      </div>


      <div className={css.navsecond}>
        <ul className={css.navsecondul}>
            <Link to={localStorage.getItem("token")?"/user":"/"} className={css.link}><li className={css.li}>Home</li></Link>
            <Link to="/developer" className={css.link}><li className={css.li}>Developers</li></Link>
            <Link to="/" className={css.link}><li className={css.li}>About Us</li></Link>
            <Link to="/" className={css.link}><li className={css.li}>Contact Us</li></Link>
        </ul>
      </div>
      </div>
      </>
  )
}

export default Navbar
