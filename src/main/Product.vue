<template>
    <div class="product">
        <div class="product__left col-3">
            <!-- <p @click="filterAll('')">Tất cả</p>
            <p @click="filterType('food_cat')">Đồ ăn cho mèo</p> -->
            <div class="product__left__filterprice">
                <div class="product__left__filterprice__title">
                    <span class="product__left__filterprice__title__label">SẢN PHẨM</span>
                </div>
                <MultiLevelMenu @type="typeFilter" />
            </div>
            <hr />
            <div class="product__left__filterprice">
                <div class="product__left__filterprice__title">
                    <span class="product__left__filterprice__title__label">LỌC THEO GIÁ</span>
                </div>
                    <!-- style="margin-top: 50px; margin-bottom: 20px" -->
                <SliderRange1
                    style="margin-top: 50px; width: 90%"
                    :priceMax ="priceMax" 
                    :priceMin ="priceMin" 
                    piecewise: false
                    @rePriceMax ="rePriceMax"
                    @rePriceMin ="rePriceMin"
                />
                <!-- <SliderRange1/> -->
        <!-- <p class="product__left__filterprice__price">
            Giá từ: {{value[0] | filterPrice}}đ - {{value[1] | filterPrice}}đ
        </p> -->
                <!-- <p class="product__left__filterprice__price">
                    Giá từ: {{repriceMin | filterPrice}}đ - {{repriceMax | filterPrice}}đ
                </p> -->
                <button 
                    class="product__left__filterprice--submit"
                    style="float: right" 
                    @click="filterPrice()"
                >
                    Lọc
                </button><br/><br/>
            </div>
            <hr />
            <div class="product__left__filterprice">
                <div class="product__left__filterprice__title">
                    <span class="product__left__filterprice__title__label">SẮP XẾP</span>
                </div>
                <SortProduct 
                    @onHandleSortAZ="onHandleSortAZ"
                    @onHandleSortZA="onHandleSortZA"
                    @onHandleSortUp ="onHandleSortUp"
                    @onHandleSortDown ="onHandleSortDown"
                />
                <!-- <p>Có {{productAll.length}} sản phẩm</p> -->
            </div>
            <hr />
        </div>
        <div class="product__right col-9" v-if="productAll.length !=0">
            <!-- <div 
                class="product__right__item col-3"
                v-for="(item, key) in productAll" 
                :key="key"
            >
                <img :src="item.image"/>
                <router-link 
                    :to="`/purchase/${item.type}/${item.detail}/${key}`"
                    style="text-decoration: none"
                > 
                    <p class="product__right__item__name" :title="item.title">{{item.title}}</p>
                </router-link>
                <p class="product__right__item__price" :title="item.price">{{item.price | filterPrice}}đ</p>
            </div> -->
            <!-- <Panigation :productAll ="productAll"/> -->
            <Pagination :productAll ="productAll"/>
        </div>
        <div v-else>Không có sản phẩm tương ứng</div>
    </div>
