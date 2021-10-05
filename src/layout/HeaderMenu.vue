<template>
      <div class="header__bottom">
        <!-- <div class="header__bottom__"></div> -->
        <div class="header__bottom__menu">
          <router-link class="col-2" style="background-color: orange" :to="'/'" v-show="visible">
             <font-awesome-icon :icon="['fas', 'home']" style="color: white; background-color: orange" size="3x" />
          </router-link> 
          <ul class="header__bottom__menu__ul col-8">
            <li class="header__bottom__menu__ul__li">GIỚI THIỆU</li>
            <router-link style="text-decoration: none" to="/product/all">
              <li class="header__bottom__menu__ul__li">SẢN PHẨM</li>
            </router-link>
            <router-link style="text-decoration: none" to="/panigation">
              <li class="header__bottom__menu__ul__li">TIN TỨC</li>
            </router-link>
            <router-link style="text-decoration: none" to="/test">
              <li class="header__bottom__menu__ul__li">LIÊN HỆ</li>
            </router-link>
            <li class="header__bottom__menu__ul__li">VIDEO</li>
          </ul>
          <router-link
            class="header__bottom__menu__cart col-2"
            v-show="visible"  
            to="/cart"
            style="text-decoration: none;"
          >
              <font-awesome-icon :icon="['fas', 'shopping-cart']" color="white" size="3x" />
              <span class="header__bottom__menu__cart__title">&nbsp;Giỏ hàng({{product.length}})</span>
          </router-link>
          <!-- <router-view /> -->
        </div>
      </div>
</template>
<script>

import '../scss/Header.scss'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      height: 0,
      visible: false,
      fullname: sessionStorage.getItem('fullname')
    }
  },
  computed: mapGetters(['product',"getUser", "isUserAuth"]),
  methods: {
    scrollListener: function () {
      // console.log(window.scrollY);
      if( window.scrollY <=100)this.height = window.scrollY
      this.visible = window.scrollY > 99
      // console.log(window.scrollY );
      // if (window.scrollY> 100) return 
    },
  },
  mounted: function () {
    window.addEventListener('scroll', this.scrollListener)
  },
  beforeDestroy: function () {
    window.removeEventListener('scroll', this.scrollListener)
  }
}
</script>