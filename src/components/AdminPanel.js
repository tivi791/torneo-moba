import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function AdminPanel() {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchEquipos() {
      try {
        const q = query(collection(db, 'equipos'), orderBy('creadoEn', 'desc'));
        const querySnapshot = await getDocs(q);
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipos(lista);
      } catch (error) {
        console.error("Error al cargar equipos:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchEquipos();
  }, []);

  if (cargando) return <p>Cargando equipos...</p>;

  return (
    <div>
      <h2>Panel de Administración</h2>
      {equipos.length === 0 ? (
        <p>No hay equipos registrados aún.</p>
      ) : (
        equipos.map((equipo) => (
          <div key={equipo.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>🔹 {equipo.nombre}</h3>
            <p><strong>Registrado por:</strong> {equipo.creadoPor}</p>
            <p><strong>Jugadores:</strong></p>
            <ul>
              {equipo.jugadores && equipo.jugadores.length > 0 ? (
                equipo.jugadores.map((j, i) => (
                  <li key={i}>
                    {j.nickname} {j.uid ? `(UID: ${j.uid})` : ''}
                  </li>
                ))
              ) : (
                <li>Sin jugadores registrados.</li>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;
