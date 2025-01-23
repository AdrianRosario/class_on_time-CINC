import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Importar los estilos predeterminados

const ConfirmDialog = ({ message, onConfirm }) => {
  const showConfirm = () => {
    confirmAlert({
      title: "Confirmación",
      message: message || "¿Estás seguro de realizar esta acción?",
      buttons: [
        {
          label: "Sí",
          onClick: onConfirm, // Llama a la función de confirmación
        },
        {
          label: "No",
          onClick: () => {}, // No se hace nada al cancelar
        },
      ],
    });
  };

  return showConfirm; // Ahora regresa solo la función
};

export default ConfirmDialog;
