from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, \
    UserSerializer as BaseUserSerializer


class CreateUserSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['username', 'first_name', 'last_name', 'email', 'password']


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ['username', 'first_name', 'last_name', 'email']
