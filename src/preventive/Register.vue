<template>
    <div class="userlogin">
        <div class="userlogin__box">
            <h2 class="userlogin__box__title">Đăng kí</h2>
            <!-- <div> -->
            <div class="userlogin__box__main">
                <!-- <p class="userlogin__box__main__title">Tên đăng nhập hoặc địa chỉ email *</p> -->
                <input class="userlogin__box__main--input" 
                    v-model="name" 
                    type="text"
                    placeholder="Họ và Tên"
                >
                <input class="userlogin__box__main--input" 
                    v-model="email" 
                    type="text"
                    placeholder="Email"
                >
                <!-- <input class="userlogin__box__main--input" 
                    v-model="username" 
                    type="text"
                    placeholder="Username"
                > -->
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
                    @click="handleRegister()"
                >
                    Tạo
                </button>
                <router-link to="/user_login">
                    <button 
                        class="userlogin__box__login--sign_up" 
                    >
                        Quay lại
                    </button>
                </router-link>
                
                    <!-- @click="handleCreateAccountUser()" -->
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
            name: null,
            email: null,
            // username: null,
            password: null,
            logoG: logoG,
            logoF: logoF
        }
    },
    methods: {
        ...mapActions(["signUpAction"]),
        handleRegister(){
            this.signUpAction({ email: this.email, password: this.password, name: this.name });
            // firebase
            //     .auth()
            //     .createUserWithEmailAndPassword(this.username, this.password)
            //     .then((user) => {
            //         alert(user); 
            //         this.$router.push("/user_login")
            //     })
            //     .catch(err => alert(err.message))
        }
    }
}
</script>