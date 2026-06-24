# Skill: Checklist de Seguridad EcoPython

## Propósito
Lista de verificación de seguridad obligatoria para cualquier cambio en EcoPython que toque código de backend, autenticación, pagos, o datos de usuarios.

## Checklist — Nueva vista Django

### Autenticación y autorización
- [ ] La vista tiene `@login_required(login_url="login")` si requiere usuario autenticado
- [ ] Las CBV tienen `LoginRequiredMixin`
- [ ] Vistas que acceden a datos del usuario verifican `obj.user == request.user`
- [ ] Admin views tienen `@staff_member_required` o verificación de `is_staff`

### Formularios POST
- [ ] El template tiene `{% csrf_token %}` en el `<form>`
- [ ] Si usa fetch/AJAX, incluye cabecera `X-CSRFToken` con el token del cookie
- [ ] Solo `stripe_webhook` puede tener `@csrf_exempt` (la firma de Stripe lo reemplaza)

### Datos del usuario
- [ ] No se exponen datos de otros usuarios en queries (filtrar por `request.user`)
- [ ] Órdenes: `Orden.objects.filter(user=request.user, ...)`
- [ ] Direcciones: `DireccionEnvio.objects.filter(user=request.user, ...)`
- [ ] Carrito: `Cart.objects.filter(user=request.user, ...)`

### Pagos Stripe
- [ ] El monto del PaymentIntent viene del modelo `orden.get_total()` — nunca del cliente
- [ ] `confirmar_pago` verifica que `payment_intent_id` corresponde a la orden correcta
- [ ] El webhook valida la firma con `STRIPE_WEBHOOK_SECRET` (en producción obligatorio)
- [ ] `_finalizar_orden_pagada()` está dentro de `transaction.atomic()`

## Checklist — Antes de hacer commit

- [ ] No hay secretos hardcodeados (`SECRET_KEY`, claves Stripe, Facebook)
- [ ] `.env` y `db.sqlite3` están en `.gitignore`
- [ ] No se modificaron archivos protegidos sin revisión
- [ ] No hay `print()` que exponga datos sensibles
- [ ] No hay `console.log()` con datos de pago o usuario en JavaScript

## Checklist — Antes de deploy a producción

- [ ] `DJANGO_SECRET_KEY` es único y fuerte (no igual al de desarrollo)
- [ ] `DEBUG=False` confirmado
- [ ] `ALLOWED_HOSTS` set al dominio real (no `*`)
- [ ] Stripe LIVE keys configuradas (`pk_live_*`, `sk_live_*`)
- [ ] `STRIPE_WEBHOOK_SECRET` configurado (requerido en prod)
- [ ] Facebook OAuth callback URL actualizado al dominio de producción
- [ ] HTTPS habilitado (settings activa `SECURE_SSL_REDIRECT`, `HSTS` cuando `DJANGO_ENV=production`)
- [ ] Backup de base de datos realizado

## Archivos protegidos — NUNCA modificar sin aprobación explícita
```
backend/WebDjango/settings.py         → configuración de entorno y seguridad
backend/orden/views.py                → lógica de pago Stripe
backend/users/models.py               → modelo de usuario personalizado
backend/*/migrations/                 → migraciones ya aplicadas
.env                                  → variables de entorno y secretos
```

## Severidad de vulnerabilidades
| Nivel | Ejemplos | Acción |
|-------|---------|--------|
| CRITICO | Payment amount bypass, auth bypass, acceso cross-user | Fix inmediato, no deploy hasta resolver |
| ALTO | Sin ownership check, CSRF missing, webhook sin firma | Fix en este ciclo |
| MEDIO | Datos extra en response, logging sensible | Fix próximo ciclo |
| BAJO | Headers menores, mensajes de error verbosos | Backlog |
