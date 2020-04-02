// Para establecer la coneión entre la instancia de Vue y el DOM, usamos la propiedad el

// Creamos una nueva instancia de Vue, que es la conexión con la aplicación Vue
// Se crea pasando objetos dentro de él, con diversoas propiedades que se usan para almacenar datos y realizar acciones

var app = new Vue({
  el: '#app',
  data: {
    brand: 'Patricia',
    product: 'Boots',
    // image: './assets/boots-green.jpg',
    url: 'https://www.google.es',
    // inStock: false,
    inventory: 0,
    onSale: false,
    details: [ '80% cotton', '20% poliester', 'gender-neutral' ],
    variants: [
      {
        variantId: 2234,
        variantColor: 'green',
        variantImage: './assets/boots-green.jpg',
        variantQuantity: 10
      },
      {
        variantId: 2235,
        variantColor: 'blue',
        variantImage: './assets/boots-blue.jpg',
        variantQuantity: 0
      }
    ],
    sizes: [ 'size S', 'size M', 'size L' ],
    cart: 0,
    selectedVariant: 0,
    onSale: true
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    }
  }
});
