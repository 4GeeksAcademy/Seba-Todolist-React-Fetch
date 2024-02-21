import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [nuevoTodo, setNuevoTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // Cargar la lista al montar el componente
  useEffect(() => {
    obtenerTareas();
  }, []);

  // Función para obtener las tareas del servidor
  const obtenerTareas = () => {
    fetch('https://playground.4geeks.com/apis/fake/todos/user/sevaldes')
      .then(resp => resp.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error("La respuesta del servidor no es un array:", data);
        }
      })
      .catch(error => console.log(error));
  };

  // Función para agregar una nueva tarea
  const agregarTarea = () => {
    if (nuevoTodo.trim() !== "") {
      const nuevaTarea = { id: Date.now(), label: nuevoTodo, done: false };
      const nuevaLista = [...todos, nuevaTarea]; // Agregamos la nueva tarea a la lista existente

      fetch('https://playground.4geeks.com/apis/fake/todos/user/sevaldes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaLista)
      })
        .then(resp => resp.json())
        .then(data => {
          console.log(data); // Puedes hacer algo con la respuesta del servidor si lo necesitas
          setTodos(nuevaLista); // Actualizamos el estado con la nueva lista de tareas
          setNuevoTodo(""); // Limpiamos el campo para una nueva tarea
        })
        .catch(error => console.error('Error al enviar la solicitud PUT:', error));
    }
  };



  // Dentro de tu componente App
  const [tareasEliminadas, setTareasEliminadas] = useState([]);

  // Función para eliminar una tarea
  // Función para eliminar una tarea
  // Función para eliminar una tarea
  const eliminarTarea = (indice) => {
    const nuevasTareas = [...todos];
    nuevasTareas.splice(indice, 1); // Elimina la tarea del array de tareas
    setTodos(nuevasTareas);
  };
  // Función para actualizar la lista de tareas en el servidor
  const actualizarTareasEnServidor = () => {
    const tareasParaActualizar = todos.filter(
      (tarea, _) => !tareasEliminadas.includes(tarea)
    );

    fetch(`https://playground.4geeks.com/apis/fake/todos/user/sevaldes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tareasParaActualizar)
    })
      .then(response => {
        if (response.ok) {
          console.log('Lista de tareas actualizada exitosamente');
          setTareasEliminadas([]); // Limpiar la lista de tareas eliminadas
        } else {
          console.error('Error al actualizar la lista de tareas:', response.statusText);
        }
      })
      .catch(error => console.error('Error en la solicitud PUT:', error));
  };

  const eliminarTodasLasTareas = () => {
    setTodos([]); // Establece el array de tareas vacío
  };


  // Manejador de evento para agregar tarea al presionar Enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      agregarTarea();
    }
  };

  // Manejador de evento para cambiar el valor de nuevoTodo
  const handleChange = (event) => {
    setNuevoTodo(event.target.value);
  };

  return (
    <div className="text-center todo-container">
      <h1 className='mt-5'>Tareas</h1>
      <div className="input-group mb-3 todo-input">
        <input
          type="text"
          className="form-control"
          placeholder="Agregar tarea"
          value={nuevoTodo}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <ul className="list-group">
        {todos.map((tarea, indice) => (
          <li key={indice} className="list-group-item d-flex justify-content-between align-items-center">
            {tarea.label}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => eliminarTarea(indice)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <button className="btn btn-danger mt-3" onClick={eliminarTodasLasTareas}>
        Eliminar todas las tareas
      </button>
    </div>
  );
}

export default App;
