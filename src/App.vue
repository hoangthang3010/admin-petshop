<template>
  <div id="app">
    <NavMenu>
      <BackToTop/>
      <!-- {{children}} -->
    </NavMenu>
  </div>
</template>

<script>
import NavMenu from './layout/NavBar.vue'
// import Footer from './layout/Footer.vue'
// import HeaderMenu from './layout/HeaderMenu.vue'
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
    NavMenu,
    // Footer,
    // HeaderMenu,
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


