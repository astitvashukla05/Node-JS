const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      // ✅ Check if file has data and handle parse error
      if (!err && fileContent.length > 0) {
        try {
          cart = JSON.parse(fileContent);
        } catch (parseErr) {
          console.error('Cart JSON invalid — resetting cart:', parseErr);
        }
      }

      // ✅ Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products.push(updatedProduct);
      }

      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static deleteProductFromCart(id, price) {
    fs.readFile(p, (err, content) => {
      if (err || content.length === 0) return; // ✅ handle empty file

      let updatedCart;
      try {
        updatedCart = JSON.parse(content);
      } catch (parseErr) {
        console.error('Cart JSON invalid — cannot delete product:', parseErr);
        return;
      }

      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) return;

      const productQty = product.qty;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) console.log(err);
      });
    });
  }
  static getCartItem(cb) {
    fs.readFile(p, (err, content) => {
      if (err) cb(null);
      const cart = JSON.parse(content);
      cb(cart);
    });
  }
};
