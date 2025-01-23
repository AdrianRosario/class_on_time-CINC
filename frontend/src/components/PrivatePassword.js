import React, { Fragment, useState } from "react";
import TareasPage from "../TareasPage";
import "../style/update.css";
import Menu3 from "./Menu3";
import ToastNotification,{showToast} from "./ToastNotification";

const backend = process.env.REACT_APP_BACKEND;

const PrivatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  

  const clearFields = () => {
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backend}/createpassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: currentPassword,
          newpassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostrar notificación de éxito
        showToast("Password updated successfully!","success");
      } else {
        // Mostrar notificación de error
        showToast("Failed to update password.", "error");
      }

      
      clearFields();
    } catch (error) {
      console.error("Error updating password:", error);
      showToast("error", "An error occurred while updating the password.");
    }
  };

  return (
    <Fragment>
      <Menu3 />
      <ToastNotification/>
      <div className="overlay-pp">
        <div class="body">
          <div class="container-update">
            <form className="form-update" onSubmit={handleChangePassword}>
              <div class="head">
                <span>Update Password</span>
                <p>
                  If you want to update your password you must first enter your
                  current password and then your new password and press the
                  button Update.
                </p>
              </div>
              <div class="inputs">
                <input
                  type="password"
                  placeholder="password actual"
                  id="password"
                  required
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                />
                <input
                  type="password"
                  placeholder=" Nueva Password"
                  id="newpassword"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>
              <button>Update</button>
            </form>
          </div>
        </div>
       
      </div>
    </Fragment>
  );
};

export default PrivatePassword;
