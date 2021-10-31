import Dashboard from '../demo/dashboard.vue'
import ProductManager from '../components/ProductManager.vue'
import RateManager from '../components/RateManager.vue'
import CommentManager from '../components/CommentManager.vue'
import UserManager from '../components/UserManager.vue'
import OrderManager from '../components/OrderManager.vue'

export const routes = [
    { path: '/', redirect: '/admin'},
    { path: '/admin', name: 'admin', component: Dashboard},
    { path: '/product', name: 'product', component: ProductManager},
    { path: '/rateproduct', name: 'rateproduct', component: RateManager},
    { path: '/commentproduct', name: 'commentproduct', component: CommentManager},
    { path: '/user', name: 'user', component: UserManager},
    { path: '/order', name: 'order ', component: OrderManager}
]