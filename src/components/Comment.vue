<template>
    <div class="comment-user">
        <!-- {{allComment.length > 1 ? 'replies' : 'reply'}} -->
        <span key="comment-nested-reply-to">{{allComment.length}} bình luận </span>
        <span class="change-status-comment" @click="showAllComment" v-if="isStatusComment && allComment.length > listComment.length && allComment.length >5">- Hiển thị tất cả</span>
        <span class="change-status-comment" @click="filterComment" v-if="!isStatusComment && allComment.length >5">- Thu gọn lại</span>
        <hr/>
        <!-- <span @click="showAllComment" key="comment-nested-reply-to">{{comments.length}} {{comments.length > 1 ? 'replies' : 'reply'}}</span> -->
        <a-list
            v-if="allComment.length && infoUser"
            :data-source="listComment.length > 0 ? listComment : (allComment.length > 5 ? allComment.slice(this.allComment.length-5) : allComment)"
            :header="``"
            item-layout="horizontal"
        >
        <!-- <a-list
            v-if="allComment.length && infoUser"
            :data-source="allComment.length > 5 ? listComment : allComment.slice(this.allComment.length-5)"
            :header="``"
            item-layout="horizontal"
        > -->
            <span style="display: none">{{infoUser}}</span>
            <!-- , index -->
            <a-list-item slot="renderItem" slot-scope="item" style="display: block">
                <div style="display: flex; align-items: center; justify-content: space-between">
                    <a-comment
                        :author="item.nameUser"
                        :avatar="item.avatar"
                        :content="item.content"
                        :datetime="item.time.slice(0,10)"
                    />
                    <div class="edit-comment">
                        <span v-if="item.userId == infoUser.id" @click="onDeleteComment(item.id)">Xóa </span>
                        <span v-if="item.userId == infoUser.id && !isEditComment" @click="onEditComment(item.id, item.content)">Chỉnh sửa</span>
                    </div>
                </div>
                <div v-if="isEditComment && idEditComment == item.id" >
                    <a-form-item>
                        <a-textarea :rows="4" :value="value1" @change="handleChange1" />
                    </a-form-item>
                    <a-form-item>
                        <a-button 
                            style="margin-right: 8px"
                            html-type="submit" 
                            :loading="submitting" 
                            type="primary" 
                            @click="handleEditComment(item.id, item.content)"
                        >
                            Cập nhật
                        </a-button>
                        <a-button 
                            html-type="submit" 
                            :loading="submitting" 
                            type="danger" 
                            @click="handleCancleEditComment"
                        >
                            Hủy
                        </a-button>
                    </a-form-item>
                </div>
                    <!-- :datetime="item.datetime == moment().fromNow() ? item.datetime:item.datetime.fromNow()" -->
            </a-list-item>
            <!-- .fromNow() -->
        </a-list>
        <a-list v-else> Chưa có bình luận nào</a-list>
        <a-comment>
            <a-avatar
                slot="avatar"
                :src="infoUser.avatar"
                alt="Han Solo"
            />
            <div slot="content">
                <a-form-item>
                    <a-textarea :rows="4" :value="value" @change="handleChange" />
                </a-form-item>
                <a-form-item>
                    <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
                        Gửi
                    </a-button>
                    <a-button 
                        style="display: none"
                        v-if="isEditComment" 
                        html-type="submit" 
                        :loading="submitting" 
                        type="primary" 
                        @click="handleCancleEditComment"
                    >
                        Hủy
                    </a-button>
                </a-form-item>
            </div>
        </a-comment>
    </div>
</template>

<script>
import moment from 'moment';
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
    export default {
        props: ['allComment', 'id'],
        data() {
            return {
                isStatusComment: true,
                moment,
                // comments: [
                //     {
                //     actions: ['Reply to'],
                //     author: 'Han Solo',
                //     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                //     content:
                //         'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                //     datetime: moment().subtract(1, 'days'),
                //     },
                //     {
                //     actions: ['Reply to'],
                //     author: 'Han Solo',
                //     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                //     content:
                //         'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
                //     datetime: moment().subtract(2, 'days'),
                //     },],
                comments: {},
                submitting: false,
                value: '',
                value1: '',
                infoUser: {},
                idUser1:  '',
                listComment: [],
                isEditComment: false,
                idEditComment: ''
            };
        },
        created(){
            this.$bus.on('infoUser', value => {
                this.infoUser = value
            })
        },
        mounted(){},
        watch:{
            comments(){
            }
        },
        methods: {
            handleSubmit() {
                let time = new Date()
                if (!this.value) {
                    return;
                }
                this.submitting = true;
                this.comments = {
                    productId: this.id,
                    userId: this.infoUser.id,
                    nameUser: this.infoUser.fullname,
                    content: this.value,
                    avatar: this.infoUser.avatar,
                    time: time,
                };
                if(this.infoUser.id){
                    this.commentProduct()
                    this.value = '';
                }
                setTimeout(() => {
                    this.submitting = false;
                }, 1000);
                this.$emit('handleComment');

            },
            handleChange(e) {
                this.value = e.target.value;
            },
            handleChange1(e) {
                this.value1 = e.target.value;
            },
            showAllComment(){
                this.isStatusComment = !this.isStatusComment
                this.listComment = this.allComment
            },
            filterComment(){
                this.isStatusComment = !this.isStatusComment
                this.listComment = this.allComment.slice(this.allComment.length-5)
            },
            onDeleteComment(id){
                this.deteleCommentProductId(id)
                this.$emit('handleDeleteComment');
            },
            onEditComment(id, content){
                this.value1 = content
                this.isEditComment = true
                this.idEditComment = id
            },
            handleEditComment(id){
                let time = new Date()
                this.comments = {
                    productId: this.id,
                    userId: this.infoUser.id,
                    nameUser: this.infoUser.fullname,
                    content: this.value1,
                    avatar: this.infoUser.avatar,
                    time: time,
                };
                this.updateCommentProductId(id, this.comments)
                setTimeout(() => {
                    this.isEditComment = false
                }, 500);
                this.$emit('handleEditComment');
                // this.$notification['success']({
                //     message: 'Bạn đã chỉnh sửa bình luận',
                //     duration: 2,
                //     style: {
                //         marginTop: `75px`,
                //         marginBottom: '-50px'
                //     },
                // })
            },
            handleCancleEditComment(){
                this.value = ''
                this.isEditComment = false
            },
            async commentProduct(){
                const {data} = await PostsRepository.createCommentProduct(this.comments);
                this.comments = data
                // this.$forceUpdate()
            },
            async deteleCommentProductId(id){
                const {data} = await PostsRepository.deteleCommentProductId(id);
                this.comments = data
            },
            async updateCommentProductId(id, content){
                const {data} = await PostsRepository.updateCommentProductId(id, content);
                this.comments = data
            },
        },
    }
</script>

<style lang="scss">
.comment-user{
    .change-status-comment{
        cursor: pointer;
        &:hover{
            color: #575757;
        }
    }
    .ant-comment{
        .ant-btn{
            background-color: orange;
            border-color: orange;
            &:hover{
                background-color: #946000;
                border-color: #946000;
            }
        }
    }
    .ant-input:hover{
        border-color: orange;
    }
    .ant-input:focus{
        border-color: orange;
        box-shadow: 0 0 0 2px #ffe8ba
    }
    .ant-list-split{
        .ant-comment-avatar{
            width: 50px;
        }
        .ant-list-item{
            padding: 0;
        }
    }
    .edit-comment{
        span{
            cursor: pointer;
            color: rgba(0, 0, 0, 0.45);
            &:hover{
                color: orange;
            }
        }
    }
}
</style>