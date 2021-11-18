<template>
  <div id="app">
    <NavMenu v-if="id">
      <BackToTop/>
      <!-- {{children}} -->
    </NavMenu>
    <div v-else><Login/></div>
  </div>
</template>

<script>
import NavMenu from './layout/NavBar.vue'
// import Footer from './layout/Footer.vue'
// import HeaderMenu from './layout/HeaderMenu.vue'
import '../src/scss/App.scss'
import BackToTop from './components/BackToTop.vue'
import Login from './components/Login.vue'
import { mapGetters, mapActions } from "vuex";
export default {
  name: 'App',
  data() {
    return {
      role: this.$route.params.admin,
      id: sessionStorage.getItem('id')
    }
  },
  components: {
    NavMenu,
    // Footer,
    // HeaderMenu,
    BackToTop,
    Login
  },
  created(){
    console.log(this.role);
    this.$bus.on('idUser', value => {
                this.id = value
            })
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


