<template>
    <div class="infouser">
        <div class="infouser__body">
            <div class="infouser__body__left col-3">
                <div class="infouser__body__left__profile">
                    <img class="col-3" src="ádaSD" alt="dsdf"/>
                    <div class="col-9">
                        <h4>hoangthang3010</h4>
                        <p @click="showProfile">Sửa hồ sơ</p>
                    </div>
                </div>
                <hr/>
                <div class="infouser__body__left__menu">
                    <span 
                        onMouseOver="this.style.color='red'" 
                        onMouseOut="this.style.color='black'"
                        @click="showProfile"
                    >
                        Tài khoản của tôi
                    </span>
                </div>
                <div class="infouser__body__left__menu">
                    <span 
                        onMouseOver="this.style.color='red'" 
                        onMouseOut="this.style.color='black'"
                        @click="showSale"
                    >
                        Đơn mua
                    </span>
                </div>
                <div class="infouser__body__left__menu">
                    <span 
                        onMouseOver="this.style.color='red'" 
                        onMouseOut="this.style.color='black'"
                        @click="showNotification"
                    >
                        Thông báo
                    </span>
                </div>
                <button class="infouser__body__right--save" @click="logout">Đăng xuất</button>
                <span class="infouser__body__right--forget" @click="forget">Đổi mật khẩu</span>
            </div>
            <div class="infouser__body__right col-9" v-if="showRight === 'profile'">
                <div class="infouser__body__right__title">
                    <h4>Hồ Sơ Của Tôi</h4>
                    <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>  
                <hr/>
                <div class="infouser__body__right__bottom">
                    <div class="col-8">
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Tên đăng nhập</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                <input v-model="user.username" class="infouser__body__right__bottom__info__iright--input" type="text">
                            </td>
                        </tr>
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Tên</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                <input v-model="user.fullname" class="infouser__body__right__bottom__info__iright--input" type="text">
                            </td>
                        </tr>
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Email</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                <input v-model="user.email" class="infouser__body__right__bottom__info__iright--input" type="text">
                            </td>
                        </tr>
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Số điện thoại</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                <input v-model="user.phonenumber" class="infouser__body__right__bottom__info__iright--input" type="text">
                            </td>
                        </tr>
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Giới tính</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                <div class="infouser__body__right__bottom__info__iright--radio">
                                    <input type="radio" name="sex" id="orther" v-model="user.sex" value="2"><label for="orther">Khác</label>
                                    <input type="radio" name="sex" id="male" v-model="user.sex" value="0"><label for="male">Nam</label>
                                    <input type="radio" name="sex" id="female" v-model="user.sex" value="1"><label for="female">Nữ</label>
                                </div>&nbsp;
                            </td>
                        </tr>
                        <tr class="infouser__body__right__bottom__info row">
                            <td class="infouser__body__right__bottom__info__ileft col-3">Ngày sinh</td>
                            <td class="infouser__body__right__bottom__info__iright col-9">
                                    <date-picker style="width: 100%" v-model="user.birthday" valueType="format"></date-picker>
                            </td>
                        </tr>
                    </div>
                    <div class="infouser__body__right__bottom__image col-4">
                        <!-- <div class="infouser__body__right__bottom__"> -->
                            <div class="infouser__body__right__bottom__image__avatar">
                                <img src="sdfgsdf" alt="sdfsdf">
                            </div>
                            <button>Chọn ảnh</button>
                        <!-- </div> -->
                    </div>
                </div>
                <button class="infouser__body__right--save" @click="saveInfo">Lưu</button>
            </div>
            <SaleUser v-if="showRight === 'sale'"/>
            <NotificationUser v-if="showRight === 'notification'"/>
            <div class="infouser__body__right col-9" v-if="showRight === 'forget'">
                <div class="infouser__body__right__title">
                    <h4>Mật khẩu</h4>
                    <p>Thay đổi mật khẩu</p>
                </div>
                <hr/>
                <div class="infouser__body__right__forget">
                    <p class="infouser__body__right__forget__title">Mật khẩu cũ</p>
                    <input
                        v-model="oldPassword"
                        class="infouser__body__right__forget--input" 
                        type="text"
                    >
                    <p class="infouser__body__right__forget__title">Mật khẩu mới</p>
                    <input
                        v-model="password"
                        class="infouser__body__right__forget--input" 
                        type="text"
                    >
                    <p class="infouser__body__right__forget__title">Nhập lại mật khẩu mới</p>
                    <input 
                        v-model="rePassword"
                        class="infouser__body__right__forget--input" 
                        type="text"
                    >
                    <button class="infouser__body__right__forget--change" @click="change">
                        Thay đổi
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '../scss/InfoUser.scss'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import SaleUser from '../components/SaleUser.vue'
import { mapGetters } from 'vuex'
// import firebase from "firebase";
import { mapActions } from "vuex";
import NotificationUser from '../components/NotificationUser.vue'
export default {
    data(){
        return{
            user:{
                email: this.$store.getters.getUser.email,
                phonenumber: '',
                username: '',
                fullname: this.$store.getters.getUser.displayName,
                sex: '',
                birthday: ''
            },
            id: sessionStorage.getItem('id'),
            date: new Date(),
            allAccount: [],
            checkUsername: 0,
            checkEmail: 0,
            showRight: 'profile',
            oldPassword: '',
            password: '',
            rePassword: ''
        }
    },
    components: { DatePicker, SaleUser, NotificationUser},
    computed: mapGetters(["getUser"]),
    methods:{
        ...mapActions(["signOutAction"]),
        logout(){
            this.signOutAction();
            // this.$router.push("/"),
            // this.$bus.emit('increaseCounter', null),
            // sessionStorage.removeItem('id')
            // firebase.auth().signOut().then(() => {
            // }).catch((error) => {
            //     console.log(error);
            // });
        },
        saveInfo(){},
        showProfile(){
            this.showRight = 'profile'
        },
        showSale(){
            console.log(123);
            this.showRight = 'sale'
        },
        forget(){
            this.showRight = 'forget'
        },
        showNotification(){
            this.showRight = 'notification'
        },
    }
}
</script>