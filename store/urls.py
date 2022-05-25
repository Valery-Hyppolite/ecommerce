from django.urls import path
from  .views import *

urlpatterns = [
    path('', store, name='store'),
    path('cart/', cart, name='cart'),
    path('checkout/', checkout, name='checkout'),

    path('update-items/', update_items, name='update-items'),
    path('proccess_order/', proccess_order, name='proccess_order'),

    
]