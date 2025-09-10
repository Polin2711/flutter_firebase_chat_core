const mongoose = require('mongoose');
const Rank = require('../models/Rank');
require('dotenv').config();

// Rangos militares del Ejército Español (desde soldado raso hasta el más alto)
const militaryRanks = [
  {
    name: 'soldado_raso',
    displayName: 'Soldado Raso',
    level: 1,
    icon: '🪖',
    description: 'Rango inicial para nuevos miembros del grupo',
    requirements: 'Ser miembro activo del grupo Las Empoderás',
    privileges: [
      'Acceso al chat grupal',
      'Visualización de perfil personal',
      'Participación en actividades del grupo'
    ]
  },
  {
    name: 'soldado_primera',
    displayName: 'Soldado de Primera',
    level: 2,
    icon: '🎖️',
    description: 'Soldado con experiencia y compromiso demostrado',
    requirements: 'Participación activa durante 1 mes',
    privileges: [
      'Todos los privilegios de Soldado Raso',
      'Acceso a contenido exclusivo',
      'Posibilidad de sugerir mejoras'
    ]
  },
  {
    name: 'cabo',
    displayName: 'Cabo',
    level: 3,
    icon: '⭐',
    description: 'Líder de equipo con responsabilidades básicas',
    requirements: 'Participación activa durante 3 meses y liderazgo demostrado',
    privileges: [
      'Todos los privilegios anteriores',
      'Moderación básica del chat',
      'Organización de eventos menores'
    ]
  },
  {
    name: 'cabo_primero',
    displayName: 'Cabo Primero',
    level: 4,
    icon: '🌟',
    description: 'Cabo con experiencia avanzada y mayor responsabilidad',
    requirements: '6 meses de participación y excelente desempeño como Cabo',
    privileges: [
      'Todos los privilegios anteriores',
      'Mentoría de nuevos miembros',
      'Acceso a herramientas de moderación avanzadas'
    ]
  },
  {
    name: 'sargento',
    displayName: 'Sargento',
    level: 5,
    icon: '🏅',
    description: 'Líder de pelotón con amplia experiencia',
    requirements: '1 año de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Moderación completa del chat',
      'Organización de eventos importantes',
      'Acceso a estadísticas del grupo'
    ]
  },
  {
    name: 'sargento_primero',
    displayName: 'Sargento Primero',
    level: 6,
    icon: '🎖️',
    description: 'Sargento con responsabilidades de sección',
    requirements: '18 meses de participación y gestión exitosa de equipos',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de rangos menores',
      'Acceso a herramientas administrativas',
      'Representación del grupo en eventos externos'
    ]
  },
  {
    name: 'brigada',
    displayName: 'Brigada',
    level: 7,
    icon: '🏆',
    description: 'Líder de compañía con amplias responsabilidades',
    requirements: '2 años de participación y gestión exitosa de múltiples equipos',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de moderadores',
      'Acceso completo a herramientas administrativas',
      'Toma de decisiones importantes del grupo'
    ]
  },
  {
    name: 'subteniente',
    displayName: 'Subteniente',
    level: 8,
    icon: '🥇',
    description: 'Oficial subalterno con responsabilidades de mando',
    requirements: '3 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de todos los rangos subalternos',
      'Acceso a información confidencial del grupo',
      'Participación en decisiones estratégicas'
    ]
  },
  {
    name: 'teniente',
    displayName: 'Teniente',
    level: 9,
    icon: '👑',
    description: 'Oficial con responsabilidades de mando medio',
    requirements: '4 años de participación y gestión exitosa de la organización',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión completa de la estructura organizacional',
      'Acceso a todas las herramientas administrativas',
      'Representación oficial del grupo'
    ]
  },
  {
    name: 'capitan',
    displayName: 'Capitán',
    level: 10,
    icon: '👑',
    description: 'Oficial superior con responsabilidades de compañía',
    requirements: '5 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de oficiales subalternos',
      'Acceso a información estratégica',
      'Participación en decisiones de alto nivel'
    ]
  },
  {
    name: 'comandante',
    displayName: 'Comandante',
    level: 11,
    icon: '👑',
    description: 'Oficial superior con responsabilidades de batallón',
    requirements: '6 años de participación y gestión exitosa de múltiples unidades',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de múltiples compañías',
      'Acceso a información confidencial',
      'Participación en planificación estratégica'
    ]
  },
  {
    name: 'teniente_coronel',
    displayName: 'Teniente Coronel',
    level: 12,
    icon: '👑',
    description: 'Oficial superior con responsabilidades de regimiento',
    requirements: '8 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de batallones completos',
      'Acceso a información de alto secreto',
      'Participación en decisiones ejecutivas'
    ]
  },
  {
    name: 'coronel',
    displayName: 'Coronel',
    level: 13,
    icon: '👑',
    description: 'Oficial superior con responsabilidades de brigada',
    requirements: '10 años de participación y gestión exitosa de grandes unidades',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de regimientos completos',
      'Acceso a información estratégica confidencial',
      'Participación en decisiones de estado mayor'
    ]
  },
  {
    name: 'general_brigada',
    displayName: 'General de Brigada',
    level: 14,
    icon: '👑',
    description: 'General con responsabilidades de división',
    requirements: '12 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de brigadas completas',
      'Acceso a información de máximo secreto',
      'Participación en decisiones de alto mando'
    ]
  },
  {
    name: 'general_division',
    displayName: 'General de División',
    level: 15,
    icon: '👑',
    description: 'General con responsabilidades de cuerpo de ejército',
    requirements: '15 años de participación y gestión exitosa de divisiones',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de divisiones completas',
      'Acceso a información de estado mayor',
      'Participación en decisiones de comando supremo'
    ]
  },
  {
    name: 'teniente_general',
    displayName: 'Teniente General',
    level: 16,
    icon: '👑',
    description: 'General con responsabilidades de ejército',
    requirements: '18 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Gestión de cuerpos de ejército',
      'Acceso a información de máximo nivel',
      'Participación en decisiones de comando supremo'
    ]
  },
  {
    name: 'general_ejercito',
    displayName: 'General del Ejército',
    level: 17,
    icon: '👑',
    description: 'El rango más alto del Ejército Español',
    requirements: '20 años de participación y liderazgo excepcional',
    privileges: [
      'Todos los privilegios anteriores',
      'Comando supremo de la organización',
      'Acceso a toda la información',
      'Toma de decisiones finales',
      'Representación máxima del grupo'
    ]
  }
];

async function initializeRanks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/las-empoderas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a MongoDB');

    // Clear existing ranks
    await Rank.deleteMany({});
    console.log('Rangos existentes eliminados');

    // Insert new ranks
    const createdRanks = await Rank.insertMany(militaryRanks);
    console.log(`${createdRanks.length} rangos militares creados exitosamente`);

    // Display created ranks
    console.log('\nRangos creados:');
    createdRanks.forEach(rank => {
      console.log(`${rank.level}. ${rank.displayName} ${rank.icon} - ${rank.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error inicializando rangos:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeRanks();