from django.db import models

class Proveedor(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=512)
    contact = models.CharField(max_length=255)
    # opcional: creation_date, is_active, etc.
    partnership = models.BooleanField(default=False)  # indica si está en partnership
    def __str__(self):
        return self.nombre
