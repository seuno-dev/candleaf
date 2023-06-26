# Generated by Django 4.1.7 on 2023-06-26 02:20

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CandleProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('slug', models.SlugField()),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(1)])),
                ('inventory', models.IntegerField(blank=True, default=0)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('wax', models.TextField()),
                ('fragrance', models.TextField()),
                ('dimension', models.CharField(max_length=100)),
                ('weight', models.IntegerField()),
                ('minimum_burning_time', models.IntegerField()),
                ('maximum_burning_time', models.IntegerField()),
            ],
        ),
        migrations.AlterField(
            model_name='cartitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='store.candleproduct'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='store.candleproduct'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='store.candleproduct'),
        ),
        migrations.DeleteModel(
            name='Product',
        ),
    ]
