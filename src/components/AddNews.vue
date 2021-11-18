<template>
    <div class="add-news">
        <div class="container" style="width: 880px">
            <div style="margin-bottom: 10px; text-align: end">
                <input style="margin-right: 8px" @click="onCancel" type="button" value="Hủy">
                <input v-if="newsProps.id" type="button" @click="onSave" value="Lưu">
                <input v-else type="button" @click="onUpNews" value="Đăng">
            </div>
            <div>
                <!-- <div class="up-image" :style="`position: fixed; top: ${top+35}px; left: ${left+685}px`"  @click="onUpImage">
                    <span>Tải ảnh lên</span>
                    <input class="input-up-image" style="width: 70px; display: none" type="file" accept="image/jpeg" @change="(e) =>uploadImage(e)">
                </div> -->
                <input style="display: none" id="image" type="text" v-model="image">
                <input style="display: none" type="button" value="Copy Link" @click="coppyImage">
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px">
                <span style="width: 80px">Tiêu để: </span>
                <input 
                    type="text" 
                    style="height: 30px; width: calc(100% - 80px); border: 1px solid rgb(170 170 170);"
                    v-model="titleNews"
                >
            </div>
            <!-- decode(newsProps) -->
            <div style="position: relative">
                <span>Nội dung:</span>
                <tinymce id="d1"
                        :other_options="tinyOptions" 
                        v-model="editorContent"
                ></tinymce>
                <div class="up-image" @click="onUpImage">
                    <span>Tải ảnh lên</span>
                    <input class="input-up-image" style="width: 70px; display: none" type="file" accept="image/jpeg" @change="(e) =>uploadImage(e)">
                </div>

            </div>
        <!-- <input type="text" :value="decode (contentNews)"> -->
        <!-- {{decode (contentNews)}} -->
        </div>
    </div>
</template>

<script>
// import 'tinymce/icons/default';
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    props:['newsProps'],
    data() {
        return {
                editorContent: '',
                tinyOptions: {
                    'height': 300
                },
                image: '',
                top: '',
                left: '',
                contentNews: '',
                allNews: [],
                titleNews: ''
        }
    },
    mounted(){
        var a = document.getElementsByClassName("mce-tinymce");
        this.top = a[0].getBoundingClientRect().top
        this.left = a[0].getBoundingClientRect().left
    },
    computed:{
        // decode () {
        //     const he = require('he');
        //     return he.decode(this.contentNews)
        // },
    },
    created(){
        if(this.newsProps){
            setTimeout(() => {
                this.titleNews = this.newsProps.title
                this.editorContent = this.decode(this.newsProps.content)
            }, 1000);
        }
    },
    methods:{
        encode () {
            const he = require('he');
            this.contentNews = he.encode(this.editorContent)
        },
        decode (value) {
            const he = require('he');
            return he.decode(value)
        },
        onUpNews(){
            this.encode()
            const  a = {
                "title": this.titleNews,
                "content": this.contentNews,
                "time": new Date().toJSON()
            }
            this.createNews(a)
            this.$emit('isShowFormAdd');
        },
        onSave(){
            const a = {
                ...this.newsProps,
                title: this.titleNews,
                content: this.editorContent,
                time: new Date().toJSON()
            }
            this.updateNewsId(a.id, a)
            this.$emit('isShowFormAdd');
        },
        onCancel(){
            this.contentNews = ''
            this.editorContent = ''
            this.titleNews = ''
            this.$emit('isShowFormAdd');
        },
        coppyImage(){
            var copyText = document.getElementById("image");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value)
            const a = document.getElementsByClassName("mce-txt")[3]
            a.click();
            // setTimeout(() => {
            //     const b = document.getElementsByClassName("mce-first")[12]
            //     b.click();
            //     // const b = document.getElementsByClassName("mce-text")[2]
            //     // b.click();
            //     setTimeout(() => {
            //         // const c = document.getElementsByClassName("mce-textbox")[0]
            //         // c.value = this.image;
            //         // const d = document.getElementsByClassName("mce-first")[18]
            //         // d.value = 300
            //         // const e = document.getElementsByClassName("mce-i-checkbox")
            //         // e.click();
            //         // setTimeout(() => {
            //         //     const f = document.getElementsByClassName("mce-txt")[9]
            //         //     f.click();
            //         // }, 1000);
            //         // const c = document.getElementsByClassName("mce-textbox")[0]
            //         // c.value = this.image;
            //         // if(c.value){
            //         //     const d = document.getElementsByClassName("mce-txt")[9]
            //         //     d.click();
            //         // }
            //     }, 1000);
            // }, 1000);
        },
        onUpImage(){
            const a = document.getElementsByClassName('input-up-image')
            a[0].click();
        },
        uploadImage(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                this.image = e.target.result;
            };
            setTimeout(() => {
                var copyText = document.getElementById("image");
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(copyText.value)
                const a = document.getElementsByClassName("mce-txt")[3]
                a.click();
                setTimeout(() => {
                    const b = document.getElementsByClassName("mce-first")[12]
                    b.click();
                }, 1000)
            }, 1000);
        },
        async createNews(payload){
            const {data} = await PostsRepository.createNews(payload);
            this.allNews= data
        },
        async getNews(){
            const {data} = await PostsRepository.getNews();
            this.allNews = data
        },
        async updateNewsId(id, payload){
            const {data} = await PostsRepository.updateNewsId(id, payload);
            this.allNews = data
        },
    }
}
</script>
<style lang="scss">
    .up-image{
        position: absolute;
        top: calc(24% - 48px);
        // left: calc(68% - 48px);
        // left: calc(% - 48px);
        right: 10%;
        z-index: 100;
        height: 35px;
        color: #5f5f5f;
        border-left: 1px solid #D9D9D9;
        padding: 10px;
        text-decoration: underline;
        cursor: pointer;

        // position: absolute;
        // top: calc(24% - 5px);
        // left: 68%;
        // z-index: 100;
    }
    .add-news{
        left: 20% !important;
        .container{
            padding: 15px;
            min-height: 200px;
            background-color: white;
        }
    }
</style>