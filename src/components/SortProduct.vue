<template>
    <div class="sort">
        <ul class="sort__dropdown">
            <li class="sort__dropdown__title">Sắp xếp theo tên</li>
            <li class="sort__dropdown__btn">
                <button
                    class="sort__dropdown__btn--submit"
                    @click="onHandleSortAZ" 
                    style="background: white, border: white"
                >
                    Từ A-Z &uarr;
                </button>
                <button
                    class="sort__dropdown__btn--submit"
                    @click="onHandleSortZA" 
                    style="background: 'white', border: white"
                >
                    Từ Z-A &darr;
                </button>
            </li>
            <li class="sort__dropdown__title" style="margin-top: 10px">Sắp xếp theo giá</li>
            <li>
                <button  
                    class="sort__dropdown__btn--submit"
                    @click="onHandleSortUp" 
                    style="background: white, border: white"
                >
                    Thấp- Cao &uarr;
                </button>
                <button
                    class="sort__dropdown__btn--submit"
                    @click="onHandleSortDown"  
                    style="background: white, border: white"
                >
                    Cao - Thấp &darr;
                </button>
            </li>
        </ul>
    </div>
</template>
<script>
import '../scss/SortProduct.scss'
export default {
    methods:{
        onHandleSortAZ(){
            this.$emit('onHandleSortAZ', 'az')
        },
        onHandleSortZA(){
            this.$emit('onHandleSortZA', 'za')
        },
        onHandleSortUp(){
            this.$emit('onHandleSortUp', 'increase')
        },
        onHandleSortDown(){
            this.$emit('onHandleSortDown', 'reduction')
        }
    }
}
</script>