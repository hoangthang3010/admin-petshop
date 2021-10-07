import Dashboard from '../demo/dashboard.vue'
import ProductManager from '../main/ProductManager.vue'
import RateManager from '../components/RateManager.vue'
import CommentManager from '../components/CommentManager.vue'

export const routes = [
    { path: '/', redirect: '/admin'},
    { path: '/admin', name: 'admin', component: Dashboard},
    { path: '/product', name: 'admin', component: ProductManager},
    { path: '/rateproduct', name: 'admin', component: RateManager},
    { path: '/commentproduct', name: 'admin', component: CommentManager}
]