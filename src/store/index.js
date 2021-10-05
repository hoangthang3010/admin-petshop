import Vue from 'vue'
import Vuex from 'vuex'

// Import modules
import cart from './modules/cart'
import login from './modules/login'

Vue.use(Vuex)

const storeData = {
	modules: {
		cart, 
		login
	}
}

const store = new Vuex.Store(storeData)

export default store
