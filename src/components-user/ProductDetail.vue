<template>
    <div class="productD">
        <div class="card-group"  v-if="productDetail.length!==0">
            <div class="col-9 productD__left" style="padding-bottom: 40px">
                <div class="productD__left__top">
                    <div class="col-6 productD__left__top__image">
                        <img :src="productDetail && productDetail[id].image"/>  
                    </div>
                    <div class="col-6 productD__left__top__info">
                        <h3 class="productD__left__top__info__title">
                            {{ productDetail && productDetail[$route.params.id].title}}
                        </h3>
                        <div class="productD__left__top__info__price">
                            Giá: 
                            <span class="productD__left__top__info__price__1">
                                {{ productDetail && productDetail[$route.params.id].price | filterPrice }} đ
                            </span>
                        </div>
                        <div class="productD__left__top__info__order">
                            <div class="productD__left__top__info__order__count"
                            >
                                <input 
                                    class="productD__left__top__info__order__count--change" 
                                    type="button" 
                                    value="-"
                                    @click="countDown()"
                                >
                                <input 
                                    class="productD__left__top__info__order__count--num" 
                                    type="text"
                                    v-model="count"
                                    @change="handleCount"
                                >
                                <input 
                                    class="productD__left__top__info__order__count--change" 
                                    type="button" 
                                    value="+"
                                    @click="countUp()"
                                >
                            </div>
                            <div 
                                class="productD__left__top__info__order__add"
                                @click="ADD_TO_CART({
                                    id : id, 
                                    title: productDetail[id].title, 
                                    price: productDetail[id].price,
                                    image: productDetail[id].image,
                                    count: count,
                                    name1: $route.params.name1,
                                    name2: $route.params.name2,

                                })"
                                
                            >Thêm vào giỏ hàng</div>
                        </div>
                                    <!-- name: $route.params.name, -->
                        <!-- <div class="productD__left__top__info__capacity">
                            <h1>Công dụng: </h1>
                        </div> -->
                    </div>
                </div>
                
                <md-tabs  class="productD__left__tab">
                    <md-tab id="tab-home" md-label="Mô tả">
                        <div v-if="productDetail[id].product_detail">
                            <div v-for="(item, key) in productDetail[id].product_detail && productDetail[id].product_detail.describe" :key="key">
                                <span style="font-size: 15px; font-weight: 600; color: black">{{item.title}}:</span>
                                <p>{{item.info}}</p>
                            </div>
                        </div>
                        <div v-else>
                            <p>Không có thông tin</p>
                        </div>
                    </md-tab>
                    <md-tab id="tab-pages" 
                            md-label="Hướng dẫn mua hàng và thanh toán"
                    >
                        <p style="font-size: 15px; font-weight: 600; color: black; margin-bottom: 10px !important">Hướng dẫn mua hàng</p>
                        <!-- <p>{{productDetail[id].product_detail && productDetail[id].product_detail.tutorial.purchase}}</p> -->
                        <p style="font-size: 13px;line-height: 20px; margin-bottom: 5px !important">Quý khách truy cập website của chúng tôi xem sản phẩm và lựa chọn sản phẩm cần mua. - Nhấn nút "Thêm vào giỏ hàng" để đưa sản phẩm vào giỏ hàng. - Sau khi đã hoàn tất việc chọn hàng, quý khách vào giỏ hàng để xem (biểu tượng giỏ hàng ngoài cùng bên phải topbar). - Chuyển tới trang thanh toán. - Nhập đầy đủ thông tin cá nhân và thông tin thanh toán vào biểu mẫu. -Kết thúc đơn hàng, quý khách vui lòng chờ nhân viên của chúng tôi điện thoại lại để chốt đơn.</p>
                        <p style="font-size: 15px; font-weight: 600; color: black; margin-bottom: 10px !important">Hướng dẫn thanh toán</p>
                        <!-- <p>{{productDetail[id].product_detail && productDetail[id].product_detail.tutorial.pay}}</p> -->
                        <p style="font-size: 13px;line-height: 20px; margin-bottom: 5px  !important">Hiện tại, chúng tôi mới chỉ cung cấp 2 hình thức thanh toán: (1). nhận hàng thanh toán và (2). thanh toán chuyển khoản. - 1. Quý khách đặt hàng và được nhân viên xác nhận qua cuộc gọi trực tiếp. Qua đó, chúng tôi gửi hàng về cho quý khách thông qua dịch vụ ship COD. Quý khách nhận hàng, kiểm tra hàng và thanh toán trực tiếp cho nhân viên bưu phát. - 2: Quý khách chuyển khoản trước cho chúng tôi qua tài khoản nhân hàng, và chúng tôi sẽ gửi chuyển phát nhanh cho quý khách:</p>
                    </md-tab>
                </md-tabs>
                <div class="productD__left__rate">
                    <p class="productD__left__rate__title">Đánh giá</p>
                    <div class="productD__left__rate__box">
                        <div class="col-3 productD__left__rate__box__left">
                            <span>SAO TRUNG BÌNH</span>
                            <a-rate class="rate-tb" v-model="totalStar" />
                            <!-- <p>{{totalStar}}</p> -->
                            <div>
                            </div>
                        </div>
                        <div class="col-6 productD__left__rate__box__center">
                            <div>
                                <ul>
                                    <li class="row">
                                        <span class="col-2">5 sao</span>
                                        <span class="col-7">
                                            <span class="ratio-star" :style="`width: ${fiveStar.length*100/totalRate.length ? fiveStar.length*100/totalRate.length : 0}%`"></span>
                                        </span>
                                        <span class="col-3">{{fiveStar.length}} đánh giá</span>
                                    </li>
                                    <li class="row">
                                        <span class="col-2">4 sao</span>
                                        <span class="col-7">
                                            <span class="ratio-star" :style="`width: ${fourStar.length*100/totalRate.length ? fourStar.length*100/totalRate.length : 0}%`"></span>
                                        </span>
                                         <!-- > 0 ? fourStar.length : 0 -->
                                        <span class="col-3">{{fourStar.length}} đánh giá</span>
                                    </li>
                                    <li class="row">
                                        <span class="col-2">3 sao</span>
                                        <span class="col-7">
                                            <span class="ratio-star" :style="`width: ${threeStar.length*100/totalRate.length ? threeStar.length*100/totalRate.length : 0}%`"></span>
                                        </span>
                                        <span class="col-3">{{threeStar.length}} đánh giá</span>
                                    </li>
                                    <li class="row">
                                        <span class="col-2">2 sao</span>
                                        <span class="col-7">
                                            <span class="ratio-star" :style="`width: ${twoStar.length*100/totalRate.length ? twoStar.length*100/totalRate.length : 0}%`"></span>
                                        </span>
                                        <span class="col-3">{{twoStar.length}} đánh giá</span>
                                    </li>
                                    <li class="row">
                                        <span class="col-2">1 sao</span>
                                        <span class="col-7">
                                            <span class="ratio-star" :style="`width: ${oneStar.length*100/totalRate.length ? oneStar.length*100/totalRate.length : 0}%`"></span>
                                        </span>
                                         <!-- > 0 ? oneStar.length : 0 -->
                                        <span class="col-3">{{oneStar.length}} đánh giá</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-3 productD__left__rate__box__right">
                            <div>
                                <button class="productD__left__rate__box__right--submit" v-if="!showRate" @click="showRate = !showRate" >Đánh giá</button>
                                 <!-- && checkUserRate < 0 -->
                                <p v-if="showRate && !idUser">Bạn chưa đăng nhập, vui lòng đăng nhập để đánh giá sản phẩm</p>
                                     <!-- && checkUserRate >= 0 -->
                                <div v-if="showRate && idUser">
                                    <div v-if="totalRate.length > 0 && (totalRate.filter(item => item.productId == id && item.userId == idUser).length >  0 && isShowRate)">
                                        <p>Bạn đã đánh giá sản phẩm này {{totalRate.filter(item => item.productId == id && item.userId == idUser)[0].star}} sao</p>
                                        <button class="productD__left__rate__box__right--submit" @click="isShowRate = !isShowRate" >Đánh giá lại</button>
                                    </div><!-- {{checkUserRate}} -->
                                    <!-- {{totalRate.filter(item => item.productId == id && item.userId == idUser).length}}{{isShowRate}} -->
                                    <div v-if="totalRate.filter(item => item.productId == id && item.userId == idUser).length > 0 && !isShowRate || totalRate.filter(item => item.productId == id && item.userId == idUser).length <= 0 && isShowRate || totalRate.length == 0">
                                        <p class="productD__left__rate__box__right__show">
                                            Đánh giá sao
                                        </p>
                                        <div style="margin-bottom: 8px">
                                            <a-rate v-model="rateCount" />
                                        </div>
                                        <button class="productD__left__rate__box__right--cancel" @click="onCancelRate" >Hủy bỏ</button>
                                        <button class="productD__left__rate__box__right--submit" @click="onHandleRate" >Gửi</button>
                                    </div>
                                </div>
                                <button class="productD__left__rate__box__right--submit" v-if="showRate && !idUser" @click="isShowLogin=!isShowLogin" >Đăng nhập</button> 
                            </div>
                        </div>
                    </div>
                </div>
                <!-- {{ totalRate.filter(item => item.productId == id && item.userId == idUser)[0].star}} -->
                <!-- {{totalRate.filter(item => item.productId == id && item.userId == idUser)}} -->
                <div class="productD__left__rate box-comment">
                    <p class="productD__left__rate__title">Bình luận</p>
                    <Comment 
                        class="box-comment-content" 
                        :idUser ="idUser" 
                        :allComment ="allComment" 
                        :id ="id" 
                        @handleComment="handleComment"
                        @handleDeleteComment="handleDeleteComment"
                        @handleEditComment="handleEditComment"
                    />
                </div>
                <div class="productD__left__sale itemproduct__item__right" style="width: 100%; margin-top: 20px;">
                    <p style="font-size: 14px; font-weight: bold">Sản phẩm đang khuyến mãi</p>
                    <VueSlickCarousel 
                        v-bind="settings" 
                        v-if="productDetail.length > 0"
                        style="width: 91%; margin: auto"
                    >
                        <div   
                            class="itemproduct__item__right__top__detail"
                            v-for="(item, key) in productDetail.filter(item => item.sale > 0)" :key="key"
                        >
                            <CardItems :item= item />
                        </div>
                    </VueSlickCarousel>
                </div>
            </div>
            <div class="col-3 productD__right">
                <div class="productD__right__product">
                    <!-- <div> -->
                    <!-- <span class="productD__right__product__title">Sản phẩm</span> -->
                    <!-- </div> -->
                    <div  class="productD__right__product__body">
                        <h2>Sản phẩm</h2>
                        <MultiLevelMenu/>
                    </div>
                </div>
                <div class="productD__right">

                </div>
            </div>
        </div>
        <div class="modal-login" v-if="isShowLogin">
            <div class="display-modal-login" @click="isShowLogin = !isShowLogin"></div>
            <Login :isShowLogin = "isShowLogin" @isShowLogin ="isShowLogin =!isShowLogin"/>
        </div>
    </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import MultiLevelMenu from '../components/MultiLevelMenu.vue'
