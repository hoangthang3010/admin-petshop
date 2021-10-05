import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import {routes} from './router/index'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueSplide from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-sea-green.min.css';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import Bus from './plugins/EventBus'
import UUID from "vue-uuid";
import firebase from "firebase";
// import { DatePicker } from 'ant-design-vue';
// Vue.use(DatePicker);
import JwPagination from 'jw-vue-pagination';
import VueFbCustomerChat from 'vue-fb-customer-chat'
 
Vue.use(VueFbCustomerChat, {
  page_id: 101051212340029, //  change 'null' to your Facebook Page ID,
  theme_color: '#0A7CFF', // theme color in HEX
  locale: 'en_US', // default 'en_US'
})
Vue.use(UUID);
Vue.use(Bus)
Vue.component('VueSlider', VueSlider)
Vue.component('jw-pagination', JwPagination);
Vue.use( VueSplide );
library.add(fab, fas, far)
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Antd);
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
Vue.use(VueMaterial)
Vue.config.productionTip = false
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtQGvXK52TY1BmKmu3_5C4VQugDSqPuJM",
  authDomain: "login-7727f.firebaseapp.com",
  projectId: "login-7727f",
  storageBucket: "login-7727f.appspot.com",
  messagingSenderId: "700733959528",
  appId: "1:700733959528:web:f6f1422fbc2f5df5997add",
  measurementId: "G-HBLLWD5DEQ"
};
firebase.initializeApp(firebaseConfig);


const vm =new Vue({
  el: '#app',
  render: h => h(App),
  router,
	store
}) 
export { vm }
