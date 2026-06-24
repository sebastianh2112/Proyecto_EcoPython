# EcoPython — Roadmap de Portafolio

**Objetivo:** Convertir EcoPython en un e-commerce de portafolio completamente funcional, visualmente profesional y demostrable a potenciales clientes o empleadores.

**Stack actual:** Django 6 REST API + Next.js 15 (App Router) + Nike design system (Bebas Neue, tokens monochrome + gold).

---

## Estado actual

| Area | Estado |
|------|--------|
| Django REST API (auth, productos, carrito, órdenes) | Listo |
| JWT authentication (login/register/logout) | Listo |
| Next.js 15 con Tailwind v4 y design tokens Nike | Listo |
| Homepage con hero + grid de productos | Listo |
| Página de listado con filtros por categoría | Listo |
| Página de detalle de producto | Listo |
| Cart drawer animado | Listo |
| Header sticky + mobile drawer | Listo |
| Footer | Listo |
| Páginas login / registro | Listo |
| **Productos en base de datos** | **Vacío** |
| Flujo de checkout completo | Pendiente |
| Página de cuenta / perfil | Pendiente |
| Historial de órdenes | Pendiente |
| Loading skeletons / estados de carga | Pendiente |
| Manejo de errores (404, error boundary) | Pendiente |
| Deploy público | Pendiente |

---

## Fase 1 — Datos demo y contenido real

**Objetivo:** Que la tienda tenga contenido visible desde el primer momento. Sin productos, el portafolio no se puede ver.

### 1.1 Categorías y productos de ejemplo

Crear desde el admin de Django (`/admin`) las siguientes categorías y productos de ejemplo:

**Categorías sugeridas:**
- Tecnología
- Ropa
- Accesorios
- Hogar
- Deportes

**Productos sugeridos (5–10 por categoría):**
- Nombre, descripción corta, precio, imagen real
- Imágenes: usar Unsplash o Picsum (descargar y subir al admin)

**Archivos a crear:**
- `backend/fixtures/demo_data.json` — fixture de Django con categorías y productos
- Script de carga: `python backend/manage.py loaddata demo_data`

### 1.2 Imágenes de productos

