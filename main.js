const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  // callback > içerisinde farklı fonksiyonlar çalıştırır
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  // veri çekme isteği atma
  fetch("https://api.escuelajs.co/api/v1/categories")
    // gelen veriyi işleme
    .then((res) => res.json())
    // işlenen veriyi foreach ile herbir obje için ekrana basma
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const { image, name } = category;
        // gelen herbir obje için div oluşturma
        const categoryDiv = document.createElement("div");
        // dive class ekleme
        categoryDiv.classList.add("category");
        // divin içeriğini değiştirme
        categoryDiv.innerHTML = `
            <img src="${image}" />
            <span>${name}</span>
        `;
        // oluşan divi htmldeki listeye atma
        categoryList.appendChild(categoryDiv);
      })
    );
}

// Ürünleri Çekme
function fetchProduct() {
  // apiye veri çekme isteği  atma
  fetch("https://api.escuelajs.co/api/v1/products")
    // istek başarılı olursa veriyi işle
    .then((res) => res.json())
    // işlenen veriyi al ve ekrana bas
    .then((data) =>
      data.slice(0, 25).forEach((item) => {
        // div oluştur
        const productDiv = document.createElement("div");
        // dive class ekle
        productDiv.classList.add("product");
        // divin içeriğini değiştir
        productDiv.innerHTML = `
            <img src="${item.images[0]}" />
            <p>${item.title}</p>
            <p>${item.category.name}</p>
            <div class="product-action">
              <p>${item.price} $</p>
              <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Sepete Ekle</button>
            </div>
        `;
        // oluşan ürünü htmldeki listeye gönderme
        productList.appendChild(productDiv);
      })
    );
}

// Sepet
let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(product) {
  // sepette parametere olarak gelen eremanı arar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    // eğer elemandan varsa bulunan elmanın miktarını arttır
    foundItem.amount++;
  } else {
    // eğer elemandan sepette bulunmadıysa sepete ekle
    basket.push(product);
  }
}

// Açma ve Kapatma

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  // sepetin içine ürünleri listeleme
  addList();
  // toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  // sepeti kaptınca içini temizleme
  modalList.innerHTML = "";
  // toplam değerini sıfırlama
  total = 0;
});

// sepete listeleme fonksiyonu
function addList() {
  basket.forEach((product) => {
    console.log(product);
    // sepet dizisindeki her obje için div oluştur
    const listItem = document.createElement("div");
    // bunlara class ekle
    listItem.classList.add("list-item");
    // içeriğini değiştir
    listItem.innerHTML = `
              <img src="${product.img}" />
              <h2>${product.title}</h2>
              <h2 class="price">${product.price}  $</h2>
              <p>Miktar: ${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    // elemanı htmldeki listeye gönderme
    modalList.appendChild(listItem);

    // toplam değişkenini güncelleme
    total += product.price * product.amount;
  });
}

// sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
  // silinen elemanın fiyatını total'den çıkartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
  if (e.target.id === "del") {
    e.target.parentElement.remove();
  }
});

// eğer dışarıya tıklanırsa kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
