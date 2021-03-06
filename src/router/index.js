import Dashboard from '../demo/dashboard.vue'
import ProductManager from '../components/ProductManager.vue'
import RateManager from '../components/RateManager.vue'
import CommentManager from '../components/CommentManager.vue'
import UserManager from '../components/UserManager.vue'
import OrderManager from '../components/OrderManager.vue'
import RaceManager from '../components/RaceManager.vue'
import SlideManager from '../components/SlideManager.vue'
import TypeProductManager from '../components/TypeProductManager.vue'
import WarehouseManager from '../components/WarehouseManager.vue'
import PostsManager from '../components/PostsManager.vue'

export const routes = [
    { path: '/', redirect: '/admin'},
    { path: '/admin', name: 'admin', component: Dashboard},
    { path: '/product', name: 'product', component: ProductManager},
    { path: '/rateproduct', name: 'rateproduct', component: RateManager},
    { path: '/commentproduct', name: 'commentproduct', component: CommentManager},
    { path: '/user', name: 'user', component: UserManager},
    { path: '/order', name: 'order', component: OrderManager},
    { path: '/race', name: 'race', component: RaceManager},
    { path: '/slide', name: 'slide ', component: SlideManager},
    { path: '/typeproduct', name: 'typeproduct', component: TypeProductManager},
    { path: '/warehouse', name: 'warehouse', component: WarehouseManager},
    { path: '/posts', name: 'posts', component: PostsManager}
]
export const routesAdmin = [
    { path: '/', redirect: '/homepage'},
]