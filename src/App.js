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
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>Plataforma de Torneos MOBA</h1>

    {usuario ? (
      <>
        <p>Bienvenido: <strong>{usuario.email}</strong> ({usuario.role})</p>
        <button onClick={() => signOut(auth)}>Cerrar sesión</button>
        <hr />
        
        {usuario.role === "admin" && (
          <div>
            <AdminPanel />
            <CrearEquipo />
            <ListaEquipos />
            <hr />
          </div>
        )}

        {usuario.role !== "admin" && (
          <>
            <CrearEquipo />
          </>
        )}
      </>
    ) : (
      <LoginRegistro />
    )}
  </div>
);

}

export default AdminPanel;
