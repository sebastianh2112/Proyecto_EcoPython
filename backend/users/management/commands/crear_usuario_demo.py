from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = 'Crea el usuario demo para demostraciones del portfolio'

    def handle(self, *args, **options):
        if User.objects.filter(username='demo').exists():
            self.stdout.write('El usuario demo ya existe.')
            return

        User.objects.create_user(
            username='demo',
            password='demo1234',
            email='demo@ecopython.dev',
            first_name='Demo',
            last_name='User',
        )
        self.stdout.write(self.style.SUCCESS('Usuario demo creado: demo / demo1234'))
