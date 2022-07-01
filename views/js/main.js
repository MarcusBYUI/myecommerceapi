import { getAllProducts } from "/js/connections.js";

const renderProducts = async () => {
  const products = await getAllProducts();
  const productHTMl = products
    .map((product) => {
      return `<div class="home-product">
      <img src="${product.image}" alt="${product.name}" />
      <p>${product.name}</p>
      <span>$${product.price}</span>
      <a href="/products/${product._id}">Buy Now</a>
    </div>`;
    })
    .join("");

  document.querySelector(".home-products-grid").innerHTML = productHTMl;

  console.log(productHTMl);
};

renderProducts();
