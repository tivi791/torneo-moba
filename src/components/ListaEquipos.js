import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ListaEquipos() {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const obtenerEquipos = async () => {
      try {
        const q = query(collection(db, 'equipos'), orderBy('creadoEn', 'desc'));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipos(lista);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };

    obtenerEquipos();
  }, []);

  return (
    <div>
      <h2>Equipos Registrados</h2>
      {equipos.length === 0 ? (
        <p>No hay equipos registrados aún.</p>
      ) : (
        <ul>
          {equipos.map((equipo) => (
            <li key={equipo.id}>
              <strong>{equipo.nombre}</strong> — {equipo.jugadores?.length || 0} jugadores
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaEquipos;
