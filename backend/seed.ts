import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
// Dependiendo del hasheo interno que use Better Auth, si queremos insertar directamente en BD 
// tendríamos que generar el hash exacto.
// La forma recomendada es iniciar la API y usar requests HTTP, o si no 
// usar una función de inserción ficticia y luego usar la app para registrar.
// Por simplicidad, insertaremos artículos públicos con un authorId ficticio, 
// o un script interactivo.
// Mejor aún, este script usa llamadas fetch asumiendo que el server corre:

dotenv.config();

const API_URL = 'http://localhost:3000/api';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSeed() {
  console.log('Iniciando seed...');
  console.log('Asegurate de tener el backend corriendo en el puerto 3000');
  
  await sleep(2000);

  // 1. Registrar usuario 1
  const user1 = { name: 'Juan Perez', email: 'juan@test.com', password: 'password123' };
  let authRes = await fetch(`${API_URL}/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user1)
  });
  
  if (!authRes.ok) {
     console.log('Usuario 1 quizás ya existe');
  }

  // 1.1 Iniciar sesión para obtener token (Better Auth setea la cookie o devuelve el token)
  let loginRes = await fetch(`${API_URL}/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user1.email, password: user1.password })
  });

  const loginData1 = await loginRes.json();
  const token1 = loginData1.token; // En better auth JWT mode, suele venir acá o en un header/cookie

  // Para poder mandar las cookies o auth header
  const headersUser1 = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}` 
  };

  // Insertar artículos
  const articlesUser1 = [
    { title: 'Introducción a React', content: 'React es una librería de JS para interfaces...' },
    { title: 'Node.js vs Deno', content: 'Comparativa de runtimes...' },
    { title: 'Vite es el futuro', content: 'Por qué deberías dejar Webpack...' }
  ];

  for (const art of articlesUser1) {
    await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: headersUser1,
      body: JSON.stringify(art)
    });
  }

  console.log('Seed de artículos completado.');
}

runSeed().catch(console.error);
