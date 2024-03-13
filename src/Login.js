import React from "react";
import "./Login.css";
import googleIcon from "./images/google-icon.png";
import { auth, gprovider } from "./Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "./Context/Context";

export default function Login() {
  const { authUser, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
  function signInWithGoogle() {
    signInWithPopup(auth, gprovider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        // console.log(token);
        const user = result.user;
        //.././......For Context API
        setUser(user);
        setIsLoggedIn(true);
        //.... for kam  chalane k liye till the issue related to context api resolves
        window.localStorage.setItem("isLoggedIn", true);
        window.localStorage.setItem("appUser", JSON.stringify(user));
        console.log("Successfull SignIN");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log("Error occured while signin" + error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <div className="login-container">
      <h1>Sign in</h1>
      <button className="google-login-btn" onClick={signInWithGoogle}>
        <img src={googleIcon} alt="Google Icon" className="google-icon"></img>
        Sign in with Google
      </button>
    </div>
  );
}
