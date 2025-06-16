import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function VistaEquipos() {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    const obtenerEquipos = async () => {
      const querySnapshot = await getDocs(collection(db, 'equipos'));
      const datos = querySnapshot.docs.map(doc => doc.data());
      setEquipos(datos);
    };

    obtenerEquipos();
  }, []);

  return (
    <div>
      <h3>Equipos Registrados</h3>
      <ul>
        {equipos.map((equipo, index) => (
          <li key={index}>{equipo.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default VistaEquipos;
