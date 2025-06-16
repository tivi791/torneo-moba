import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

function CrearEquipo() {
  const [equipoExistente, setEquipoExistente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [nombreJugador, setNombreJugador] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const verificarEquipo = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'equipos'), where('creadoPorUID', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setEquipoExistente({
          id: docSnap.id,
          ...docSnap.data(),
        });
      }

      setCargando(false);
    };

    verificarEquipo();
  }, []);

  const crearEquipo = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const nuevoEquipo = {
        nombre: nombreEquipo,
        creadoPorUID: user.uid,
        jugadores: [],
        creadoEn: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'equipos'), nuevoEquipo);

      setEquipoExistente({ id: docRef.id, ...nuevoEquipo });
      setNombreEquipo('');
      setMensaje('✅ Equipo creado correctamente.');
    } catch (error) {
      console.error('Error al crear equipo:', error);
      setMensaje('❌ Error al crear equipo.');
    }
  };

  const agregarJugador = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !equipoExistente) return;

    const jugadoresActuales = equipoExistente.jugadores || [];

    if (jugadoresActuales.length >= 7) {
      setMensaje('⚠️ Tu equipo ya tiene 7 jugadores.');
      return;
    }

    const yaExiste = jugadoresActuales.some(
      (j) => j.nickname.toLowerCase() === nombreJugador.toLowerCase()
    );
    if (yaExiste) {
      setMensaje('⚠️ Ese nickname ya fue agregado.');
      return;
    }

    try {
      const equipoRef = doc(db, 'equipos', equipoExistente.id);
      const nuevoJugador = {
        nickname: nombreJugador,
        uid: user.uid,
      };

      await updateDoc(equipoRef, {
        jugadores: [...jugadoresActuales, nuevoJugador],
      });

      setEquipoExistente((prev) => ({
        ...prev,
        jugadores: [...jugadoresActuales, nuevoJugador],
      }));

      setNombreJugador('');
      setMensaje('✅ Jugador agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar jugador:', error);
      setMensaje('❌ Error al agregar jugador.');
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      {equipoExistente ? (
        <>
          <h3>Mi equipo: {equipoExistente.nombre}</h3>
          <p><strong>Jugadores actuales:</strong></p>
          <ul>
            {(equipoExistente.jugadores || []).map((j, i) => (
              <li key={i}>{j.nickname}</li>
            ))}
          </ul>
          {equipoExistente.jugadores.length < 7 && (
            <form onSubmit={agregarJugador}>
              <input
                type="text"
                placeholder="Nombre del jugador"
                value={nombreJugador}
                onChange={(e) => setNombreJugador(e.target.value)}
                required
              />
              <button type="submit">Agregar jugador</button>
            </form>
          )}
          {mensaje && <p>{mensaje}</p>}
        </>
      ) : (
        <form onSubmit={crearEquipo}>
          <h3>Crear un equipo</h3>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            required
          />
          <button type="submit">Crear equipo</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
      )}
    </div>
  );
}

export default CrearEquipo;
