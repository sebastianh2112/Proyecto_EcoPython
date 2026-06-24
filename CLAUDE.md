# EcoPython — Contexto del proyecto para Claude

## Resumen ejecutivo

EcoPython es una tienda de comercio electrónico construida con Django como **proyecto de portafolio y machote (template base)** para futuros proyectos ecommerce. Demuestra dominio de: Django ORM, autenticación con OAuth2, integración de pagos Stripe, gestión de sesiones, y arquitectura de aplicaciones web Django. Permite gestión de productos, carrito de compras, órdenes, direcciones de envío, códigos promocionales y pagos con Stripe.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Lenguaje | Python | 3.x |
| Framework | Django | 6.0 |
| ORM | Django ORM | (incluido en Django) |
| Base de datos (dev) | SQLite | local |
| Base de datos (prod) | PostgreSQL | recomendado |
| Migraciones | Django Migrations | nativo |
| Autenticación | Django Auth + social-auth-app-django | 5.7.0 |
| Pagos | Stripe | 14.1.0 |
| OAuth | Facebook OAuth2 (social-auth-core) | 4.8.3 |
| API REST | djangorestframework | 3.16.1 |
| Imágenes | Pillow | 12.1.0 |
| Entorno | python-dotenv | 1.2.1 |
| Frontend | Django Templates + Bootstrap | 5.3.8 CDN |

**Directorio de backend:** `backend/`
**Módulo principal:** `WebDjango/`

---

## Ejecución local

```powershell
# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate

# Instalar dependencias
pip install -r backend/requirements.txt

# Configurar variables de entorno (copiar y completar)
copy .env.example .env

# Aplicar migraciones
python backend/manage.py migrate

# Crear superusuario
python backend/manage.py createsuperuser

# Correr servidor
python backend/manage.py runserver
```

| Recurso | URL |
|---------|-----|
| App principal | http://localhost:8000/ |
| Admin Django | http://localhost:8000/admin/ |

---

## Variables de entorno requeridas

```
DJANGO_SECRET_KEY         → clave secreta Django (nunca hardcodear)
DJANGO_ENV                → development | production
DEBUG                     → True | False
ALLOWED_HOSTS             → 127.0.0.1,localhost en dev; dominio real en prod

STRIPE_PUBLIC_KEY         → pk_test_* en dev, pk_live_* en prod
STRIPE_PRIVATE_KEY        → sk_test_* en dev, sk_live_* en prod
STRIPE_CURRENCY           → usd (default)
STRIPE_WEBHOOK_SECRET     → whsec_* (opcional en dev)

FACEBOOK_CLIENT_ID        → App ID de Facebook
FACEBOOK_CLIENT_SECRET    → App Secret de Facebook
```

---

## Estructura del proyecto

```
Proyecto_EcoPython/
├── CLAUDE.md                         → este archivo
├── .env.example                      → plantilla de variables de entorno
├── .gitignore
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3                    → base de datos SQLite (solo dev)
│   ├── media/                        → archivos subidos (imágenes de productos)
│   ├── WebDjango/                    → configuración principal del proyecto
│   │   ├── settings.py               → configuración de Django
│   │   ├── urls.py                   → rutas principales
│   │   ├── views.py                  → login, registro, logout
│   │   ├── forms.py                  → formulario de registro
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── products/                     → catálogo de productos
│   ├── categories/                   → categorías de productos
│   ├── users/                        → modelo de usuario personalizado
│   ├── carts/                        → carrito de compras
│   ├── orden/                        → gestión de órdenes y pagos Stripe
│   ├── DirEnvio/                     → direcciones de envío
│   ├── promo_codigo/                 → códigos promocionales
│   ├── MetodoPago/                   → métodos de pago guardados
│   └── templates/                    → plantillas HTML
└── static/                           → CSS, JS, imágenes estáticas
```

---

## Módulos del proyecto

| Módulo | App Django | Descripción |
|--------|-----------|-------------|
| **Productos** | `products` | Catálogo, búsqueda, slugs automáticos |
| **Categorías** | `categories` | Agrupación de productos (M2M) |
| **Usuarios** | `users` | AbstractUser personalizado, Profile, Cliente (proxy) |
| **Carrito** | `carts` | Cart, CartProduct (through), sesión, cálculo de totales |
| **Órdenes** | `orden` | Orden (UUID), OrdenProducto, estados, Stripe PaymentIntent |
| **Envíos** | `DirEnvio` | DireccionEnvio, selección default, múltiples direcciones |
| **Promos** | `promo_codigo` | PromoCodigo con validación de fechas y uso único |
| **Pagos** | `MetodoPago` | ProfilePago: guarda tokens de tarjetas Stripe |

---

## Rutas principales

