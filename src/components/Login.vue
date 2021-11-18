<template>
    <div class="userlogin">
        <div class="userlogin__box">
            <h2 class="userlogin__box__title">Đăng nhập</h2>
            <div class="userlogin__box__main">
                <input class="userlogin__box__main--input" 
                    v-model="username" 
                    @change="handleUsername" 
                    type="text"
                    placeholder="Email/Tên đăng nhập"
                >
                <input class="userlogin__box__main--input" 
                    @change="handlePassword()" 
                    v-model="password" 
                    type="password"
                    placeholder="Mật khẩu"
                >
            </div>
            <div class="userlogin__box__login">
                <button 
                    class="userlogin__box__login--sign_in" 
                    @click="handleLogin()"
                >
                    Đăng nhập
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import '../scss/Login.scss'
// import { mapMutations} from 'vuex'
// import axios from 'axios'    
// import {API_URL} from '../.env.js'
import logoG from '../../public/picture/logoG.png'
import logoF from '../../public/picture/logoF.png'
import firebase from "firebase";
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    data(){
        return{
            users: [],
            username: '',
            password: '',
            checkUser: '',
            logoG: logoG,
            logoF: logoF
        }
    },
    props: ['isShowLogin'],
    methods:{
        // ...mapMutations(['handleLogin']),
        handleUsername(){
            console.log(this.username);
        },
        handlePassword(){console.log(this.password);
        },
        //  && this.role == 'admin'
        handleLogin(){
            for(let i=0; i<this.users.length; i++){
                if((this.users[i].username == this.username || this.users[i].email == this.username) && this.users[i].password == this.password && this.users[i].role == 'admin'){
                    return (
                        this.$bus.emit('idUser', this.users[i].id),
                        this.checkUser = i,
                        this.$router.push("/"),
                        this.$notification['success']({
                            message: 'Đăng nhập thành công',
                            description:
                            `Chào ${this.username}`,
                            duration: 2,
                            style: {
                                marginTop: `75px`,
                                marginBottom: '-50px'
                            },
                        }),
                        sessionStorage.setItem('id', this.users[i].id)
                    )
                }
                else this.checkUser = ''
            }
            if (this.checkUser === '') {
                this.$notification['error']({
                    message: 'Tên đăng nhập/email hoặc mật khẩu sai',
                    description:
                    'Vui lòng nhập lại tên đăng nhập/email hoặc mật khẩu',
                    duration: 2,
                    style: {
                        marginTop: `75px`,
                        marginBottom: '-50px'
                    },
                });
            }       
        },
        loginGoogle(){
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase
                    .auth()
                    .signInWithPopup(provider)
                    .then((result) => {
                    let token = result.credential.accessToken;
                    let user = result.user;
                        console.log(token) // Token
                        console.log(user.photoURL) // User that was authenticated
                        this.$bus.emit('increaseCounter', user.displayName)
                    })
                    .then(() => {
                        this.$router.push("/info_user")
                    })
                    .catch((err) => {
                    console.log(err); // This will give you all the information needed to further debug any errors
                    });
        },
        loginFacebook(){
            // firebase.auth().signInWithPopup(fbProvider).then(function(result) 
            const fbProvider = new firebase.auth.FacebookAuthProvider();
            // fbProvider.addScope('user_birthday');
            firebase
                    .auth()
                    .signInWithPopup(fbProvider)
                    .then((result) => {
                    let token = result.credential.accessToken;
                    let user = result.user;
                        console.log(token) // Token
                        console.log(user) // User that was authenticated
                        this.$bus.emit('increaseCounter', user.displayName)
                        console.log(user.user_birthday)
                    })
                    .then(() => {
                        this.$router.push("/info_user")
                    })
                    .catch((err) => {
                    console.log('fail: ' + err); // This will give you all the information needed to further debug any errors
                    });
        },
        async fetchAccount(){
            const {data} = await PostsRepository.getAccount();
            this.users = data
        }
    },
    created(){
        this.fetchAccount()
    },
}
</script>