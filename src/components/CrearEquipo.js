import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function CrearEquipo() {
  const [nombre, setNombre] = useState('');
  const [formato, setFormato] = useState('5vs5');
  const [jugadores, setJugadores] = useState(['']);
  const [mensaje, setMensaje] = useState('');

  const agregarJugador = () => {
    setJugadores([...jugadores, '']);
  };

  const cambiarJugador = (index, valor) => {
    const copia = [...jugadores];
    copia[index] = valor;
    setJugadores(copia);
  };

  const crearEquipo = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'equipos'), {
        nombre,
        formato,
        jugadores,
        creadorId: auth.currentUser.uid,
        creadoEl: new Date()
      });
      setMensaje('✅ Equipo creado con éxito');
      setNombre('');
      setJugadores(['']);
    } catch (error) {
      setMensaje('❌ Error al crear equipo');
    }
  };

  return (
    <form onSubmit={crearEquipo}>
      <h2>Crear Equipo</h2>
      <input
        type="text"
        placeholder="Nombre del equipo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <select value={formato} onChange={(e) => setFormato(e.target.value)}>
        <option value="1vs1">1 vs 1</option>
        <option value="2vs2">2 vs 2</option>
        <option value="3vs3">3 vs 3</option>
        <option value="5vs5">5 vs 5</option>
      </select>

      <h4>Jugadores (email)</h4>
      {jugadores.map((j, i) => (
        <input
          key={i}
          type="email"
          placeholder={`Jugador ${i + 1}`}
          value={j}
          onChange={(e) => cambiarJugador(i, e.target.value)}
        />
      ))}

      <button type="button" onClick={agregarJugador}>+ Añadir jugador</button>
      <br /><br />
      <button type="submit">Crear equipo</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