| URL | Vista | Descripción |
|-----|-------|-------------|
| `/` | `ProductListView` | Página de inicio con listado de productos |
| `/admin/` | Django Admin | Panel administrativo |
| `/usuarios/login` | `login` | Login local |
| `/usuarios/registro` | `registro` | Registro de usuario |
| `/usuarios/salir` | `salir` | Logout (POST) |
| `/social-auth/` | social_django | Rutas OAuth2 (Facebook) |
| `/productos/search` | `ProductSearchListView` | Búsqueda de productos |
| `/productos/<slug>` | `ProductDetailview` | Detalle de producto |
| `/carrito/` | `cart` | Ver carrito |
| `/carrito/agregar` | `add` | Agregar al carrito (POST) |
| `/carrito/eliminar` | `remove` | Quitar del carrito (POST) |
| `/orden/` | `orden` | Inicio de proceso de orden |
| `/orden/direccion` | `direccion` | Seleccionar dirección |
| `/orden/confirmacion` | `confirmacion` | Confirmar orden + Stripe UI |
| `/orden/crear-payment-intent` | `crear_payment_intent` | Crear PaymentIntent (POST, JSON) |
| `/orden/confirmar-pago` | `confirmar_pago` | Confirmar pago (POST, JSON) |
| `/orden/stripe/webhook` | `stripe_webhook` | Webhook Stripe (csrf_exempt) |
| `/orden/completados` | `OrdenViews` | Historial de órdenes (LoginRequired) |
| `/direcciones/` | `EnvioDirecciones` | Listar direcciones de envío |
| `/codigopromo/validar` | `validar` | Validar código promo (POST, JSON) |
| `/pagos/nuevo` | `crear` | Crear perfil de pago |

---

## Seguridad — resumen técnico

- **Autenticación:** Django session-based (cookies). No JWT.
- **OAuth:** Facebook OAuth2 via `social-auth-app-django`
- **Protección de vistas:** `@login_required(login_url="login")` + `LoginRequiredMixin`
- **CSRF:** Activo en todas las vistas POST excepto `stripe_webhook` (`@csrf_exempt`)
- **Stripe Webhook:** Validación de firma con `STRIPE_WEBHOOK_SECRET` (recomendado en prod)
- **Producción:** SSL/HTTPS redirect, HSTS, cookies seguras activados cuando `DJANGO_ENV=production`
- **Secrets:** Manejados via variables de entorno. `settings.py` lanza `ImproperlyConfigured` si faltan.
- **Producción impone:** live Stripe keys, dominios reales en `ALLOWED_HOSTS`, `DEBUG=False`
- **Modelo de usuario:** Custom `AUTH_USER_MODEL = 'users.User'`
- **Roles:** Sin sistema de roles granular — solo autenticado vs no autenticado + `is_staff`/`is_superuser`

---

## Flujo de pago Stripe

1. Usuario llega a `/orden/confirmacion` → frontend recibe `STRIPE_PUBLIC_KEY`
2. Frontend llama `POST /orden/crear-payment-intent` → backend crea `PaymentIntent` con metadatos
3. Stripe Elements presenta formulario de tarjeta al usuario
4. Usuario completa pago en Stripe
5. Frontend recibe confirmación → llama `POST /orden/confirmar-pago` con `payment_intent_id`
6. Backend valida el intent con Stripe, verifica metadatos y finaliza la orden atómicamente
7. Webhook en `/orden/stripe/webhook` como respaldo asíncrono

---

## Reglas de trabajo con Claude

1. **Proponer antes de editar.** Describe el cambio y espera confirmación antes de aplicar.
2. **Cambios atómicos:** mínimo de archivos por modificación.
3. **Si el cambio toca más de 3 archivos:** explicar el riesgo primero.
4. **Nunca agregar dependencias a `requirements.txt`** sin mencionarlo explícitamente.
5. **No agregar abstracciones** ni refactors fuera del alcance de la tarea pedida.
6. **No comentarios innecesarios** en código. Solo cuando el "por qué" no sea obvio.
7. **No generar migraciones Django** sin aprobación explícita.
8. **Tras cada cambio aplicado**, indicar:
   - Lista de archivos modificados (ruta completa desde `backend/`)
   - Comando exacto para verificar localmente
9. **No usar emojis** en código ni en documentación técnica.
10. **Nunca trabajar directo en `main`.** Siempre en rama de trabajo.
11. **No borrar archivos** sin aprobación explícita.
12. **No ejecutar comandos destructivos** sin confirmación.
13. **No modificar `.env`, credenciales, tokens ni claves.**
14. **Nunca subir secretos al repositorio.**

---

## Formato de respuesta esperado

```
### Propuesta
Qué se va a cambiar y por qué (máx 3 líneas)

### Cambio
[código o diff]

### Archivos modificados
- backend/...

### Cómo verificarlo
python backend/manage.py runserver
# Navegar a http://localhost:8000/...
```

