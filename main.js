Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">

      <div class="product-image">
        <img v-bind:src="image">
      </div>

      <div class="product-info">
        <h1 >{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>

        <product-details :details="details"></product-details>

        <div class="color-box"
          v-for="(variant, index) in variants" 
          :key="variant.variantId"
          :style="{backgroundColor: variant.variantColor}"
          @mouseover="updateProduct(index)">
        </div>
      </div>

      <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
        Add to Cart
      </button>

      <button v-on:click="removeToCart">
        Remove to cart
      </button>
      

    </div>
  `,
  data() {
    return {
      product: 'Boots',
      brand: 'Patricia',
      selectedVariant: 0,
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
          variantQuantity: 8
        }
      ]
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeToCart() {
      this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId);
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
    },
    shipping() {
      if (this.premium) {
        return 'Free';
      }
      return '2.99 €';
    }
  }
});

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
});

var app = new Vue({
  el: '#app',
  data: {
    cart: [],
    premium: true
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    deleteToCart(id) {
      const index = this.cart.indexOf(id);
      if (index > -1) {
        this.cart.splice(0, index);
      }
    }
  }
});
