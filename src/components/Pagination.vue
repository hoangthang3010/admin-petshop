<template>
    <div class="row" style="width: 100%">
        <div class="row"  style="width: 100%; min-height: 535px">
            <div
                class="col-3"
                 v-for="item in pageOfItems" 
                :key="item.id"
            >
                <div class="product__right__item" >
                    <CardItems :item= item />
                    <!-- <img :src="item.image"/>
                    <router-link 
                        :to="`/purchase/${item.type}/${item.detail}/${item.id-1}`"
                        style="text-decoration: none"
                    > 
                        <p class="product__right__item__name" :title="item.title">{{item.title}}</p>
                    </router-link>
                    <p class="product__right__item__price" :title="item.price">{{item.price | filterPrice}} ₫</p> -->
                </div>
            </div>
        </div>
        <div style="margin: auto">
            <jw-pagination :items="productAll" @changePage="onChangePage" :labels="customLabels" :pageSize="8" :maxPages="4"></jw-pagination>
        </div> 
    </div>
</template>

<script>
const customLabels = {
    first: '❮❮',
    last: '❯❯',
    previous: '❮',
    next: '❯'
};
import CardItems from './CardItems.vue'
export default {
    data() {
        return {
            customLabels,
            pageOfItems: [],
            productAllfilter: [],
        };
    },
    components: {CardItems},
    props: ["productAll"],
    methods: {
        onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems;
        }
    },
    created() {
        // for (var i = 0; i < this.productAll.length; i++) {
        //     if (this.productAllfilter.indexOf(this.productAll[i].price) === -1) {
        //         this.productAllfilter.push(this.productAll[i])
        //     }
        // }
        // console.log(this.productAllfilter);
        // var arr = [{"in":1}, {"in":1}, {"in":2}, {"in":3}, {"in":5}, {"in":3}, {"in":1}, {"in":5}, {"in":6}, {"in":7}, {"in":4}]
        // var newArr = []
        // for (let j = 0; j < arr.length; j++) {
        //     if (newArr.indexOf(arr[j].in) === -1) {
        //     newArr.push(arr[j])
        //     }
        // }
        // console.log(newArr);
    },
    filters : {
        filterPrice : function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
		trimWords(value){
			return value.split(" ").splice(0,20).join(" ") + '...';
		},
        // productAllfilter(data){
        //      return Array.from(new Set(data.title)) //
        // },
    }
};
</script>
<style>
a.page-link{
    color: black  !important;
}
.page-item.active .page-link{
    color: white !important;
    background-color: orange !important;
    border: 1px solid orange !important;
}
</style>
