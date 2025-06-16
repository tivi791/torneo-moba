import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import CrearEquipo from './components/CrearEquipo';
import AdminPanel from './components/AdminPanel';
import LoginRegistro from './components/LoginRegistro';
import TorneosDisponibles from './components/TorneosDisponibles';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [equipoId, setEquipoId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsuario({ ...user, role: data.role || 'usuario' });
          } else {
            setUsuario({ ...user, role: 'usuario' });
          }

          // Obtener equipo asociado al usuario (si existe)
          const equiposRef = collection(db, 'equipos');
          const equiposSnap = await getDocs(equiposRef);
          const equipoDelUsuario = equiposSnap.docs.find(doc => doc.data().ownerId === user.uid);
          setEquipoId(equipoDelUsuario ? equipoDelUsuario.id : null);

        } catch (error) {
          console.error("Error al obtener datos:", error);
          setUsuario({ ...user, role: 'usuario' });
        }
      } else {
        setUsuario(null);
        setEquipoId(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Plataforma de Torneos MOBA</h1>

      {usuario ? (
        <>
          <p>Bienvenido: <strong>{usuario.email}</strong> ({usuario.role})</p>
          <button onClick={() => signOut(auth)}>Cerrar sesión</button>
          <hr />

          {usuario.role === "admin" && <AdminPanel />}

          {usuario.role !== "admin" && (
            <>
              <CrearEquipo />
              {equipoId ? (
                <TorneosDisponibles equipoId={equipoId} />
              ) : (
                <p>🔒 Crea un equipo primero para poder inscribirte a torneos.</p>
              )}
            </>
          )}
        </>
      ) : (
        <LoginRegistro />
      )}
    </div>
  );
}

export default App;
