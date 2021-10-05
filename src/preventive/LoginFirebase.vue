<template>
    <div class="userlogin">
        <div class="userlogin__box">
            <h2 class="userlogin__box__title">Đăng nhập</h2>
            <!-- <div> -->
            <div class="userlogin__box__main">
                <!-- <p class="userlogin__box__main__title">Tên đăng nhập hoặc địa chỉ email *</p> -->
                <input class="userlogin__box__main--input" 
                    v-model="email" 
                    type="text"
                    placeholder="Email/Tên đăng nhập"
                >
                <!-- <p class="userlogin__box__main__title">Mật khẩu *</p> -->
                <input class="userlogin__box__main--input" 
                    v-model="password" 
                    type="password"
                    placeholder="Mật khẩu"
                >
                <!-- </div> -->
            </div>
            <div class="userlogin__box__memo">
                <input class="userlogin__box__memo--checkbox" type="checkbox" name="" id="">
                <span class="userlogin__box__memo__title">Ghi nhớ mật khẩu</span>
            </div>
            <div class="userlogin__box__login">
                <button 
                    class="userlogin__box__login--sign_in" 
                    @click="handleLogin()"
                >
                    Đăng nhập
                </button>
                
                    <!-- @click="handleCreateAccountUser()" -->
                <router-link to="/register_user">
                    <button 
                        class="userlogin__box__login--sign_up" 
                    >
                        Đăng kí
                    </button>
                </router-link>
                <p class="userlogin__box__login__forget">Quên mật khẩu?</p>
            </div>
            <div class="userlogin__box__or">
                <div class="userlogin__box__or__hr"></div>
                <span class="userlogin__box__or__title">HOẶC</span>
                <div class="userlogin__box__or__hr"></div>
            </div>
            <div class="userlogin__box__social">
                <div class="userlogin__box__social__google" @click="loginGoogle">
                    <img class="userlogin__box__social__google__image" :src="logoG" alt="">
                    <span class="userlogin__box__social__google__title">Google</span>
                </div>
                <div class="userlogin__box__social__facebook" @click="loginFacebook">
                    <img class="userlogin__box__social__facebook__image" :src="logoF" alt="">
                    <span class="userlogin__box__social__facebook__title">Facebook</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import '../scss/Login.scss'
import logoG from '../../public/picture/logoG.png'
import logoF from '../../public/picture/logoF.png'
import { mapActions } from "vuex";
export default {
    data() {
        return{
            email: '',
            password: '',
            logoG: logoG,
            logoF: logoF,
            token: '',
            user: ''
        }
    },
    methods: {
        ...mapActions(["signInAction", "signInFacebookAction", "signInGoogleAction"]),
        handleLogin(){
            this.signInAction({ email: this.email, password: this.password });
            // firebase
            //     .auth()
            //     .signInWithEmailAndPassword(this.email, this.password)
            //     .then((result) => {
            //         console.log(result);
            //         // this.token = result.credential.accessToken;
            //         this.$bus.emit('increaseCounter', this.email);
            //         console.log(this.token)
                    
            //     })
            //     .catch(err => alert(err.message))
        },
        loginGoogle(){
            this.signInGoogleAction()
            // const provider = new firebase.auth.GoogleAuthProvider();
            // firebase
            //         .auth()
            //         .signInWithPopup(provider)
            //         .then((result) => {
            //         this.token = result.credential.accessToken;
            //         this.user = result.user;
            //         console.log(result);
            //             console.log(this.token) // Token
            //             console.log(this.user.photoURL) // User that was authenticated
            //             this.$bus.emit('increaseCounter', this.user.displayName)
            //         })
            //         .then(() => {
            //             this.$router.push("/info_user")
            //             // this.$bus.emit('increaseCounter', this.users[i].fullname),
            //         })
            //         .catch((err) => {
            //         console.log(err); // This will give you all the information needed to further debug any errors
            //         });
        },
        loginFacebook(){
            this.signInFacebookAction();
            // firebase.auth().signInWithPopup(fbProvider).then(function(result) 
            // const fbProvider = new firebase.auth.FacebookAuthProvider();
            // // fbProvider.addScope('user_birthday');
            // firebase
            //         .auth()
            //         .signInWithPopup(fbProvider)
            //         .then((result) => {
            //         this.token = result.credential.accessToken;
            //         this.user = result.user;
            //             console.log(this.token) // Token
            //             console.log(this.user) // User that was authenticated
            //             this.$bus.emit('increaseCounter', this.user.displayName)
            //             console.log(this.user.user_birthday)
            //         })
            //         .then(() => {
            //             this.$router.push("/info_user")
            //         })
            //         .catch((err) => {
            //         console.log('fail: ' + err); // This will give you all the information needed to further debug any errors
            //         });
        },
    }
}
</script>