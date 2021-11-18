<template>
    <div>
        <h3>Quản lý tin tức</h3>
        <a-button type="primary" @click="onAddNews">
            Thêm
        </a-button>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allNews.length}} đánh giá</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
                <a-divider type="vertical" />
                <input type="button" @click="deleteRateSelected" value="Xóa">
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
            :data-source="allNews"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template slot="action" slot-scope="text, record, key">
                <div class="editable-row-operations">
                    <span>
                        <a @click="onEditNews(record)">Chỉnh sửa</a>
                        <a-divider type="vertical" />
                        <a @click="onDeleteNews(record, key)">Xóa</a>
                    </span>
                </div>
            </template>
        </a-table>
        <!-- <a-modal class="modal-news" v-model="isDisplayModal" :title="newsProps.id ? 'Sửa bài viết' : 'Thêm bài viết'">
            <AddNews :newsProps="newsProps"/>
        </a-modal> -->
        
        <div class="modal-add-product" v-if="isDisplayModal">{{isDisplayModal}}
            <div class="display-modal-add-product" @click="isDisplayModal = !isDisplayModal"></div>
            <AddNews @isShowFormAdd="isShowFormAdd" :newsProps="newsProps"/>
        </div>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    scopedSlots: { customRender: 'title' },
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    width: '20%',
    scopedSlots: { customRender: 'time' },
  },
  {
    title: 'Hành động',
    width: '15%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
import AddNews from '../components/AddNews.vue'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    data() {
        return {
            columns,
            selectedRowKeys: [],
            allNews: [],
            allNewsBackup: [],
            productAll: [],
            accountAll: [],
            isAddStar: true,
            countStar: 0,
            idProductAdd: '',
            value1: ['',''],
            isDisplayModal: false,
            newsProps: []
        }
    },
    components: {DatePicker, AddNews},
    async created(){
        this.getNews()
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allNews = this.allNewsBackup
        }
    },
    watch:{
        isDisplayModal(){
            if(this.isDisplayModal == false){
                this.newsProps = []
            }
        }
    },
    methods:{
        isShowFormAdd(){
            this.isDisplayModal = false
            this.newsProps = []
            this.getNews()
        },
        onEditNews(record){
            // this.allNews.filter(item => item.id == record.id)
            this.newsProps = record,
            this.isDisplayModal = true
        },
        onAddNews(){
            this.newsProps = [],
            this.isDisplayModal = true
        },
        deleteRateSelected(){
            this.allNews.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deleteNews(item.id)
                    }
                })
            })
            this.getNews()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allNewsBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allNews = a
            }
        },
        onDeleteNews(item){
            this.deleteNews(item.id)
            this.getNews()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        async createNews(payload){
            const {data} = await PostsRepository.createNews(payload);
            this.allNews= data
        },
        async getNews(){
            const {data} = await PostsRepository.getNews();
            this.allNews = data
            this.allNewsBackup = data
        },
        async deleteNews(id){
            const {data} = await PostsRepository.deleteNews(id);
            this.allNews = data
        },
    }
}
</script>

<style lang="scss">
.add-star{
    .ant-rate{
        padding: 6px 10px !important;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        display: flex !important;
        align-items: center;
        margin: 0 16px 0 0 !important
    }
}
.modal-news{
    .ant-modal{
        top: 10px !important
    }
}

</style>