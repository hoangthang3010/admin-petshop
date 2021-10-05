<template>
    <vue-displacement-slideshow
            :images="images"
            displacement="require('../assets/6.png')"
            :intensity="0.2"
            :speedIn="1.4"
            :speedOut="1.4"
            ease="expo.out"
            ref="slideshow">
    </vue-displacement-slideshow>
</template>

<script>
    import VueDisplacementSlideshow from "vue-displacement-slideshow";

    export default {
      data(){
        return{
          slide: 0
        }
      },
        components: {
            VueDisplacementSlideshow,
        },
        computed: {
            images() {
                return [
                    require("../assets/1.jpg"),
                    require("../assets/2.jpg"),
                    require("../assets/3.png"),
                    require("../assets/4.jpg"),
                ];
            }
        },
        methods: {
            init() {
                //We loop through all our images by calling the 'next' method of our component every 2 seconds
                this.slide = setInterval(() => {
                    this.$refs.slideshow.next();
                }, 2000);
            }
        },
        beforeDestroy () {
            clearInterval(this.slide)
        },
        mounted() {
            this.init();
        }
    };
</script>