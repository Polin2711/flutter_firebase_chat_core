# Las Empoderás - Plataforma Social

Una plataforma web completa para el grupo "Las Empoderás" que incluye chat en tiempo real, sistema de perfiles de usuario y jerarquía de rangos militares.

## 🚀 Características Principales

### 💬 Chat en Tiempo Real
- Chat grupal visible inmediatamente al acceder
- Interfaz intuitiva y responsive
- Sistema de notificaciones para mensajes nuevos
- Indicadores de usuarios escribiendo
- Lista de usuarios en línea

### 👤 Sistema de Perfiles
- Perfil personalizable para cada miembro
- Información personal editable
- Visualización del rango actual con insignia
- Historial de actividad

### 🎖️ Sistema de Rangos Militares
- Jerarquía completa desde Soldado Raso hasta General del Ejército
- 17 rangos diferentes con iconos únicos
- Visualización del rango en el chat y perfil
- Descripción de requisitos y privilegios para cada rango

### 📱 Navegación Móvil
- Bottom bar con navegación intuitiva
- Chat, Perfil, Diccionario (SOON), y Rangos
- Diseño responsive para todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MongoDB** con Mongoose
- **Socket.io** para chat en tiempo real
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas

### Frontend
- **React** con TypeScript
- **Material-UI** para componentes de interfaz
- **Socket.io-client** para conexión en tiempo real
- **Axios** para peticiones HTTP
- **React Router** para navegación

## 📋 Rangos Militares Implementados

1. **Soldado Raso** 🪖 - Rango inicial
2. **Soldado de Primera** 🎖️ - Con experiencia básica
3. **Cabo** ⭐ - Líder de equipo
4. **Cabo Primero** 🌟 - Cabo con experiencia avanzada
5. **Sargento** 🏅 - Líder de pelotón
6. **Sargento Primero** 🎖️ - Responsabilidades de sección
7. **Brigada** 🏆 - Líder de compañía
8. **Subteniente** 🥇 - Oficial subalterno
9. **Teniente** 👑 - Oficial con mando medio
10. **Capitán** 👑 - Oficial superior
11. **Comandante** 👑 - Oficial superior de batallón
12. **Teniente Coronel** 👑 - Oficial superior de regimiento
13. **Coronel** 👑 - Oficial superior de brigada
14. **General de Brigada** 👑 - General de división
15. **General de División** 👑 - General de cuerpo de ejército
16. **Teniente General** 👑 - General de ejército
17. **General del Ejército** 👑 - Rango más alto

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o en la nube)
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd las-empoderas-platform
```

### 2. Instalar Dependencias del Backend
```bash
npm install
```

### 3. Instalar Dependencias del Frontend
```bash
cd client
npm install
cd ..
```

### 4. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
MONGODB_URI=mongodb://localhost:27017/las-empoderas
JWT_SECRET=tu-clave-secreta-jwt
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 5. Inicializar la Base de Datos
```bash
# Ejecutar script para crear rangos militares
node scripts/initRanks.js
```

### 6. Ejecutar la Aplicación

#### Desarrollo
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Producción
```bash
# Construir frontend
npm run build

# Ejecutar servidor
npm start
```

## 📁 Estructura del Proyecto

```
las-empoderas-platform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # Contextos de React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios de API y Socket
│   │   ├── types/          # Tipos TypeScript
│   │   └── App.tsx         # Componente principal
│   └── package.json
├── models/                 # Modelos de MongoDB
├── routes/                 # Rutas de la API
├── middleware/             # Middleware personalizado
├── scripts/                # Scripts de utilidad
├── server.js              # Servidor principal
└── package.json
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/profile` - Actualizar perfil
- `GET /api/users/online/list` - Usuarios en línea

### Chat
- `GET /api/chat/messages` - Obtener mensajes
- `POST /api/chat/messages` - Enviar mensaje
- `PUT /api/chat/messages/:id` - Editar mensaje
- `DELETE /api/chat/messages/:id` - Eliminar mensaje

### Rangos
- `GET /api/ranks` - Obtener todos los rangos
- `GET /api/ranks/:id` - Obtener rango por ID
- `GET /api/ranks/:id/users` - Usuarios por rango
- `GET /api/ranks/stats/overview` - Estadísticas de rangos

## 🔒 Seguridad

- Autenticación JWT con tokens seguros
- Encriptación de contraseñas con bcrypt
- Validación y sanitización de entradas
- Rate limiting para prevenir abuso
- CORS configurado para seguridad
- Helmet.js para headers de seguridad

## 📱 Características Móviles

- Diseño responsive con Material-UI
- Bottom navigation bar
- Interfaz optimizada para touch
- Soporte para PWA (Progressive Web App)

## 🚀 Despliegue

### Heroku
```bash
# Instalar Heroku CLI
# Crear aplicación
heroku create las-empoderas-platform

# Configurar variables de entorno
heroku config:set MONGODB_URI=tu-mongodb-uri
heroku config:set JWT_SECRET=tu-jwt-secret

# Desplegar
git push heroku main
```

### Docker
```bash
# Construir imagen
docker build -t las-empoderas-platform .

# Ejecutar contenedor
docker run -p 5000:5000 las-empoderas-platform
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Diseño UI/UX**: [Diseñador]
- **Backend**: [Desarrollador Backend]

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Email: soporte@lasempoderas.com
- Discord: [Servidor de Discord]
- GitHub Issues: [Repositorio Issues]

## 🔮 Roadmap Futuro

- [ ] Sistema de notificaciones push
- [ ] Chat privado entre usuarios
- [ ] Sistema de eventos y calendario
- [ ] Integración con redes sociales
- [ ] App móvil nativa
- [ ] Sistema de logros y badges
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)

---

**Las Empoderás** - Empoderando a través de la tecnología y la comunidad 💪