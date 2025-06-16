import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import CrearEquipo from './components/CrearEquipo';
import AdminPanel from './components/AdminPanel';
import LoginRegistro from './components/LoginRegistro';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

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
        } catch (error) {
          console.error("Error al obtener rol:", error);
          setUsuario({ ...user, role: 'usuario' });
        }
      } else {
        setUsuario(null);
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
          {usuario.role === "admin" && (
            <AdminPanel />
          )}
          <CrearEquipo />
        </>
      ) : (
        <LoginRegistro />
      )}
    </div>
  );
}

export default App;
