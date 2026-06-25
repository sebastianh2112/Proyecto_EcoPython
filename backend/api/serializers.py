from django.contrib.auth import authenticate
from rest_framework import serializers
from products.models import Product
from categories.models import Category
from users.models import User
from carts.models import Cart, CartProduct
from orden.models import Orden, OrdenProducto
from DirEnvio.models import DireccionEnvio
from promo_codigo.models import PromoCodigo


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Este correo ya está registrado.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Credenciales inválidas.')
        if not user.is_active:
            raise serializers.ValidationError('Cuenta desactivada.')
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    has_address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'has_address')

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_has_address(self, obj):
        return obj.has_direccion_envio()


# ─── Categories ───────────────────────────────────────────────────────────────

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'title', 'description', 'product_count')


# ─── Products ─────────────────────────────────────────────────────────────────

class ProductListSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True, source='category_set')
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'title', 'price', 'slug', 'image_url', 'categories', 'created_at')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ('description',)


# ─── Cart ─────────────────────────────────────────────────────────────────────

class CartProductSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = CartProduct
        fields = ('id', 'product', 'product_id', 'quantity', 'created_at')


class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'cart_id', 'subtotal', 'total', 'items', 'created_at')

    def get_items(self, obj):
        qs = CartProduct.objects.filter(cart=obj).select_related('product')
        return CartProductSerializer(qs, many=True, context=self.context).data


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1, max_value=99)


# ─── Addresses ────────────────────────────────────────────────────────────────

class DireccionEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DireccionEnvio
        fields = (
            'id', 'line1', 'line2', 'city', 'state',
            'country', 'reference', 'postal_code', 'default', 'created_at'
        )
        read_only_fields = ('id', 'created_at')


# ─── Promo Codes ──────────────────────────────────────────────────────────────

class PromoValidateSerializer(serializers.Serializer):
    codigo = serializers.CharField(max_length=10)


class PromoResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCodigo
        fields = ('codigo', 'descuento')


# ─── Orders ───────────────────────────────────────────────────────────────────

class OrdenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenProducto
        fields = ('id', 'title', 'price', 'quantity')


class OrdenSerializer(serializers.ModelSerializer):
    products = OrdenProductoSerializer(many=True, read_only=True, source='items')
    direccion = DireccionEnvioSerializer(read_only=True, source='direccion_envio')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    total_display = serializers.SerializerMethodField()

    class Meta:
        model = Orden
        fields = (
            'id', 'ordenID', 'status', 'status_display',
            'total', 'total_display', 'envio_total',
            'direccion', 'products', 'created_at'
        )

    def get_total_display(self, obj):
        return str(obj.get_total())


class CreatePaymentIntentSerializer(serializers.Serializer):
    orden_id = serializers.IntegerField()


class ConfirmPaymentSerializer(serializers.Serializer):
    payment_intent_id = serializers.CharField()
    orden_id = serializers.IntegerField()
