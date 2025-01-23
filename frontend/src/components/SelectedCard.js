import React from 'react'

const SelectedCard = () => {
  const handleMoveCard = async () => {
    if (!taskId || !selectedColumn) {
      console.error("No task or column selected");
      return;
    }

    try {
      // Encuentra la tarjeta seleccionada
      const taskToMove = tasks.find((task) => task._id === taskId);

      if (!taskToMove) {
        console.error("Task not found");
        return;
      }

      // Actualiza el backend
      const updatedTask = { ...taskToMove, list: selectedColumn };

      const response = await fetch(`${backend}/card/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        // Actualiza el estado del frontend
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, list: selectedColumn } : task
          )
        );
        console.log("Card moved successfully!");
      } else {
        console.error("Failed to move card");
      }
    } catch (error) {
      console.error("Error moving card:", error);
    }
  };
  return <div>SelectedCard</div>;
};

export default SelectedCard;