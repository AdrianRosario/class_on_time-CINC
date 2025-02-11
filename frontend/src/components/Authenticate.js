import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Authenticate = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const backend = process.env.REACT_APP_BACKEND;
  const[, setTimer] = useState(900000);

  useEffect(() => {
    const handleActivity = () => {
      setTimer(900000); // Reiniciar temporizador a 30 mnutes 
    };

    // Escuchar eventos de actividad del usuario
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Checar inactividad cada segundo
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1000) {
          console.log("No activity detected, logging out");
          logout();
          clearInterval(interval); // Detener el intervalo después de cerrar sesión
          return 0;
        }
        return prev - 1000; // Reducir temporizador
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch(`${backend}/logout`, { method: 'POST' });
      setIsAuthenticated(false);
      localStorage.removeItem('jwt_token'); // Eliminar token JWT
      localStorage.removeItem('isAuthenticated');
      navigate('/login'); // Redirigir a la pantalla de login
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return null;
}

export default Authenticate;
