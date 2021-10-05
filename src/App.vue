<template>
  <div id="app">
    <Header v-if="role !== 'admin'"/>
    <HeaderMenu v-if="role !== 'admin'"/>
    <!-- <router-view name='header'/>
    <router-view name='header-menu'/> -->
    <BackToTop/>
    <router-view/>
    {{children}}
    <Footer/>
  </div>
</template>

<script>
import Header from './layout/Header.vue'
import Footer from './layout/Footer.vue'
import HeaderMenu from './layout/HeaderMenu.vue'
import '../src/scss/App.scss'
import BackToTop from './components/BackToTop.vue'
import { mapGetters, mapActions } from "vuex";
export default {
  name: 'App',
  data() {
    return {
      role: this.$route.params.admin
    }
  },
  components: {
    Header,
    Footer,
    HeaderMenu,
    BackToTop
  },
  created(){
    console.log(this.role);
  },
  // created(){
  //   window.scrollTo(0,0)
  // },
  mounted() {
    this.authAction();
  },
  computed: {
    ...mapGetters(["getUser", "isUserAuth"]),
  },
  methods: {
    ...mapActions(["authAction"])
  }
}
</script>

<style>
</style>


