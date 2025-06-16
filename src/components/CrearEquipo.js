import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

function CrearEquipo() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    if (!nombre.trim()) {
      setMensaje('⚠️ El nombre del equipo no puede estar vacío.');
      return;
    }

    try {
      setCargando(true);
      // Verificar si ya existe un equipo con el mismo nombre
      const q = query(collection(db, 'equipos'), where('nombre', '==', nombre));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMensaje('❌ Ya existe un equipo con ese nombre.');
        setCargando(false);
        return;
      }

      // Guardar el nuevo equipo
      const user = auth.currentUser;
      await addDoc(collection(db, 'equipos'), {
        nombre,
        creadoPor: user.email,
        uidCreador: user.uid,
        creadoEn: Timestamp.now(),
        jugadores: [], // puedes agregar lógica para añadir jugadores luego
      });

      setMensaje('✅ Equipo creado con éxito.');
      setNombre('');
    } catch (error) {
      console.error('Error al crear equipo:', error);
      setMensaje('❌ Error al crear equipo. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', marginBottom: '30px' }}>
      <h2>Crear Equipo</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del equipo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          type="submit"
          disabled={cargando}
          style={{ width: '100%', padding: '10px' }}
        >
          {cargando ? 'Creando...' : 'Crear equipo'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '10px', color: mensaje.includes('✅') ? 'green' : 'red' }}>{mensaje}</p>}
    </div>
  );
}

export default CrearEquipo;
