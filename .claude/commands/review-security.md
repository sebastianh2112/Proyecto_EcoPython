# Comando: Revisión de Seguridad

## Propósito
Auditoría de seguridad enfocada en EcoPython: autenticación, autorización, pagos Stripe, CSRF, secretos y configuración Django.

## Cuándo usar
- Antes de cualquier commit que toque auth, pagos, o permisos
- Revisión mensual de seguridad
- Después de agregar nuevos endpoints o vistas
- Antes de hacer deploy a producción

## Agente principal
`security-reviewer` con apoyo de `code-reviewer`

## Áreas a revisar

### 1. Autenticación Django
- `@login_required(login_url="login")` en vistas protegidas
- `LoginRequiredMixin` en class-based views
- Facebook OAuth callback seguro
- No hay bypass de autenticación

### 2. Autorización y Ownership
- Vistas de orden verifican `orden.user == request.user`
- Vistas de direcciones verifican `direccion.user == request.user`
- Vistas de carrito no permiten acceso cross-user
- Admin Django protegido con `is_staff`

### 3. Pagos Stripe (CRÍTICO)
- `crear_payment_intent`: el monto viene del modelo — no del cliente
- `confirmar_pago`: valida que `payment_intent_id` metadata coincida con la orden
- `stripe_webhook`: valida firma con `STRIPE_WEBHOOK_SECRET` en producción
- `_finalizar_orden_pagada()`: dentro de `transaction.atomic()`

### 4. CSRF Protection
- `CsrfViewMiddleware` activo en `settings.py`
- `{% csrf_token %}` en todos los formularios POST
- Solo `stripe_webhook` tiene `@csrf_exempt` (intencional — firma reemplaza CSRF)
- Fetch API con cabecera CSRF correcta

### 5. Secrets y Configuración
- `DJANGO_SECRET_KEY` no hardcodeado, viene de env var
- `STRIPE_PRIVATE_KEY` no en templates ni logs
- `.env` en `.gitignore`
- `DEBUG=False` en producción
- `ALLOWED_HOSTS` no es `*` en producción

### 6. Rate Limiting (GAP CONOCIDO)
- Sin rate limiting en `/usuarios/login` — brute force posible
- Sin rate limiting en `/codigopromo/validar` — enumeración posible
- Recomendar implementación con `django-ratelimit` o middleware custom

## Archivos protegidos
```
backend/WebDjango/settings.py
backend/orden/views.py          → lógica Stripe
backend/users/models.py
backend/*/migrations/
.env
```

## Formato de hallazgos
```
CRITICO: [descripción] en [archivo:línea]
ALTO: [descripción] en [archivo:línea]
MEDIO: [descripción] en [archivo:línea]
BAJO: [descripción] en [archivo:línea]
```
