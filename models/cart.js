const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

const getCartFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };
    if (!err) {
      cart = JSON.parse(fileContent);
    }
    cb(cart);
  }); 
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // get the previous Cart
    getCartFromFile((cart) => {
      // Find existing Product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = ++updatedProduct.qty;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
