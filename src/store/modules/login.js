import firebase from "firebase";
import { vm } from '@/main'
const initialState = () => {
  return { user: null, error: null };
};

const login = {
  state: initialState(),
  mutations: {
    setUser(state, payload) {
        state.user = payload;
    },
    setError(state, payload) {
    state.error = payload;
    }
  },
  actions: {
    authAction({ commit }) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                commit("setUser", user);
            } else {
                commit("setUser", null);
            }
        });
    },    
    signUpAction({ commit }, payload) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(payload.email, payload.password)
            .then(response => {
                commit("setUser", response.user);
                response.user
                    .updateProfile({
                        displayName: payload.name,
                        // username: payload.username
                    })
                    .then(() => {});
                vm.$router.push("/")
                console.log(response.user);
            })
            .catch(error => {
                commit("setError", error.message);
                console.log('hi');
            });
    },
    signInAction({ commit }, payload) {
        firebase
            .auth()
            .signInWithEmailAndPassword(payload.email, payload.password)
            .then((response) => {
                vm.$router.push("/")
                console.log(response);
                // this.token = response.credential.accessToken;
                // this.$bus.emit('increaseCounter', payload.email);
                commit("setUser", response.user);
                
            })
            .catch(error => commit("setError", error.message))
    },
    signInFacebookAction({commit}){
        const fbProvider = new firebase.auth.FacebookAuthProvider();
            // fbProvider.addScope('user_birthday');
            firebase
                    .auth()
                    .signInWithPopup(fbProvider)
                    .then((result) => {
                        commit("setUser", result.user);
                        this.token = result.credential.accessToken;
                        this.user = result.user;
                        console.log(this.token) // Token
                        console.log(this.user) // User that was authenticated
                    })
                    .then(() => {
                        vm.$router.push("/info_user")
                    })
                    .catch((err) => {
                    console.log('fail: ' + err); // This will give you all the information needed to further debug any errors
                    });
    },
    signInGoogleAction({commit}){
        const provider = new firebase.auth.GoogleAuthProvider();
            firebase
                    .auth()
                    .signInWithPopup(provider)
                    .then((result) => {
                        commit("setUser", result.user);
                        this.token = result.credential.accessToken;
                        this.user = result.user;
                        console.log(result);
                        console.log(this.token) // Token
                        console.log(this.user.photoURL) // User that was authenticated
                    })
                    .then(() => {
                        vm.$router.push("/info_user")
                        // this.$bus.emit('increaseCounter', this.users[i].fullname),
                    })
                    .catch((err) => {
                    console.log(err); // This will give you all the information needed to further debug any errors
                    });
    },
    signOutAction({ commit }) {
        firebase
            .auth()
            .signOut()
            .then(() => {
                vm.$router.push("/user_login")
                commit("setUser", null);
            })
            .catch(error => {
                commit("setError", error.message);
            });
      }
  },
  getters: {
    getUser(state) {
            return state.user;
        },
        isUserAuth(state) {
            return !!state.user;
        },
        getError(state) {
            return state.error;
        }
    }
};
export default login