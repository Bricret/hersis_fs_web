# Hooks Comunes Reutilizables

Este directorio contiene hooks personalizados que pueden ser reutilizados en diferentes componentes de la aplicación para manejar funcionalidades comunes como debounce y búsquedas con URL.

## useDebounce

Hook para implementar debounce de manera reutilizable.

### Parámetros

- `value`: Valor a aplicar debounce
- `delay`: Tiempo de retraso en milisegundos (por defecto 500ms)

### Uso básico

```tsx
import { useDebounce } from "@/presentation/hooks/common";

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    // Esta función solo se ejecuta después del delay
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
  );
};
```

## useUrlSearch

Hook más completo para manejar búsquedas con debounce y sincronización automática con la URL.

### Parámetros

- `paramName`: Nombre del parámetro en la URL (por defecto 'search')
- `debounceDelay`: Tiempo de debounce en milisegundos (por defecto 500ms)
- `initialValue`: Valor inicial del search
- `onSearchChange`: Callback que se ejecuta cuando el search cambia (después del debounce)
- `updateUrl`: Si true, actualiza la URL automáticamente cuando cambia el search

### Valores retornados

- `searchTerm`: Valor actual del input (sin debounce)
- `debouncedSearchTerm`: Valor con debounce aplicado
- `setSearch`: Función para cambiar el término de búsqueda
- `clearSearch`: Función para limpiar la búsqueda
- `isSearching`: Indica si está en proceso de debounce

### Uso básico

```tsx
import { useUrlSearch } from "@/presentation/hooks/common";

const SearchableComponent = () => {
  const { searchTerm, debouncedSearchTerm, setSearch, isSearching } =
    useUrlSearch({
      paramName: "search",
      debounceDelay: 500,
      onSearchChange: async (term) => {
        // Esta función se ejecuta después del debounce
        console.log("Buscando:", term);
        // Aquí puedes hacer la solicitud al servidor
      },
    });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />
      {isSearching && <span>Buscando...</span>}
    </div>
  );
};
```

### Uso con servidor y revalidación de cache

```tsx
import { useUrlSearch } from "@/presentation/hooks/common";
import { revalidateInventoryCache } from "@/infraestructure/utils/revalidateCache";

const InventorySearch = () => {
  const handleServerSearch = useCallback(async (searchTerm: string) => {
    try {
      // Revalidar el cache para obtener nuevos datos del servidor
      await revalidateInventoryCache();
    } catch (error) {
      console.error("Error al revalidar cache:", error);
    }
  }, []);

  const { searchTerm, setSearch, isSearching } = useUrlSearch({
    paramName: "search",
    debounceDelay: 500,
    onSearchChange: handleServerSearch,
    updateUrl: true,
  });

  return (
    <div className="relative">
      <input
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        className="pr-10"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
    </div>
  );
};
```

## Beneficios

1. **Reutilizable**: Los hooks pueden ser usados en cualquier componente
2. **Optimización**: Evita solicitudes excesivas al servidor con debounce
3. **UX mejorada**: Sincronización automática con URL y estados de loading
4. **Mantenible**: Lógica centralizada y fácil de actualizar
5. **Flexible**: Configuración personalizable para diferentes casos de uso
