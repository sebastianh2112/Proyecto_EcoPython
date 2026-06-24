# Comando: Validar Deployment

## Propósito
Checklist completo de validación antes y después de un deployment de EcoPython a producción.

## Cuándo usar
- Antes de cada deploy a producción
- Después de aplicar migraciones de base de datos
- Al cambiar variables de entorno en producción

## Agente principal
`devops-deployment` con apoyo de `security-reviewer`

## PRE-DEPLOY: Checklist obligatorio

### Código
- [ ] Rama `main` actualizada y limpia
- [ ] Tests pasando: `python manage.py test`
- [ ] Sin conflictos de merge pendientes
- [ ] Code review completado
- [ ] Migraciones pendientes verificadas: `python manage.py migrate --check`

### Seguridad
- [ ] No hay secretos hardcodeados en el código nuevo
- [ ] `.env` no está en el repositorio
- [ ] Nuevas vistas tienen `@login_required` o `LoginRequiredMixin`
- [ ] Migraciones no rompen datos existentes

### Variables de entorno (verificar en servidor)
```
DJANGO_ENV                → production
DEBUG                     → False
DJANGO_SECRET_KEY         → valor único y fuerte (no igual al de dev)
ALLOWED_HOSTS             → dominio real (no *)
STRIPE_PUBLIC_KEY         → pk_live_* (live, NO test)
STRIPE_PRIVATE_KEY        → sk_live_* (live, NO test)
STRIPE_WEBHOOK_SECRET     → whsec_* (REQUERIDO en prod)
FACEBOOK_CLIENT_ID        → configurado
FACEBOOK_CLIENT_SECRET    → configurado
```

### Base de datos
- [ ] Backup de producción realizado
- [ ] Nueva migración probada localmente
- [ ] Plan de rollback de la migración definido

### Archivos estáticos y media
- [ ] `python manage.py collectstatic` ejecutado
- [ ] Configuración de `MEDIA_ROOT` y almacenamiento verificada

## Build y Deploy
```powershell
# Activar entorno virtual
venv\Scripts\activate

# Instalar/actualizar dependencias
pip install -r backend/requirements.txt

# Migraciones
python backend/manage.py migrate

# Recopilar archivos estáticos
python backend/manage.py collectstatic --noinput

# Iniciar Gunicorn (ejemplo)
gunicorn WebDjango.wsgi:application --bind 0.0.0.0:8000
```

## POST-DEPLOY: Validación

### Smoke Tests (manual)
1. `GET /` → Homepage carga con productos
2. Login → Redirige correctamente
3. Agregar producto al carrito → Carrito actualiza
4. Flujo de orden hasta confirmación → Stripe Elements carga
5. `/admin/` → Panel accesible para superusuario
6. Imágenes de productos cargan correctamente
7. CSS y Bootstrap cargan

### Webhook Stripe
- Verificar en Stripe Dashboard que el webhook endpoint está configurado
- Hacer una compra de prueba y verificar que la orden se marca como COMPLETED
- Revisar logs por errores de firma

### Rollback
Si hay error crítico post-deploy:
1. Revertir al código anterior (git)
2. Si hubo migración: restaurar backup de DB
3. Reiniciar el servidor
4. Notificar y documentar el incidente

## Guardar registro en
```
docs/Cambios-para-versionamiento.md → agregar entrada de deploy con fecha y versión
```
