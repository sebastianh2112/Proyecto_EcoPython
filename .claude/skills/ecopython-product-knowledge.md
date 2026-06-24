# Skill: Conocimiento del Producto EcoPython

## Descripción del proyecto
EcoPython es una tienda de comercio electrónico construida con Django 6.0 como proyecto de portafolio.
Demuestra habilidades en: Django ORM, autenticación, integración de pagos con Stripe, OAuth social,
gestión de sesiones, y arquitectura de aplicaciones web Django.

## Flujo de usuario completo

### Flujo de compra (happy path)
```
1. Visitante llega a la homepage (/)
2. Explora productos o busca (/productos/search?q=...)
3. Ve detalle de producto (/productos/<slug>)
4. Agrega al carrito → /carrito/agregar (POST)
5. Ve su carrito (/carrito/)
6. Inicia sesión si no lo ha hecho
7. Va a /orden/ → Revisión de la orden
8. Va a /orden/direccion → Selecciona o crea dirección de envío
9. Opcionalmente aplica código promo (/codigopromo/validar)
10. Va a /orden/confirmacion → Stripe Elements carga
11. Ingresa datos de tarjeta → Paga
12. Sistema confirma pago → Orden se marca COMPLETED
13. Ve historial en /orden/completados
```

### Flujo de autenticación
```
Registro → /usuarios/registro
Login local → /usuarios/login
Login Facebook → /social-auth/login/facebook/
Logout → /usuarios/salir (POST)
```

## Estados de una Orden
```
CREATED  → Orden creada, pendiente de pago
PAYED    → Pago procesado por Stripe (intermedio)
COMPLETED → Finalizada y confirmada
CANCELED  → Cancelada
```

## Modelos clave y sus relaciones
```
User (custom) ──┬── Cart ── CartProduct ── Product ── Category
                ├── Orden ── OrdenProducto ── Product
                ├── DireccionEnvio
                └── ProfilePago (Stripe tokens)

Orden ──── PromoCodigo (OneToOne)
Orden ──── DireccionEnvio (FK)
Orden ──── Cart (FK)
```

## Configuración mínima para desarrollo
```
.env con:
  DJANGO_SECRET_KEY=cualquier-valor-largo
  STRIPE_PUBLIC_KEY=pk_test_...
  STRIPE_PRIVATE_KEY=sk_test_...
  FACEBOOK_CLIENT_ID=... (opcional en dev)
  FACEBOOK_CLIENT_SECRET=... (opcional en dev)
```

## URLs de testing con Stripe
- Tarjeta exitosa: `4242 4242 4242 4242`
- Tarjeta rechazada: `4000 0000 0000 0002`
- Requiere autenticación: `4000 0025 0000 3155`
- Fecha: cualquier fecha futura, CVC: cualquier 3 dígitos

## Límites y configuración del carrito
- `FEE = 0.01` en `carts/models.py` — 1% de comisión sobre subtotal
- `Cart.update_subtotal()` suma precios de productos × cantidades
- `Cart.update_total()` = subtotal × (1 + FEE)
- Carrito asociado a sesión para usuarios anónimos, a User para autenticados

## Códigos promocionales
- 5 caracteres, alfanuméricos en mayúsculas (auto-generados)
- Validación: `fecha_inicio <= hoy <= fecha_final AND NOT used`
- Solo se puede usar una vez por código
- Descuento en porcentaje almacenado en `PromoCodigo.descuento`
