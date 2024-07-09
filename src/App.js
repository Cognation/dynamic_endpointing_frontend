import { useEffect, useState } from 'react';
import Main from './Components/Main';
import Navbar from './Components/Navbar';
import UserNavbar from './Components/UserNavbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Alert from './Components/Alert';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Footer from './Components/Footer/Footer';
import Developer from './Components/Developer/Developer';
import Talk from './Components/Talk/Talk';
import Talk_Groq from './Components/Talk_Groq/Talk_groq';
import Talk2 from './Components/Talknew/Talk';

function App() {

  const[alert,setalert] = useState(null);

  const showalert = (message,type)=>{
    setalert({
    message : message,
    type : type
  })
  setTimeout(() => {
    setalert(null);
  }, 1500);
}


  return (
    <>
    <Router>
      <Routes>
        <Route exact  path="/" element={<><Navbar/><Talk_Groq/></>} />
        {/* <Route exact  path="/" element={<><Navbar/><Home/><Footer/></>} /> */}
        <Route exact  path="/talk" element={<><Navbar/><Talk/></>} />
        <Route exact  path="/groq" element={<><Navbar/><Talk_Groq/></>} />
        <Route exact  path="/talk2" element={<><Navbar/><Talk2/></>} />
        <Route exact  path="/developer" element={<><Navbar/><Developer/><Footer/></>} />
        <Route exact  path="/user" element={<><UserNavbar/><Main showalert={showalert}/></>} />
        <Route exact  path="/login" element={<><Alert alert={alert}/><Login showalert= {showalert}/></>} />
      <Route exact  path="/signup" element={<><Alert alert={alert}/><Signup showalert={showalert}/></>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
