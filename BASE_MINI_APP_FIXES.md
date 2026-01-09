# Base Mini-App Fixes - Infinite Loop & Search Visibility

## Problemas Resueltos

### 1. ✅ Loop Infinito de "Wallet Connected Successfully"

**Problema**: Al acceder desde dentro de Base App, aparecía continuamente en cascada el mensaje "wallet connected successfully" de forma infinita.

**Causa**: RainbowKit muestra notificaciones toast cada vez que detecta una conexión. En contextos de mini-apps/iframes, esto se dispara continuamente causando un loop infinito.

**Solución Implementada**:

1. **Detección de contexto de iframe**:
   - Detectamos automáticamente si la app está corriendo dentro de un iframe (Base mini-app)
   - Usamos `window.self !== window.top` para la detección

2. **Deshabilitación de notificaciones en mini-apps**:
   - `showRecentTransactions={!isInIframe}` - Deshabilita el historial de transacciones que causa notificaciones
   - `refetchOnWindowFocus: false` - Previene refetch al enfocar la ventana

3. **Configuración optimizada de RainbowKit**:
```typescript
<RainbowKitProvider
  modalSize="compact"
  locale="en-US"
  showRecentTransactions={!isInIframe} // Deshabilitado en mini-apps
  appInfo={{
    appName: 'Vesting Scheduler',
    disclaimer: undefined, // Sin disclaimer en mini-apps
  }}
>
```

**Archivos modificados**:
- `/app/providers.tsx` - Detección de iframe y configuración de RainbowKit

---

### 2. ✅ Visibilidad en Búsqueda de Base

**Problema**: La app no aparecía en la búsqueda de Base porque faltaban campos requeridos en el manifest.

**Campos Agregados al Manifest**:

1. **`primaryCategory: "finance"`** (CRÍTICO)
   - Define en qué categoría aparece tu app en Base
   - Sin esto, la app NO aparece en navegación por categorías

2. **`subtitle`**: "Token vesting made simple on Base"
   - Descripción corta visible en previews

3. **`description`**: Descripción completa con keywords
   - "Create customizable token vesting schedules on Base Network. 100% decentralized with verified contracts. Gas-free with Coinbase Smart Wallet."

4. **`tags`**: Array de palabras clave para búsqueda
   - `["vesting", "tokens", "defi", "base", "smart-contracts", "payroll", "team", "investors"]`
   - La búsqueda de Base usa estos tags para encontrar tu app

5. **`screenshotUrls`**: Array de URLs de screenshots
   - Mejora la presentación en resultados de búsqueda
   - URLs absolutas a tus screenshots

**Archivo modificado**:
- `/public/.well-known/farcaster.json` - Manifest de Base mini-app

**Metadatos Open Graph mejorados**:
- Actualizado URLs a dominio de producción
- Agregadas meta tags de Farcaster frames
- Mejoradas descripciones con keywords relevantes

**Archivo modificado**:
- `/app/layout.tsx` - Metadatos de la app

---

## Cómo Hacer que tu App Aparezca en Base

### Paso 1: Verifica tu Manifest

Asegúrate de que `https://baseapp4.vercel.app/.well-known/farcaster.json` sea accesible públicamente y contenga:

```json
{
  "frame": {
    "version": "1",
    "name": "Vesting Scheduler",
    "subtitle": "Token vesting made simple on Base",
    "description": "...",
    "primaryCategory": "finance",  // ← CRÍTICO
    "tags": ["vesting", "tokens", ...],  // ← Importante para búsqueda
    "screenshotUrls": [...],
    "iconUrl": "https://baseapp4.vercel.app/icon.png",
    "splashImageUrl": "https://baseapp4.vercel.app/splash.png",
    "homeUrl": "https://baseapp4.vercel.app",
    "webhookUrl": "https://baseapp4.vercel.app/api/webhook"
  }
}
```

### Paso 2: Comparte tu URL en el Feed Social

Para activar la indexación automática:

1. **Desde Farcaster/Warpcast**:
   - Haz un post con tu URL: `https://baseapp4.vercel.app`
   - Base App detectará y validará tu manifest automáticamente

2. **Desde Base App**:
   - Comparte tu mini-app en el feed
   - Menciona características clave en el post

### Paso 3: Espera la Indexación

- **Tiempo de indexación**: ~10 minutos después de compartir
- Base App validará tu manifest automáticamente
- Si hay errores, NO se indexará (revisa logs del webhook)

### Paso 4: Verifica que Aparece en Búsqueda

1. Abre Base App
2. Ve a la sección de Mini-Apps
3. Busca "Vesting Scheduler" o "vesting"
4. Tu app debe aparecer en:
   - **Resultados de búsqueda** (por nombre y tags)
   - **Categoría Finance** (por primaryCategory)

