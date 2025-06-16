import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function TorneosDisponibles({ equipoId }) {
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarTorneos() {
      setCargando(true);
      try {
        const torneosCol = collection(db, 'torneos');
        const torneosSnap = await getDocs(torneosCol);
        const activos = torneosSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(t => t.estado === 'activo');
        setTorneos(activos);
      } catch (error) {
        setMensaje('Error cargando torneos: ' + error.message);
      }
      setCargando(false);
    }
    cargarTorneos();
  }, []);

  const inscribirEquipo = async (torneoId) => {
    try {
      const torneoRef = doc(db, 'torneos', torneoId);
      const torneoSnap = await torneoRef.get();
      if (!torneoSnap.exists()) {
        setMensaje('Torneo no existe');
        return;
      }
      const inscritos = torneoSnap.data().inscritos || [];
      if (inscritos.includes(equipoId)) {
        setMensaje('Ya estás inscrito en este torneo');
        return;
      }
      const nuevosInscritos = [...inscritos, equipoId];
      await updateDoc(torneoRef, { inscritos: nuevosInscritos });
      setMensaje('Inscripción exitosa');
    } catch (error) {
      setMensaje('Error al inscribirse: ' + error.message);
    }
  };

  if (cargando) return <p>Cargando torneos...</p>;

  return (
    <div>
      <h3>Torneos disponibles para inscripción</h3>
      {mensaje && <p>{mensaje}</p>}
      {torneos.length === 0 && <p>No hay torneos activos.</p>}
      <ul>
        {torneos.map(torneo => (
          <li key={torneo.id}>
            <strong>{torneo.nombre}</strong> ({torneo.modalidad}){' '}
            <button onClick={() => inscribirEquipo(torneo.id)}>Inscribirse</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
