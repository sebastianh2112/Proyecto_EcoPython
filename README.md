# 🚀 ECOPYTHON — README Operativo

> [!info] Resumen ejecutivo
> **ECOPYTHON** es una aplicación web de e-commerce construida con **Python**, **Django** y vistas HTML renderizadas con templates.  
> Incluye catálogo de productos, categorías, autenticación de usuarios, autenticación social con Facebook, carrito de compras, órdenes, direcciones de envío, códigos promocionales, pagos con Stripe y administración mediante Django Admin.

---

## 🧭 Índice

- [[#📌 Estado rápido del proyecto]]
- [[#🧩 Módulos principales]]
- [[#🏗️ Estructura del proyecto]]
- [[#🛠️ Requisitos]]
- [[#⚙️ Perfiles de ejecución]]
- [[#▶️ Correr localmente]]
- [[#🔐 Credenciales demo]]
- [[#🌍 Variables de entorno de producción]]
- [[#🗄️ Base de datos y migraciones]]
- [[#🧪 Comandos frecuentes]]
- [[#🔌 API y rutas]]
- [[#🛡️ Seguridad operativa]]
- [[#👥 Roles]]
- [[#🚢 Despliegue sugerido]]
- [[#✅ Checklist antes de producción]]
- [[#🧰 Notas para mantenimiento]]
- [[#📚 Documentos relacionados sugeridos]]
- [[#🧾 Registro rápido de mantenimiento]]

---

## 📌 Estado rápido del proyecto

| Área | Detalle |
|---|---|
| **Backend** | Python / Django |
| **Framework principal** | Django `6.0` según `backend/requirements.txt` |
| **Frontend** | Templates Django, HTML, CSS, Bootstrap y JavaScript |
| **Base de datos local** | SQLite (`backend/db.sqlite3`, ignorada por Git) |
| **Base de datos producción** | No configurada en el repo; recomendado PostgreSQL |
| **Autenticación** | Django Auth + modelo de usuario personalizado |
| **Autenticación social** | Facebook OAuth con `social-auth-app-django` |
| **Pagos** | Stripe API |
| **API / soporte REST** | `djangorestframework` instalado |
| **Archivos multimedia** | `backend/media/` para imágenes de productos |
| **Build / dependencias** | `pip` + `backend/requirements.txt` |
| **Estado** | En desarrollo / proyecto educativo |

> [!tip] Uso recomendado
> Este archivo debe ser el **punto de entrada operativo** para cualquier persona que trabaje en ECOPYTHON: instalación local, variables de entorno, base de datos, rutas, seguridad y mantenimiento.

---

## 🧩 Módulos principales

### 🔐 Seguridad y acceso
- Registro de usuarios.
- Inicio y cierre de sesión.
- Modelo de usuario personalizado en `users.User`.
- Autenticación social con Facebook OAuth.
- Protección CSRF y sesiones de Django.

### 🛍️ Catálogo comercial
- Productos.
- Categorías.
- Imágenes de productos.
- Búsqueda de productos.
- Detalle de producto por `slug`.

### 🛒 Carrito de compras
- Creación de carrito.
- Agregar productos.
- Eliminar productos.
- Cantidades por producto.
- Subtotal, comisión y total.

### 🧾 Órdenes
- Creación de órdenes.
- Confirmación de compra.
- Cancelación de orden.
- Estados de orden.
- Historial de órdenes completadas.
- Relación entre orden, carrito, usuario y productos.

### 📦 Direcciones de envío
- Registro de direcciones.
- Edición y eliminación.
- Dirección predeterminada.
- Selección de dirección para una orden.

### 🏷️ Promociones
- Códigos promocionales.
- Validación por fecha de inicio y finalización.
- Descuento aplicado a órdenes.
- Marcado de código como usado.

### 💳 Pagos
- Integración con Stripe.
- Registro de perfiles de pago.
- Tarjetas asociadas a usuario.
- Tarjeta predeterminada.

### 🛠️ Administración
- Panel Django Admin.
- Gestión administrativa de modelos registrados.
- Fixtures iniciales para productos en `backend/products/fixtures/products.json`.

---

## 🏗️ Estructura del proyecto

```text
Proyecto_EcoPython/
  backend/
    WebDjango/        -> configuración principal, URLs, vistas base, WSGI/ASGI
    products/         -> productos, búsqueda, detalle y fixtures
    categories/       -> categorías y relación con productos
    users/            -> usuario personalizado, registro y perfil
    carts/            -> carrito, productos del carrito y totales
    orden/            -> órdenes, confirmación, estados y utilidades
    DirEnvio/         -> direcciones de envío
    promo_codigo/     -> códigos promocionales
    MetodoPago/       -> perfiles y métodos de pago
    templates/        -> templates HTML de la aplicación
    manage.py         -> comandos administrativos de Django
    requirements.txt  -> dependencias Python

  static/
    css/              -> estilos globales
    js/               -> JavaScript frontend
    imagenes/         -> imágenes estáticas del proyecto

  .env.example        -> plantilla de variables de entorno
  .gitignore          -> exclusiones de secretos, SQLite, media y entornos
  README.md           -> documentación operativa
```

> [!note] Regla de arquitectura
> La lógica de negocio debe mantenerse dentro de cada app de Django, principalmente en `models.py`, `views.py`, managers, utilidades o servicios si se agregan.  
> Los templates deben limitarse a presentación y no contener reglas complejas de negocio.

---

## 🛠️ Requisitos

| Requisito | Versión / uso |
|---|---|
| Python | 3.x compatible con las dependencias |
| pip | Instalación de paquetes |
| virtualenv / venv | Entorno virtual local |
| SQLite | Base local por defecto |
| Stripe | Pagos en modo prueba o producción |
| Facebook App | OAuth social si se habilita login con Facebook |
| Git | Control de versiones |

```powershell
python --version
pip --version
git --version
```

---

## ⚙️ Perfiles de ejecución

ECOPYTHON no define perfiles formales como `dev`, `local` o `prod`. El comportamiento depende principalmente de variables de entorno en `backend/WebDjango/settings.py`.

| Modo | Uso | Base de datos | DEBUG | Observaciones |
|---|---|---|---|---|
| `desarrollo` | Trabajo local | SQLite | `True` | Modo actual por defecto si no se define `DEBUG` |
| `pruebas` | Validar cambios | SQLite temporal de Django | Según comando | Usar `python manage.py test` |
| `producción` | Servidor real | Recomendado PostgreSQL | `False` | Requiere endurecer configuración antes de publicar |

> [!warning] Importante
> En desarrollo, `DEBUG` toma `True` por defecto y `ALLOWED_HOSTS` usa `127.0.0.1,localhost`. En producción, `DJANGO_ENV=production` obliga `DEBUG=False`, `DJANGO_SECRET_KEY` y dominios reales en `ALLOWED_HOSTS`.

---

## ▶️ Correr localmente

### 1. Clonar el repositorio

```powershell
git clone https://github.com/sebastianh2112/Proyecto_EcoPython.git
cd Proyecto_EcoPython
```

### 2. Crear y activar entorno virtual

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

En Bash:

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```powershell
cd backend
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea un archivo `.env` a partir de `.env.example` o define las variables en la terminal.

```powershell
$env:DJANGO_SECRET_KEY="django-insecure-cambiar-en-desarrollo"
$env:DJANGO_ENV="development"
$env:DEBUG="True"
$env:ALLOWED_HOSTS="127.0.0.1,localhost"
$env:FACEBOOK_CLIENT_ID="facebook-client-id"
$env:FACEBOOK_CLIENT_SECRET="facebook-client-secret"
$env:STRIPE_PUBLIC_KEY="pk_test_xxxxx"
$env:STRIPE_PRIVATE_KEY="sk_test_xxxxx"
```

> [!note] Nota técnica
> El proyecto incluye `python-dotenv`, pero `settings.py` actualmente lee variables con `os.getenv`. Si se usa archivo `.env`, validar que el entorno de ejecución lo cargue o agregar carga explícita en configuración.

### 5. Ejecutar migraciones

```powershell
python manage.py migrate
```

### 6. Crear superusuario

```powershell
python manage.py createsuperuser
```

### 7. Cargar productos de ejemplo, si aplica

```powershell
python manage.py loaddata products/fixtures/products.json
```

### 8. Ejecutar servidor

```powershell
python manage.py runserver
```

### URLs locales

```text
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin/
http://127.0.0.1:8000/usuarios/login
http://127.0.0.1:8000/usuarios/registro
http://127.0.0.1:8000/carrito/
```

---

## 🔐 Credenciales demo

> [!danger] Solo desarrollo
> El README anterior no define credenciales demo fijas. Para desarrollo, crear un superusuario local con:

```powershell
python manage.py createsuperuser
```

> [!warning] Seguridad
> No usar usuarios, passwords ni llaves de prueba como credenciales de producción.

---

## 🌍 Variables de entorno de producción

> [!danger] Seguridad
> En producción no se deben guardar secretos en archivos versionados. Definirlos en el servidor, gestor de secretos, panel del proveedor o servicio del proceso.

```powershell
$env:DJANGO_SECRET_KEY="secreto-largo-y-aleatorio"
$env:DJANGO_ENV="production"
$env:DEBUG="False"
$env:ALLOWED_HOSTS="ecopython.com,www.ecopython.com"
$env:FACEBOOK_CLIENT_ID="facebook-client-id-produccion"
$env:FACEBOOK_CLIENT_SECRET="facebook-client-secret-produccion"
$env:STRIPE_PUBLIC_KEY="pk_live_xxxxx"
$env:STRIPE_PRIVATE_KEY="sk_live_xxxxx"
```

### Variables actuales

| Variable | Descripción | Default actual |
|---|---|---|
| `DJANGO_SECRET_KEY` | Llave secreta de Django | Sin default; obligatoria |
| `DJANGO_ENV` | Ambiente de ejecución (`development` o `production`) | `development` |
| `DEBUG` | Activa modo debug | `True` en desarrollo, `False` en producción |
| `ALLOWED_HOSTS` | Dominios permitidos para Django | `127.0.0.1,localhost` en desarrollo; obligatorio en producción |
| `FACEBOOK_CLIENT_ID` | ID de aplicación Facebook OAuth | `None` |
| `FACEBOOK_CLIENT_SECRET` | Secreto de Facebook OAuth | `None` |
| `STRIPE_PUBLIC_KEY` | Llave pública de Stripe | `None` |
| `STRIPE_PRIVATE_KEY` | Llave privada de Stripe | `None` |

### Variables recomendadas para endurecer producción

| Variable | Descripción |
|---|---|
| `ALLOWED_HOSTS` | Dominios permitidos para Django |
| `DATABASE_URL` | Cadena de conexión si se migra a PostgreSQL |
| `CSRF_TRUSTED_ORIGINS` | Orígenes HTTPS confiables |
| `SECURE_SSL_REDIRECT` | Forzar HTTPS detrás de proxy |
| `SESSION_COOKIE_SECURE` | Cookies de sesión solo por HTTPS |
| `CSRF_COOKIE_SECURE` | Cookie CSRF solo por HTTPS |
| `SECURE_HSTS_SECONDS` | HSTS activo automáticamente en producción |

---

## 🗄️ Base de datos y migraciones

| Ambiente | Motor | Migraciones | Observaciones |
|---|---|---|---|
| Desarrollo | SQLite | Migraciones Django por app | Configurado por defecto |
| Pruebas | SQLite temporal | Django crea base de test | Usar `python manage.py test` |
| Producción | Recomendado PostgreSQL | Migraciones Django | Requiere ajustar `DATABASES` |

### Migraciones actuales por app

```text
carts/migrations/
categories/migrations/
DirEnvio/migrations/
MetodoPago/migrations/
orden/migrations/
products/migrations/
promo_codigo/migrations/
users/migrations/
```

> [!warning] Regla de producción
> Para cambios de esquema, crear nuevas migraciones con:
>
> ```powershell
> python manage.py makemigrations
> python manage.py migrate
> ```
>
> No modificar migraciones que ya fueron aplicadas en servidores compartidos o producción.

---

## 🧪 Comandos frecuentes

### Validar configuración de Django

```powershell
python manage.py check
```

### Crear migraciones

```powershell
python manage.py makemigrations
```

### Aplicar migraciones

```powershell
python manage.py migrate
```

### Ejecutar pruebas

```powershell
python manage.py test
```

### Crear superusuario

```powershell
python manage.py createsuperuser
```

### Levantar servidor local

```powershell
python manage.py runserver
```

### Cargar fixture de productos

```powershell
python manage.py loaddata products/fixtures/products.json
```

---

## 🔌 API y rutas

ECOPYTHON es principalmente una aplicación web renderizada con templates. Aunque `djangorestframework` está instalado, el repo actual expone rutas web de Django, no un contrato REST documentado.

### Rutas principales

```text
GET/POST  /usuarios/login
GET       /usuarios/salir
GET/POST  /usuarios/registro
GET       /
GET       /admin/
GET       /social-auth/
GET       /productos/search
GET       /productos/<slug>
GET       /carrito/
POST      /carrito/agregar
POST      /carrito/eliminar
GET       /orden/
GET/POST  /orden/direccion
GET       /orden/seleccionar/direccion
GET       /orden/establecer/direccion/<id>
GET       /orden/confirmacion
GET       /orden/cancelar
GET       /orden/completado
GET       /orden/completados
GET       /direcciones/
GET/POST  /direcciones/nueva
GET/POST  /direcciones/editar/<id>
GET/POST  /direcciones/eliminar/<id>
GET       /direcciones/default/<id>
POST      /codigopromo/validar
POST      /pagos/nuevo
```

> [!note] Pantallas HTML
> Las pantallas se sirven desde `backend/templates/` y los recursos estáticos desde `static/`.

---

## 🛡️ Seguridad operativa

| Área | Regla |
|---|---|
| Secretos | Usar variables de entorno; nunca versionar `.env` |
| `DEBUG` | Debe ser `False` en producción |
| `ALLOWED_HOSTS` | Debe contener dominios reales en producción |
| CSRF | Mantener `CsrfViewMiddleware` activo |
| Sesiones | Usar cookies seguras detrás de HTTPS |
| Stripe | Usar `pk_test/sk_test` en desarrollo y `pk_live/sk_live` solo en producción |
| Facebook OAuth | Mantener client secret fuera del repo |
| Media | No versionar `media/`; gestionar backup si contiene imágenes reales |
| SQLite | No usar `db.sqlite3` como base productiva para alto tráfico |

> [!danger] No versionar secretos
> Nunca subir a GitHub:
> - `.env`
> - `db.sqlite3` con datos reales
> - passwords
> - llaves privadas
> - certificados
> - tokens de Stripe
> - secretos de Facebook OAuth
> - credenciales de producción

---

## 👥 Roles

ECOPYTHON usa el sistema de usuarios de Django con un modelo personalizado (`users.User`).

| Rol / tipo | Descripción general |
|---|---|
| `superuser` | Acceso completo al Django Admin |
| `staff` | Acceso administrativo según permisos asignados |
| `cliente` | Usuario registrado que puede comprar, gestionar direcciones y consultar órdenes |
| `anónimo` | Visitante sin sesión; puede navegar catálogo según vistas disponibles |

> [!note] Pendiente posible
> Si el proyecto necesita roles comerciales específicos, conviene agregarlos con grupos/permisos de Django o un modelo de perfiles.

---

## 🚢 Despliegue sugerido

1. Crear entorno virtual en el servidor.
2. Instalar dependencias desde `backend/requirements.txt`.
3. Configurar variables de entorno reales.
4. Cambiar `DEBUG=False`.
5. Configurar `ALLOWED_HOSTS`.
6. Migrar la base de datos a PostgreSQL si se usará en producción.
7. Ejecutar:

```powershell
python manage.py migrate
python manage.py collectstatic
```

8. Servir Django con Gunicorn, uWSGI o un servicio compatible.
9. Publicar Nginx como reverse proxy.
10. Activar HTTPS con Let's Encrypt.
11. Revisar logs después del primer arranque.

> [!warning] Antes de desplegar
> El repo actual no incluye configuración productiva completa para archivos estáticos, `ALLOWED_HOSTS`, base PostgreSQL ni servidor WSGI de producción. Debe completarse antes de publicar.

---

## ✅ Checklist antes de producción

- [ ] `DEBUG=False`.
- [ ] `DJANGO_SECRET_KEY` generado con valor largo y aleatorio.
- [ ] `ALLOWED_HOSTS` configurado con dominios reales.
- [ ] `CSRF_TRUSTED_ORIGINS` configurado si aplica.
- [ ] Stripe configurado con llaves correctas del ambiente.
- [ ] Facebook OAuth configurado con dominios productivos.
- [ ] Base de datos productiva definida y respaldada.
- [ ] Migraciones aplicadas.
- [ ] `python manage.py check --deploy` revisado.
- [ ] `collectstatic` configurado y probado.
- [ ] HTTPS activo.
- [ ] Cookies seguras activadas.
- [ ] `.env`, `db.sqlite3` y `media/` protegidos.
- [ ] Superusuario con contraseña robusta.
- [ ] Logs sin credenciales ni secretos.
- [ ] Rollback documentado.

---

## 🧰 Notas para mantenimiento

> [!success] Buenas prácticas
> - Mantener modelos y migraciones sincronizados.
> - Usar `makemigrations` y revisar el SQL cuando el cambio afecte datos importantes.
> - Mantener templates limpios y reutilizar snippets.
> - No colocar reglas sensibles directamente en templates.
> - Validar flujos completos al tocar carrito, órdenes, direcciones, promociones o pagos.
> - Agregar pruebas cuando se modifiquen pagos, descuentos, totales, autenticación o estados de orden.
> - Revisar dependencias con frecuencia y actualizar con cuidado.

---

## 📚 Documentos relacionados sugeridos

```text
[[Deploy Producción ECOPYTHON]]
[[Stripe ECOPYTHON]]
[[Facebook OAuth ECOPYTHON]]
[[Django Admin ECOPYTHON]]
[[Base de Datos ECOPYTHON]]
[[Workflow Git ECOPYTHON]]
[[Checklist Seguridad ECOPYTHON]]
[[Registro de Cambios ECOPYTHON]]
```

---

## 🧾 Registro rápido de mantenimiento

| Fecha | Cambio | Responsable | Notas |
|---|---|---|---|
| 2026-05-12 | Reestructuración del README operativo | Codex | Adaptado al proyecto ECOPYTHON |
