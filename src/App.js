import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import CrearEquipo from './components/CrearEquipo';
import AdminPanel from './components/AdminPanel'; // crea este componente luego
import LoginRegistro from './components/LoginRegistro'; // también crea este luego

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Traer datos del rol desde Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsuario({ ...user, role: docSnap.data().role });
        } else {
          // Si no existe documento, rol por defecto
          setUsuario({ ...user, role: "usuario" });
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
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Plataforma de Torneos MOBA</h1>

      {usuario ? (
        <>
          <p>Bienvenido: <strong>{usuario.email}</strong> ({usuario.role})</p>
          <button onClick={() => signOut(auth)}>Cerrar sesión</button>
          <hr />
          {usuario.role === "admin" ? <AdminPanel /> : <CrearEquipo />}
        </>
      ) : (
        <LoginRegistro />
      )}
    </div>
  );
}

export default App;
