import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function CrearEquipo() {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [yaRegistrado, setYaRegistrado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarEquipoExistente = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'equipos'), where('creadoPorUID', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setYaRegistrado(true);
        setMensaje('⚠️ Ya has registrado un equipo. No puedes crear otro.');
      }

      setCargando(false);
    };

    verificarEquipoExistente();
  }, []);

  const crearEquipo = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    if (yaRegistrado) {
      setMensaje('⚠️ Ya tienes un equipo registrado.');
      return;
    }

    try {
      await addDoc(collection(db, 'equipos'), {
        nombre: nombreEquipo,
        creadoPor: user.email,
        creadoPorUID: user.uid,
        creadoEn: new Date(),
        jugadores: [], // puedes luego permitir agregar jugadores
      });

      setMensaje('✅ Equipo creado exitosamente.');
      setYaRegistrado(true);
      setNombreEquipo('');
    } catch (error) {
      console.error('Error al crear equipo:', error);
      setMensaje('❌ Error al crear el equipo.');
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h3>Crear Equipo</h3>
      {yaRegistrado ? (
        <p>{mensaje}</p>
      ) : (
        <form onSubmit={crearEquipo}>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            required
          />
          <button type="submit">Registrar equipo</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
      )}
    </div>
  );
}

export default CrearEquipo;
