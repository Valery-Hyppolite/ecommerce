
//=========CREATe COOKIES===============
// let user = '{{request.user}}';

// function getToken(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }
// const csrftoken = getToken('csrftoken');

// //create a session cookie that allow data to be save on the browser for days.
// function getCookie(name){
//     let cookieArr = document.cookie.split(";");
//     for(let i = 0; i <  cookieArr.length; i++){
//         let cookiePair = cookieArr[i].split("=");
//         if(name == cookiePair[0].trim()){
//             return decodeURIComponent(cookiePair[1]);
//     }
// }
// return null
// }
// let cart  = JSON.parse(getCookie('cart'));
// if(cart == undefined){
// cart = {}
// console.log('cart was created');
// document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/";
// }
// console.log('cart', cart);
        

//===========UPDATE USERS CART ========
let updateBtns = document.getElementsByClassName('update-cart');

for (i = 0; i < updateBtns.length; i++){
    updateBtns[i].addEventListener('click', function() {
        let productId = this.dataset.product;
        let action = this.dataset.action;
        console.log(`product is: ${productId}, action: ${action}`);
        if (user ===  'AnonymousUser'){
            addCookieItem(productId, action);
        } else{
            updateUserOrder(productId, action); 
        };
    })
}

//CREATE the logic for anonymous user. ADD OR REMOVE PRODUCT
function  addCookieItem(productId, action){
    if(action == 'add'){
        if(cart[productId] == undefined){
            console.log('cart is undefined');
            cart[productId] = {'quantity': 1}
        } else{
            cart[productId]['quantity'] += 1;
    }
    
}

    if(action == 'remove'){
        cart[productId]['quantity'] -= 1
        if(cart[productId]['quantity']<= 0){
            console.log('Item should be delete')
            delete cart[productId];
        }
        
    }
    console.log('user not logged in.....');
    console.log('cart:' , cart);
    document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/";
    location.reload();
}


// CREATE LOGIC FOR LOGIN USERS. SEND DATA TO THE BACKEND FOR LOGIN USER
function  updateUserOrder(productId, action){
    console.log('user is logged in, sending data');
    let url = '/update-items/';
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'productId': productId,'action': action})
    })

    .then((response) => {
        return response.json()
    })

    .then((data) =>{
        console.log('DATA:', data);
        location.reload();
    })
}


//============SHPPING LOGIC===========
// let shipping = '{{order.shipping}}';
// let total = '{{order.het_cart_total|floatformat:2}}';

// if (user != 'AnonymouseUser'){
//   document.getElementById('user-info').innerHTML = ''
// }

// if(shipping == 'False' && user != 'AnonymouseUser'){
//   document.getElementById('shipping-info').innerHTML = '';
//   document.getElementById('user-info').innerHTML = '';
// }

// //=======payment form ==============
// let form  = document.getElementById('form');
// form.addEventListener('submit',  function(e){
//   e.preventDefault()
//   console.log('form is submitted');
//   //document.getElementById('payment-info').classList.remove('hidden');
// })

// document.getElementById('make-payment').addEventListener('click', function(){
//   submitPaymentData();
// })

// function submitPaymentData(){
//   console.log('payment is submitted');

//   let userFormData = {
//     'name': null,
//     'email': null,
//     'total': total
//   }

//   let shippingFormData = {
//     'address': null,
//     'city': null,
//     'state': null,
//     'zip': null
//   }
//   if(shipping != 'False'){
//     shippingFormData.address = form.address.value;
//     shippingFormData.city = form.city.value;
//     shippingFormData.state = form.state.value;
//     shippingFormData.zip = form.zip.value;
//   }

//   if (user === 'AnonymouseUser'){
//     userFormData.name = form.name.value;
//     userFormData.email = form.email.value;
//   }

//   let url = '/proccess_order/';
//   fetch(url, {
//       method: 'POST',
//       headers: {
//           'content-type': 'application/json',
//           'X-CSRFToken': csrftoken,
//       },
//       body: JSON.stringify({'form': userFormData,'shipping': shippingFormData})
//   })

//   .then((response) => {
//       return response.json()
//   })

//   .then((data) =>{
//       console.log('Success:', data);
//       alert('Transaction completed')
//       window.location.href = "{% url 'store'%}"
//   })
// }