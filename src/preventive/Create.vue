<template>
    <div class="creaccuser">
        <h3 class="creaccuser__title">Đăng kí tài khoản</h3>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Tên đăng nhập</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="username.text" @change="onHandlUsername" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="username.err">Vui lòng nhập tên đăng nhâp</p>
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="username.err1">Tên đăng nhập đã tồn tại</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Tên</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="fullname.text" @change="onHandlFullname" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="fullname.err">Vui lòng nhập tên của bạn</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Email</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="email.text" @change="onHandlEmail" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="email.err">Vui lòng nhập email</p>
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="email.err1">Email không đúng định dạng</p>
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="email.err2">Email đã tồn tại</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Số điện thoại</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="phonenumber.text" @change="onHandlPhonenumber" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="phonenumber.err">Vui lòng nhập số điện thoại</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Giới tính</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <div class="infouser__body__right__bottom__info__iright--radio">
                    <input type="radio" name="sex" id="male" v-model="sex.text" value="0"><label for="male">Nam</label>
                    <input type="radio" name="sex" id="female" v-model="sex.text" value="1"><label for="female">Nữ</label>
                    <input type="radio" name="sex" id="orther" v-model="sex.text" value="2"><label for="orther">Khác</label>
                </div>&nbsp;
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="sex.err">Vui lòng chọn giới tính</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Ngày sinh</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <date-picker style="width: 100%" v-model="birthday.text" valueType="format"></date-picker>
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="birthday.err">Vui lòng chọn ngày sinh</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Mật khẩu</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="password.text" @change="onHandlPassword" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="password.err">Vui lòng nhập mật khẩu</p>
            </td>
        </tr>
        <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">Nhập lại mật khẩu</td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                <input :value="repassword.text" @change="onHandlRePassword" class="infouser__body__right__bottom__info__iright--input" type="text">
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="repassword.err">Vui lòng nhập lại mật khẩu</p>
                <p class="infouser__body__right__bottom__info__iright__noti" v-show="repassword.err1">Mật khẩu không khớp</p>
            </td>
        </tr>
        <!-- <tr class="infouser__body__right__bottom__info row">
            <td class="infouser__body__right__bottom__info__ileft col-4">
                
            </td>
            <td class="infouser__body__right__bottom__info__iright col-8">
                
            </td>
        </tr> -->
        <div class="creaccuser__action">
            <button class="creaccuser__action--submit" @click="creaccuser">Tạo</button>
            <button class="creaccuser__action--cancel" @click="cancel">Hủy</button>
        </div>
    </div>
</template>
<script>
import {RepositoryFactory} from '../api/RepositoryFactory';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import '../scss/CreateAccountUser.scss'

const PostsRepository = RepositoryFactory.communicationAPI('posts')
const emailValidator = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
export default {
    data(){
        return{
            listAccount: [],
            account: {},
            // account: {
            sex: {text: '', err: false},
            fullname: {text: '', err: false},
            username: {text: '', err: false, err1: false},
            birthday: {text: '', err: false},
            email: {text: '', err: false, err1: false, err2: false},
            phonenumber: {text: '', err: false},
            password: {text: '', err: false},
            repassword: {text: '', err: false, err1: false},
            // isErr: false
            // },
        }
    },
    components: { DatePicker },
    methods:{
        creaccuser(){
            // console.log(this.account);
            if(this.fullname.text === '') this.fullname.err = true;
            if(this.username.text === '') this.username.err = true;
            if(this.email.text === '') this.email.err = true;
            if(!emailValidator.test(this.email.text) && this.email.text !== '') this.email.err1 = true;
            if(this.birthday.text === '') this.birthday.err = true;
            if(this.sex.text === '') this.sex.err = true;
            if(this.phonenumber.text === '') this.phonenumber.err = true;
            if(this.password.text === '') this.password.err = true;
            if(this.repassword.text === '') this.repassword.err = true;
            if(this.password.text !== this.repassword.text && this.repassword.text !== '') this.repassword.err1 = true;
            for(let i= 0; i< this.listAccount.length ; i++){
                if(this.email.text === this.listAccount[i].email  && this.email.text !== ''){
                    this.email.err2 = true
                }
                if(this.username.text === this.listAccount[i].username && this.username.text !== ''){
                    this.username.err1 = true
                }
            }
            if(
                this.fullname.err === false && this.username.err === false &&
                this.email.err === false && this.email.err1 === false &&
                this.phonenumber.err === false &&
                this.sex.err === false && this.password.err === false && 
                this.repassword.err === false && this.repassword.err1 === false &&
                this.username.err1 === false && this.email.err2 === false
            ){
                this.createAccount(),
                this.$router.push("/user_login")
                this.$notification['success']({
                    message: 'Đăng kí thành công',
                    description:
                    'Bạn đã quay lại trang đăng nhập.',
                    duration: 2,
                    style: {
                        marginTop: `75px`,
                        marginBottom: '-50px'
                    },
                });
            }
            else{
                this.$notification['error']({
                    message: 'Tạo tài khoản thất bại',
                    description:
                    'Vui lòng nhập lại.',
                    duration: 2,
                    style: {
                        marginTop: `75px`,
                        marginBottom: '-50px'
                    },
                });
            }
        },
        async createAccount(){
            const {data} = await PostsRepository.createAccount(this.account);
            this.productDetail = data
        },
        async getAccount(){
            const {data} = await PostsRepository.getAccount();
            this.listAccount = data
        },
        onHandlFullname($event){
            this.fullname = {text: $event.target.value, err: false}
        },
        onHandlEmail($event){
            this.email= {text: $event.target.value, err: false, err1: false, err2: false}
        },
        onHandlUsername($event){
            this.username = {text: $event.target.value, err: false, err1: false}
        },
        onHandlPhonenumber($event){
            this.phonenumber = {text: $event.target.value, err: false}
        },
        onHandlPassword($event){
            this.password = {text: $event.target.value, err: false}
        },
        onHandlRePassword($event){
            this.repassword = {text: $event.target.value, err: false, err1: false}
        },
        cancel(){
            this.sex= {text: '', err: false},
            this.fullname= {text: '', err: false},
            this.username= {text: '', err: false},
            this.birthday= {text: '', err: false},
            this.email= {text: '', err: false, err1: false},
            this.phonenumber= {text: '', err: false},
            this.password= {text: '', err: false},
            this.repassword= {text: '', err: false, err1: false}

        }
    },
    created(){
        this.getAccount()
    },
    beforeUpdate(){
        if(this.birthday.text !== '') this.birthday.err = false;
        if(this.sex.text !== '') this.sex.err = false;
        this.account = {
            fullname: this.fullname.text,
            username: this.username.text,
            role: "user",
            email: this.email.text,
            phonenumber: this.phonenumber.text,
            birthday: this.birthday.text,
            sex: this.sex.text,
            password: this.password.text
        }
    }
}
</script>