// import React, {useState} from 'react'
// import { useParams } from 'react-router-dom';
// import TareasPage from '../TareasPage';
// import '../style/shareuser.css'
// import '../style/shareuser.css'



// const Shareuser = () => {
//   const [showCarduser, setShowCarduser] = useState(false);
//   const [eshare, setEshare] = useState("");
//   const { id } = useParams();
//   const backend = process.env.REACT_APP_BACKEND;
  
  

//   const toggleCarduser = () => {
//     setShowCarduser(!showCarduser);
//   }

//     const handleSubmit =  async (e) => {
//       e.preventDefault();
//       if (!id) {
//         console.error("No id provided");
//         return;
//       }
      

//       try {
//         const res = await fetch(`${backend}/board/${id}/share`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
            
//           },
//           body: JSON.stringify({
//             eshare,
//           }),
//         });
  
//         if (res.status === 200) {
//           const data = await res.json();
//           console.log(data);
//           setShowCarduser(false);
//           // getBoards();
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//       }
//     }
  
  
//     return (
//       <>
//         <TareasPage />
//         <div className="overlay-pp">
//           {showCarduser && (
//             <div className="cont-form">
//               <div>
//                 <form className="form" onSubmit={handleSubmit}>
//                   <div class="note">
//                     <label className="title">Compartir tablero</label>
//                     <span className="subtitle">
//                       aqui puedes invitar nuevo usuarios a usar tu tablero con
//                       varios roles obsevador, miembro, administrador
//                     </span>
//                   </div>
//                   <div className="information">
//                     <input
//                       type="email"
//                       placeholder="Direccion de correo electronico"
//                       class="input_field"
//                       onChange={(e) => setEshare(e.target.value)}
//                       value={eshare}
//                     />
//                     <select name="" id="" className="select">
//                       <option value="">Miembros</option>
//                       <option value="">Observador</option>
//                       <option value="">Administrador</option>
//                     </select>
//                     <button className="submit">Compartir</button>
//                   </div>

//                   {/* <button className="submit">enviar</button> */}
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </>
//     );
//   };
  
//   export default Shareuser;
  