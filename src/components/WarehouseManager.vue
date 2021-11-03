<template>
    <div>
        <h3>Quản lý loại sản phẩm</h3>
        <a-button type="primary" @click="updateWarehouse">
            Thêm
        </a-button>
        <!-- <template>
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
        </template> -->
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allWarehouse.length}} đánh giá</span>
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
            :data-source="allWarehouse"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template slot="nameProduct" slot-scope="text, record">
                {{productAll.filter(item => item.id == record.idProduct)[0].title}}
            </template>
            <template slot="amountProduct" slot-scope="text, record">
                {{productAll.filter(item => item.id == record.idProduct)[0].product_amount}}
            </template>
            <template slot="action" slot-scope="text, record">
                <div class="editable-row-operations">
                    <span>
                        <a @click="moreTypeProduct(record)">Chi tiết</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="listImportGoods" title="Nhập hàng">
            <p>Sản phẩm: {{productAll.filter(item => item.id == detailImport.idProduct)[0] && productAll.filter(item => item.id == detailImport.idProduct)[0].title}}</p>
            <a-button v-show="isImportGoods" type="primary" style="margin:0 0 10px 0px" @click="isImportGoods = !isImportGoods">
                Nhập hàng
            </a-button>
            <template>
                <div class="add-comment row" v-show="!isImportGoods">
                    <span class="col-2">{{!isImportGoods ? 'Nhập hàng:' : ''}}</span>
                    <a-input class="col-6" v-model="amountImport" placeholder="Số lượng" />
                    <a-button type="primary" @click="saveAddComment1">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isImportGoods" @click="handleCancelAdd">
                        Hủy
                    </a-button>
                </div>
            </template>
            <p>Đã nhập {{detailImport.listImportGoods ? detailImport.listImportGoods.length : '0'}} lần</p>
            <a-table
                style="border-bottom: 1px solid #e8e8e8"
                :row-selection="{ selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1 }"
                :columns="innerColumns"
                :data-source="detailImport.listImportGoods && detailImport.listImportGoods.sort(sort.fn)"
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
            </a-table>
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'idProduct',
    width: '10%',
    scopedSlots: { customRender: 'idProduct' },
  },
  {
    title: 'Tên sản phẩm',
    key: 'nameProduct',
    scopedSlots: { customRender: 'nameProduct' },
  },
  {
    title: 'Số lượng hàng',
    width: '10%',
    key: 'amountProduct',
    scopedSlots: { customRender: 'amountProduct' },
  },
  {
    title: 'Thời gian tạo',
    dataIndex: 'time',
    width: '15%',
    scopedSlots: { customRender: 'time' },
  },
  {
    title: 'Hành động',
    width: '10%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerColumns = [
  {
    title: 'Số lượng hàng được nhập',
    dataIndex: 'count',
    scopedSlots: { customRender: 'count' },
    width: '40%'
  },
  {
    title: 'Thời gian nhập hàng',
    dataIndex: 'time',
    scopedSlots: { customRender: 'time' },
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
            allWarehouse: [],
            allWarehouseBackup: [],
            productAll: [],
            accountAll: [],
            isAddTypeProduct: true,
            isImportGoods: true,
            editingKey: '',
            editingKey1: '',
            countStar: 0,
            titleTypeProductAdd: '',
            nameTypeProductAdd: '',
            value1: ['',''],
            cacheData: [],
            detailImport: [],
            listImportGoods: false,
            selectedRowKeys1: [],
            sort:{
                fn: (a, b) => {
                    var n1 = a.time.toLowerCase() 
                    var n2 = b.time.toLowerCase()
                    if (n1 < n2){return 1}
                    if (n1 > n2){return -1}
                    return 0
                }
            },
            amountImport: ''
        }
    },
    components: {DatePicker},
    async created(){
        // await this.getAccount()
        await this.getProductDetail()
        this.getWarehouse()
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allWarehouse = this.allWarehouseBackup
        }
    },
    methods:{
        updateWarehouse(){
            this.productAll.forEach(item =>{
              this.allWarehouse.forEach(elem =>{
                if(item.id !== elem.idProduct){
                    const date = new Date()
                    const newElem = {
                        idProduct: item.id,
                        time: date,
                        listImportGoods: [],
                        listExportGoods: []
                    }
                    this.allWarehouse.push(newElem)
                    // this.createWarehouse(newElem)
                }
              })
            })
            console.log(this.allWarehouse);
        },
        handleCancelAdd(){
            this.amountImport = ''
            this.isImportGoods = true
        },
        saveAddComment1(){
            if(this.amountImport){
                const date = new Date()
                const a = {
                    "id": [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                    "count": this.amountImport,
                    "time": date.toJSON(),
                }
                const newData = [...this.detailImport.listImportGoods];
                const newCacheData = [...this.cacheData1];
                this.detailImport.listImportGoods = newData.concat(a);
                this.updateWarehouseId(this.detailImport.id, this.detailImport)
                this.getWarehouse()
                this.cacheData1 = newCacheData;
                this.editingKey1 = '';
                this.amountImport = ''
                this.isImportGoods = true
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
        moreTypeProduct(item){
            this.detailImport = item
            this.listImportGoods = true;
            this.cacheData1 = item.listImportGoods.map(item => ({ ...item }));
        },
        edit(record) {
            const newData = [...this.allWarehouse];
            const target = newData.filter(item => item.name === record.name)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allWarehouse = newData;
            }
        },
        cancel(record) {
            const newData = [...this.allWarehouse];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                delete target.editable;
                this.allWarehouse = newData;
            }
        },
        saveEdit(record) {
            const newData = [...this.allWarehouse];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id === record.id)[0];
            const targetCache = newCacheData.filter(item => item.id === record.id)[0];
            if (target && targetCache) {
                delete target.editable;
                target.time = new Date().toJSON(),
                this.updateWarehouseId(record.id, target)
                this.getWarehouse()
                this.allWarehouse = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            this.editingKey = '';
        },
        saveEditTypeDetailProduct(record) {
            const newData = [...this.detailImport.type];
            const newCacheData = [...this.cacheData1];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            if (target && targetCache) {
                delete target.editable1;
                target.time = new Date().toJSON(),
                this.detailImport.type = newData;
                this.updateWarehouseId(this.detailImport.id, this.detailImport)
                this.getWarehouse()
                Object.assign(targetCache, target);
                this.cacheData1 = newCacheData;
            // this.cacheData1 = item.type.map(item => ({ ...item }));
            }
            this.editingKey1 = '';
        },
        editTypeDetailProduct(record) {
            const newData = [...this.detailImport.type];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey1 = record.id;
            if (target) {
                target.editable1 = true;
                this.detailImport.type = newData;
            }
        },
        cancelEditTypeDetailProduct(record) {
            const newData = [...this.detailImport.type];
            const target = newData.filter(item => item.id == record.id)[0];
            this.editingKey1 = '';
            if (target) {
                Object.assign(target, this.cacheData1.filter(item => item.id == record.id)[0]);
                delete target.editable1;
                this.detailImport.type = newData;
            }
        },
        handleChange(value, record, column) {
            const newData = [...this.allWarehouse];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.allWarehouse = newData;
            }
        },
        handleChange1(value, record, column) {
            const newData = [...this.detailImport.type];
            const target = newData.filter(item => item.name === record.name)[0];
            if (target) {
                target[column] = value;
                this.detailImport.type = newData;
            }
        },
        deleteRace(item){
            this.deteleWarehouse(item.id)
            this.getWarehouse()
        },
        deleteRaceSelected(){
            this.allWarehouse.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deteleWarehouse(item.id)
                    }
                })
            })
            // await this.getAccount()
            // await this.getProductDetail()
            this.getWarehouse()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allWarehouseBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allWarehouse = a
            }
        },
        saveAddTypeProduct(){
            const checkTitle = this.allWarehouse.map(item =>{
                    return item.titleType.toLowerCase().trim();
                }).indexOf(this.titleTypeProductAdd.toLowerCase().trim());
            const checkName = this.allWarehouse.map(item =>{
                    return item.name.toLowerCase().trim();
                }).indexOf(this.nameTypeProductAdd.toLowerCase().trim());
            const a = {
                "titleType": this.titleTypeProductAdd.trim(),
                "name": this.nameTypeProductAdd.toLowerCase().trim(),
                "time": new Date()
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
                this.createWarehouse(a)
                this.getWarehouse()
                this.isAddTypeProduct = true
                this.titleTypeProductAdd = ''
                this.nameTypeProductAdd = ''
            }
        },
        // handleCancelAdd(){
        //     this.isAddTypeProduct = true
        //     this.titleTypeProductAdd = ''
        //     this.nameTypeProductAdd = ''
        // },
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        onSelectChange1(selectedRowKeys) {
            this.selectedRowKeys1 = selectedRowKeys;
        },
        async getWarehouse(){
            const {data} = await PostsRepository.getWarehouse();
            this.allWarehouse = data
            this.allWarehouseBackup = data
            this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleWarehouse(id){
            const {data} = await PostsRepository.deteleWarehouse(id);
            this.allWarehouse = data
        },
        async updateWarehouseId(id, payload){
            const {data} = await PostsRepository.updateWarehouseId(id, payload);
            this.allWarehouse = data
        },
        async createWarehouse(payload){
            const {data} = await PostsRepository.createWarehouse(payload);
            this.allWarehouse= data
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