<template>
  <div class="carditem">
    <!-- <div class="carditem_"> -->
    <span v-if="item.sale" class="carditem__sale">
      <p class="carditem__sale--text">{{ item.sale }}%</p>
    </span>
    <!-- </div> -->
    <img :src="item.image" />
    <router-link
      :to="`/purchase/${item.type}/${item.detail}/${item.id - 1}`"
      style="text-decoration: none;"
    >
      <p class="product__right__item__name" :title="item.title">
        {{ item.title }}
      </p>
    </router-link>
    <div class="carditem__price" v-if="item.sale">
      <p class="product__right__item__price-old" :title="item.price">
        {{ item.price | filterPrice }} ₫
      </p>
      <p class="product__right__item__price" :title="item.price">
        {{ (item.price - (item.price * item.sale) / 100) | filterPrice }} ₫
      </p>
    </div>
    <div class="carditem__price" v-else>
      <p class="product__right__item__price" :title="item.price">
        {{ item.price | filterPrice }} ₫
      </p>
    </div>
    <div class="carditem__addtocard"
          @click="
            ADD_TO_CART({
              id: item.id-1,
              title: item.title,
              price: item.price,
              image: item.image,
              count: count,
              name1: item.type,
              name2: item.detail,
            })
          "
         >
        <span >Thêm vào giỏ hàng</span
        >
    </div>
  </div>
</template>
<script>
import "../scss/CardItems.scss";
import { mapMutations} from 'vuex'
export default {
    data() {
        return{ 
            productDetail: [],
            count: 1,
            value: 0
        }
    },
    props: ["item"],
    methods: {
        ...mapMutations(['ADD_TO_CART']),
        // ADD_TO_CART(e){
        //     console.log(e);
        // }
    },
    filters : {
        filterPrice : function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            // toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
    },
};
</script>