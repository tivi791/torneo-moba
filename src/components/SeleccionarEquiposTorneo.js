import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function SeleccionarEquiposTorneo({ torneoId }) {
  const [equipos, setEquipos] = useState([]);
  const [torneoEquipos, setTorneoEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      try {
        // Equipos
        const equiposCol = collection(db, 'equipos');
        const equiposSnap = await getDocs(equiposCol);
        setEquipos(equiposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Torneo
        const torneoDocRef = doc(db, 'torneos', torneoId);
        const torneoSnap = await getDoc(torneoDocRef);
        if (torneoSnap.exists()) {
          setTorneoEquipos(torneoSnap.data().equipos || []);
        }
      } catch (error) {
        setMensaje('Error: ' + error.message);
      }
      setCargando(false);
    }
    cargarDatos();
  }, [torneoId]);

  const toggleEquipo = async (equipoId) => {
    let nuevosEquipos;
    if (torneoEquipos.includes(equipoId)) {
      nuevosEquipos = torneoEquipos.filter(id => id !== equipoId);
    } else {
      nuevosEquipos = [...torneoEquipos, equipoId];
    }
    setTorneoEquipos(nuevosEquipos);

    try {
      const torneoDocRef = doc(db, 'torneos', torneoId);
      await updateDoc(torneoDocRef, { equipos: nuevosEquipos });
      setMensaje('Equipos actualizados');
    } catch (error) {
      setMensaje('Error al actualizar: ' + error.message);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h4>Seleccionar equipos para el torneo</h4>
      {mensaje && <p>{mensaje}</p>}
      {equipos.length === 0 && <p>No hay equipos registrados.</p>}
      {equipos.map(equipo => (
        <div key={equipo.id}>
          <label>
            <input
              type="checkbox"
              checked={torneoEquipos.includes(equipo.id)}
              onChange={() => toggleEquipo(equipo.id)}
            />
            {equipo.nombre}
          </label>
        </div>
      ))}
    </div>
  );
}
