import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import CrearEquipo from './components/CrearEquipo';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });

    // Limpia el observer cuando se desmonte el componente
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h1>Plataforma de Torneos MOBA</h1>

      {usuario ? (
        <>
          <p>Bienvenido: <strong>{usuario.email}</strong></p>
          <button onClick={() => signOut(auth)}>Cerrar sesión</button>
          <hr />
          <CrearEquipo />
        </>
      ) : (
        <>
          <Login />
          <Register />
        </>
      )}
    </div>
  );
}

export default App;
