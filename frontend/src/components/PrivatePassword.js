import React, { Fragment, useState} from "react";
import TareasPage from "../TareasPage";


const backend = process.env.REACT_APP_BACKEND;


const PrivatePassword = () => {


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [menssage, setMessage] = useState("");

  const clearFields = () => {
    setCurrentPassword('');
    setNewPassword('');
  }
 

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
      try {
        const response = await fetch(`${backend}/createpassword`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
           
          },
          body: JSON.stringify({
            password: currentPassword,
            newpassword: newPassword,
          }),
        });
    
       const data = await response.json();
       console.log(data)
       clearFields();
      } catch (error) {
        console.error('Error updating password:', error);
        setMessage('Error en la solicitud');
      }
    };
  

  return (
    <Fragment>
      <TareasPage />
      <div className="overlay-pp">
        <form className="form-pp" onSubmit={handleChangePassword}>
          <div className="con-pp">
            <header className="form-head-pp">
              <h2>ResetPassword</h2>
              <p>login here using your username and password</p>
            </header>
            <br />
            <div className="field-pp">
              {/* <label>id del usuario: {id}</label> */}
             {/* <input type="text" value={id} onChange={(e) => setId(e.target.value)} />  */}
              <label className="label-pp">ingrese su password actual :</label>
              <input
                className="form-input"
                id="password"
                type="Password"
                placeholder="ingrese su password actual:"
                required=""
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
              />
              <label className="label-pp">Nueva Password</label>
              <input
                className="form-input"
                id="newpassword"
                type="Password"
                placeholder="Nueva Password"
                required=""
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
              <br />
              <button className="log-pp"> Enviar </button>
            </div>
          </div>
        </form>
    
      </div>
        
    </Fragment>
  );
};

export default PrivatePassword;
