<template>
    <div>
        <h3>Quản lý loại sản phẩm</h3>
        <a-button v-show="isAddTypeProduct" type="primary" @click="isAddTypeProduct = !isAddTypeProduct">
            Thêm
        </a-button>
        <template>
            <div class="add-star add-comment row" v-show="!isAddTypeProduct">
                <span class="col-2">{{!isAddTypeProduct ? 'Thêm loại sản phẩm:' : ''}}</span>
                <a-input class="col-2" v-model="titleTypeProductAdd" placeholder="Tên loại sản phẩm" />
                <a-input class="col-2" v-model="nameTypeProductAdd" placeholder="Loại sản phẩm" />
                <a-button type="primary" @click="saveAddTypeProduct">
                    Lưu
                </a-button>
                <a-button type="danger" v-show="!isAddTypeProduct" @click="handleCancelAdd">
                    Hủy
                </a-button>
            </div>
        </template>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allTypeProduct.length}} đánh giá</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
                <a-divider type="vertical" />
                <input type="button" @click="deleteRaceSelected" value="Xóa">
            </div>
            <div>
                Thời gian: 
                <date-picker v-model="value1" type="date" @change="onChangeDate" range placeholder="Chọn thời gian"></date-picker>
            </div>
        </div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8; margin-top: 10px"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange1 }"
            :columns="columns"
            :data-source="allTypeProduct"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template
                v-for="col in ['titleType', 'name']"
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
                        <a @click="() => saveEdit(record)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(record)">Cancel</a>
                    </span>
                    <span v-else>
                        <!-- <a @click="() => saveEdit(record)">Save</a> -->
                        <a :disabled="editingKey !== ''" @click="() => edit(record)">Chỉnh sửa</a>
                        <a-divider type="vertical" />
                        <a @click="deleteRace(record, key)">Xóa</a>
                        <a-divider type="vertical" />
                        <a @click="moreTypeProduct(record)">Chi tiết</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="visible" title="Bình luận">
            <span>Loại sản phẩm: {{editTypeProduct.titleType}}</span>
            <a-button v-show="isAddTypeDetailProduct" type="primary" style="margin:0 0 10px 10px" @click="isAddTypeDetailProduct = !isAddTypeDetailProduct">
                Thêm chi tiết loại sản phẩm
            </a-button>
            <template>
                <div class="add-comment row" v-show="!isAddTypeDetailProduct">
                    <span class="col-2">{{!isAddTypeDetailProduct ? 'Trả lời:' : ''}}</span>
                    <a-input class="col-6" v-model="contentProductAdd1" placeholder="Nội dung" />
                    <a-button type="primary" @click="saveAddComment1">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isAddTypeDetailProduct" @click="handleCancelAdd1">
                        Hủy
                    </a-button>
                </div>
            </template>
            <p>Có {{editTypeProduct.type ? editTypeProduct.type.length : '0'}} trả lời</p>
            <a-table
                style="border-bottom: 1px solid #e8e8e8"
                :row-selection="{ selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1 }"
                :columns="innerColumns"
                :data-source="editTypeProduct.type"
                :scroll="{ y: 300 }"
                :pagination = false
            >
                <template
                    v-for="col in ['titleTypeDetail', 'name']"
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
                            <a @click="() => saveEditTypeDetailProduct(record)">Save</a>
                            <a-divider type="vertical" />
                            <a @click="() => cancelEditTypeDetailProduct(record)">Cancel</a>
                        </span>
                        <span v-else>
                            <a :disabled="editingKey1 !== ''" @click="() => editTypeDetailProduct(record)">Chỉnh sửa</a>
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
    title: 'Id loại sản phẩm',
    dataIndex: 'id',
    width: '10%',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: 'Tên loại sản phẩm',
    dataIndex: 'titleType',
    // width: '15%'
    scopedSlots: { customRender: 'titleType' },
  },
  {
    title: 'Loại sản phẩm',
    dataIndex: 'name',
    // width: '15%'
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Thời gian thêm',
    dataIndex: 'time',
    // width: '15%'
    scopedSlots: { customRender: 'time' },
  },
  {
    title: 'Hành động',
    width: '15%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerColumns = [
  {
    title: 'Tên chi tiết loại sản phẩm',
    dataIndex: 'titleTypeDetail',
    scopedSlots: { customRender: 'titleTypeDetail' },
    width: '40%'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: 'Hành động',
    width: '16%',
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
            innerColumns,
            selectedRowKeys: [],
            allTypeProduct: [],
            allTypeProductBackup: [],
            productAll: [],
            accountAll: [],
            isAddTypeProduct: true,
            isAddTypeDetailProduct: true,
            editingKey: '',
            editingKey1: '',
            countStar: 0,
            titleTypeProductAdd: '',
            nameTypeProductAdd: '',
            value1: ['',''],
            cacheData: [],
            editTypeProduct: [],
            visible: false,
            selectedRowKeys1: []
        }
    },
    components: {DatePicker},
    async created(){
        // await this.getAccount()
        // await this.getProductDetail()
        this.getTypeProduct()
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allTypeProduct = this.allTypeProductBackup
        }
    },
    methods:{
        moreTypeProduct(item){
            this.editTypeProduct = item
            this.visible = true;
            this.cacheData1 = item.type.map(item => ({ ...item }));
        },
        edit(record) {
            const newData = [...this.allTypeProduct];
            const target = newData.filter(item => item.name === record.name)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allTypeProduct = newData;
            }
        },
        cancel(record) {
            const newData = [...this.allTypeProduct];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                delete target.editable;
                this.allTypeProduct = newData;
            }
        },
        saveEdit(record) {
            const newData = [...this.allTypeProduct];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id === record.id)[0];
            const targetCache = newCacheData.filter(item => item.id === record.id)[0];
            if (target && targetCache) {
                delete target.editable;
                target.time = new Date().toJSON(),
                this.updateTypeProductId(record.id, target)
                this.getTypeProduct()
                this.allTypeProduct = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            this.editingKey = '';
        },
        saveEditTypeDetailProduct(record) {
            const newData = [...this.editTypeProduct.type];
            const newCacheData = [...this.cacheData1];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            if (target && targetCache) {
                delete target.editable1;
                target.time = new Date().toJSON(),
                this.editTypeProduct.type = newData;
                this.updateTypeProductId(this.editTypeProduct.id, this.editTypeProduct)
                this.getTypeProduct()
                Object.assign(targetCache, target);
                this.cacheData1 = newCacheData;
            // this.cacheData1 = item.type.map(item => ({ ...item }));
            }
            this.editingKey1 = '';
        },
        editTypeDetailProduct(record) {
            const newData = [...this.editTypeProduct.type];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey1 = record.id;
            if (target) {
                target.editable1 = true;
                this.editTypeProduct.type = newData;
            }
        },
        cancelEditTypeDetailProduct(record) {
            const newData = [...this.editTypeProduct.type];
            const target = newData.filter(item => item.id == record.id)[0];
            this.editingKey1 = '';
            if (target) {
                Object.assign(target, this.cacheData1.filter(item => item.id == record.id)[0]);
                delete target.editable1;
                this.editTypeProduct.type = newData;
            }
        },
        handleChange(value, record, column) {
            const newData = [...this.allTypeProduct];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.allTypeProduct = newData;
            }
        },
        handleChange1(value, record, column) {
            const newData = [...this.editTypeProduct.type];
            const target = newData.filter(item => item.name === record.name)[0];
            if (target) {
                target[column] = value;
                this.editTypeProduct.type = newData;
            }
        },
        deleteRace(item){
            this.deteleTypeProduct(item.id)
            this.getTypeProduct()
        },
        deleteRaceSelected(){
            this.allTypeProduct.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deteleTypeProduct(item.id)
                    }
                })
            })
            // await this.getAccount()
            // await this.getProductDetail()
            this.getTypeProduct()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allTypeProductBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allTypeProduct = a
            }
        },
        saveAddTypeProduct(){
            const checkTitle = this.allTypeProduct.map(item =>{
                    return item.titleType.toLowerCase().trim();
                }).indexOf(this.titleTypeProductAdd.toLowerCase().trim());
            const checkName = this.allTypeProduct.map(item =>{
                    return item.name.toLowerCase().trim();
                }).indexOf(this.nameTypeProductAdd.toLowerCase().trim());
            const a = {
                "titleType": this.titleTypeProductAdd.trim(),
                "name": this.nameTypeProductAdd.toLowerCase().trim(),
                "time": new Date(),
                "type": []
            }
            if(!this.titleTypeProductAdd || !this.nameTypeProductAdd){
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
            else if(Number(checkTitle) > -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Tên loại sản phẩm tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else if(Number(checkName) > -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Loại sản phẩm tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else{
                this.createTypeProduct(a)
                this.getTypeProduct()
                this.isAddTypeProduct = true
                this.titleTypeProductAdd = ''
                this.nameTypeProductAdd = ''
            }
        },
        handleCancelAdd(){
            this.isAddTypeProduct = true
            this.titleTypeProductAdd = ''
            this.nameTypeProductAdd = ''
        },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        onSelectChange1(selectedRowKeys) {
            this.selectedRowKeys1 = selectedRowKeys;
        },
        async getTypeProduct(){
            const {data} = await PostsRepository.getTypeProduct();
            this.allTypeProduct = data
            this.allTypeProductBackup = data
            this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleTypeProduct(id){
            const {data} = await PostsRepository.deteleTypeProduct(id);
            this.allTypeProduct = data
        },
        async updateTypeProductId(id, payload){
            const {data} = await PostsRepository.updateTypeProductId(id, payload);
            this.allTypeProduct = data
        },
        async createTypeProduct(payload){
            const {data} = await PostsRepository.createTypeProduct(payload);
            this.allTypeProduct= data
        },
        async getProductDetail(){
            const {data} = await PostsRepository.getProductDetail();
            this.productAll = data
        },
    }
}
</script>

<style lang="scss">

</style>