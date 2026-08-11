const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const newAuthorsNames = [
  'Laura Fernández', 'Diego Gómez', 'Valeria Silva', 'Marcos Castro', 
  'Lucía Navarro', 'Andrés Vega', 'Carmen Morales', 'Javier Ortiz',
  'Elena Reyes', 'Roberto Delgado'
];

const authors = [
  { name: 'Ana García', email: 'ana@ejemplo.com', password: 'password123' },
  { name: 'Carlos Ruiz', email: 'carlos@ejemplo.com', password: 'password123' },
  { name: 'Sofía Martínez', email: 'sofia@ejemplo.com', password: 'password123' },
  ...newAuthorsNames.map((name, index) => ({
    name,
    email: `autor${index}@ejemplo.com`,
    password: 'password123'
  }))
];

const techTopics = ['React', 'Node.js', 'Inteligencia Artificial', 'CSS Moderno', 'Bases de Datos', 'Docker', 'Arquitectura de Software', 'TypeScript', 'Frontend', 'Backend', 'WebAssembly', 'Microservicios', 'GraphQL', 'Next.js'];
const adjs = ['Moderno', 'Avanzado', 'Definitivo', 'Escalable', 'Eficiente', 'Rápido', 'Profesional', 'Práctico', 'Robusto', 'Seguro'];

const paragraphs = [
  "La tecnología avanza a pasos agigantados. Lo que hace apenas un par de años considerábamos la vanguardia, hoy es el estándar mínimo esperado. Mantenerse actualizado requiere un esfuerzo constante, pero las recompensas en términos de calidad de producto y velocidad de desarrollo son inmensas.",
  "Uno de los mayores desafíos actuales es gestionar la complejidad. A medida que las aplicaciones crecen en características y usuarios, el código tiende a volverse inmanejable si no se aplican patrones de diseño sólidos desde el día cero. Separar las responsabilidades es la regla de oro.",
  "Las herramientas que utilizamos moldean nuestra forma de pensar sobre los problemas. Por eso es vital no atarse a un solo framework o librería, sino entender los fundamentos y los patrones arquitectónicos subyacentes. Así, cuando llegue la nueva herramienta de moda, sabremos exactamente cómo evaluarla.",
  "La experiencia de usuario ya no es un lujo, es una necesidad. Los usuarios esperan interfaces rápidas, responsivas y accesibles en cualquier dispositivo. Lograr esto requiere no solo buen diseño visual, sino un código optimizado que cargue en milisegundos y responda instantáneamente a las interacciones.",
  "El futuro de la web está fuertemente ligado a la automatización y optimización en tiempo de compilación. Herramientas de nueva generación están demostrando que podemos enviar menos JavaScript al cliente y al mismo tiempo construir experiencias altamente interactivas.",
  "Más allá de la sintaxis y las librerías, la clave del software de calidad recae en las pruebas. Un código que no está cubierto por tests es un código que se romperá tarde o temprano. Implementar TDD no es perder el tiempo, es invertir en dormir tranquilo por las noches.",
  "La observabilidad y el monitoreo son los grandes olvidados en los proyectos pequeños, pero se vuelven críticos en producción. Si no puedes ver qué está haciendo tu aplicación cuando los usuarios la están usando, estás volando a ciegas."
];

