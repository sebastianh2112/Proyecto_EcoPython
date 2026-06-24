# Comando: Revisión Completa del Proyecto

## Propósito
Ejecutar una revisión integral de EcoPython cubriendo código, seguridad, QA, arquitectura de base de datos y patrones Django.

## Cuándo usar
- Antes de hacer deploy a producción
- Al inicio de un nuevo ciclo de desarrollo
- Cuando se reportan problemas de calidad recurrentes
- Auditoría periódica del proyecto

## Agentes a invocar (en orden)
1. `security-reviewer` — escaneo de seguridad completo (auth, Stripe, CSRF, secrets)
2. `code-reviewer` — calidad de código y patrones Django
3. `qa-tester` — cobertura de tests y gaps
4. `database-reviewer` — schema, queries, índices, N+1
5. `backend-architect` — arquitectura y patrones Django

## Checklist de revisión

### Seguridad
- [ ] Todas las vistas protegidas tienen `@login_required` o `LoginRequiredMixin`
- [ ] Vistas de orden/carrito/direcciones verifican ownership del usuario
- [ ] `{% csrf_token %}` presente en todos los formularios POST
- [ ] `STRIPE_WEBHOOK_SECRET` configurado y validando firmas
- [ ] No hay secretos hardcodeados en código
- [ ] `DJANGO_SECRET_KEY` no está en el repositorio
- [ ] Stripe test keys no están en configuración de producción

### Código
- [ ] `transaction.atomic()` en `_finalizar_orden_pagada()`
- [ ] `funcionCarrito()` y `funcionOrden()` correctamente usados
- [ ] Señales Django funcionan correctamente para cálculos de totales
- [ ] Formularios con validación correcta

### Base de datos
- [ ] Migraciones Django en orden y sin modificaciones a aplicadas
- [ ] `select_related()` / `prefetch_related()` donde hay N+1 potencial
- [ ] Índices en campos de búsqueda frecuente
- [ ] Transacciones atómicas en operaciones de múltiples modelos

### Tests
- [ ] Flujo de pago Stripe testeado (con mocks)
- [ ] Tests de ownership (usuario B no puede ver orden de usuario A)
- [ ] Tests de validación de promo codes
- [ ] Tests de ciclo de vida de la orden

### Templates
- [ ] `{% csrf_token %}` en todos los formularios
- [ ] No se expone `STRIPE_PRIVATE_KEY` en templates
- [ ] Escape correcto de datos de usuario

## Formato de salida esperado
```
## Revisión Completa — EcoPython [Fecha]

### Resumen Ejecutivo
[Estado general: Verde / Amarillo / Rojo]
[X hallazgos críticos, Y altos, Z medios]

### Hallazgos por área
[Listado con severidad, ubicación, descripción y fix sugerido]

### Acciones requeridas antes del próximo deploy
1. [acción específica]
2. [acción específica]
```

## Comando para ejecutar tests
```powershell
cd backend
python manage.py test --verbosity=2
python manage.py migrate --check
```
