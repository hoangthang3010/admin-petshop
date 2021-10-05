<template>
    <div style="background-color: #F5F8FD">
            <div class='homepage'>
                <div class="homepage__top">
                    <div class="homepage__top__left col-3">
                        <DropProduct/>
                    </div>
                    <!-- <div class="homepage__top__mid col-8"> -->
                        <SliderHomepage1/>
                    <!-- </div> -->
                    <!-- <div class="homepage__top__right col-2">
                        
                    </div> -->
                </div>
                <!-- <br/> -->
                <div class='homepage__product'>
                    <div class='homepage__product__bestselling'>
                        <span class="homepage__product__bestselling__title">SẢN PHẨM BÁN CHẠY</span>
                    </div>
                    <ItemProduct 
                        v-for="product in product"
                        :key='product.id'
                        :product ="product"
                        :productDetail ="productDetail"
                    />
                </div>
            </div>
        </div>
</template>
<script>

// import { ref } from 'vue'
import '../scss/Homepage.scss'
import axios from 'axios'
import {API_URL} from '../.env.js'
import ItemProduct from '../components/ItemProduct.vue'
import DropProduct from '../components/DropProduct.vue'
// import SliderHomepage from '../components/SliderHomepage.vue'
import SliderHomepage1 from '../components/SliderHomepage1.vue'

export default {
    name: 'Homepage',
    components: {ItemProduct, SliderHomepage1, DropProduct},
    data() {
        return{
            product: [],
            productDetail: [],
            bestselling: [],
        }
    },
    created () {
        window.scrollTo(0,0)
        axios.get(API_URL)
            .then(response => {
                this.bestselling = response.data
                // console.log(response.data);
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
        axios.get(`${API_URL}/ProductAll`)
            .then(response => {
                this.product = response.data
                // console.log(response.data);
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
        axios.get(`${API_URL}/productDetail`)
            .then(response => {
                this.productDetail = response.data
                // console.log(response.data);
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
    }
}
</script>
