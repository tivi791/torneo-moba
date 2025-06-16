import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy } from 'firebase/firestore';
import CrearTorneo from './CrearTorneo';
import SeleccionarEquiposTorneo from './SeleccionarEquiposTorneo';

export default function AdminPanel() {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarTorneos() {
      setCargando(true);
      try {
        const torneosCol = collection(db, 'torneos');
        const torneosSnap = await getDocs(torneosCol);
        const lista = torneosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(lista);
      } catch (error) {
        console.error(error);
      }
      setCargando(false);
    }
    cargarTorneos();
  }, []);

  return (
    <div>
      <h2>Panel de Administración</h2>

      <CrearTorneo />

      <h3>Torneos creados</h3>
      {cargando ? (
        <p>Cargando torneos...</p>
      ) : torneos.length === 0 ? (
        <p>No hay torneos creados aún.</p>
      ) : (
        <ul>
          {torneos.map(torneo => (
            <li key={torneo.id}>
              <button onClick={() => setTorneoSeleccionado(torneo.id)}>
                {torneo.nombre} ({torneo.modalidad})
              </button>
            </li>
          ))}
        </ul>
      )}

      {torneoSeleccionado && (
        <SeleccionarEquiposTorneo torneoId={torneoSeleccionado} />
      )}
    </div>
  );
}
