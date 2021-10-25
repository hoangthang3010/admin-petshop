<template>
    <div class="dashboard">
        <div class="box-top row">
            <div class="col-3 item-box-top" style="background-color: #008E97">
                <div class="title-box">
                    <font-awesome-icon 
                    :icon="['fa', 'users']" 
                    size="4x" 
                    color="white"
                    />
                    <span>Số lượng tài khoản khách hàng</span>
                </div>
                <div class="number-box">
                    <span class="number">{{productAll.length}}</span>
                    <span class="text"> người</span>
                </div>
            </div>
            <div class="col-3 item-box-top" style="background-color: #F58220">
                <div class="title-box">
                    <font-awesome-icon 
                    :icon="['fa', 'dolly-flatbed']" 
                    size="4x" 
                    color="white"
                    />
                    <span>Số lượng sản phẩm hiện có</span>
                </div>
                <div class="number-box">
                    <span class="number">{{accountAll.length}}</span>
                    <span class="text"> sản phẩm</span>
                </div>
            </div>
            <div class="col-3 item-box-top" style="background-color: #57BF98">
                <div class="title-box">
                    <font-awesome-icon 
                    :icon="['fa', 'comment-alt']" 
                    size="4x" 
                    color="white"
                    />
                    <span>Số lượng bình luận sản phẩm</span>
                </div>
                <div class="number-box">
                    <span class="number">{{allCommentProduct.length}}</span>
                    <span class="text"> bình luận</span>
                </div>
            </div>
            <div class="col-3 item-box-top" style="background-color: #E3624F">
                <div class="title-box">
                    <font-awesome-icon 
                    :icon="['fa', 'star']" 
                    size="4x" 
                    color="white"
                    />
                    <span>Số lượng đánh giá sản phẩm</span>
                </div>
                <div class="number-box">
                    <span class="number">{{allRateProduct.length}}</span>
                    <span class="text"> đánh giá</span>
                </div>
            </div>
        </div>
        <div class="order">
            <h3 style="background-color: #664F68; padding: 4px 10px; color: white">Đơn hàng</h3>
            <div class="item-in-order row">
                <div class="box col-6">
                    <h4 class="title">Doanh số bán hàng trong 12 tháng</h4>
                    <apexchart width="500" type="bar" :options="optionsBar" :series="seriesBar"></apexchart>
                    <!-- <div>
                        <div>tổng</div>
                        <div>{{accountAll.length}}</div>
                    </div> -->
                </div>
                <div class="col-6 bestseller">
                    <h4 class="title">Top 5 sản phẩm bán chạy</h4>
                    <div>
                        <table>
                            <tr class="row">
                                <th class="col-1">Top</th>
                                <th class="col-9">ID - Tên sản phẩm</th>
                                <th class="col-2">Số lượng</th>
                            </tr>
                            <tr class="row" v-for="(item, key) in bestSeller.length > 5 ? bestSeller.slice(0,5) : bestSeller" :key="key">
                                <td class="col-1">{{key+1}}</td>
                                <td class="col-9">{{item.idProduct}} - {{productAll.filter(item1 => item1.id == item.idProduct)[0].title}}</td>
                                <td class="col-2">{{item.total}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="order">
            <h3 style="background-color: #664F68; padding: 4px 10px; color: white">Người dùng</h3>
            <div class="item-in-order row">
                <div class="box col-6">
                    <h4 class="title">Tỉ lệ giới tính</h4>
                    <apexchart width="380" type="donut" :options="optionsDonut" :series="seriesDonut"></apexchart>
                    <div class="total-sex">
                        <div>Tổng</div>
                        <span>{{accountAll.length}} người dùng</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class=" bestseller">
                        <h4 class="title">Top 5 khách hàng thân thiện</h4>
                        <div>
                            <table>
                                <tr class="row">
                                    <th class="col-2">Top</th>
                                    <th class="col-6">ID - Tên sản phẩm</th>
                                    <th class="col-4">Số tiền</th>
                                </tr>
                                <tr class="row" v-for="(item, key) in bestCustomer.length > 5 ? bestCustomer.slice(0,5):bestCustomer" :key="key">
                                    <td class="col-2">{{key+1}}</td>
                                    <td class="col-6">{{item.idUser}} - {{accountAll.filter(item1 => item1.id == item.idUser)[0].username}}</td>
                                    <td class="col-4">{{item.total | filterPrice}}đ</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import ApexCharts from 'apexcharts'
import VueApexCharts from 'vue-apexcharts'
// import LineChart from 'vue-chartjs'
import './dashboard.scss'
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
    export default {
        components: {apexchart: VueApexCharts, },
        data() {
            return {
                productAll: [],
                allCommentProduct: [],
                accountAll: [],
                allOrder: [],
                allRateProduct: [],
                loaded: false,
                chartdata: null,
                amountProductOrder: '',
                optionsDonut: {
                    labels: ['Nam', 'Nữ', 'Khác'],
                    plotOptions: {
                        pie: {
                            customScale: 0.8,
                        }
                    }
                },
                seriesDonut: [null, null, null],
                year: new Date().getFullYear(),
                optionsBar: {
                    chart: {
                        id: 'vuechart-example',
                    },
                    xaxis: {
                        categories: ['', 'T2/2021', 'T3/2021', 'T4/2021', 'T5/2021', 'T6/2021', 'T7/2021', 'T8/2021', 'T9/2021', 'T10/2021', 'T11/2021', 'T12/2021'],
                    },
                },
                seriesBar: [{
                    name: 'series-1',
                    data: [null,null,null,null,null,null,null,null,null,null,null,null]
                }],
                increase: {
                    fn: (a, b) => (b.total - a.total)
                },
                bestSeller: [],
                bestCustomer: []
            }
        },
        created(){
            this.getOrder()
            this.getProductDetail()
            this.getCommentProduct()
            this.getAccount()
            this.getRateProduct()      
            this.optionsBar.xaxis.categories = ['T1/' + this.year, 'T2/' + this.year, 'T3/' + this.year, 'T4/' + this.year, 'T5/' + this.year, 'T6/' + this.year, 'T7/' + this.year, 'T8/' + this.year, 'T9/' + this.year, 'T10/' + this.year, 'T11/' + this.year, 'T12/' + this.year]
        },
        mounted(){
        },
        methods: {
            async getProductDetail(){
                const {data} = await PostsRepository.getProductDetail();
                this.productAll = data
            },
            async getCommentProduct(){
                const {data} = await PostsRepository.getCommentProduct();
                this.allCommentProduct = data
            },
            async getAccount(){
                const {data} = await PostsRepository.getAccount();
                this.accountAll = data
                this.seriesDonut = [data.filter(item => item.sex == 0).length, data.filter(item => item.sex == 1).length,  data.filter(item => item.sex == 2).length]
            },
            async getOrder(timeS, timeE){
                const {data} = await PostsRepository.getOrder();
                if(timeS && timeE){
                    this.allOrder = data.filter(item => item.dateOrder > timeS && item.dateOrder < timeE)
                }
                else this.allOrder = data
                let newData = [
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 1).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 2).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 3).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 4).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 5).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 6).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 7).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 8).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 9).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 10).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 11).length,
                    this.allOrder.filter(item=>item.dateOrder.slice(5,7) == 12).length
                    ]
                this.seriesBar = [{
                    name: 'Đơn hàng',
                    data:  newData
                }]
                const newArr = this.allOrder.map(el => {return el.listProductOrder}).flat(2)
                const result = Object.values(newArr.reduce((acc,{idProduct, amount})=> {
                    acc[idProduct] = acc[idProduct] || {idProduct: idProduct, total: 0};
                    acc[idProduct].total += amount
                    return acc
                }, {}))
                this.bestSeller = result.sort(this.increase.fn)
                const result1 = Object.values(this.allOrder.reduce((acc,{idUser, total},key, arr) => {
                    if (arr[key].statusOrder == "done"){
                        acc[idUser] = acc[idUser] || {idUser: idUser, total: 0};
                        acc[idUser].total += total;
                    }
                        return acc;
                },{}))
                this.bestCustomer = result1
            },
            async getRateProduct(){
                const {data} = await PostsRepository.getRateProduct();
                this.allRateProduct = data
            }
        },
        filters: {
            filterPrice: function (data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
        },
    }
</script>

<style scoped>

</style>