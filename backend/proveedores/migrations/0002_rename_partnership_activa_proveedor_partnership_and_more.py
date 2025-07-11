# Generated by Django 4.2.21 on 2025-06-05 03:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proveedores', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='proveedor',
            old_name='partnership_activa',
            new_name='partnership',
        ),
        migrations.RemoveField(
            model_name='proveedor',
            name='contacto',
        ),
        migrations.RemoveField(
            model_name='proveedor',
            name='direccion',
        ),
        migrations.RemoveField(
            model_name='proveedor',
            name='nombre',
        ),
        migrations.AddField(
            model_name='proveedor',
            name='address',
            field=models.CharField(default='', max_length=512),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='proveedor',
            name='contact',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='proveedor',
            name='name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
