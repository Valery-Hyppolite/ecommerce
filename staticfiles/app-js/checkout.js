// let user = '{{request.user}}';

//   function getToken(name) {

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
//   }
//   const csrftoken = getToken('csrftoken');

  //============SHPPING LOGIC===========
  let shipping = '{{order.shipping}}';
  let total = '{{order.get_cart_total}}';

  if (user != 'AnonymousUser'){
    document.getElementById('user-info').innerHTML = '';
  }else{
    console.log('user is anonymous');
  }
  if(shipping == 'False'){
    document.getElementById('shipping-info').classList.add('hidden');
    document.getElementById('payment-info').classList.remove('hidden');
  }

  if(shipping == 'False' && user != 'AnonymousUser'){
    document.getElementById('shipping-info').innerHTML = '';
    document.getElementById('user-info').innerHTML = '';
    document.getElementById('payment-info').classList.remove('hidden');
  }

  //=======payment form ==============
  let form  = document.getElementById('form');
  //let csrftoken = form.getElementsByTagName('input')[0].value;
  //console.log(`new ${csrftoken}`);
  
  form.addEventListener('submit',  function(e){
    e.preventDefault()
    console.log('form is submitted');
    document.getElementById('payment-info').classList.remove('hidden');
  })

  document.getElementById('make-payment').addEventListener('click', function(){
    submitPaymentData();
  })

  function submitPaymentData(){
    console.log('payment is submitted');

    let userFormData = {
      'name': null,
      'email': null,
      'total': total
    }

    let shippingFormData = {
      'address': null,
      'city': null,
      'state': null,
      'zipcode': null
    }
    if(shipping != 'False'){
      shippingFormData.address = form.address.value;
      shippingFormData.city = form.city.value;
      shippingFormData.state = form.state.value;
      shippingFormData.zipcode = form.zipcode.value;
    }

    if (user == 'AnonymousUser'){
      userFormData.name = form.name.value;
      userFormData.email = form.email.value;
    }

    let url = '/proccess_order/';
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'form': userFormData,'shipping': shippingFormData})
    })

    .then((response) => {
        return response.json()
    })

    .then((data) =>{
        console.log('Success:', data);
        alert('Transaction completed')
        cart = {}
        document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/";
        window.location.href = "{% url 'store' %}"
    })
  }