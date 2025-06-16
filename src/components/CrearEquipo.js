import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';

function CrearEquipo() {
  const [equipo, setEquipo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [nickname, setNickname] = useState('');
  const [jugadorUid, setJugadorUid] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarEquipo() {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'equipos'), where('creadoPorUID', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setEquipo({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
      }
      setCargando(false);
    }
    cargarEquipo();
  }, []);

  const crearEquipo = async (e) => {
    e.preventDefault();
    if (!nombreEquipo.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const nuevoEquipo = {
        nombre: nombreEquipo.trim(),
        creadoPorUID: user.uid,
        jugadores: [],
        creadoEn: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'equipos'), nuevoEquipo);
      setEquipo({ id: docRef.id, ...nuevoEquipo });
      setNombreEquipo('');
      setMensaje('Equipo creado con éxito');
    } catch (error) {
      setMensaje('Error al crear equipo: ' + error.message);
    }
  };

  const agregarJugador = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !jugadorUid.trim()) {
      setMensaje('Debes ingresar nickname y UID del jugador');
      return;
    }

    if (equipo.jugadores.length >= 7) {
      setMensaje('Ya tienes 7 jugadores');
      return;
    }

    if (equipo.jugadores.find(j => j.uid === jugadorUid.trim())) {
      setMensaje('Este UID ya está agregado');
      return;
    }

    try {
      const equipoRef = doc(db, 'equipos', equipo.id);
      const nuevosJugadores = [...equipo.jugadores, { nickname: nickname.trim(), uid: jugadorUid.trim() }];
      await updateDoc(equipoRef, { jugadores: nuevosJugadores });
      setEquipo({ ...equipo, jugadores: nuevosJugadores });
      setNickname('');
      setJugadorUid('');
      setMensaje('Jugador agregado con éxito');
    } catch (error) {
      setMensaje('Error al agregar jugador: ' + error.message);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      {equipo ? (
        <>
          <h3>Equipo: {equipo.nombre}</h3>
          <ul>
            {equipo.jugadores.map((j, i) => (
              <li key={i}>{j.nickname} - UID: {j.uid}</li>
            ))}
          </ul>
          {equipo.jugadores.length < 7 && (
            <form onSubmit={agregarJugador}>
              <input
                type="text"
                placeholder="Nickname del jugador"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="UID del jugador (del juego)"
                value={jugadorUid}
                onChange={e => setJugadorUid(e.target.value)}
                required
              />
              <button type="submit">Agregar jugador</button>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={crearEquipo}>
          <h3>Crea tu equipo</h3>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombreEquipo}
            onChange={e => setNombreEquipo(e.target.value)}
            required
          />
          <button type="submit">Crear equipo</button>
        </form>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CrearEquipo;
