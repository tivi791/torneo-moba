import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CrearTorneo() {
  const [nombre, setNombre] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [mensaje, setMensaje] = useState('');

  const crearTorneo = async () => {
    if (!nombre || !modalidad) {
      setMensaje('Completa todos los campos');
      return;
    }
    try {
      await addDoc(collection(db, 'torneos'), {
        nombre,
        modalidad,
        estado: 'activo',
        equipos: [],
        inscritos: [],
        creadoEn: serverTimestamp()
      });
      setMensaje('Torneo creado con éxito');
      setNombre('');
      setModalidad('');
    } catch (error) {
      setMensaje('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h3>Crear Torneo</h3>
      <input
        placeholder="Nombre del torneo"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <input
        placeholder="Modalidad (ej. 1 vs 1)"
        value={modalidad}
        onChange={e => setModalidad(e.target.value)}
      />
      <button onClick={crearTorneo}>Crear Torneo</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
