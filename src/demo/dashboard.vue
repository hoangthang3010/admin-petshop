<template>
    <div class="dashboard">
        <div class="dashboard__menu">
            <div class="dashboard__menu__title">
                <img class="dashboard__menu__title__image" :src="logo" alt="">
            </div>
        </div>
        <div class="dashboard__children">
            <div class="dashboard__children__top">
                <div class="dashboard__children__top__titleLeft">
                    Trang chủ
                </div>
                <div class="dashboard__children__top__titleRight">
                    <!-- hi -->
                    <div class="dashboard__children__top__titleRight__listicon">
                        <div class="dashboard__children__top__titleRight__listicon__icon">
                            <font-awesome-icon 
                            :icon="['fas', 'home']" 
                            size="2x" 
                            color="white"
                            />
                        </div>
                        <div class="dashboard__children__top__titleRight__listicon__icon">
                            <font-awesome-icon 
                            :icon="['fas', 'user']" 
                            size="2x" 
                            color="white"
                            />
                        </div>
                        <div class="dashboard__children__top__titleRight__listicon__icon">
                            <font-awesome-icon 
                            :icon="['fas', 'sign-out-alt']" 
                            size="2x" 
                            color="white"
                            /></div>
                    </div>
                </div>
            </div>
            <div class="dashboard__children__body">
                <div class="dashboard__children__body__title">
                    <div class="dashboard__children__body__title__left">
                        <span class="dashboard__children__body__title__left--time">Thời gian</span>
                    </div>
                    <div 
                        class="dashboard__children__body__title__right" 
                        @click="show"
                        :style="`background: ${isShow ===true ? '#f3f3f3' : ''}`"
                    >
                        <div class="dashboard__children__body__title__right__seven">
                            <span class="dashboard__children__body__title__right__seven__num">7 ngày</span> 
                            <span 
                                class="dashboard__children__body__title__right__seven__icon"
                                :style="`transform: ${ isShow ===  true ? 'rotate(180deg)' : ''}`"
                            >
                                <font-awesome-icon
                                    :icon="['fas', 'angle-down']" 
                                    color="#939393"
                                />
                            </span>
                        </div>
                        <ul class="dashboard__children__body__title__right__range" v-show="isShow">
                            <li class="dashboard__children__body__title__right__range__li">Hôm nay</li>
                            <li class="dashboard__children__body__title__right__range__li">Hôm qua</li>
                            <li class="dashboard__children__body__title__right__range__li">7 ngày</li>
                            <li class="dashboard__children__body__title__right__range__li">28 ngày</li>
                        </ul>
                    </div>
                </div>
                <div class="dashboard__children__body__count row">
                    <div class="dashboard__children__body__count__item col-4">
                        <div class="dashboard__children__body__count__item__box count-through">
                            <div class="dashboard__children__body__count__item__box__right">
                                <font-awesome-icon
                                    :icon="['fas', 'walking']" 
                                    color="white"
                                    size="4x"
                                />
                            </div>
                            <div class="dashboard__children__body__count__item__box__left">
                                <p class="dashboard__children__body__count__item__box__left__title">Số lượng người đi qua</p>
                                <p class="dashboard__children__body__count__item__box__left__amount">5828 người</p>
                                <p class="dashboard__children__body__count__item__box__left__ratio">
                                    <font-awesome-icon
                                        :icon="['fas', 'level-up-alt']" 
                                        color="white"
                                    /> 37%</p>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard__children__body__count__item col-4">
                        <div class="dashboard__children__body__count__item__box count-in">
                            <div class="dashboard__children__body__count__item__box__right">
                                <font-awesome-icon
                                    :icon="['fas', 'person-booth']" 
                                    color="white"
                                    size="4x"
                                />
                            </div>
                            <div class="dashboard__children__body__count__item__box__left">
                                <p class="dashboard__children__body__count__item__box__left__title">Số lượng người đi vào</p>
                                <p class="dashboard__children__body__count__item__box__left__amount">5828 người</p>
                                <p class="dashboard__children__body__count__item__box__left__ratio">
                                    <font-awesome-icon
                                        :icon="['fas', 'level-down-alt']" 
                                        color="white"
                                    /> 289%</p>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard__children__body__count__item col-4">
                        <div class="dashboard__children__body__count__item__box conversion-rate">
                            <div class="dashboard__children__body__count__item__box__right">
                                <font-awesome-icon
                                    :icon="['fas', 'exchange-alt']" 
                                    color="white"
                                    size="4x"
                                />
                            </div>
                            <div class="dashboard__children__body__count__item__box__left">
                                <p class="dashboard__children__body__count__item__box__left__title">Tỉ lệ chuyển đổi</p>
                                <p class="dashboard__children__body__count__item__box__left__amount">78%</p>
                                <p class="dashboard__children__body__count__item__box__left__ratio">
                                    <!-- <font-awesome-icon
                                        :icon="['fas', 'level-down-alt']" 
                                        color="white"
                                    /> -->
                                     0%</p>
                            </div>
                        </div>
                    </div> 
                </div>
                <div>
                    <p>Lượng người ra/vào cửa hàng ngày gần nhất</p>
                </div>
                <div class="dashboard__children__body__list-shop">
                    <p class="dashboard__children__body__list-shop__title" @click="showTable">Các cửa hàng</p>
                    <div class="dashboard__children__body__list-shop__box" v-show="isShowTable">
                        <table class="dashboard__children__body__list-shop__box__table">
                            <tr class="dashboard__children__body__list-shop__box__table__tr">
                                <th class="dashboard__children__body__list-shop__box__table__tr__th">Tên của hàng</th>
                                <th class="dashboard__children__body__list-shop__box__table__tr__th">Lượng người đi qua &darr;&uarr;</th>
                                <th class="dashboard__children__body__list-shop__box__table__tr__th">Lượng người đi vào &darr;&uarr;</th>
                                <th class="dashboard__children__body__list-shop__box__table__tr__th">Thời gian TB trong 1 khu vực &darr;&uarr;</th>
                                <th class="dashboard__children__body__list-shop__box__table__tr__th">Tỉ lệ chuyển đổi lượng người đi ra/vào &darr;&uarr;</th>
                            </tr>
                            <tr class="dashboard__children__body__list-shop__box__table__tr">
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">coop-mart</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">5828</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">4578</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">4s</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">78</td>
                            </tr>
                            <tr class="dashboard__children__body__list-shop__box__table__tr">
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">vin-mart</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">3453</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">2463</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">8s</td>
                                <td class="dashboard__children__body__list-shop__box__table__tr__td">67</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="dashboard__children__body__analytics row">
                    <div class="dashboard__children__body__analytics__box col-6">
                        <div class="dashboard__children__body__analytics__box__border">   
                            <p class="dashboard__children__body__analytics__box__border__title sex">Tỉ lệ giới tính tại chuỗi cửa hàng</p>
                            <div class="dashboard__children__body__analytics__box__border__chart row">
                                <div class="dashboard__children__body__analytics__box__border__chart__right col-10">
                                </div>
                                <div class="dashboard__children__body__analytics__box__border__chart__left col-2">
                                    <span>
                                    <font-awesome-icon
                                        :icon="['fas', 'bowling-ball']" 
                                        color="#008FFB"
                                        size="1x"
                                    />Nam</span>
                                    <span>
                                    <font-awesome-icon
                                        :icon="['fas', 'bowling-ball']" 
                                        color="#00E396"
                                        size="1x"
                                    />Nữ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard__children__body__analytics__box col-6">
                        <div class="dashboard__children__body__analytics__box__border">  
                            <p class="dashboard__children__body__analytics__box__border__title reaction">Tỉ lệ cảm xúc tại chuỗi cửa hàng</p>
                            <div class="dashboard__children__body__analytics__box__border__chart">
                                <div class="dashboard__children__body__analytics__box__border__chart__right">
                                </div>
                                <div class="dashboard__children__body__analytics__box__border__chart__left">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './dashboard.scss'
import logo from '../../public/picture/vue-logo.png'
export default {
    data(){
        return{
            logo,
            isShow: false,
            isShowTable: true
        }
    },
    methods:{
        show(){
            this.isShow = !this.isShow
        },
        showTable(){
            this.isShowTable = !this.isShowTable
        }
    }
}
</script>

