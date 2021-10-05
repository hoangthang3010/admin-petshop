<template>
  <!-- <div style="position: fixed; z-index: 100; width:100%;"> -->
    <div id="app" class="header">
      <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> -->
      <div class="header__top" id="header1">
        <div class="header__top__left col-3">
          <router-link :to="'/'">
            <img class="header__top__left__image" src="https://jandpet.com.vn/wp-content/uploads/2018/07/JPet-logo-01.png"/>  
          </router-link> 
        </div>
        <div class="header__top__mid col-6">
          <div class="header__top__mid__search col-8">
            <!-- <input class="header__top__mid__search__item" type="text"/> -->
            <SearchProduct />
          </div>
          <div class="header__top__mid__clientcare col-4">
            <font-awesome-icon 
              class="header__top__mid__clientcare__icon"
              :icon="['fas', 'headset']" 
              size="4x" 
              color="orange"
            />
            <!-- <a-icon class="col-5" style="fontSize: 60px; margin: auto" type="customer-service"  theme="twoTone" two-tone-color="#FFA500"/> -->
            <span class="header__top__mid__clientcare__title col-8">Hỗ trợ 
              khách hàng</span>
          </div>
        </div>
        <div class="header__top__right col-3">
          <router-link 
            class="header__top__right__cart" 
            to="/cart"
            style="text-decoration: none; color: black;"
          >
            <!-- <div> -->
              <font-awesome-icon :icon="['fas', 'shopping-cart']" size="2x" />
              <!-- <a-icon class="header__top__right__cart__icon" type="shopping-cart" /> -->
              <!-- &nbsp; -->
              <span class="header__top__right__cart__title">Giỏ hàng({{product.length}})</span>
              <!-- <md-button class="md-primary">Primary</md-button> -->
            <!-- </div> -->
          </router-link>
          <router-link
            v-if="fullname"
            class="header__top__right__login"
            to="/info_user"
            style="text-decoration: none; color: black;"
          >
            <font-awesome-icon :icon="['fas', 'user']" size="2x" />
            <!-- <a-icon style="fontSize: 30px"  type="user" /> -->
            <!-- <span class="header__top__right__login__title">{{getUser.displayName}}</span> -->
            <span class="header__top__right__login__title">{{fullname}}</span>
          </router-link>
          <router-link
            v-else
            class="header__top__right__login col-6"
            to="/user_login"
            style="text-decoration: none; color: black;"
          >
            <font-awesome-icon :icon="['fas', 'user']" size="2x" />
            <!-- <a-icon style="fontSize: 30px"  type="user" /> -->
            <span class="header__top__right__login__title">Đăng nhập</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- <div class="headerhide" v-show="visible">
    </div> -->
  <!-- </div> -->
</template>
<script>
import '../scss/Header.scss'
import SearchProduct from '../components/SearchProduct.vue'
// import Vue from 'vue'
import { mapGetters } from 'vuex'
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
  name: 'Header',
  data () {
    return {
      id: sessionStorage.getItem('id'),
      fullname: '',
    }
  },
  components: {SearchProduct},
  methods:{
    async fetchAccountId(){
            const {data} = await PostsRepository.getAccountId(this.id);
            this.fullname = data.fullname
            console.log(data);
        },
  },
  created(){
    this.$bus.on('increaseCounter', value => {
                this.fullname = value
            })
    this.fetchAccountId()  
    this.fetch()
  },
  computed: mapGetters(['product',"getUser", "isUserAuth"]),
}
</script>