from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    ordering = ['first_name']
    list_display = ["first_name", "last_name", "email"]