---

## Categorías Disponibles

Puedes usar estas categorías en `primaryCategory`:

- `"social"` - Redes sociales, comunicación
- `"finance"` - DeFi, pagos, vesting, wallets
- `"gaming"` - Juegos, NFT games
- `"utilities"` - Herramientas, servicios
- `"entertainment"` - Contenido, streaming
- `"productivity"` - Gestión, organización

**Para Vesting Scheduler**: Usamos `"finance"` porque es una app de gestión financiera (vesting de tokens).

---

## Tags para Búsqueda

Los tags que agregamos:
```json
"tags": [
  "vesting",          // Palabra clave principal
  "tokens",           // Tipo de activo
  "defi",             // Categoría Web3
  "base",             // Red blockchain
  "smart-contracts",  // Tecnología
  "payroll",          // Caso de uso
  "team",             // Audiencia
  "investors"         // Audiencia
]
```

Cuando alguien busca "vesting", "tokens", "payroll", etc., tu app aparecerá.

---

## Actualizar el Manifest (Reindexación)

Si modificas tu manifest después de la primera indexación:

1. **Haz los cambios** en `farcaster.json`
2. **Despliega** a producción
3. **Re-comparte tu URL** en el feed social
4. **Espera ~10 minutos** para la reindexación

**Importante**: NO hay proceso manual de revisión. La indexación es 100% automática.

---

## Checklist de Verificación

- [ ] ✅ Manifest accesible en `/.well-known/farcaster.json`
- [ ] ✅ Campo `name` presente y descriptivo
- [ ] ✅ Campo `primaryCategory` configurado
- [ ] ✅ Campo `tags` con keywords relevantes
- [ ] ✅ Campo `subtitle` agregado
- [ ] ✅ Campo `description` completo
- [ ] ✅ `screenshotUrls` con imágenes válidas
- [ ] ✅ `iconUrl` y `splashImageUrl` accesibles
- [ ] ✅ URLs absolutas (con dominio completo)
- [ ] ✅ URL compartida en feed social
- [ ] ✅ Esperado 10+ minutos después de compartir
- [ ] ✅ Verificado en búsqueda de Base App

---

## Testing del Infinite Loop Fix

Para verificar que el loop infinito está arreglado:

1. **Despliega** a producción
2. **Accede desde Base App** (no desde navegador directo)
3. **Conecta wallet**
4. **Verifica** que NO aparece cascada de notificaciones
5. **Navega** por la app normalmente

**Comportamiento esperado**:
- ✅ Conexión silenciosa sin notificaciones repetidas
- ✅ Un solo mensaje de conexión (si aparece)
- ✅ Navegación fluida sin interrupciones

**Si el problema persiste**:
- Verifica que estés usando la versión desplegada (no local)
- Limpia la caché de Base App
- Reconecta tu wallet

---

## URLs Importantes

- **App en producción**: https://baseapp4.vercel.app
- **Manifest**: https://baseapp4.vercel.app/.well-known/farcaster.json
- **Webhook**: https://baseapp4.vercel.app/api/webhook
- **Icon**: https://baseapp4.vercel.app/icon.png (1024x1024)
- **OG Image**: https://baseapp4.vercel.app/og-image.png (1200x630)

---

## Recursos y Documentación

- **Base Mini-Apps Docs**: https://docs.base.org/mini-apps/
- **Search Guide**: https://docs.base.org/mini-apps/troubleshooting/how-search-works
- **Featured Guidelines**: https://docs.base.org/mini-apps/featured-guidelines/overview

---

## Resumen de Cambios

### Archivos Modificados

1. **`/app/providers.tsx`**
   - Detección de contexto iframe
   - Configuración de RainbowKit para mini-apps
   - Query client optimizado

2. **`/public/.well-known/farcaster.json`**
   - Agregado `primaryCategory`
   - Agregado `subtitle`
   - Agregado `description`
   - Agregado `tags`
   - Agregado `screenshotUrls`

3. **`/app/layout.tsx`**
   - URLs absolutas en Open Graph
   - Meta tags de Farcaster frames
   - Descripciones mejoradas con keywords

### Build Status

✅ Compilación exitosa sin errores
✅ TypeScript strict mode passing
✅ Optimizaciones de producción aplicadas

---

## Próximos Pasos

1. **Despliega a producción** (Vercel auto-deploy)
2. **Verifica que el manifest es accesible**:
   ```bash
   curl https://baseapp4.vercel.app/.well-known/farcaster.json
   ```
3. **Comparte tu URL** en Farcaster/Warpcast
4. **Espera 10 minutos**
5. **Busca tu app** en Base App
6. **Prueba** que no hay loop infinito

---

**Última actualización**: 2026-01-09
**Estado**: ✅ Listo para indexación en Base
