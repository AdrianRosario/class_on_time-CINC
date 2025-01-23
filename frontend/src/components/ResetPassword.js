import React, { Fragment, useState } from "react";
import Menu from "./Menu";
import "../style/resetPassword.css"
import ToastNotification, {showToast} from "./ToastNotification";

const backend = process.env.REACT_APP_BACKEND;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const clearFields = () => {
    setEmail("");
  };

  const handlesubmin = async (e) => {
    e.preventDefault();
    try{
    const res = await fetch(`${backend}/resetpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
     
      showToast(data.msg || "Password reset successful! Check your email.", "success");
        
      clearFields();
    } else {
      
      showToast(data.msg || "Error: Unable to reset password. Please try again.", "error");
    }
  } catch (error) {
    console.error('Error during login:', error);
    showToast("An error occurred while processing your request.", "error");
  }
  };

  return (
    <Fragment>
      <ToastNotification/>
      <Menu />
      <div className="reset">
      
      <form className="form-reset"  onSubmit={handlesubmin} >
     
      <span className="title-reset">Reset Passwor.</span>
      <p className="description-reset">
        Enviamos una nueva password a tu gmail para iniciar session, si quieres
        actualizar tu nueva password en settin tienes una opcion para actualizar a tu gusto.
      </p>
      <div>
        <input
          placeholder="Enter your email"
          type="email"
          name="email"
          id="email-address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoFocus
          required
        />
        <button type="submit">Recuperar</button>
      </div>
    </form>
      </div>
    </Fragment>
  );
};

export default ResetPassword;
