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
      <h3>Equipos registrados</h3>
      {equipos.length === 0 ? (
        <p>No hay equipos registrados aún.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Nombre del Equipo</th>
              <th>Jugadores (Emails)</th>
              <th>Registrado el</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map(equipo => (
              <tr key={equipo.id}>
                <td>{equipo.nombre}</td>
                <td>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {equipo.jugadores.map((jugador, i) => (
                      <li key={i}>{jugador}</li>
                    ))}
                  </ul>
                </td>
                <td>{equipo.creadoEn?.toDate().toLocaleString() || 'Sin fecha'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;
