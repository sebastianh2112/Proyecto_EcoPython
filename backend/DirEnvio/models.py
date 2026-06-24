from django.db import models
from users.models import User
from orden.models import Orden
from django.dispatch import receiver
from django.db.models.signals import post_delete

class DireccionEnvio(models.Model):
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    line1 = models.CharField(max_length=300)
    line2 = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    reference = models.CharField(max_length=300)
    postal_code = models.CharField(max_length=10, null=False, blank=False)
    default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.postal_code
    
    def update_default(self, default=False):
        self.default = default
        self.save()
        
    def has_orden(self):
        return self.orden_set.count() >= 1
    
    @property
    def direccion(self):
        return '{} - {} - {}'.format(self.city,self.state,self.country)
    
@receiver(post_delete, sender=DireccionEnvio)
def reasignar_direccion_default(sender, instance, **kwargs):
    """
    Si una dirección usada en una orden se elimina,
    se reasigna la dirección default del usuario (si existe).
    """
    # Buscar todas las órdenes que usaban esta dirección
    ordenes = Orden.objects.filter(direccion_envio=instance)

    for orden in ordenes:
        nueva_dir = orden.user.direccion_envio  # obtiene la dirección default del usuario
        orden.direccion_envio = nueva_dir  # puede ser None si no tiene default
        orden.save()