<template>
    <div class="sliderrange">
        <vue-slider
            v-model="value"
            :min="min"
            :max="max" 
            :bg-style="bgStyle" 
            :tooltip-style="tooltipStyle" 
            :process-style="processStyle"
            :tooltip-formatter="formatter"
            @dragging="change"
            :tooltip="'always'"
        />
        
            <!-- :marks="[priceMin, priceMax]" -->
        <p class="product__left__filterprice__price">
            Giá từ: {{priceMin | filterPrice}} ₫ - {{priceMax | filterPrice}} ₫
        </p>
        <!-- {{value[0]}} --- {{value[1]}} -->
        <!-- {{value}} -->
        <!-- <p >
            {{priceMin}} - {{priceMax}}</p> -->
            <!-- {{valueRange}} -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            value: [0,0]
        }
    },
    props: ['priceMax', 'priceMin'],
    methods:{
        change(){
            console.log(this.value[0]);
            console.log(this.value[1]);
            this.$emit('rePriceMax', this.value[1]),
            this.$emit('rePriceMin', this.value[0])
        }
    },
    // computed:{
    //     valueRange(){
    //         return this.value
    //     }
    // },
    created() {
        this.formatter = value => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`
        this.min = this.priceMin
        this.max = this.priceMax
        this.enableCross = false
        this.value = [this.priceMin,this.priceMax]
        this.bgStyle = {
            backgroundColor: '#999 !important',
            boxShadow: 'inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)'
        }
        this.tooltipStyle = {
            backgroundColor: 'orange',
            borderColor: 'orange',
            // color: 'orange'
            // display: 'none'
        }
        this.processStyle = {
            backgroundColor: 'orange',
            height: '100%' 
        } 
    },
    beforeUpdate(){
        this.min=this.priceMin 
        this.max= this.priceMax
        this.value= [this.priceMin,this.priceMax]
    },
    // mouted:{
        
    //     change(){
    //         console.log(this.value[0]);
    //         console.log(this.value[1]);
    //         this.$emit('rePriceMax', this.value[1]),
    //         this.$emit('rePriceMin', this.value[0])
    //     }
    // },
    filters : {
        filterPrice : function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    },
}
</script>
<style>
span.vue-slider-dot-tooltip-text{
    background-color: orange !important  ;
}
/* .vue-range-slider.slider-component .slider .slider-piecewise {
    height: 0% !important;
} */
/* .vue-range-slider.slider-component .slider{
    width: 100%;
} */
</style>