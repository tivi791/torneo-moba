import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function CrearEquipo() {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [jugadores, setJugadores] = useState([{ nickname: '', uid: '' }]);
  const [mensaje, setMensaje] = useState('');

  const agregarJugador = () => {
    setJugadores([...jugadores, { nickname: '', uid: '' }]);
  };

  const actualizarJugador = (index, campo, valor) => {
    const nuevosJugadores = [...jugadores];
    nuevosJugadores[index][campo] = valor;
    setJugadores(nuevosJugadores);
  };

  const enviar = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    try {
      await addDoc(collection(db, 'equipos'), {
        nombre: nombreEquipo,
        creadoPor: user.email,
        jugadores: jugadores.filter(j => j.nickname.trim() !== ''),
        creadoEn: Timestamp.now()
      });
      setMensaje('✅ Equipo creado correctamente');
      setNombreEquipo('');
      setJugadores([{ nickname: '', uid: '' }]);
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      setMensaje('❌ Error al crear el equipo');
    }
  };

  return (
    <form onSubmit={enviar}>
      <h3>Crear Equipo</h3>
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={nombreEquipo}
        onChange={(e) => setNombreEquipo(e.target.value)}
        required
      />

      <h4>Jugadores</h4>
      {jugadores.map((jugador, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Jugador ${index + 1} - Nickname`}
            value={jugador.nickname}
            onChange={(e) => actualizarJugador(index, 'nickname', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="UID (opcional)"
            value={jugador.uid}
            onChange={(e) => actualizarJugador(index, 'uid', e.target.value)}
          />
        </div>
      ))}

      <button type="button" onClick={agregarJugador}>+ Agregar jugador</button>
      <br />
      <button type="submit">Registrar equipo</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}

export default CrearEquipo;
