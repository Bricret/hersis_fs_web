# Integración de WebSockets para Notificaciones en Tiempo Real

## Descripción

Esta integración permite recibir notificaciones en tiempo real a través de WebSockets utilizando Socket.IO, junto con notificaciones push del navegador para una experiencia de usuario completa.

## Características

- **WebSockets en tiempo real**: Conexión persistente para recibir notificaciones instantáneamente
- **Notificaciones push del navegador**: Alertas nativas del sistema operativo
- **Reconexión automática**: Manejo robusto de desconexiones y reconexiones
- **Autenticación JWT**: Verificación de identidad del usuario
- **Heartbeat**: Monitoreo de la salud de la conexión
- **Filtros y gestión**: Sistema completo de filtrado y gestión de notificaciones

## Arquitectura

### Capa de Infraestructura

- `websocket.adapter.ts`: Adaptador para Socket.IO
- `websocket.config.ts`: Configuración del WebSocket

### Capa de Aplicación

- `websocket-notification.service.ts`: Servicio de notificaciones WebSocket
- `push-notification.service.ts`: Servicio de notificaciones push

### Capa de Presentación

- `useWebSocketNotifications.tsx`: Hook para WebSocket
- `usePushNotifications.tsx`: Hook para notificaciones push
- `NotificationProvider.tsx`: Contexto de notificaciones
- `NotificationPopover.tsx`: Componente de notificaciones en el header

## Configuración

### Variables de Entorno

Crear un archivo `.env.local` con:

```bash
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000
```

### Configuración del WebSocket

El archivo `websocket.config.ts` contiene:

```typescript
export const WEBSOCKET_CONFIG = {
  SERVER_URL: "http://localhost:3000",
  RECONNECTION: {
    ENABLED: true,
    MAX_ATTEMPTS: 5,
    DELAY: 1000,
    MAX_DELAY: 30000,
  },
  HEARTBEAT: {
    ENABLED: true,
    INTERVAL: 30000,
    TIMEOUT: 10000,
  },
  // ... más configuraciones
};
```

## Uso

### 1. Configurar el Proveedor

Envolver la aplicación con `NotificationProvider`:

```tsx
import { NotificationProvider } from "@/presentation/providers/NotificationProvider";

export default function Layout({ children }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
```

### 2. Usar el Hook de WebSocket

```tsx
import { useWebSocketNotifications } from "@/presentation/hooks/notifications/useWebSocketNotifications";

function MyComponent() {
  const { isConnected, connect, disconnect } = useWebSocketNotifications({
    onNotificationReceived: (notification) => {
      console.log("Nueva notificación:", notification);
    },
    autoConnect: true,
  });

  return <div>Estado: {isConnected ? "Conectado" : "Desconectado"}</div>;
}
```

### 3. Usar el Hook de Notificaciones Push

```tsx
import { usePushNotifications } from "@/presentation/hooks/notifications/usePushNotifications";

function MyComponent() {
  const { permission, requestPermission, showNotification } =
    usePushNotifications();

  const handleActivatePush = async () => {
    await requestPermission();
  };

  return (
    <div>
      <button onClick={handleActivatePush}>Activar Notificaciones Push</button>
      <p>Estado: {permission}</p>
    </div>
  );
}
```

### 4. Usar el Contexto de Notificaciones

```tsx
import { useNotificationContext } from "@/presentation/providers/NotificationProvider";

function MyComponent() {
  const { notifications, unreadCount, markAsRead, isWebSocketConnected } =
    useNotificationContext();

  return (
    <div>
      <p>Notificaciones no leídas: {unreadCount}</p>
      <p>WebSocket: {isWebSocketConnected ? "Conectado" : "Desconectado"}</p>

      {notifications.map((notification) => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => markAsRead(notification.id)}>
            Marcar como leída
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Eventos del WebSocket

### Eventos del Cliente al Servidor

- `ping`: Heartbeat del cliente
- `join`: Unirse a una sala específica
- `leave`: Salir de una sala específica

### Eventos del Servidor al Cliente

- `notification`: Nueva notificación recibida
- `pong`: Respuesta al heartbeat
- `connect`: Conexión establecida
- `disconnect`: Desconexión
- `error`: Error en la conexión

## Estructura de Notificación

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  entity_type?: string;
  created_at: Date;
  updated_at: Date;
}
```

## Tipos de Notificación

- `low_stock`: Stock bajo de productos
- `expiration_warning`: Productos próximos a vencer
- `sale_reminder`: Recordatorios de ventas
- `system_alert`: Alertas del sistema
- `inventory_alert`: Alertas de inventario

## Prioridades

- `critical`: Crítica (rojo)
- `high`: Alta (naranja)
- `medium`: Media (azul)
- `low`: Baja (gris)

## Estados

- `unread`: No leída
- `read`: Leída
- `dismissed`: Descartada
- `archived`: Archivada

## Manejo de Errores

### Reconexión Automática

- Se intenta reconectar automáticamente en caso de desconexión
- Backoff exponencial para evitar spam de reconexiones
- Máximo de 5 intentos de reconexión

### Fallback

- Si el WebSocket falla, se muestran notificaciones estáticas
- Las notificaciones push siguen funcionando independientemente
- Toast notifications como respaldo

## Seguridad

- Autenticación mediante JWT en el header de autenticación
- Validación del token en cada conexión
- Timeout de autenticación configurable
- Manejo seguro de desconexiones

## Monitoreo

### Indicadores Visuales

- Icono de WiFi en el header de notificaciones
- Estado de conexión en la página de notificaciones
- Contador de notificaciones no leídas

### Logs

- Conexión/desconexión
- Errores de conexión
- Intentos de reconexión
- Notificaciones recibidas

## Troubleshooting

### Problemas Comunes

1. **WebSocket no se conecta**

   - Verificar que el servidor esté ejecutándose
   - Verificar la URL en la configuración
   - Verificar que el token JWT sea válido

2. **Notificaciones push no funcionan**

   - Verificar permisos del navegador
   - Verificar que HTTPS esté habilitado (requerido para push)
   - Verificar compatibilidad del navegador

3. **Reconexiones fallan**
   - Verificar configuración de reconexión
   - Verificar límite de intentos
   - Verificar logs del servidor

### Debug

Habilitar logs detallados en la consola del navegador para:

- Estado de conexión WebSocket
- Eventos recibidos
- Intentos de reconexión
- Errores de autenticación

## Dependencias

- `socket.io-client`: Cliente Socket.IO
- `sonner`: Toast notifications
- `lucide-react`: Iconos

## Compatibilidad

- **Navegadores**: Chrome 50+, Firefox 45+, Safari 11+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Protocolos**: WebSocket, HTTP Long Polling (fallback)

## Rendimiento

- Conexión persistente para latencia mínima
- Heartbeat para detectar desconexiones rápidamente
- Reconexión inteligente con backoff exponencial
- Limpieza automática de recursos al desmontar componentes