</template>
<script>
import '../scss/Product.scss'
import axios from 'axios'
import {API_URL} from '../.env.js'
import MultiLevelMenu from '../components/MultiLevelMenu.vue'
// import SliderRange from '../components/SliderRange.vue'
import SliderRange1 from '../components/SliderRange1.vue'
import SortProduct from '../components/SortProduct.vue'
import Pagination from '../components/Pagination.vue'
// import Panigation from '../components/Pagination.vue'
// import Vue from 'vue'
export default {
    name: "Product",
    components: {MultiLevelMenu,  SortProduct, Pagination, SliderRange1},
    data() {
        return{
            product: [],
            productDetail: [],
            productAll: [],
            productAll1: [],
            name: this.$route.params.id,
            repriceMax: 0,
            repriceMin: 0,
            sort: 'default',
            productAllP: [],
            sortTypes:{
                    // tăng
                //   (item.price * item.sale) / 100)  
                // (a.price * a.sale)/100 - (b.price * b.sale)*100
                increase: {
                    fn: (a, b) => (a.price - (a.price * a.sale)/100) - (b.price - (b.price * b.sale)/100)
                },
                // giảm
                reduction: {
                    fn: (a, b) => (b.price - (b.price * b.sale)/100) - (a.price - (a.price * a.sale)/100)
                },
                az:{
                    fn: (a, b) =>   { 
                                        var n1 = a.title.toLowerCase();
                                        var n2 = b.title.toLowerCase();
                                        if (n1 < n2)
                                        {return -1}
                                        if (n1 > n2)
                                        {return 1}
                                        return 0
                                    }
                },
                za:{
                    fn: (a, b) =>   { 
                                        var n1 = a.title.toLowerCase();
                                        var n2 = b.title.toLowerCase();
                                        if (n1 < n2)
                                        {return 1}
                                        if (n1 > n2)
                                        {return -1}
                                        return 0
                                    }
                },
                default: {
                    fn: (a) => a
                }
            }
        }
    },
    computed: {
        priceMax: function () {
            let max = 0
            if (this.productAll1.length !== 0 ){
                for (let i = 0; i < this.productAll1.length; i++){
                    if (max < (this.productAll1[i].price - (this.productAll1[i].price*this.productAll1[i].sale)/100))
                        max = (this.productAll1[i].price - (this.productAll1[i].price*this.productAll1[i].sale)/100);
                    }
                return max
            }
            else{
                for (let i = 0; i < this.productDetail.length; i++){
                    if (max < (this.productDetail[i].price - (this.productDetail[i].price*this.productDetail[i].sale)/100))
                        max = (this.productDetail[i].price - (this.productDetail[i].price*this.productDetail[i].sale)/100);
                    }
                return max
            }
        },
        priceMin: function () {
            if (this.productAll1.length !== 0 ){
                let min = this.productAll1[0].price
                for (let i = 0; i < this.productAll1.length; i++){
                    if (min > (this.productAll1[i].price - (this.productAll1[i].price*this.productAll1[i].sale)/100))
                        min = (this.productAll1[i].price - (this.productAll1[i].price*this.productAll1[i].sale)/100)}
                return min
            }
            else{
                let min = this.productDetail[0].price
                for (let i = 0; i < this.productDetail.length; i++){
                    if (min > (this.productDetail[i].price - (this.productDetail[i].price*this.productDetail[i].sale)/100))
                        min = (this.productDetail[i].price - (this.productDetail[i].price*this.productDetail[i].sale)/100)}
                return min
            }
        },
    },
    methods:{
        typeFilter: function(type){
            // console.log(type);
            this.name = type
            // console.log(type);
            if (this.name == 'all'){
                this.productAll = this.productDetail
            }
            else{
                this.productAll = this.productDetail.filter((item) => item.detail === type || item.type === type || item.type_product === type)
            }
            this.productAll1 = this.productAll
            // console.log(this.priceMax)
            this.repriceMax= this.priceMax
            this.repriceMin= this.priceMin
        },
        rePriceMax: function(rePriceMax){
            this.repriceMax = rePriceMax
            // return rePriceMax(rePriceMax)
        },
        rePriceMin: function(rePriceMin){
            this.repriceMin = rePriceMin
        },
        filterPrice(){
            console.log(this.repriceMin);
            console.log(this.repriceMax);
            this.productAll = this.productAll1.filter((item) => (item.price - (item.price * item.sale) / 100) >= this.repriceMin && (item.price - (item.price * item.sale) / 100) <= this.repriceMax)
        },
        onHandleSortAZ(type){
            this.sort = type
            // console.log(type);
            this.productAll = this.productAll.sort(this.sortTypes[this.sort].fn)
        },
        onHandleSortZA(type){
            this.sort = type
            // console.log(type);
            this.productAll = this.productAll.sort(this.sortTypes[this.sort].fn)
        },
        onHandleSortUp(type){
            this.sort = type
            // console.log(type);
            this.productAll = this.productAll.sort(this.sortTypes[this.sort].fn)
        },
        onHandleSortDown(type){
            this.sort = type
            // console.log(type);
            this.productAll = this.productAll.sort(this.sortTypes[this.sort].fn)
        }
    },
    // beforeUpdate(){
    //     this.productAll = this.productDetail.filter((item) => item.detail == this.$route.params.id || item.type == this.$route.params.id)
    //     this.productAll1 = this.productAll
    // },
    created () {
        window.scrollTo(0,100)
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
                if (this.$route.params.id === 'all'){
                    this.productAll = response.data
                    this.productAll1= response.data
                    let min = this.productDetail[0].price
                    let max = 0
                    for (let i = 0; i < this.productDetail.length; i++){
                        if (max < this.productDetail[i].price)
                            max = this.productDetail[i].price;
                    }
                    for (let i = 0; i < this.productDetail.length; i++){
                        if (min > this.productDetail[i].price)
                            min = this.productDetail[i].price;
                    }
                    this.repriceMin = min
                    this.repriceMax = max
                }
                else{
                    this.productAll = this.productDetail.filter((item) => item.detail == this.$route.params.id || item.type == this.$route.params.id || item.type_product == this.$route.params.id)
                    this.productAll1= this.productAll
                    let min = this.productAll[0].price
                    let max = 0
                    for (let i = 0; i < this.productAll.length; i++){
                        if (max < this.productAll[i].price)
                            max = this.productAll[i].price;
                    }
                    for (let i = 0; i < this.productAll.length; i++){
                        if (min > this.productAll[i].price)
                            min = this.productAll[i].price;
                    }
                    this.repriceMin = min
                    this.repriceMax = max
                }
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
    },
    filters : {
        filterPrice : function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
    }
    
}
</script>