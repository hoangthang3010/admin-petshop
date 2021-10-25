<template>
  <div class="app">
      {{series[0].data}}
      <!-- {{Number(allOrder[1].dateOrder.slice(5,7))}} -->
    <apexcharts width="500" type="bar" :options="chartOptions" :series="series"></apexcharts>
    <!-- <div>
      <button @click="updateChart">Update!</button>
    </div> -->
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
  name: 'Chart',
  components: {
    apexcharts: VueApexCharts,
  },
  data: function() {
      // const year = new Date().getFullYear()
      return {
        year: new Date().getFullYear(),
        chartOptions: {
          chart: {
            id: 'vuechart-example',
          },
          xaxis: {
            categories: ['', 'T2/2021', 'T3/2021', 'T4/2021', 'T5/2021', 'T6/2021', 'T7/2021', 'T8/2021', 'T9/2021', 'T10/2021', 'T11/2021', 'T12/2021'],
          },
        },
        series: [{
          name: 'series-1',
          data: ['null','null','null','null','null','null','null','null','null','null','null','null']
        }],
                allOrder: [],
      }
    },
    created(){
            this.getOrder()
      this.chartOptions.xaxis.categories = ['T1/' + this.year, 'T2/' + this.year, 'T3/' + this.year, 'T4/' + this.year, 'T5/' + this.year, 'T6/' + this.year, 'T7/' + this.year, 'T8/' + this.year, 'T9/' + this.year, 'T10/' + this.year, 'T11/' + this.year, 'T12/' + this.year]
      
      // setTimeout(() => {
          // console.log('áds; ' + this.series[0].data);
      // }, 1000);
    },
    updated(){},
    mounted(){},
    methods: {
      updateChart() {
        const max = 90;
        const min = 20;
        const newData = this.series[0].data.map(() => {
          return Math.floor(Math.random() * (max - min + 1)) + min
        })
        // In the same way, update the series option
        this.series = [{
          data: newData
        }]
      },
            async getOrder(){
                const {data} = await PostsRepository.getOrder();
                this.allOrder = data
                this.series[0].data = [
                    10,
                    data.filter(item=>item.dateOrder.slice(5,7) == 2).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 3).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 4).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 5).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 6).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 7).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 8).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 9).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 10).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 11).length,
                    data.filter(item=>item.dateOrder.slice(5,7) == 12).length,
                  ]
            },
    }
}
</script>
<style scoped>
  button {
    background: #26E6A4;
    border: 0;
    font-size: 16px;
    color: '#fff';
    padding: 10px;
    margin-left: 28px;
  }
</style>