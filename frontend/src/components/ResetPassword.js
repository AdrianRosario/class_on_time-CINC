import React, { Fragment, useState } from "react";
import Menu from "./Menu";
import "../style/resetPassword.css"

const backend = process.env.REACT_APP_BACKEND;

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const clearFields = () => {
    setEmail("");
  };

  const handlesubmin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${backend}/resetpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      clearFields();
    } else {
      console.error("Error al retablecer su password");
    }
  };

  return (
    <Fragment>
      <Menu />
      <div className="reset">
        <form onSubmit={handlesubmin} className="form-reset">
          <div className="con-reset">
            <header className="head-reset">
              <h2>Reset Password</h2>
            </header>
            <div className="field-reset">
                <label className="label-reset">Email *</label>
              <input
                className="form-input"
                id="txt-gmail"
                type="text"
                placeholder="@Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoFocus
                required
              />
              <br />
              <button className="log-reset"> Enviar </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ResetPassword;
