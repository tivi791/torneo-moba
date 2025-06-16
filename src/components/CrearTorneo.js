import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

function CrearTorneo() {
  const [nombre, setNombre] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarEquipos() {
      try {
        const equiposCol = collection(db, 'equipos');
        const equiposSnapshot = await getDocs(equiposCol);
        const lista = equiposSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEquipos(lista);
      } catch (error) {
        setMensaje('Error cargando equipos: ' + error.message);
      }
    }
    cargarEquipos();
  }, []);

  const toggleEquipo = (id) => {
    if (equiposSeleccionados.includes(id)) {
      setEquiposSeleccionados(equiposSeleccionados.filter(e => e !== id));
    } else {
      setEquiposSeleccionados([...equiposSeleccionados, id]);
    }
  };

  const crearTorneo = async (e) => {
    e.preventDefault();
    if (nombre.trim() === '') return setMensaje('Por favor ingresa un nombre para el torneo');
    if (equiposSeleccionados.length < 2) return setMensaje('Selecciona al menos 2 equipos');

    try {
      await addDoc(collection(db, 'torneos'), {
        nombre: nombre.trim(),
        creadoEn: Timestamp.now(),
        equipos: equiposSeleccionados,
        estado: 'activo',
      });
      setNombre('');
      setEquiposSeleccionados([]);
      setMensaje('Torneo creado con éxito');
    } catch (error) {
      setMensaje('Error al crear torneo: ' + error.message);
    }
  };

  return (
    <div>
      <h3>Crear Torneo</h3>
      <form onSubmit={crearTorneo}>
        <input
          type="text"
          placeholder="Nombre del torneo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <div style={{ marginTop: '10px' }}>
          <h4>Selecciona equipos participantes</h4>
          {equipos.map(e => (
            <label key={e.id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={equiposSeleccionados.includes(e.id)}
                onChange={() => toggleEquipo(e.id)}
              />
              {e.nombre}
            </label>
          ))}
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Crear Torneo</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CrearTorneo;
