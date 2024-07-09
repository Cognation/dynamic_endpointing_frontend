import React, { useState } from 'react'
import css from './Login.module.css'
import {Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Login(props) {

  const [logindata , setlogindata] = useState({email: "" , password: ""})

  const navigate = useNavigate();

  const submit = async(e)=>{
    e.preventDefault();
    const responce = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,{
        method: 'POST',
        headers : {
        "Accept": "application/json",
        'Content-Type' : 'application/json',
        "Allow-cross-origin" : "*",
      },

      body : JSON.stringify({email: logindata.email , password : logindata.password})
  });

  const json = await responce.json();

    if(json.success){
        localStorage.setItem('token' , json.authtoken);
        localStorage.setItem('username' , json.user.fname);
        localStorage.setItem('userlastname' , json.user.lname);
        localStorage.setItem('useremail' , json.user.email);
        navigate("/user");
        props.showalert("Login Successfully" , 'success');
        // e.sendStatus(200);
    }
    else{
      props.showalert("Invalid Usename or passsword" , 'danger');
    }

  }


  const onChange = (e)=>{
    setlogindata({...logindata , [e.target.name] : e.target.value});
  }




  return (
    <div className={css.main}>
      <div className={css.first}>
        <div className={css.first_login}>
      <div className={css.logo}><Link to='/' className={css.logolink}>IVY</Link></div>
        <div className={css.heading}>Access your IVY</div>
        <div className={css.formdiv}>
          <form onSubmit={submit} >
            <input type="email" id='email' className={css.email} name='email' onChange={onChange} value={logindata.email} placeholder='Email' /><br />
            <input type="text" id='password' className={css.password} name='password' onChange={onChange} value={logindata.password} placeholder='Password' /><br/>
            <button className={css.loginbuttondiv}  type="submit" >Login</button>
          </form>
        </div>
        <p className={css.afterform}>Create your account <span className={css.span} onClick={()=>{navigate('/signup')}}>Sign Up</span></p>
      </div>
      </div>

      <div className={css.second}>
        <div className={css.second_login}>
          <h3>Welcome Back!</h3>
          <h3>You are building the future.</h3>
        </div>
      </div>
    </div>
  )
}

export default Login