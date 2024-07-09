import React, { useState} from 'react';
import css from './Signup.module.css'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
// const axios = require("axios");


function Signup(props) {



  const [signupdata , setsigndata] = useState({fname: "" , lname: "" , email: "" , password: ""})

  const navigate = useNavigate();

  const submit = async(e)=>{
    e.preventDefault();
    const responce = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,{
      method:'POST',
      headers : {
        'Content-Type' : 'application/json'
      },

      body : JSON.stringify({fname:signupdata.fname , lname:signupdata.lname , email: signupdata.email , password: signupdata.password})

  });

  const json = await responce.json()
  console.log(json);

  if(json.success){
    localStorage.setItem('token' , json.authtoken)
    navigate('/login');
    props.showalert("Sign Up Successfully!" , 'success');
  }
  else{
    props.showalert("Check Details Again!" , 'danger')
  }

  }

  const onChange = (e)=>{
    setsigndata({...signupdata , [e.target.name] : e.target.value});
  }

  return (
    <div className={css.main}>
    <div className={css.first}>
      <div className={css.first_signup}>
    <div className={css.logo}><Link to='/' className={css.logolink}>IVY</Link></div>
      <div className={css.formdiv}>


        <form className={css.form} onSubmit={submit} >
          <input type="text" className={css.namein} id='fname' name='fname' placeholder='First Name'  onChange={onChange} /><br />
          <input type="text" className={css.namein} id='lname' name='lname' placeholder='Last Name'  onChange={onChange} /><br />
          <input type="email" className={css.email} id='email' name='email' placeholder='Email' onChange={onChange} /><br />
          <input type="password" id='password' name='password' className={css.password} placeholder='Password' onChange={onChange}/> <br />
          <input type="password" id='cpassword' name='cpassword' className={css.password} placeholder='Confirm Password' onChange={onChange}/>
          
          <button className={css.signupbutton} type="submit">Sign Up</button>
        </form>

      </div>
        <p className={css.afterform}>Already have account? <span className={css.span} onClick={()=>{navigate('/login')}}>Login</span></p>
    </div>
    </div>

    <div className={css.second}>
        <div className={css.second_login}>
          <h3>Revolutionize <span className={css.span}> Speach To Text</span></h3>
          <h3>We have build the future.</h3>
        </div>
      </div>
  </div>
  )
}

export default Signup