function generateArticle(authorIndex) {
  const topic = techTopics[Math.floor(Math.random() * techTopics.length)];
  const adj = adjs[Math.floor(Math.random() * adjs.length)];
  
  const titleFormats = [
    `Dominando ${topic}: Un Enfoque ${adj} para el ${new Date().getFullYear()}`,
    `¿Qué es ${topic} y por qué revolucionará la web?`,
    `5 secretos sobre ${topic} que los seniors no te cuentan`,
    `Guía paso a paso para migrar a ${topic}`,
    `El impacto de ${topic} en la arquitectura de software`,
    `Mitos y realidades sobre ${topic} en producción`,
    `Cómo construir un sistema ${adj} usando ${topic}`
  ];
  
  const title = titleFormats[Math.floor(Math.random() * titleFormats.length)];
  
  // Mezclamos y tomamos entre 3 y 6 párrafos largos para que el artículo sea robusto
  const selectedParagraphs = [...paragraphs]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 3);

  const content = selectedParagraphs.join('\n\n') + '\n\nEn conclusión, el desarrollo de software es una disciplina que recompensa la curiosidad y la disciplina. Construir aplicaciones escalables requiere una comprensión profunda de estos conceptos fundamentales.';

  return {
    title,
    content,
    coverImageUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/1200/600`,
    authorIndex
  };
}

let articlesData = [];

for (let i = 0; i < authors.length; i++) {
  // Cada autor tendrá aleatoriamente entre 3 y 6 artículos
  const numArticles = Math.floor(Math.random() * 4) + 3; 
  for (let j = 0; j < numArticles; j++) {
    articlesData.push(generateArticle(i));
  }
}

async function waitForBackend() {
  const maxRetries = 15;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${API_URL}/public/articles`);
      if (res.ok) {
        return true;
      }
    } catch (e) {
      // Ignorar error de fetch
    }
    console.log(`⏳ Esperando al backend (intento ${i + 1}/${maxRetries})...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  return false;
}

async function isAlreadyPopulated() {
  try {
    const res = await fetch(`${API_URL}/public/articles`);
    if (res.ok) {
      const json = await res.json();
      if (json.total && json.total > 0) {
        return true;
      }
    }
  } catch (e) {
    // ignorar
  }
  return false;
}

async function seed() {
  const isUp = await waitForBackend();
  if (!isUp) {
    console.error('❌ El backend no respondió después de varios intentos. Abortando seed.');
    process.exit(1);
  }

  const populated = await isAlreadyPopulated();
  if (populated) {
    console.log('✅ La base de datos ya contiene artículos. Saltando el seed automático para evitar duplicados.');
    process.exit(0);
  }

  console.log(`🌱 Iniciando carga de ${authors.length} autores y ${articlesData.length} artículos...`);
  let cookies = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    console.log(`\nCreando autor: ${author.name}...`);
    
    try {
      const res = await fetch(`${API_URL}/auth/sign-up/email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173'
        },
        body: JSON.stringify({ name: author.name, email: author.email, password: author.password })
      });

      if (!res.ok) {
        const text = await res.text();
        const loginRes = await fetch(`${API_URL}/auth/sign-in/email`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:5173'
          },
          body: JSON.stringify({ email: author.email, password: author.password })
        });
        
        if (!loginRes.ok) {
           console.log(`Fallo también el login: ${await loginRes.text()}`);
        } else {
           cookies[i] = loginRes.headers.get('set-cookie');
           console.log(`✓ Sesión iniciada para ${author.name} (ya existía).`);
        }
      } else {
        cookies[i] = res.headers.get('set-cookie');
        console.log(`✓ Autor ${author.name} creado.`);
      }
    } catch (e) {
      console.error(`Error con autor ${author.name}:`, e.message);
    }
  }

  console.log(`\n📚 Creando ${articlesData.length} artículos...`);
  
  for (const article of articlesData) {
    const authorCookie = cookies[article.authorIndex];
    if (!authorCookie) {
      console.log(`Saltando artículo "${article.title}" porque su autor no se cargó correctamente.`);
      continue;
    }

    try {
      const cookieHeader = Array.isArray(authorCookie) ? authorCookie.join(';') : authorCookie;
      
      const res = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173',
          'Cookie': cookieHeader
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          coverImageUrl: article.coverImageUrl
        })
      });

      if (res.ok) {
        console.log(`✓ Artículo creado: "${article.title}"`);
      } else {
        console.error(`✗ Error al crear artículo "${article.title}":`, await res.text());
      }
    } catch (e) {
      console.error(`Error con artículo "${article.title}":`, e.message);
    }
  }
  
  console.log('\n✅ Carga de datos masiva completada.');
}

seed();
