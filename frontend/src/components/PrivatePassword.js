import React, { Fragment } from "react";
import TareasPage from "../TareasPage";

function PrivatePassword() {
  return (
    <Fragment>
      <TareasPage />
      <div className="overlay-pp">
        <form  className="form-pp">
          <div className="con-pp">
            <header className="form-head-pp">
              <h2>Log In</h2>
              <p>login here using your username and password</p>
            </header>
            <br />
            <div className="field-pp">
                <label className="label-pp">ingrese su password actual :</label>
              <input
                className="form-input"
                id="txt-input"
                type="email"
                placeholder="ingrese su password actual:"
                required=""
                // onChange={(e) => setEmail(e.target.value)}
                // value={email}
              />
               <label className="label-pp">Nueva Password</label>
              <input
                className="form-input"
                id="txt-input"
                type="email"
                placeholder="Nueva Password"
                required=""
                // onChange={(e) => setEmail(e.target.value)}
                // value={email}
              />
              <br/>
               <button className="log-pp"> Enviar </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default PrivatePassword;
