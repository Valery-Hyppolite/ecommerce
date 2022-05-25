import email
from tkinter.tix import Tree
from django.db import models
from django.contrib.auth.models import User
from django.forms import FloatField

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, null=False, blank=False)
    email = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    price = models.DecimalField(max_digits=9, decimal_places=2, blank=False, null=False)
    digital = models.BooleanField(default=False, null=True, blank=True)
    image  = models.ImageField(null=True, blank=True, upload_to='store/', default='store/close-icon.png')

    def __str__(self) -> str:
        return self.name
    

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    date_order = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True)

    @property
    def get_cart_total(self):
        total = 0
        orderitem = self.orderitem_set.all()
        total = sum([item.get_total_price for item in orderitem])
        return total

    @property
    def get_cart_items(self):
        total = 0
        orderitem = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitem])
        return total

    @property
    def shipping(self):
        shipping = False
        orderitems = self.orderitem_set.all()
        for item in orderitems:
            if item.product.digital == False:
                shipping = True
        return shipping

    def __str__(self) -> str:
        return str(self.id)

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    quantity  = models.IntegerField(default=0, null=False, blank=False)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def get_total_price(self):
        total = self.quantity * self.product.price
        return total

    def __str__(self) -> str:
        return str(self.id)



class Shipping(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    address = models.CharField(max_length=200, null=False, blank=False)
    city = models.CharField(max_length=200, null=False, blank=False)
    state  = models.CharField(max_length=200, null=False, blank=False)
    zipcode = models.CharField(max_length=200, null=False, blank=False)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.address