---

## Zonas protegidas — requieren aprobación explícita

Antes de editar cualquiera de estos archivos, **detente y pide confirmación**:

```
backend/WebDjango/settings.py            → configuración general, secretos, producción
backend/WebDjango/urls.py                → rutas principales
backend/users/models.py                  → modelo de usuario y autenticación
backend/orden/views.py                   → lógica de pago Stripe (transaccional)
backend/orden/models.py                  → modelo de órdenes y estados
backend/*/migrations/                    → migraciones ya aplicadas (nunca modificar)
.env / .env.example                      → variables de entorno y secretos
```

---

## Patrones clave a respetar

| Patrón | Implementación actual |
|--------|----------------------|
| Autenticación de vistas | `@login_required` o `LoginRequiredMixin` |
| Sesiones de carrito/orden | `request.session['cart_id']` y `request.session['orden_id']` |
| Formularios | `ModelForm` con clases Bootstrap en atributos `widget` |
| Carrito | `funcionCarrito()` en `carts/funciones.py` — obtiene o crea desde sesión/usuario |
| Orden | `funcionOrden()` en `orden/utils.py` — obtiene o crea desde sesión |
| Pago Stripe | `_finalizar_orden_pagada()` es atómica con `transaction.atomic()` |
| Admin | Modelos registrados en cada `admin.py` de cada app |
| Señales | `post_save` / `pre_delete` / `m2m_changed` para cálculos automáticos |
| Templates | `base.html` extiende Bootstrap 5.3.8 via CDN |

---

## Tests

```powershell
# Todos los tests
python backend/manage.py test

# Tests de una app específica
python backend/manage.py test carts
python backend/manage.py test orden

# Verificar migraciones
python backend/manage.py migrate --check
```

---

## Flujo de trabajo obligatorio

Para toda tarea de desarrollo, seguir estas fases en orden:

### FASE 1: Diagnóstico
- Revisar contexto y archivos relacionados
- Explicar qué se encontró
- Clasificar riesgos: **crítico / alto / medio / bajo**
- Indicar qué agentes del proyecto ayudarían:
  `backend-architect`, `security-reviewer`, `database-reviewer`,
  `qa-tester`, `frontend-architect`, `code-reviewer`

### FASE 2: Propuesta — esperar aprobación antes de editar
- Resumen del problema y causa probable
- Archivos que se tocarían
- Solución recomendada, riesgos y alternativas
- Impacto en: backend, templates, base de datos, seguridad y usuarios

### FASE 3: Implementación
- Cambios pequeños y controlados
- No tocar archivos no relacionados con la tarea
- Mantener el estilo actual del proyecto
- Explicar cada cambio en palabras simples

### FASE 4: Validación
- Lista de archivos modificados con ruta completa
- Cómo probarlo localmente paso a paso
- Posibles efectos secundarios
- Qué revisar antes de hacer commit

### FASE 5: Revisión final
- Revisar seguridad, QA e impacto en otros módulos
- Confirmar si está listo para commit o requiere ajustes

### FASE 6: Documentación
- Esperar visto bueno antes de documentar
- Registrar el cambio con el formato definido abajo

---

## Formato de documentación de cambios

Ruta: `docs/Cambios-para-versionamiento.md`

```
# Cambio aplicado: [Nombre corto del cambio]

## Fecha
## Tipo de cambio
Nueva función / Corrección / Mejora / Refactor / Seguridad / Documentación / DevOps

## Resumen técnico
Explicación técnica clara del cambio aplicado.

## Explicación sencilla
Explicación para una persona sin conocimiento técnico.

## Archivos modificados
- archivo 1: qué se cambió
- archivo 2: qué se cambió

## Motivo del cambio
## Riesgos considerados
## Validaciones realizadas
## Pasos para probar localmente
## Impacto en el sistema
Backend / Templates / Base de datos / Seguridad / Usuarios / Admin

## Pendientes o recomendaciones
```

---

## Notas importantes

- **SQLite en dev:** `backend/db.sqlite3` no se versiona. En producción usar PostgreSQL.
- **Media files:** Imágenes de productos en `backend/media/` — no versionar.
- **Bootstrap CDN:** El frontend usa Bootstrap 5.3.8 via CDN. Sin framework JS.
- **Stripe test mode:** En desarrollo usar siempre claves `pk_test_*` / `sk_test_*`.
- **Facebook OAuth:** Requiere app configurada en Facebook Developers con callback URL correcto.
- **Webhook Stripe:** En producción requiere `STRIPE_WEBHOOK_SECRET` para validar firmas.
- **csrf_exempt en webhook:** Es intencional — Stripe no puede incluir CSRF token. La firma del webhook reemplaza esa protección.
