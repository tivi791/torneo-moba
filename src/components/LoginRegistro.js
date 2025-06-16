import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function LoginRegistro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modo, setModo] = useState('login'); // "login" o "registro"
  const [error, setError] = useState('');

  const manejarFormulario = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (modo === 'registro') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Guardar en Firestore el rol
        await setDoc(doc(db, 'users', userCred.user.uid), {
          email: userCred.user.email,
          role: 'usuario',
        });

        alert('Usuario registrado con éxito');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>{modo === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      <form onSubmit={manejarFormulario}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {modo === 'login' ? 'Entrar' : 'Registrarme'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p style={{ marginTop: '10px', textAlign: 'center' }}>
        {modo === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <button onClick={() => setModo('registro')}>Regístrate</button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => setModo('login')}>Inicia sesión</button>
          </>
        )}
      </p>
    </div>
  );
}

export default LoginRegistro;
