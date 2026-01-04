<h1 align="center">Proyecto EcoPython</h1>
<p align="center">
Aplicación web desarrollada con Django orientada a e-commerce
</p>

<h4>Tecnologías utilizadas</h4>

* Python 3

* Django

* SQLite (desarrollo)

* HTML / CSS / Bootstrap

* JavaScript

* Stripe API (pagos)

* Social Auth (Facebook OAuth)

* Git & GitHub


<h4>Funcionalidades principales</h4>

* Registro y autenticación de usuarios

* Autenticación social con Facebook

* Gestión de productos y categorías

* Carrito de compras

* Creación de órdenes

* Integración con pagos mediante Stripe

* Manejo de direcciones de envío

* Sistema de promociones / códigos de descuento

* Panel administrativo con Django Admin


<h4>Estructura del proyecto</h4>

```
Proyecto_EcoPython/
│
├── WebDjango/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── products/
├── categories/
├── users/
├── carts/
├── orden/
├── DirEnvio/
├── promo_codigo/
├── MetodoPago/
│
├── templates/
├── static/
├── media/
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

<h4>Variables de entorno</h4>

Este proyecto utiliza variables de entorno para proteger información sensible.
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

```
DJANGO_SECRET_KEY=django-insecure-xxxxxx
DEBUG=True
FACEBOOK_CLIENT_ID=xxxxxxxx
FACEBOOK_CLIENT_SECRET=xxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxx
STRIPE_PRIVATE_KEY=sk_test_xxxxxxxx
```

***El archivo .env NO debe subirse a GitHub (ya está ignorado en .gitignore).


<h4>Instalación y configuración local</h4>
  
1 - Clonar el repositorio
```
git clone https://github.com/sebastianh2112/Proyecto_EcoPython.git
cd Proyecto_EcoPython
```
2 - Crear entorno virtual
```
python -m venv venv
```
Activar:
*Bash:
```
source venv/bin/activate
```
3 - Instalar dependencias
```
pip install -r requirements.txt
```
4 - Migraciones
```
python manage.py migrate
```
5 - Crear superusuario
```
python manage.py createsuperuser
```
6 - Ejecutar servidor
```
python manage.py runserver
```
Accede en:
http://127.0.0.1:8000/


<h4>Entorno de desarrollo</h4>

* Base de datos: SQLite

* Debug activado solo en desarrollo

* Variables sensibles protegidas con .env


<h4>Seguridad</h4>

* Claves y tokens gestionados mediante variables de entorno

* Protección contra subida de secretos activada en GitHub

* .gitignore configurado correctamente


<h4>Flujo de trabajo con Git</h4>

* Desarrollo en ramas independientes

* Commits claros y descriptivos

* Pull Requests para revisión de código

* Rama main protegida


<h4>Estado del proyecto</h4>

* En desarrollo

Proyecto utilizado con fines educativos y de aprendizaje en Django, Git y GitHub.


<h4>Contribuciones</h4>

* Las contribuciones son bienvenidas:

- Fork del proyecto

- Crear rama (feature/nueva-funcionalidad)

- Commit de cambios

- Pull Request


<h4>Licencia</h4>

Este proyecto se distribuye bajo la licencia MIT.


<h4>Autores</h4>

Sebastian H - Desarrollador Backend

Emily C - Desarrolladora Frontend
