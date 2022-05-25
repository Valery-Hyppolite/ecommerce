
import imp
import re
from traceback import print_tb
from webbrowser import get
from django.shortcuts import render
from django.http import JsonResponse
import json
import datetime

from .models import *
from.utils import Anonymous_user_cart, cart_data, guess_checkout

# Create your views here.
def store(request):
    '''show the products on the welcome page'''
    cart = cart_data(request)
    cart_items = cart[2]
    # if request.user.is_authenticated:
    #     customer = request.user.customer
    #     order, created = Order.objects.get_or_create(customer=customer, complete=False)
    #     items = order.orderitem_set.all()
    #     cart_items = order.get_cart_items
    # else:
    #     cart  = get_cookie_cart(request)
    #     cart_items  = cart[2]
        # items = []
        # order = {"get_cart_total":0, 'get_cart_items':0, "shipping": False}
        # cart_items = order['get_cart_items']
    products = Product.objects.all()
    context = {'products': products, 'cart_items': cart_items}
    return render(request, 'store/store.html', context)


def cart(request):
    '''get the cart item and render the page'''
    items, order, cart_items  = cart_data(request)
    context = {'items': items, 'order':order, 'cart_items': cart_items}
    return render(request, 'store/cart.html', context)

def checkout(request):
    '''get render the item on the checkout page'''
    items, order, cart_items  = cart_data(request)
    orderitem = OrderItem.objects.all()
    context = {'items': items, 'order':order, 'cart_items': cart_items}
    return render(request, 'store/checkout.html', context)


def update_items(request):
    '''add or remove product when function on javascript is triggered'''
    data = json.loads(request.body)
    product_id = data['productId']
    action = data['action']
    print(product_id, action)

    customer = request.user.customer
    product = Product.objects.get(id=product_id)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    orderitem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        orderitem.quantity += 1
    elif  action == 'remove':
        orderitem.quantity += -1
    orderitem.save()

    if orderitem.quantity <= 0:
        orderitem.delete()
    return JsonResponse('item was added', safe=False)

from django.views.decorators.csrf import csrf_exempt
#this item is added so that user can sbmit data to the backend without needing a csrftoken. 
@csrf_exempt
def proccess_order(request):
    '''process order, add items and customers in the database for both user and guess'''
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
    else:
        customer, order = guess_checkout(request, data)

    total = float(data['form']['total'])
    order.transaction_id = transaction_id
    if total == order.get_cart_total:
        order.complete = True
        order.save()

    if order.shipping  == True:
        Shipping.objects.create(
            customer = customer,
            order = order,
            address = data['shipping']['address'],
            city = data['shipping']['city'],
            state = data['shipping']['state'],
            zipcode = data['shipping']['zipcode'],
            )
    
    return JsonResponse('payment is complete', safe=False)

