import React, {useState} from 'react'
import TareasPage from '../TareasPage';
import '../style/shareuser.css'
import '../style/shareuser.css'



const Shareuser = () => {
  const [showCarduser, setShowCarduser] = useState(false);
  

  const toggleCarduser = () => {
    setShowCarduser(!showCarduser);
  }

    const handleSubmit = (event) => {
      event.preventDefault();
      setShowCarduser(false);
    }
  
    return (
      <>
      <TareasPage/>
      <div className="overlay-pp">
        {showCarduser && (
          <div className="cont-form">
          <div>
          <form className="form" onSubmit={handleSubmit}>
              <div class="note">
                  <label className="title">Compartir tablero</label>
                  <span className="subtitle">aqui puedes invitar nuevo usuarios a usar tu tablero con varios roles obsevador, miembro, administrador</span>
  
              </div>
              <div className="information">
                  <input type="text" placeholder="Direccion de correo electronico" class="input_field"/>
                  <select name="" id="" className="select">
                      
                      <option value="">Miembros</option>
                      <option value="">Observador</option>
                      <option value="">Administrador</option>
                  </select>
                  <button className="submit">Compartir</button>
              </div>
              
              {/* <button className="submit">enviar</button> */}
  
              
  
          </form>
          </div>
      </div>
        )}
      
    </div>
      </>
    );
  };
  
  export default Shareuser;
  