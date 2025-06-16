import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';

function TorneosDisponibles() {
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarTorneos() {
      setCargando(true);
      try {
        const torneosCol = collection(db, 'torneos');
        const q = query(torneosCol, where('estado', '==', 'activo'));
        const torneosSnapshot = await getDocs(q);
        const lista = torneosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTorneos(lista);
      } catch (error) {
        setMensaje('Error al cargar torneos: ' + error.message);
      }
      setCargando(false);
    }
    cargarTorneos();
  }, []);

  const inscribirUsuario = async (torneoId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setMensaje('Debes iniciar sesión para inscribirte.');
        return;
      }

      const torneoRef = doc(db, 'torneos', torneoId);
      // Agregamos el UID del usuario en un array "inscritos" (si no existe, se crea)
      await updateDoc(torneoRef, {
        inscritos: arrayUnion(user.uid)
      });

      setMensaje('Te has inscrito correctamente en el torneo.');
    } catch (error) {
      setMensaje('Error al inscribirse: ' + error.message);
    }
  };

  if (cargando) return <p>Cargando torneos disponibles...</p>;

  return (
    <div>
      <h3>Torneos Disponibles</h3>
      {mensaje && <p>{mensaje}</p>}
      {torneos.length === 0 ? (
        <p>No hay torneos activos disponibles.</p>
      ) : (
        torneos.map(torneo => (
          <div key={torneo.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <h4>{torneo.nombre}</h4>
            <p><strong>Equipos participantes:</strong> {torneo.equipos.length}</p>
            <button onClick={() => inscribirUsuario(torneo.id)}>Inscribirme</button>
            <p>
              <strong>Usuarios inscritos:</strong> {torneo.inscritos ? torneo.inscritos.length : 0}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default TorneosDisponibles;
