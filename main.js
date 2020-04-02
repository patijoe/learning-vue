var eventBus = new Vue();

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
        <img :src="image">
      </div>

      <div class="product-info">
        <h1 >{{ title }}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>

        <details-product-tabs :shipping="shipping" :details="details"></details-product-tabs>

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
      
      <product-tabs :reviews="reviews"></product-tabs>
 
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
      ],
      reviews: []
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
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
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

// v-model="name", se llama two-way data binding  template <===> data. En nuestro CacheStorage, cuanso se introduzca algo en name a traves del InputDeviceInfo, cambiará el name de data
Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent = "onSubmit">

      <p v-if="errors.length">
        <b>Please correct the error(s):</b>
        <ul>
          <li v-for="error in errors"> {{ error }}</li>
        </ul>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</Label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <label for="recommend"> Would you recommend this product?</label>
        <input type="radio" :value="true"  v-model="recommend" selected>Yes
        <input type="radio" :value="false" v-model="recommend">No
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: true,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review && this.recommend != null) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = true;
      } else {
        if (!this.name) this.errors.push('Name required');
        if (!this.rating) this.errors.push('Rating required');
        if (!this.review) this.errors.push('Review required');
      }
    }
  }
});

Vue.component('details-product-tabs', {
  props: {
    shipping: {
      type: String,
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
<div>
  <span v-for="(productTab, index) in productTabs" 
        :key="index"
        :class="{ activeTab: selectedDetailsTab === productTab }"
        @click="selectTab(productTab)">{{ productTab }}</span>

  <p v-show="selectedDetailsTab === 'shipping'">Shipping: {{ shipping }}</p>

  <product-details 
      :details="details" 
      v-show="selectedDetailsTab === 'Product details'">
  </product-details>
</div>
  `,
  data() {
    return {
      productTabs: [ 'shipping', 'Product details' ],
      selectedDetailsTab: 'Product details'
    };
  },
  methods: {
    selectTab(productTab) {
      this.selectedDetailsTab = productTab;
    }
  }
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
    <span class="tab"
       :class="{ activeTab: selectedTab === tab }"
       v-for="(tab, index) in tabs" 
         :key="index"
         @click="selectedTab = tab"
         >{{ tab }}</span>

    <div v-show="selectedTab === 'Reviews'">
       <p v-if="reviews.length === 0">There are no reviews</p>
       <ul>
         <li v-for="(review, index) in reviews" :key="index">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review}}</p>
           <p>Would you recommended? {{ getRecommendName(review) }}</p>
         </li>
       </ul>
   </div>
   
   <product-review
      v-show="selectedTab === 'Make a Review'">
   </product-review>
  </div>
  `,
  data() {
    return {
      tabs: [ 'Reviews', 'Make a Review' ],
      selectedTab: 'Reviews'
    };
  },
  methods: {
    getRecommendName(productReview) {
      return productReview.recommend ? 'Yes' : 'No';
    }
  }
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
        this.cart.splice(index, 1);
      }
    }
  }
});