import Comment from '../components/Comment.vue'
import '../scss/ProductDetail.scss'
import Login from './Login.vue'
import CardItems from './CardItems.vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
// import {API_URL} from '../.env.js'
// import axios from 'axios'
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    name: "ProductDetail",
    components: {MultiLevelMenu, CardItems, VueSlickCarousel, Login, Comment},
    data() {
        return{ 
            productDetail: [],
            showRate: false,
            count: 1,
            id: '',
            // id: Number(this.$route.params.id),
            rateCount: 0,
            idUser: sessionStorage.getItem('id'),
            isShowLogin: false,
            totalStar: '',
            fiveStar: [],
            fourStar: [],
            threeStar: [],
            twoStar: [],
            oneStar: [],
            totalRate: [],
            countRate: {},
            followData: [],
            checkUserRate: -1,
            isShowRate: true,
            allComment: [],
            settings: {
                // "arrows": true,
                // "dots": true,
                // "centerMode": true,
                // "centerPadding": "20px",
                // "rows": 2,q
                "infinite": true,
                "slidesToShow": 4,
                "speed": 500,
                "autoplay": true,
                "autoplaySpeed": 2000,
                "pauseOnDotsHover": true,
                "pauseOnFocus": true,
                "pauseOnHover": true,
                "touchMove": true
            }
        }
    },
    computed: {
        ...mapGetters(['product']),
          
    },
    created(){
        this.fetch()
        this.fetchRateProduct()
        this.fetchCommentProduct()
        this.userRateProduct()
        this.id = Number(this.$route.params.id)
        window.scrollTo(0,0)
    },
    filters : {
        filterPrice : function(data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            // toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
    },
    beforeUpdate(){
        if(this.rateCount){
            this.countRate = {
                productId: Number(this.id),
                star: this.rateCount,
                userId:  this.infoUser.id
            }
        }
    },
    updated(){
        if(this.id != this.$route.params.id){
            window.scrollTo(0,0),
            this.fetchRateProduct()
            this.fetchCommentProduct()
            this.$forceUpdate()
            this.userRateProduct()
        }
        //      window.scrollTo(0,0)
            this.id = Number(this.$route.params.id),
            this.fetchAccountID(),
            this.idUser= sessionStorage.getItem('id')
            this.checkUserRate = this.totalRate.map(item =>{ //kiểm tra xem bạn đã đánh giá sản phẩm này chưa
                        return item.userId;
                    }).indexOf(Number(sessionStorage.getItem('id')));
                    // console.log(this.checkUserRate);
                    // console.log(this.totalRate);
            // this.checkUserRate = this.totalRate.filter(item => item.productId == this.id && item.userId == this.idUser)
    },
    watch: {
        followData(){
            this.fetchRateProduct(),
            this.fetchCommentProduct(),
            this.rateCount = 0;
            this.idUser= sessionStorage.getItem('id')
            // this.$forceUpdate()
        },
    },
    mounted(){},
    methods: {
        ...mapMutations(['ADD_TO_CART']),
        // ADD_TO_CARD(id, title, price, count){
        //     let detail = Object.assign({id},{title}, {price}, {count});
        //     console.log(detail);
        // },
        handleCount(){
            if (!this.count || this.count == 0 || this.count % 1 !== 0) 
                return(
                    this.count = 1
                )
            else 
                return(
                    this.count = Number(this.count)
                )
        },
        onReRate(){
            this.isShowRate = false
        },
        countUp(){
            this.count = this.count + 1;
        },
        countDown(){
            this.count === 1 ? this.count : this.count-=1
        },
        onCancelRate(){
            this.rateCount = 0;
            this.showRate = false
            this.isShowRate = true
        },
        onHandleRate(){
            this.showRate = !this.showRate
            if(this.rateCount > 0){
                if(this.totalRate.filter(item => item.productId == this.id && item.userId == this.idUser).length == 0){
                    this.rateProduct()
                    this.$notification['success']({
                        message: 'Đánh giá sản phẩm thành công',
                        duration: 2,
                        style: {
                            marginTop: `75px`,
                            marginBottom: '-50px'
                        },
                    })
                    this.isShowRate = true
                }
                else{
                    this.userRateProduct()
                    this.$notification['success']({
                        message: 'Đánh giá sản phẩm thành công',
                        duration: 2,
                        style: {
                            marginTop: `75px`,
                            marginBottom: '-50px'
                        },
                    })
                    this.isShowRate = true
                    // console.log('hkjhkjk');
                }
            }
            else{
                this.showRate = true
                this.$notification['error']({
                    message: 'Đánh giá sao thất bại',
                    description:
                    'Vui lòng chọn số sao cần đánh giá',
                    duration: 2,
                    style: {
                        marginTop: `75px`,
                        marginBottom: '-50px'
                    },
                });
            }
        },
        handleComment(){
            if(this.userId || sessionStorage.getItem('id')) this.fetchCommentProduct()
            else this.isShowLogin=!this.isShowLogin
        },
        handleDeleteComment(){
            this.fetchCommentProduct()
        },
        handleEditComment(){
            this.fetchCommentProduct()
        },
        async fetch(){
            const {data} = await PostsRepository.getProductDetail();
            this.productDetail = data
        },
        async fetchRateProduct(){
            const {data} = await PostsRepository.getRateProduct();
            this.totalRate = data.filter(item => item.productId == this.$route.params.id)
            if(this.totalRate.length>0){
                this.oneStar = this.totalRate.filter(item => item.star == 1)
                this.twoStar = this.totalRate.filter(item => item.star == 2)
                this.threeStar = this.totalRate.filter(item => item.star == 3)
                this.fourStar = this.totalRate.filter(item => item.star == 4)
                this.fiveStar = this.totalRate.filter(item => item.star == 5)
                this.totalStar = (this.oneStar.length + 2*this.twoStar.length + 3*this.threeStar.length + 4*this.fourStar.length + 5*this.fiveStar.length) / this.totalRate.length
            }
            else{
                this.oneStar  = []
                this.twoStar = []
                this.threeStar = []
                this.fourStar = []
                this.fiveStar = []
                this.totalStar =  []
                this.totalRate = []
            }
        },
        async rateProduct(){
            const {data} = await PostsRepository.createRateProduct(this.countRate);
            this.followData = data
            // this.$forceUpdate()
        },
        async fetchAccountID(){
            const {data} = await PostsRepository.getAccountId(this.idUser);
            this.infoUser = data
            this.$bus.emit('infoUser', this.infoUser)
        },
        async userRateProduct(){
            const {data} = await PostsRepository.updateUserRateProduct(this.totalRate.filter(item => item.productId == this.id && item.userId == this.idUser)[0].id, this.countRate);
            this.followData = data
        },
        async fetchCommentProduct(){
            const {data} = await PostsRepository.getCommentProduct();
            this.allComment = data.filter(item => item.productId == this.$route.params.id)
        }
    }
}
</script>