Descargar imágenes de [unsplash.com](https://unsplash.com) en categorías limpias (tecnología, ropa, objetos).
Resolución recomendada: 800x800px o 1:1 aspect ratio.
Subirlas al admin Django en cada producto.

### 1.3 Superusuario demo

Crear un usuario demo con credenciales visibles en la homepage para que recruiters puedan hacer el flujo completo:

```
Usuario: demo
Contraseña: demo1234
```

**Validar al terminar esta fase:**
- Homepage muestra al menos 8 productos con imágenes
- Filtros por categoría funcionan
- Detalle de producto abre con imagen correcta
- Carrito agrega productos correctamente

---

## Fase 2 — Flujo de checkout completo

**Objetivo:** Que alguien pueda seleccionar un producto, agregarlo al carrito, ingresar una dirección y pagar con Stripe (modo test).

### 2.1 Página de carrito `/carrito`

Página dedicada (no solo el drawer) que muestre:
- Lista de productos en el carrito con cantidad editable
- Botón para eliminar ítems
- Subtotal, total con fee
- Input de código promocional (llamada a `/api/promo/validate/`)
- Botón "Ir al checkout"

**Archivo:** `frontend/src/app/(shop)/carrito/page.tsx`

### 2.2 Checkout — Paso 1: Dirección de envío `/checkout`

- Si el usuario tiene direcciones guardadas: mostrarlas con radio buttons para seleccionar
- Botón para agregar nueva dirección (formulario inline)
- Guardar selección en el store de Zustand / llamar a la API
- Botón "Continuar al pago"

**Archivos:**
- `frontend/src/app/(shop)/checkout/page.tsx`
- `frontend/src/components/checkout/AddressSelector.tsx`
- `frontend/src/components/checkout/AddressForm.tsx`

### 2.3 Checkout — Paso 2: Pago con Stripe `/checkout/pago`

- Mostrar resumen de la orden (productos, dirección, total)
- Formulario de pago con Stripe Elements (CardElement o PaymentElement)
- Llamada a `POST /api/orders/payment-intent/` para obtener `client_secret`
- Confirmar con `stripe.confirmCardPayment(clientSecret)`
- Redirigir a `/checkout/confirmacion?orden_id=...`

**Archivos:**
- `frontend/src/app/(shop)/checkout/pago/page.tsx`
- `frontend/src/components/checkout/StripePaymentForm.tsx`

**Stripe en modo test:** usar tarjeta `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC.

### 2.4 Confirmación de orden `/checkout/confirmacion`

Página de éxito que muestre:
- Mensaje de confirmación con ID de la orden
- Resumen: productos, dirección, total pagado
- Botón "Ver mis pedidos" y "Seguir comprando"

**Archivo:** `frontend/src/app/(shop)/checkout/confirmacion/page.tsx`

### 2.5 Direcciones en la API

Verificar que `DireccionEnvio` en Django tenga los campos que el frontend espera (`line1`, `city`, etc.). Revisar `backend/DirEnvio/models.py`.

**Validar al terminar esta fase:**
- Flujo completo: agregar al carrito → checkout → pagar con tarjeta test → ver confirmación
- Orden queda en estado COMPLETED en el admin Django

---

## Fase 3 — Página de cuenta de usuario

**Objetivo:** Que el usuario logueado pueda ver su información, sus pedidos y sus direcciones.

### 3.1 Layout de cuenta `/cuenta`

Layout común para todas las páginas de cuenta con sidebar de navegación:
- Mi perfil
- Mis pedidos
- Mis direcciones
- Cerrar sesión

**Archivo:** `frontend/src/app/cuenta/layout.tsx`

### 3.2 Página de perfil `/cuenta`

Mostrar: nombre, email, username.
Opcionalmente: formulario para editar nombre/email.

**Archivo:** `frontend/src/app/cuenta/page.tsx`

### 3.3 Historial de órdenes `/cuenta/ordenes`

Lista de todas las órdenes del usuario con:
- ID de orden (UUID corto)
- Fecha
- Estado (chip de color): CREATED / PAYED / COMPLETED / CANCELED
- Total
- Botón "Ver detalle"

**Archivo:** `frontend/src/app/cuenta/ordenes/page.tsx`

### 3.4 Detalle de orden `/cuenta/ordenes/[id]`

Detalle completo de una orden:
- Productos comprados (nombre, cantidad, precio)
- Dirección de envío
- Total pagado
- Estado actual

**Archivo:** `frontend/src/app/cuenta/ordenes/[id]/page.tsx`

### 3.5 Gestión de direcciones `/cuenta/direcciones`

- Lista de direcciones guardadas (con badge "Predeterminada")
- Botón para agregar nueva
- Botón para marcar como predeterminada
- Botón para eliminar

**Archivo:** `frontend/src/app/cuenta/direcciones/page.tsx`

**Validar al terminar esta fase:**
- Login → ver historial con orden pagada en Fase 2
- Agregar nueva dirección funciona
- Logout limpia el estado

---

## Fase 4 — UX y estados de interfaz

**Objetivo:** Que la aplicación se sienta responsive, rápida y pulida. Sin loading states parece rota.

### 4.1 Loading skeletons

Crear componentes skeleton para:
- ProductCard (caja gris animada mientras carga)
- Product grid (grid de 4x skeletons)
- Página de detalle (imagen + texto grises)

Usar `loading.tsx` de Next.js App Router para cada ruta.

**Archivos:**
- `frontend/src/components/ui/Skeleton.tsx`
- `frontend/src/app/(shop)/loading.tsx`
- `frontend/src/app/(shop)/productos/loading.tsx`
- `frontend/src/app/(shop)/productos/[slug]/loading.tsx`

### 4.2 Página 404 personalizada

Página con diseño Nike:
- Título en Bebas Neue: "404 — PÁGINA NO ENCONTRADA"
- Botón "Volver al inicio"

**Archivo:** `frontend/src/app/not-found.tsx`

### 4.3 Error boundary

Página de error genérica para errores de servidor.

**Archivo:** `frontend/src/app/error.tsx`

### 4.4 Toast / notificaciones

Agregar feedback visual para acciones del usuario:
- "Producto agregado al carrito"
- "Código promo aplicado"
- "Error al procesar el pago"

Opciones: `react-hot-toast` (liviano) o `sonner` (más moderno).
No agregar dependencia sin mencionarlo.

### 4.5 Animaciones Framer Motion

Aplicar transiciones en:
- Page transitions (layout animations)
- Product card hover (ya implementado)
- Cart items (stagger al abrir)
- Hero section (fade-in al cargar)

### 4.6 Búsqueda en tiempo real

El header ya tiene search expandible. Mejorar para mostrar resultados instantáneos (debounce 300ms) en un dropdown antes de navegar.

**Validar al terminar esta fase:**
- Navegar a `/productos` sin backend muestra skeletons, no pantalla en blanco
- 404 al escribir URL inválida muestra página personalizada
- Agregar producto al carrito muestra toast de confirmación

---

## Fase 5 — Pulido de portafolio y deploy

**Objetivo:** Que el proyecto sea demostrable públicamente con una URL real.

### 5.1 Banner de demo en la homepage

Agregar un banner visible (no intrusivo) en la homepage con:

```
Modo demo — Usuario: demo | Contraseña: demo1234
Tarjeta de prueba Stripe: 4242 4242 4242 4242 | Fecha: 12/26 | CVC: 123
```

Diseño: barra sticky en el bottom con fondo gold (`--color-brand`), texto negro, botón de cerrar.

**Archivo:** `frontend/src/components/ui/DemoBanner.tsx`

### 5.2 README profesional

Actualizar `README.md` con:
- Screenshot o GIF del frontend
- Tech stack con badges (shields.io)
- Instrucciones de instalación local (2–3 comandos)
- Link al deploy en vivo
- Features implementadas
- Flujo de pago con tarjeta de prueba

### 5.3 Variables de entorno para producción

Crear `.env.production.example` con todas las variables necesarias para producción:
- Claves Stripe live
- `DEBUG=False`
- `ALLOWED_HOSTS` con dominio real
- `DATABASE_URL` para PostgreSQL

### 5.4 Deploy del backend — Railway o Render

**Railway (recomendado):**
1. Conectar repositorio en railway.app
2. Agregar servicio PostgreSQL
3. Configurar variables de entorno
4. Railway detecta Django automáticamente con `Procfile`:
   ```
   web: python backend/manage.py migrate && gunicorn WebDjango.wsgi --chdir backend
   ```
5. Agregar `gunicorn` a `requirements.txt`
6. Configurar `DJANGO_SETTINGS_MODULE` y `DATABASE_URL`

### 5.5 Deploy del frontend — Vercel

1. Conectar repositorio en vercel.com
2. Seleccionar directorio raíz: `frontend`
3. Variables de entorno:
   - `NEXT_PUBLIC_API_URL` = URL de Railway
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` = pk_live o pk_test
4. Vercel detecta Next.js automáticamente

### 5.6 Dominio y CORS en producción

Actualizar `settings.py` (requiere aprobación):
```python
CORS_ALLOWED_ORIGINS = ["https://ecopython.vercel.app"]
ALLOWED_HOSTS = ["ecopython.railway.app"]
```

### 5.7 Stripe Webhook en producción

Configurar en el dashboard de Stripe:
- Endpoint URL: `https://ecopython.railway.app/orden/stripe/webhook`
- Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copiar `STRIPE_WEBHOOK_SECRET` al `.env` de Railway

**Validar al terminar esta fase:**
- URL pública funciona (`https://ecopython.vercel.app`)
- Usuario demo puede hacer compra completa con tarjeta de prueba
- Admin Django accesible en el dominio de Railway

---

## Resumen de prioridades

| Prioridad | Fase | Tiempo estimado | Impacto en portafolio |
|-----------|------|----------------|----------------------|
| **Critica** | Fase 1 — Datos demo | 2–3 horas | Sin productos no hay portafolio |
| **Alta** | Fase 2 — Checkout Stripe | 4–6 horas | Demuestra integración de pagos |
| **Alta** | Fase 5 — Deploy | 2–3 horas | URL pública es esencial |
| Media | Fase 3 — Cuenta usuario | 3–4 horas | Muestra flujo completo |
| Media | Fase 4 — UX/Loading | 2–3 horas | Hace la app sentirse terminada |

---

## Orden recomendado de ejecución

```
Fase 1 (datos) → Fase 5.1 (banner demo) → Fase 2 (checkout) → Fase 5 (deploy) → Fase 3 (cuenta) → Fase 4 (UX)
```

**Razón:** Con datos + checkout + deploy ya tienes algo demostrable públicamente. Cuenta y UX son mejoras sobre una base funcional.

---

## Áreas del código que requieren revisión antes de cada fase

| Archivo | Motivo |
|---------|--------|
| `backend/DirEnvio/models.py` | Verificar campos (`line1`, `city`, etc.) antes de Fase 2 |
| `backend/orden/views.py` | Zona protegida — revisar antes de tocar flujo de pago |
| `backend/WebDjango/settings.py` | Zona protegida — CORS y ALLOWED_HOSTS para Fase 5 |
| `frontend/src/lib/api.ts` | Endpoints de órdenes y direcciones — validar con el API real |

---

## Features opcionales (post-portafolio)

Estas features agregarían valor al proyecto pero no son necesarias para la demo:

- Modo oscuro (dark mode con `next-themes` — ya instalado)
- Favoritos / wishlist
- Reviews de productos
- Filtro por precio (range slider)
- Ordenamiento (más reciente, precio asc/desc)
- Zoom en imagen de producto
- Productos relacionados en detalle
- Email de confirmación de orden (Sendgrid)
- Panel de métricas básico en el admin
