<template>
    <div>
        <h3>Quản lý loại sản phẩm</h3>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allWarehouse.length}} đánh giá</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
                <a-divider type="vertical" />
                <input type="button" @click="deleteRaceSelected" value="Xóa">
                <a-divider type="vertical" />
                <a-button type="primary" @click="updateWarehouse">
                    Cập nhật
                </a-button>
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
            :data-source="allWarehouse"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template slot="nameProduct" slot-scope="text, record">
                {{productAll && productAll.filter(item => item.id == record.idProduct)[0].title}}
            </template>
            <template slot="amountProduct" slot-scope="text, record">
                {{productAll && productAll.filter(item => item.id == record.idProduct)[0].product_amount}}
            </template>
            <template slot="action" slot-scope="text, record">
                <div class="editable-row-operations">
                    <span>
                        <a @click="handleImport(record)">Nhập hàng</a>
                        <a-divider type="vertical" />
                        <a @click="handleExport(record)">Xuất hàng</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="isShowImport" title="Nhập hàng">
            <p>Sản phẩm: {{productAll && productAll.filter(item => item.id == detailImport.idProduct)[0] && productAll.filter(item => item.id == detailImport.idProduct)[0].title}}</p>
            <a-button v-show="isImportGoods" type="primary" style="margin:0 0 10px 0px" @click="isImportGoods = !isImportGoods">
                Nhập hàng
            </a-button>
            <template>
                <div class="add-comment row" v-show="!isImportGoods">
                    <span class="col-2">{{!isImportGoods ? 'Nhập hàng:' : ''}}</span>
                    <a-input class="col-6" v-model="amountImport" placeholder="Số lượng" />
                    <a-button type="primary" @click="saveImport()">
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
                :columns="importColumns"
                :data-source="detailImport.listImportGoods"
                :scroll="{ y: 300 }"
                :pagination = false
            >
                <!-- :row-selection="{ selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1 }" -->
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

        <a-modal v-model="isShowExport" title="Xuất hàng">
            <p>Sản phẩm: {{productAll.filter(item => item.id == detailExport.idProduct)[0] && productAll.filter(item => item.id == detailExport.idProduct)[0].title}}</p>
            <a-button v-show="isImportGoods" type="primary" style="margin:0 0 10px 0px" @click="isImportGoods = !isImportGoods">
                Xuất hàng
            </a-button>
            <template>
                <div class="add-comment row" v-show="!isImportGoods">
                    <span class="col-2">{{!isImportGoods ? 'Nhập hàng:' : ''}}</span>
                    <a-input class="col-6" v-model="amountImport" placeholder="Số lượng" />
                    <a-button type="primary" @click="saveExport()">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isImportGoods" @click="handleCancelAdd">
                        Hủy
                    </a-button>
                </div>
            </template>
            <p>Đã xuất {{detailExport.listExportGoods ? detailExport.listExportGoods.length : '0'}} lần</p>
            <a-table
                style="border-bottom: 1px solid #e8e8e8"
                :columns="exportColumns"
                :data-source="detailExport.listExportGoods"
                :scroll="{ y: 300 }"
                :pagination = false
            >
             <!-- && detailExport.listExportGoods.sort(sort.fn) -->
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
    title: 'Chi tiết',
    width: '15%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const importColumns = [
  {
    title: 'Số lượng',
    dataIndex: 'count',
    scopedSlots: { customRender: 'count' },
    width: '40%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    scopedSlots: { customRender: 'time' },
  },
];
const exportColumns = [
  {
    title: 'Số lượng',
    dataIndex: 'count',
    scopedSlots: { customRender: 'count' },
    width: '40%'
  },
  {
    title: 'Thời gian',
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
            importColumns,
            exportColumns,
            selectedRowKeys: [],
            allWarehouse: [],
            allWarehouseBackup: [],
            productAll: [],
            isShowImport: false,
            isShowExport: false,  
            isImportGoods: true,          
            editingKey: '',
            editingKey1: '',
            value1: ['',''],
            cacheData: [],
            detailImport: [],
            detailExport: [],
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
        async updateWarehouse(){
            const a = []
            this.productAll.forEach(item =>{
                const date = new Date()
                const newElem = {
                    idProduct: item.id,
                    time: date.toJSON(),
                    listImportGoods: [],
                    listExportGoods: []
                }
                a.push(newElem)
            })
            let b = [...this.allWarehouse, ...a]
            this.allWarehouse.forEach(elem =>{
                b = b.filter(item => item.idProduct !== elem.idProduct)
            })
            b.forEach(item => {
                this.createWarehouse(item)
                this.getWarehouse()
            })
        },
        handleCancelAdd(){
            this.amountImport = ''
            this.isImportGoods = true
        },
        saveImport(){
            if(this.amountImport){
                const date = new Date()
                const a = {
                    "id": [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                    "count": this.amountImport,
                    "time": date.toJSON(),
                }
                const newDataImport = [...this.detailImport.listImportGoods];
                const newCacheData = [...this.cacheData1];
                this.detailImport.listImportGoods = newDataImport.concat(a);
                this.productAll.forEach(item =>{
                    if(item.id == this.detailImport.idProduct){
                        const newCount = item.product_amount + Number(a.count)
                        const newElem = {
                            ...item,
                            product_amount: newCount,
                        }
                        this.updateProductDetail(item.id, newElem)
                        this.getProductDetail()
                        this.updateWarehouseId(this.detailImport.id, this.detailImport)
                        this.getWarehouse()
                        this.cacheData1 = newCacheData;
                        this.editingKey1 = '';
                        this.amountImport = ''
                        this.isImportGoods = true
                    }
                })
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
        saveExport(){
            if(this.amountImport){
                const date = new Date()
                const a = {
                    "id": [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                    "count": this.amountImport,
                    "time": date.toJSON(),
                }
                const newDataExport = [...this.detailExport.listExportGoods];
                const newCacheData = [...this.cacheData1];
                this.productAll.forEach(item =>{
                    if(item.id == this.detailExport.idProduct){
                        if(item.product_amount >= a.count){
                            this.detailExport.listExportGoods = newDataExport.concat(a);
                            const newCount = item.product_amount - Number(a.count)
                            const newElem = {
                                ...item,
                                product_amount: newCount,
                            }
                            this.updateProductDetail(item.id, newElem)
                            this.getProductDetail()
                            this.updateWarehouseId(this.detailExport.id, this.detailExport)
                            this.getWarehouse()
                            this.cacheData1 = newCacheData;
                            this.editingKey1 = '';
                            this.amountImport = ''
                            this.isImportGoods = true
                        }
                        else{
                            this.$notification['error']({
                                message: 'Xuất thất bại',
                                description:
                                'Kho không đủ hàng để xuất',
                                duration: 2,
                                style: {
                                    top: `75px`,
                                    marginBottom: '10px'
                                },
                            });
                        }
                    }
                })
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
        handleImport(item){
            this.detailImport = item
            this.isShowImport = true;
            this.cacheData1 = item.listImportGoods.map(item => ({ ...item }));
        },
        handleExport(item){
            this.detailExport = item
            this.isShowExport = true;
            this.cacheData1 = item.listExportGoods.map(item => ({ ...item }));
        },
        deleteRaceSelected(){
            this.allWarehouse.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deteleWarehouse(item.id)
                    }
                })
            })
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
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
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
        async updateProductDetail(id,payload) {
            const { data } = await PostsRepository.updateProductDetail(id,payload);
            this.productAll = data;
        },
    }
}
</script>

<style lang="scss">

</style>