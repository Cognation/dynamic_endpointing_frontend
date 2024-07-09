import React from 'react'
import './Alert.css'

export default function Alert(props) {

    const capital = (word)=>{
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
  return (
    props.alert &&  <div className={`alert alert-${props.alert.type}`} role ="alert">
    {props.alert.message}
  {/* <button className="btn-close mx-4" type='button' data-bs-dismiss='alert' aria-label='close'></button> */}
</div>
  )
}
