# 🚀 Guía de Inicio Rápido - Las Empoderás

## ⚡ Instalación en 5 Minutos

### 1. Prerrequisitos
```bash
# Verificar Node.js (v14+)
node --version

# Verificar MongoDB
mongod --version
```

### 2. Instalación Rápida
```bash
# Clonar e instalar dependencias
git clone <repository-url>
cd las-empoderas-platform
npm install
cd client && npm install && cd ..

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Inicializar base de datos
node scripts/initRanks.js

# Ejecutar en desarrollo
npm run dev
```

### 3. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Registro**: Crear cuenta nueva
- **Login**: Usar credenciales creadas

## 🎯 Funcionalidades Principales

### ✅ Chat en Tiempo Real
- Mensajes instantáneos
- Usuarios en línea
- Indicadores de escritura
- Rangos visibles en mensajes

### ✅ Sistema de Rangos
- 17 rangos militares
- Desde Soldado Raso hasta General del Ejército
- Iconos únicos para cada rango
- Privilegios específicos

### ✅ Perfiles de Usuario
- Información personalizable
- Visualización del rango
- Historial de actividad
- Edición de perfil

### ✅ Navegación Móvil
- Bottom bar responsive
- Chat, Perfil, Diccionario (SOON), Rangos
- Optimizado para móviles

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Backend con nodemon
npm run client       # Frontend React
npm run build        # Build para producción

# Base de datos
node scripts/initRanks.js    # Inicializar rangos
npm run install-client       # Solo instalar frontend

# Producción
npm start           # Servidor de producción
```

## 🐛 Solución de Problemas

### Error de Conexión a MongoDB
```bash
# Verificar que MongoDB esté corriendo
sudo systemctl start mongod
# o
brew services start mongodb-community
```

### Error de Puerto en Uso
```bash
# Cambiar puerto en .env
PORT=5001
```

### Error de Dependencias
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
cd client && rm -rf node_modules package-lock.json && npm install
```

## 📱 Pruebas Rápidas

### 1. Registro de Usuario
- Ir a http://localhost:3000/register
- Completar formulario
- Verificar que se asigna rango "Soldado Raso"

### 2. Chat en Tiempo Real
- Abrir múltiples pestañas
- Enviar mensajes desde diferentes usuarios
- Verificar que aparecen instantáneamente

### 3. Sistema de Rangos
- Ir a página de Rangos
- Verificar que se muestran los 17 rangos
- Comprobar iconos y descripciones

### 4. Perfil de Usuario
- Ir a Perfil
- Editar información
- Verificar que se guarda correctamente

## 🎨 Personalización

### Cambiar Colores
```typescript
// client/src/App.tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Cambiar color primario
    },
    secondary: {
      main: '#dc004e', // Cambiar color secundario
    },
  },
});
```

### Agregar Nuevos Rangos
```javascript
// scripts/initRanks.js
const newRank = {
  name: 'nuevo_rango',
  displayName: 'Nuevo Rango',
  level: 18,
  icon: '🆕',
  description: 'Descripción del nuevo rango',
  requirements: 'Requisitos específicos',
  privileges: ['Privilegio 1', 'Privilegio 2']
};
```

## 📊 Monitoreo

### Logs del Servidor
```bash
# Ver logs en tiempo real
npm run dev
# Los logs aparecen en la consola
```

### Estado de la Base de Datos
```bash
# Conectar a MongoDB
mongo las-empoderas

# Verificar colecciones
show collections

# Contar documentos
db.users.count()
db.messages.count()
db.ranks.count()
```

## 🚀 Despliegue Rápido

### Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku-cli

# Login y crear app
heroku login
heroku create las-empoderas-platform

# Configurar variables
heroku config:set MONGODB_URI=tu-mongodb-uri
heroku config:set JWT_SECRET=tu-jwt-secret

# Desplegar
git push heroku main
```

### Docker
```bash
# Crear Dockerfile (ya incluido)
docker build -t las-empoderas .
docker run -p 5000:5000 las-empoderas
```

## 📞 Soporte

### Problemas Comunes
1. **Puerto 3000 ocupado**: Cambiar puerto en package.json
2. **MongoDB no conecta**: Verificar que esté corriendo
3. **Errores de CORS**: Verificar CLIENT_URL en .env
4. **Socket.io no funciona**: Verificar SOCKET_URL en .env

### Recursos Adicionales
- [Documentación completa](README.md)
- [Arquitectura del sistema](ARCHITECTURE.md)
- [API Documentation](API.md)

---

**¡Listo! Tu plataforma Las Empoderás está funcionando** 🎉

Para más información, consulta la documentación completa en [README.md](README.md)