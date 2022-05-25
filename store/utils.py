from traceback import print_tb
from webbrowser import get
from django.shortcuts import render
from django.http import JsonResponse
import json
import datetime

from .models import *

def cart_data(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cart_items = order.get_cart_items
        shipping = order.shipping
    else:
        items, order, cart_items  = Anonymous_user_cart(request)
    return (items, order, cart_items)



def Anonymous_user_cart(request):
    try:
        cart = json.loads(request.COOKIES['cart'])
        #on first load, the cookie cart may not be set yet, which may trow  an error, set an empty cookie disctionary temporaly until the cookie get set.
    except:
        cart = {}
        print(cart)
    items = []
    order = {"get_cart_total":0, 'get_cart_items':0, "shipping": False}
    cart_items = order['get_cart_items']

    for item in cart:
        try:
            cart_items += cart[item]['quantity']
            product = Product.objects.get(id=item)
            get_total_price = (product.price * cart[item]['quantity'])
            order['get_cart_items'] += cart[item]['quantity']
            order['get_cart_total'] += get_total_price
            if  product.digital == False:
                order['shipping'] = True

            item = {
                'product':{
                    'id': product.id,
                    'name': product.name,
                    'price': product.price,
                    'image': product.image,
                },
                'quantity': cart[item]['quantity'],
                'get_total_price': get_total_price
            }
            items.append(item)
        except:
            pass
    return (items, order, cart_items)
    #return {'items':items, 'order':order, 'cart_items': cart_items}

def guess_checkout(request, data):
    print(f'cookie: {request.COOKIES}')
    name = data['form']['name']
    email = data['form']['email']
    cart = Anonymous_user_cart(request)
    items = cart[0]

    customer, created = Customer.objects.get_or_create(email=email)
    customer.name = name
    customer.save()

    order = Order.objects.create(customer=customer, complete=False)
    for item in items:
        product = Product.objects.get(id=item['product']['id'])
        product=product
        order=order
        quantity = item['quantity']
    return(customer, order)
