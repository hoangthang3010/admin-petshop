<template>
    <a @click="scrollTop" v-show="visible" class="bottom-right">
      
        <slot></slot>
        <a class="btn btn-light">
            <font-awesome-icon :icon="['fas', 'angle-double-up']" size="3x" />
            <!-- <i class="fad fa-angle-double-up"></i> -->
        </a>
    </a>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    scrollTop: function () {
      this.intervalId = setInterval(() => {
        if (window.pageYOffset === 0) {
          clearInterval(this.intervalId)
        }
        window.scroll(0, window.pageYOffset - 50)
      }, 20)
    },
    scrollListener: function () {
      this.visible = window.scrollY > 150
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.scrollListener)
  },
  beforeDestroy: function () {
    window.removeEventListener('scroll', this.scrollListener)
  }
}
</script>

<style scoped>
.bottom-right {
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
};
.btn {
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.55);
    padding-top: 27px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 5px;
}
</style>
