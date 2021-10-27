<template>
    <div>
        <h3>Quản lý sản phẩm</h3>
        <div class="toolbar-top">
            <div class="row" style="width: 60%; align-items: center">
                <div class="col-4">
                    <select id="cars" class="select-type" name="cars" v-model="valueSelect">
                        <option value="all">Tất cả</option>
                        <option value="dog">Chó</option>
                        <option value="cat">Mèo</option>
                        <option value="food">Thức ăn</option>
                        <option value="medicine">Thuốc</option>
                    </select>
                </div>
                <a-divider type="vertical" />
                <div class="col-5" style="display: flex">
                    <input type="text" v-model="valueSearchQuery" class="search-product"/>
                    <input type="button" @click="clickSearch = true" value="Tìm kiếm">
                    <!-- {{searchQuery}} - {{productSearch}} -->
                </div>
                <a-divider type="vertical" />
                <div style="padding: 0 15px">
                    <input type="button" value="Thêm" class="add-product" @click="addProduct">
                </div>
            </div>
            <div>
                Thời gian: 
                <date-picker v-model="value1" type="date" @change="onChangeDate" range placeholder="Chọn thời gian"></date-picker>
            </div>
        </div>
        <div style="margin-top: 16px">
        <!-- <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="start">
            Reload
        </a-button> -->
            <div style="margin-bottom: 4px">
                <span>Có {{allProduct.length}} sản phẩm</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
            </div>
        </div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="productfilter"
            :scroll="{ y: 320 }"
            :pagination = false
        >
            <template slot="action" slot-scope="text, record, key">
                <a @click="editProduct(record)">Chỉnh sửa</a>
                <a-divider type="vertical" />
                <a @click="deleteProduct(record, key)">Xóa</a>
            </template>
        </a-table>
        <div class="modal-add-product" v-if="isShowAddProduct">{{isShowAddProduct}}
            <div class="display-modal-add-product" @click="isShowAddProduct = !isShowAddProduct"></div>
            <AddProduct @isShowFormAdd="isShowFormAdd" :productEdit="productEdit"/>
        </div>
    </div>
</template>
<script>
const columns = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'title',
    width: '40%'
  },
  {
    title: 'Loại thú cưng',
    dataIndex: 'type',
    width: '15%'
  },
  {
    title: 'Loại sản phẩm',
    dataIndex: 'detail',
    width: '15%'
  },
  {
    title: 'Giá',
    dataIndex: 'price',
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
import AddProduct from '../components/AddProduct.vue'
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
    export default {
        data() {
            return {
                value: 'all',
                columns,
                allProduct: [],
                selectedRowKeys: [],
                loading: false,
                searchQuery: '',
                productSearch: [],
                clickSearch: false,
                isShowAddProduct: false,
                allRateProduct: [],
                value1: ['',''],
                allProductBackup: [],
                productEdit: []
            }
        },
        components: {AddProduct, DatePicker},
        computed: {
            hasSelected() {
            return this.selectedRowKeys.length > 0;
            },
            productfilter(){
                if(this.value == 'all' && !this.clickSearch){
                    return this.allProduct
                }
                else if(this.clickSearch){
                    return this.allProduct.filter((item)=>{
                        return this.searchQuery.toLowerCase().split(' ').every(v => item.title.toLowerCase().includes(v))
                    })
                }
                else return this.allProduct.filter(item => item.type_product == this.value || item.type == this.value)
            },
            valueSelect:{
                get(){
                    return this.value
                },
                set(value){
                    this.clickSearch = false
                    this.searchQuery = ''
                    this.value = value
                }
            },
            valueSearchQuery:{
                get(){
                    return this.searchQuery
                },
                set(value){
                    this.clickSearch = false
                    this.searchQuery = value
                    this.value = 'all'
                }
            }

        },
        created(){
            this.fetchProductAll()
            this.getRateProduct()
        },
        updated(){
            if(!this.value1[0] || !this.value1[1]){
                this.allProduct = this.allProductBackup
            }
        },
        methods: {
            onChangeDate(){
                const startDate = this.value1[0]
                const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
                if(this.value1[0] && this.value1[1]){
                    const a = this.allProductBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                    this.allProduct = a
                }
            },
            isShowFormAdd(){
                this.isShowAddProduct = false
                this.productEdit = []
                this.fetchProductAll()
            },
            addProduct(){
                this.isShowAddProduct = true
                this.productEdit = []
            },
            editProduct(record){
                this.productEdit = this.allProduct.filter(item => item.id == record.id)
                this.isShowAddProduct = true
            },
            deleteProduct(item){
                let idRate = ''
                this.deleteProductId(item.id)
                this.fetchProductAll()
                for(let j = 0; j < this.allRateProduct.length; j++){
                    if(this.allRateProduct[j].productId == item.id){
                        idRate = this.allRateProduct[j].id
                    }
                }
                this.deleteRateProduct(idRate)
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            async fetchProductAll(){
                const {data} = await PostsRepository.getProductDetail();
                this.allProduct = data
                this.allProductBackup = data
            },
            async deleteProductId(id){
                const {data} = await PostsRepository.deteleProductDetail(id);
                this.allProduct = data
            },
            async deleteRateProduct(idRate){
                const {data} = await PostsRepository.deleteRateProduct(idRate);
                this.allProduct = data
            },
            async getRateProduct(){
                const {data} = await PostsRepository.getRateProduct();
                this.allRateProduct = data
            }
            // start() {
            //     this.loading = true;
            //     // ajax request after empty completing
            //     setTimeout(() => {
            //         this.loading = false;
            //         this.selectedRowKeys = [];
            //     }, 1000);
            // },
        },
    }
</script>

<style lang="scss">
    .toolbar-top{
        display: flex;
        align-items: center;
        height: 30px;
        justify-content: space-between;
        .search-product{
            width: 100%;
            height: 30px;
            border: 1px solid #bdbdbd;
            margin-right: 8px;
            border-radius: 2px;
            &:focus-visible{
            outline: #bdbdbd;
            }
        }
        .select-type{
            border: 1px solid #bdbdbd;
            width: 100%;
            height: 30px;
            border-radius: 2px;
            &:focus-visible{
            outline: #bdbdbd;
            }
        }
        .add-product{
            height: 30px;
        }
    }
    .modal-add-product{
        .display-modal-add-product{
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0, 0.8);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
        }
        .add-product{
            position: fixed;
            z-index: 100;
            top: 10px;
            left: 10%;
        }
    }
</style>