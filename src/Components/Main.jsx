import React, { useEffect, useState } from "react";
import css from "./Main.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Talk from "./Talk/Talk";

function Main() {
  const [fname, setfname] = useState(localStorage.getItem("username"));
  const [lname, setlname] = useState(localStorage.getItem("userlastname"));
  const [email, setemail] = useState(localStorage.getItem("useremail"));
  const [isimage, setisimage] = useState(null);

  const [api_key, setapi_key] = useState(null);

  const getapi_key = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/api_key/getapi_key`,
        {
          email: email,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("Responseeee:", res.data);
      if (res.data) {
        setapi_key(res.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    try {
      getapi_key();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchapikey = async () => {
    try {
      if (api_key) return;
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/api_key/genapi_key`,
        {
          email: email,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("Responsee:", res.data);
      if (res.data) {
        setapi_key(res?.data?.api_key);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <>
      {/* <div className={css.top}>

          <h3>Welcome Back {fname} {lname}!!!</h3>

          <div className={css.addphoto}> 
            <button onClick={fetchapikey}>Get API KEY</button>
            {api_key ? <><div>{api_key}</div></> : null}
          </div>
        </div>         */}
      <div className={css.top}>
        <div className={css.top_first}>
          <h3>Get your API Key!!!</h3>
        </div>

        <div className={css.top_second}>
          <h3>{api_key}</h3>
          {!api_key ? (
            <button className={css.getapikey}>Get API Key</button>
          ) : null}
        </div>
      </div>
      <Talk />
      <footer className={css.footer}>© ivy </footer>
    </>
  );
}

export default Main;
