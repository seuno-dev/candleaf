# Generated by Django 4.1.7 on 2023-04-05 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0015_order_payment_intent_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='payment_intent_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
