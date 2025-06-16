import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CrearEquipo() {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [jugadores, setJugadores] = useState(['']); // array de emails
  const [mensaje, setMensaje] = useState('');

  const agregarJugador = () => {
    setJugadores([...jugadores, '']);
  };

  const cambiarJugador = (index, valor) => {
    const copia = [...jugadores];
    copia[index] = valor;
    setJugadores(copia);
  };

  const registrarEquipo = async (e) => {
    e.preventDefault();
    if (!nombreEquipo.trim()) {
      setMensaje('El nombre del equipo es obligatorio');
      return;
    }
    if (jugadores.some(j => !j.trim())) {
      setMensaje('Todos los jugadores deben tener correo válido');
      return;
    }

    try {
      await addDoc(collection(db, 'equipos'), {
        nombre: nombreEquipo,
        jugadores: jugadores,
        creadoEn: serverTimestamp(),
      });
      setMensaje('✅ Equipo registrado con éxito');
      setNombreEquipo('');
      setJugadores(['']);
    } catch (error) {
      setMensaje('❌ Error al registrar equipo: ' + error.message);
    }
  };

  return (
    <form onSubmit={registrarEquipo} style={{maxWidth:'400px'}}>
      <h3>Crear Equipo</h3>
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={nombreEquipo}
        onChange={(e) => setNombreEquipo(e.target.value)}
        required
        style={{width:'100%', padding:'8px', marginBottom:'8px'}}
      />

      <h4>Jugadores (email)</h4>
      {jugadores.map((jugador, idx) => (
        <input
          key={idx}
          type="email"
          placeholder={`Jugador ${idx + 1}`}
          value={jugador}
          onChange={(e) => cambiarJugador(idx, e.target.value)}
          required
          style={{width:'100%', padding:'8px', marginBottom:'4px'}}
        />
      ))}

      <button type="button" onClick={agregarJugador} style={{marginBottom:'12px'}}>
        + Añadir jugador
      </button>

      <button type="submit">Registrar equipo</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
