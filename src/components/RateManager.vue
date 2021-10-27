<template>
    <div>
        <h3>Quản lý đánh giá sao sản phẩm</h3>
        <a-button v-show="isAddStar" type="primary" @click="isAddStar = !isAddStar">
            Thêm
        </a-button>
        <template>
            <div class="add-star add-comment row" v-show="!isAddStar">
                <span class="col-2">{{!isAddStar ? 'Thêm đánh giá:' : ''}}</span>
                <a-input class="col-2" v-model="idProductAdd" placeholder="ID sản phẩm" />
                <a-rate v-model="countStar" />
                <a-button type="primary" @click="saveAddStar">
                    Lưu
                </a-button>
                <a-button type="danger" v-show="!isAddStar" @click="handleCancelAdd">
                    Hủy
                </a-button>
            </div>
        </template>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allRateProduct.length}} đánh giá</span>
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
            :data-source="allRateProduct"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <div slot="productId" slot-scope="text, record">
                <span>{{record.productId}}</span> - 
                <span>{{productAll.filter(item => item.id == record.productId)[0].title}}</span>
            </div>
            <div slot="userId" slot-scope="text, record">
                <span>{{record.userId}}</span> - 
                <span>{{accountAll.filter(item => item.id == record.userId)[0].username}}</span>
            </div>
            <div slot="star" slot-scope="text, record">
                <a-rate v-model="record.star" />
            </div>
            <!-- <div slot="action" slot-scope="text, record, key">
                <a>Chỉnh sửa</a>
                <a-divider type="vertical" />
                <a @click="deleteRateProduct(record, key)">Xóa</a>
            </div> -->
            <template slot="action" slot-scope="text, record, key">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="() => saveEdit(record)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(key)">Cancel</a>
                    </span>
                    <span v-else>
                        <a @click="() => saveEdit(record)">Save</a>
                        <!-- <a :disabled="editingKey !== ''" @click="() => edit(key)">Chỉnh sửa</a> -->
                        <a-divider type="vertical" />
                        <a @click="deleteRateProduct(record, key)">Xóa</a>
                    </span>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm - Tên sản phẩm',
    dataIndex: 'productId',
    // width: '40%'
    scopedSlots: { customRender: 'productId' },
  },
  {
    title: 'Id người dùng - Tên người dùng',
    dataIndex: 'userId',
    // width: '15%'
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: 'Số sao đánh giá',
    dataIndex: 'star',
    // width: '15%'
    scopedSlots: { customRender: 'star' },
  },
  {
    title: 'Hành động',
    width: '15%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    data() {
        return {
            columns,
            selectedRowKeys: [],
            allRateProduct: [],
            allRateProductBackup: [],
            productAll: [],
            accountAll: [],
            isAddStar: true,
            countStar: 0,
            idProductAdd: '',
            value1: ['',''],
        }
    },
    components: {DatePicker},
    async created(){
        await this.getAccount()
        await this.getProductDetail()
        // setTimeout(() => {
        this.getRateProduct()
        // },1000);
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allRateProduct = this.allRateProductBackup
        }
    },
    methods:{
        async deleteRateSelected(){
            this.allRateProduct.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deleteRateProducId(item.id)
                    }
                })
            })
            await this.getAccount()
            await this.getProductDetail()
            this.getRateProduct()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allRateProductBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allRateProduct = a
            }
        },
        saveAddStar(){
            const check = this.productAll.map(item =>{
                    return item.id;
                }).indexOf(Number(this.idProductAdd));
            const a = {
                "productId": Number(this.idProductAdd),
                "userId": 1,
                "star": this.countStar,
                "time": new Date()
            }
            if(!this.idProductAdd || this.countStar==0){
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
                this.createRateProduct(a)
                this.getRateProduct()
                this.isAddStar = true
                this.idProductAdd = ''
                this.countStar = 0
            }
        },
        saveEdit(item){
            // console.log(item);
            const a = {
                ...item,
                time: new Date()
            }
            this.updateUserRateProduct(a.id, a)
            this.getRateProduct()
        },
        handleCancelAdd(){
            this.isAddStar = true
            this.idProductAdd = ''
            this.countStar = 0
        },
        deleteRateProduct(item){
            this.deleteRateProducId(item.id)
            this.getRateProduct()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        async getRateProduct(){
            const {data} = await PostsRepository.getRateProduct();
            this.allRateProduct = data
            this.allRateProductBackup = data
        },
        async deleteRateProducId(id){
            const {data} = await PostsRepository.deleteRateProduct(id);
            this.allRateProduct = data
        },
        async updateUserRateProduct(id, payload){
            const {data} = await PostsRepository.updateUserRateProduct(id, payload);
            this.allRateProduct = data
        },
        async createRateProduct(payload){
            const {data} = await PostsRepository.createRateProduct(payload);
            this.allRateProduct = data
        },
        async getProductDetail(){
            const {data} = await PostsRepository.getProductDetail();
            this.productAll = data
        },
        async getAccount(){
            const {data} = await PostsRepository.getAccount();
            this.accountAll = data
        }
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

</style>