<template>
    <div class="dropproduct">
        <div 
        class="dropproduct__drop" 
            @mouseleave="onHandleDisShowDrop()"
        >
            <div 
                class="dropproduct__drop__item" 
                style="min-width: 168px"
            >
                <div
                    :style="`background-color: ${id===key ? '#eaedf3' : ''}`"
                    class="dropproduct__drop__item__box  dropright"
                    v-for="(item, key) in product" 
                    :key="key"
                    @mouseenter="onHandleShowDrop1(key, item.name)"
                    @mouseleave="onHandleDisShowDrop1(key)"
                >
                    <router-link style="color: black" :to ="`/product/${item.name}`">
                        {{item.title}}
                        <p 
                            class="dropproduct__drop__item__box__icon" 
                            v-if="item.type.length>1"
                            :style="`background-color: ${id===key ? '#eaedf3' : ''}`"
                        >&rsaquo;</p>
                    </router-link>
                </div>
            </div>
            <div
                    :style="`boxShadow: ${id1 !== null ?  '-1px 0px 3px #888888' : 'none'}`"
                    class="dropproduct__drop__right" v-if="id !==null"
            >
                <div
                    class="dropproduct__drop__right__box  dropright"
                    v-for="(item, key) in product[id].type" 
                    :key="key"
                    @mouseenter="onHandleShowDrop2(key)"
                >
                    <router-link style="color: black;" :to ="`/product/${name}/${item.name}`">
                        {{item.title}}
                    </router-link>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>
import {API_URL} from '../.env.js'
import axios from 'axios'
import '../scss/DropProduct.scss'
export default {
    name: "DropProduct",
    data() {
        return{
            showDrop: null,
            showDrop1: null,
            id: null,
            id1: null,
            name: null,
            product: [],
            productDetail: [],
            bestselling: [],
        }
    },
    methods:{
        onHandleShowDrop1(index, name){
            this.name= name
            this.showDrop = index
            this.id = index
        },
        onHandleShowDrop2(index){
            this.id1 = index
            console.log(index);
        },
        onHandleDisShowDrop(){
            this.id = null
        },
        onHandleDisShowDrop1(){
            // this.name = null
            // this.id = key
        }
    },
    created () {
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