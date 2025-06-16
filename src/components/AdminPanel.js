import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function AdminPanel() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchEquipos() {
      setCargando(true);
      try {
        const q = query(collection(db, 'equipos'), orderBy('creadoEn', 'desc'));
        const querySnapshot = await getDocs(q);
        const listaEquipos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipos(listaEquipos);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      }
      setCargando(false);
    }

    fetchEquipos();
  }, []);

  if (cargando) return <p>Cargando equipos...</p>;

  return (
    <div>
      <h2>Panel de Administración</h2>
      <p>Aquí podrás ver todos los equipos registrados:</p>
      {equipos.length === 0 ? (
        <p>No hay equipos registrados aún.</p>
      ) : (
        equipos.map((equipo) => (
          <div key={equipo.id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
            <h3>{equipo.nombre}</h3>
            <p><strong>Capitán:</strong> {equipo.capitan}</p>
            <p><strong>Jugadores:</strong></p>
            <ul>
              {(equipo.jugadores || []).map((jugador, index) => (
                <li key={index}>{jugador.nickname}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;
