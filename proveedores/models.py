from django.db import models

class Proveedor(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    direccion = models.TextField()
    contacto = models.CharField(max_length=100)

    # campo para indicar si hay partnership activa
    partnership_activa = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre
