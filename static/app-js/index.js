const ProductData = [
    {
        index: '01',
        name: "Yellow Chair",
        image: "{% static 'img/store/img10.jpg' %}",
        desc: " Best Quality Fututure at Your Door Steps"
    },

    {
        index: '02',
        name: "blue Chair",
        image: "{% static 'img/store/img12.jpg' %}",
        desc:"Best Quality Fututure at Your Door Steps"
    },

    {
        index: '03',
        name: "white Chair",
        image: "img28.jpg",
        desc: " Best Quality Fututure at Your Door Steps "
    },

    {
        index: '04',
        name: "orange Chair",
        image: "img9.jpg",
        desc: "Best Quality Fututure at Your Door Steps" 
    },

]

const nxtbtn = document.querySelector('.nxt-btn');

let smImgContainer = document.querySelector('.sm-product-img-container');
let smIgm = document.querySelector('.sm-product-img');
let productIndex = document.querySelector('.product-index');
let smProductDecs = document.querySelector('.sm-product-desc');

let productImgContainer = document.querySelector('.product-img-container');
let productImg = document.querySelector('.product-img');
let backdropImg = document.querySelector('.backdrop-img');

let productDetail = document.querySelector('.product-detail');
let productName = document.querySelector('.product-name');
let productDesc = document.querySelector('.product-desc');

let currentProduct = 0;

nxtbtn.addEventListener('click', () => {
    if (currentProduct >= ProductData.length - 1) {
        currentProduct = 0;
    } else {
        currentProduct++;
    }
    productIndex.innerHTML = ProductData[currentProduct].index;
    smProductDecs.innerHTML = ProductData[currentProduct].desc;
    productDesc.innerHTML = ProductData[currentProduct].desc;

    smImgContainer.classList.add('slide');
    productImgContainer.classList.add('slide');
    productDetail.classList.add('fade');
    backdropImg.classList.add('fade');
    setTimeout(() => {
        smImgContainer.classList.remove('slide');
        productImgContainer.classList.remove('slide');
        productDetail.classList.remove('fade');
        backdropImg.classList.add('fade');
    }, 1000)

    productName.innerHTML = ProductData[currentProduct].name;
    productDesc.innerHTML = ProductData[currentProduct].desc;
    smIgm.src = productImg.src = backdropImg.src = `/img/${ProductData[currentProduct].image}`;
    //smIgm.src = productImg.src = backdropImg.src = `${medialUrl}/${ProductData[currentProduct].image}`;

    // setTimeout(() => {
    //     productName.innerHTML = ProductData[currentProduct].name;
    //     productDesc.innerHTML = ProductData[currentProduct].desc;
    //     smIgm.src = productImg.src = backdropImg.src = `/img/${ProductData[currentProduct].image}`;
    // }, 600);





})