# Sistema de Autorización

## Roles y Permisos

### Admin

- Acceso completo a todas las rutas
- Rutas: Dashboard, Caja, Ventas, Inventario, Usuarios, Reportes, Transacciones, Estadísticas, Notificaciones, Sucursales, Configuración

### Pharmacist

- Acceso limitado a ventas y caja
- Rutas: Dashboard, Caja, Ventas

## Componentes Principales

### useAuthFetch Hook

```typescript
const { getUserAuth, hasRouteAccess, isAdmin, isPharmacist } = useAuthFetch();
```

### ProtectedRoute

Protege rutas automáticamente según la URL:

```typescript
<ProtectedRoute>
  <PageContent />
</ProtectedRoute>
```

### RouteGuard

Protege rutas por rol específico:

```typescript
<RouteGuard requiredRole="admin">
  <AdminContent />
</RouteGuard>
```

## Implementación

1. **Sidebar**: Filtra opciones según rol
2. **Layout**: Protege todas las rutas con ProtectedRoute
3. **Páginas específicas**: Usan RouteGuard para protección adicional

## Uso

```typescript
// Verificar permisos
const { isAdmin, hasRouteAccess } = useAuthFetch();

// Proteger página
<RouteGuard requiredRole="admin">
  <UsersPage />
</RouteGuard>

// Mostrar información del usuario
<UserInfo />
```
