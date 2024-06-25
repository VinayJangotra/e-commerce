import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from '../firebase';
import { useLoginMutation } from '../redux/api/userAPI';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MessageResponse } from '../types/api_types';
const Login = () => {
  const [gender , setGender]=useState("");
  const [date,setDate]=useState("");
 const [login]=useLoginMutation();
  // const loginHandler=async()=>{
  //   try{
  //   const provider= new GoogleAuthProvider();
  //    const {user}=await signInWithPopup(auth,provider);
  //    const res=await login({
  //     name:"Vinay",
  //     email:"kjdkf",
  //     photo:"jfjfj",
  //     gender,
  //     role:"user",
  //     dob:date,
  //     _id:"njklk",

  //    })
  //    if("data" in res){
  //       const message= res.data as MessageResponse;
  //       toast.success(message.message);
  //    }else{
  //       const error= res.error as FetchBaseQueryError;
  //       const message= error.data as MessageResponse;
  //       toast.error(message.message);
  //    }
  //    console.log(user);
  //   }
  //   catch(error){
  //     toast.error("Sign-in Fail");
  //   }
  //}
  const loginHandler = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    // Assuming user provides email, displayName, and photoURL
    console.log({
      name: user.displayName || "Anonymous", // Use actual name or a placeholder
      email: user.email || "no-email@example.com", // Use actual email or a placeholder
      photo: user.photoURL || "default-photo-url", // Use actual photo URL or a placeholder
      gender,
      role: "user",
      dob: date,
      _id: user.uid,
    });
    const res = await login({
      name: user.displayName!, // Use actual name or a placeholder
      email: user.email! ,
      photo: user.photoURL! , // Use actual photo URL or a placeholder
      gender,
      role: "user",
      dob: date,
      _id: user.uid // Use Firebase UID as the user ID
    });
    if ("data" in res) {
      const message = res.data as MessageResponse;
      toast.success(message.message);
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = error.data as MessageResponse;
      toast.error(message.message);
    }
    console.log(user);
  } catch (error) {
    toast.error("Sign-in Failed");
  }
};
  return (
    <div className='login'>
      <main>
        <h1 className='heading'>Login</h1>
          <div>
            <label >Gender</label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>            
              </select>

              <div>
                <label>Date of Birth</label>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}/>
              </div>
              <div>
                <p>Already Signed in Once</p>
                <button onClick={loginHandler}>
                  <FaGoogle/> <span>Sign in with Google</span>
                </button>
              </div>
          </div>
      </main>
    </div>
  );
}

export default Login;
