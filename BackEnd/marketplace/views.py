from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Category, Product, Order, OrderItem
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductListSerializer,
    OrderSerializer,
    OrderItemSerializer,
    UserSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model"""
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.get_queryset().order_by('-created_at')[:10]
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_products(self, request):
        """Get current user's products"""
        products = Product.objects.filter(seller=request.user)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Set the seller to the current user"""
        serializer.save(seller=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Users can only see their own orders"""
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the current user"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, id=None):
        """Cancel an order"""
        order = self.get_object()
        if order.status == 'pending':
            order.status = 'cancelled'
            order.save()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        return Response(
            {'error': 'Only pending orders can be cancelled'},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model (read-only)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
