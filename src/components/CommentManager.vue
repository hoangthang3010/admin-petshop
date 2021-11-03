<template>
    <div class="comment-manager">
        <h3>Quản lý bình luận sản phẩm</h3>
        <a-button v-show="isAddComment" type="primary" @click="isAddComment = !isAddComment">
            Thêm
        </a-button>
        <template>
            <div class="add-comment row" v-show="!isAddComment">
                <span class="col-2">{{!isAddComment ? 'Thêm bình luận:' : ''}}</span>
                <a-input class="col-2" v-model="idProductAdd" placeholder="ID sản phẩm" />
                <a-input class="col-6" v-model="contentProductAdd" placeholder="Nội dung" />
                <a-button type="primary" @click="saveAddComment">
                    Lưu
                </a-button>
                <a-button type="danger" v-show="!isAddComment" @click="handleCancelAdd">
                    Hủy
                </a-button>
            </div>
        </template>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allCommentProduct.length}} bình luận</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
                <a-divider type="vertical" />
                <input type="button" @click="deleteCommentSelected" value="Xóa">
            </div>
            <div>
                Thời gian: 
                <date-picker v-model="value1" type="date" @change="onChangeDate" range placeholder="Chọn thời gian"></date-picker>
            </div>
        </div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8; margin-top: 10px"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="allCommentProduct"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <!-- <template>
                <a-table
                    slot="expandedRowRender"
                    :columns="innerColumns"
                    :data-source="innerData"
                    :pagination="false"
                >
                </a-table>
            </template> -->
            <template
                v-for="col in ['productId', 'userId', 'content']"
                :slot="col"
                slot-scope="text, record"
            >
                <div :key="col">
                    <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => handleChange(e.target.value, record, col)"
                    />
                    <template v-else>
                    {{ text }}
                    </template>
                </div>
            </template>
            <template slot="action" slot-scope="text, record, key">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="() => save(record)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(record)">Cancel</a>
                    </span>
                    <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => edit(record)">Chỉnh sửa</a>
                        <a-divider type="vertical" />
                        <a @click="deleteCommentProduct(record, key)">Xóa</a>
                        <a-divider type="vertical" />
                        <a @click="moreCommentProduct(record)">Chi tiết</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="visible" title="Bình luận">
            <span>Nội dung: {{replyComment.content}}</span>
            <a-button v-show="isAddComment1" type="primary" style="margin:0 0 10px 10px" @click="isAddComment1 = !isAddComment1">
                Trả lời bình luận này
            </a-button>
            <template>
                <div class="add-comment row" v-show="!isAddComment1">
                    <span class="col-2">{{!isAddComment1 ? 'Trả lời:' : ''}}</span>
                    <!-- <a-input class="col-2" v-model="idProductAdd" placeholder="ID sản phẩm" /> -->
                    <a-input class="col-6" v-model="contentProductAdd1" placeholder="Nội dung" />
                    <a-button type="primary" @click="saveAddComment1">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isAddComment1" @click="handleCancelAdd1">
                        Hủy
                    </a-button>
                </div>
            </template>
            <p>Có {{replyComment.reply ? replyComment.reply.length : '0'}} trả lời</p>
            <a-table
                style="border-bottom: 1px solid #e8e8e8"
                :row-selection="{ selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1 }"
                :columns="innerColumns"
                :data-source="replyComment.reply"
                :scroll="{ y: 300 }"
                :pagination = false
            >
                <template
                    v-for="col in ['userId', 'content']"
                    :slot="col"
                    slot-scope="text, record"
                >
                    <div :key="col">
                        <a-input
                        v-if="record.editable1"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange1(e.target.value, record, col)"
                        />
                        <template v-else>
                        {{ text }}
                        </template>
                    </div>
                </template>
                <template slot="action" slot-scope="text, record">
                    <div class="editable-row-operations">
                        <span v-if="record.editable1">
                            <a @click="() => save1(record)">Save</a>
                            <a-divider type="vertical" />
                            <a @click="() => cancel1(record)">Cancel</a>
                        </span>
                        <span v-else>
                            <a :disabled="editingKey1 !== ''" @click="() => edit1(record)">Chỉnh sửa</a>
                            <a-divider type="vertical" />
                            <a @click="deleteCommentProduct1(record)">Xóa</a>
                        </span>
                    </div>
                </template>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'productId',
    width: '15%',
    scopedSlots: { customRender: 'productId' },
  },
  {
    title: 'Id người dùng',
    dataIndex: 'userId',
    width: '12%',
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' },
    // width: '15%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    // scopedSlots: { customRender: 'time' },
    width: '18%'
  },
  {
    title: 'Hành động',
    width: '18%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerColumns = [
  {
    title: 'Id người dùng',
    dataIndex: 'userId',
    width: '15%',
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' },
    width: '40%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    // scopedSlots: { customRender: 'time' },
    // width: '15%'
  },
  {
    title: 'Hành động',
    width: '16%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerData = [];
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    userId: '2014-12-24 23:12:00',
    content: 'This is production name',
    time: 'Upgraded: 56',
  });
}
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { uuid } from 'vue-uuid'
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    data() {
        return {
            columns,
            innerColumns,
            selectedRowKeys: [],
            selectedRowKeys1: [],
            allCommentProduct: [],
            allCommentProductBackup: [],
            editingKey: '',
            editingKey1: '',
            innerData,
            visible: false,
            replyComment: [],
            isAddComment: true,
            isAddComment1: true,
            idProductAdd: '',
            contentProductAdd: '',
            contentProductAdd1: '',
            productAll: [],
            cacheData: [],
            uuid: uuid.v4(),
            value1: ['',''],
        }
    },
    components: {DatePicker},
    created(){
        this.getCommentProduct()
        this.getProductDetail()
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allCommentProduct = this.allCommentProductBackup
        }
    },
    methods:{
        deleteCommentSelected(){
            this.allCommentProduct.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deteleCommentProductId(item.id)
                    }
                })
            })
            this.getCommentProduct()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allCommentProductBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allCommentProduct = a
            }
        },
        handleCancelAdd(){
            this.idProductAdd=''
            this.contentProductAdd=''
            this.isAddComment = true
        },
        saveAddComment(){
            const check = this.productAll.map(item =>{
                    return item.id;
                }).indexOf(Number(this.idProductAdd));
                
            const a = {
                "productId": Number(this.idProductAdd),
                "userId": 1,
                "content": this.contentProductAdd,
                "time": new Date(),
                "reply": []
            }
            if(!this.idProductAdd || !this.contentProductAdd){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Vui lòng nhập đầy đủ thông tin',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else if(Number(check) == -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Sản phẩm không tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else{
                this.createCommentProduct(a)
                this.getCommentProduct()
                this.isAddComment = true
                this.$notification['success']({
                    message: 'Thêm bình luận thành công',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
                this.idProductAdd = ''
                this.contentProductAdd = ''
            }
            // console.log(a);
        },
        saveAddComment1(){
            if(this.contentProductAdd1){
                const date = new Date()
                const a = {
                    "id": [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                    "userId": 1,
                    "content": this.contentProductAdd1,
                    "time": date.toJSON(),
                }
                const newData = [...this.replyComment.reply];
                const newCacheData = [...this.cacheData1];
                this.replyComment.reply = newData.concat(a);
                this.updateCommentProductId(this.replyComment.id, this.replyComment)
                this.getCommentProduct()
                // Object.assign(targetCache, target);
                this.cacheData1 = newCacheData;
                this.editingKey1 = '';
                this.contentProductAdd1 = ''
                this.isAddComment1 = true
            }
            else{
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Vui lòng nhập nội dung',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
        },
        deleteCommentProduct1(record){
            let newData = [...this.replyComment.reply];
            const newCacheData = [...this.cacheData1];
            this.replyComment.reply = newData.filter(item => item.id !== record.id)
            newData = this.replyComment.reply
            // console.log(newData);
            // console.log(this.replyComment.reply);
            this.updateCommentProductId(this.replyComment.id, this.replyComment)
            this.getCommentProduct()
            // Object.assign(targetCache, target);
            this.cacheData1 = newCacheData;
            this.editingKey1 = '';
        },
        handleCancelAdd1(){
            this.contentProductAdd1 = ''
            this.isAddComment1 = true
        },
        moreCommentProduct(item) {
            this.replyComment = item
            this.visible = true;
            this.cacheData1 = item.reply.map(item => ({ ...item }));
        },
        handleOk() {
            // console.log(e);
            // this.visible = false;
        },
        handleChange(value, record, column) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.allCommentProduct = newData;
            }
        },
        handleChange1(value, record, column) {
            const newData = [...this.replyComment.reply];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.replyComment.reply = newData;
            }
        },
        edit(record) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allCommentProduct = newData;
            }
        },
        edit1(record) {
            const newData = [...this.replyComment.reply];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey1 = record.id;
            if (target) {
                target.editable1 = true;
                this.replyComment.reply = newData;
            }
        },
        save(record) {
            const newData = [...this.allCommentProduct];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id === record.id)[0];
            const targetCache = newCacheData.filter(item => item.id === record.id)[0];
            if (target && targetCache) {
                delete target.editable;
                target.time = new Date().toJSON(),
                this.updateCommentProductId(record.id, target)
                this.getCommentProduct()
                // target.editable = false;
                this.allCommentProduct = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            this.editingKey = '';
        },
        save1(record) {
            const newData = [...this.replyComment.reply];
            const newCacheData = [...this.cacheData1];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            if (target && targetCache) {
                delete target.editable1;
                target.time = new Date().toJSON(),
                this.replyComment.reply = newData;
                this.updateCommentProductId(this.replyComment.id, this.replyComment)
                this.getCommentProduct()
                Object.assign(targetCache, target);
                this.cacheData1 = newCacheData;
            // this.cacheData1 = item.reply.map(item => ({ ...item }));
            }
            this.editingKey1 = '';
        },
        cancel(record) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                delete target.editable;
                this.allCommentProduct = newData;
            }
        },
        cancel1(record) {
            const newData = [...this.replyComment.reply];
            const target = newData.filter(item => item.id == record.id)[0];
            this.editingKey1 = '';
            if (target) {
                Object.assign(target, this.cacheData1.filter(item => item.id == record.id)[0]);
                delete target.editable1;
                this.replyComment.reply = newData;
            }
        },
        deleteCommentProduct(item){
            this.deteleCommentProductId(item.id)
            this.getCommentProduct()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        onSelectChange1(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys1 = selectedRowKeys;
        },
        async getCommentProduct(){
            const {data} = await PostsRepository.getCommentProduct();
            this.allCommentProduct = data
            this.allCommentProductBackup = data
            this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleCommentProductId(id){
            const {data} = await PostsRepository.deteleCommentProductId(id);
            this.allCommentProduct = data
        },
        async updateCommentProductId(id, payload){
            const {data} = await PostsRepository.updateCommentProductId(id, payload);
            this.allCommentProduct = data
        },
        async createCommentProduct(payload){
            const {data} = await PostsRepository.createCommentProduct(payload);
            this.allCommentProduct = data
        },
        async getProductDetail(){
            const {data} = await PostsRepository.getProductDetail();
            this.productAll = data
        }
    }
}
</script>

<style lang="scss">
/* .editable-row-operations a {
  margin-right: 8px;
} */
// .comment-manager{
    .ant-modal{
        width: 900px !important;
        top: 40px !important;
        .ant-modal-footer{
            display: none;
        }
    }
// }
.add-comment{
    margin: 10px 10px 20px 0px !important;
    display: flex;
    align-items: center;
    .col-2,.col-3,.col-6, button{
        margin-right: 8px;
    }
}
</style>