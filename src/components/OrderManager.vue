<template>
    <div class="order-manager">
        <h3>Quản lý đơn hàng</h3>
        <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center">
            <div>
                <span>Có {{allOrder.length}} đơn hàng</span>
                <a-divider type="vertical" />
                <span>Đã chọn {{selectedRowKeys.length}}</span>
                <a-divider type="vertical" />
                <input type="button" @click="deleteOrderSelected" value="Xóa">
            </div>
            <div>
                Thời gian: 
                <!-- <a-select
                    default-value="lifetime"
                    style="width: 100px" 
                >
                    <a-select-option value="lifetime">
                        Trọn đời
                    </a-select-option>
                    <a-select-option value="custom">
                        Tùy chỉnh
                    </a-select-option>
                </a-select> -->
                <date-picker v-model="value1" type="date" @change="onChangeDate" range placeholder="Chọn thời gian"></date-picker>
            </div>
        </div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8; margin-top: 10px"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="allOrder"
            :scroll="{ y: 355 }"
            :pagination = false
        > 
            <!-- <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
                {{ record.listProductOrder }}
            </p> -->
            <template
                slot="typePay"
                slot-scope="text"
            >
                {{ text == 'cash' ?  'Tiền mặt' : 'Paypal' }}
            </template>
            <template
                slot="total"
                slot-scope="text"
            >
                {{ text | filterPrice}}đ
            </template>
                <!-- {{ text == 'unconfirmed' ? 'Chưa xác nhận' : text == 'confirmed' ? 'Đã xác nhận':'Đã giao' | filterPrice}}đ -->
            <template
                slot="statusOrder"
                slot-scope="text, record"
            >
                <a-select
                    v-if="record.editable" 
                    v-model="record.statusOrder" 
                    style="width: 100px" 
                >
                    <a-select-option title="Chưa xác nhận" value="unconfirmed">
                        Chưa xác nhận
                    </a-select-option>
                    <a-select-option title="Đã xác nhận" value="confirmed">
                        Đã xác nhận
                    </a-select-option>
                    <a-select-option title="Đã giao" value="done" >
                        Đã giao
                    </a-select-option>
                </a-select>
                <template v-else>
                {{ text == 'unconfirmed' ? 'Chưa xác nhận' : text == 'confirmed' ? 'Đã xác nhận':'Đã giao'}}
                </template>
            </template>
            <template
                v-for="col in ['numberphone','address']"
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
                    {{ text ? text : '-'}}
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
                        <div>
                            <a :disabled="editingKey !== ''" @click="() => edit(record)">Chỉnh sửa</a>
                            <a-divider type="vertical" />
                            <a @click="deleteOrder(record, key)">Xóa</a>
                        </div>
                        <a @click="moreCommentProduct(record)">Chi tiết</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="visible" title="Đơn hàng">
            <!-- {{detailsProduct}}
            {{amountBackup}} -->
            <div class="row" style="align-items: center">
                <span class="col-2">Id đơn hàng: {{detailsProduct.id}}</span>
                <span class="col-4">Trạng thái đơn hàng: {{detailsProduct.statusOrder == 'unconfirmed' ? 'Chưa xác nhận' : detailsProduct.statusOrder == 'confirmed' ? 'Đã xác nhận':'Đã giao'}}</span>
                <a-button v-show="isAddProductOrder && detailsProduct.statusOrder == 'unconfirmed'" type="primary" @click="isAddProductOrder = !isAddProductOrder">
                    Thêm hàng cho đơn này
                </a-button>
            </div>
            <template>
                <div class="add-comment row" v-show="!isAddProductOrder">
                    <span class="col-1">{{!isAddProductOrder ? 'Thêm:' : ''}}</span>
                    <a-input class="col-2" v-model="idAddProductOrder" placeholder="Id sản phẩm" />
                    <a-input class="col-2" type="number" v-model="amountAddProductOrder" placeholder="Số lượng" />
                    <a-button type="primary" @click="saveAddProductOrder">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isAddProductOrder" @click="handleCancelAdd1">
                        Hủy
                    </a-button>
                </div>
            </template>
            <!-- <p>Có {{detailsProduct ? detailsProduct.length : '0'}} trả lời</p> -->
            <a-table
                style="border-bottom: 1px solid #e8e8e8; margin-top: 10px"
                :row-selection="{ selectedRowKeys: selectedRowKeys1, onChange: onSelectChange1 }"
                :columns="innerColumns"
                :data-source="detailsProduct.listProductOrder"
                :scroll="{ y: 300 }"
                :pagination = false
            >
                <template
                    v-for="col in ['idProduct', 'amount']"
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
                            <a :disabled="editingKey1 == '' && detailsProduct.statusOrder == 'unconfirmed' ? false : true" @click="() => edit1(record)">Chỉnh sửa</a>
                            <a-divider type="vertical" />
                            <a :disabled="detailsProduct.statusOrder == 'unconfirmed' ? false : true" @click="deleteProductOrder(record)">Xóa</a>
                        </span>
                    </div>
                </template>
            </a-table>
            <template slot="footer">
                <a-button key="back" @click="handleCancel">
                Return
                </a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
                Submit
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Loại thanh toán',
    dataIndex: 'typePay',
    sorter: (a, b) => {
       var n1 = a.typePay.toLowerCase() 
       var n2 = b.typePay.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
    width: '9%',
    scopedSlots: { customRender: 'typePay' },
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'total',
    sorter: (a, b) => a.total - b.total,
    width: '9%',
    scopedSlots: { customRender: 'total' },
  },
  {
    title: 'Trạng thái',
    dataIndex: 'statusOrder',
    // filters: [
    //   { text: 'Chưa xác nhận', value: 'male' },
    //   { text: 'Đã xác nhận', value: 'female' },
    //   { text: 'Đã giao', value: 'female' },
    // ],
    sorter: (a, b) => a.statusOrder.length - b.statusOrder.length,
    width: '12%',
    scopedSlots: { customRender: 'statusOrder' },
  },
  {
    title: 'Số điện thoại người nhận',
    dataIndex: 'numberphone',
    width: 134,
    scopedSlots: { customRender: 'numberphone' },
  },
  {
    title: 'Địa chi nhận hàng',
    dataIndex: 'address',
    sorter: (a, b) => {
       var n1 = a.address.toLowerCase() 
       var n2 = b.address.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
    // width: '15%'
    scopedSlots: { customRender: 'address' },
  },
  {
    title: 'Thời gian',
    dataIndex: 'dateOrder',
    width: 190,
    sorter: (a, b) => {
       var n1 = a.dateOrder.toLowerCase() 
       var n2 = b.dateOrder.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
    scopedSlots: { customRender: 'dateOrder' },
  },
  {
    title: 'Hành động',
    width: 130,
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerColumns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'idProduct',
    // width: '15%',
    scopedSlots: { customRender: 'idProduct' },
  },
  {
    title: 'Số lượng',
    dataIndex: 'amount',
    scopedSlots: { customRender: 'amount' },
    // width: '40%'
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
                selectedRowKeys1: [],
                editingKey: '',
                editingKey1: '',
                productAll: [],
                accountAll: [],
                detailsProduct: [],
                cacheData: [],
                cacheData1: [],
                visible: false,
                allOrder: [],
                allOrderBackup: [],
                value1: ['',''],
                isAddProductOrder: true,
                idAddProductOrder: '',
                amountAddProductOrder: '',
                allWarehouse: [],
                amountBackup: [],

                // value1: [new Date(2019, 9, 8), new Date(2019, 9, 19)],
                a: '',
                sort:{
                    fn: (a, b) =>   { 
                                        var n1 = a.statusOrder.length;
                                        // toLowerCase()
                                        var n2 = b.statusOrder.length;
                                        if (n1 < n2)
                                        {return 1}
                                        if (n1 > n2)
                                        {return -1}
                                        return 0
                                    }
                },
            }
        },
        components: { DatePicker },
        created(){
            this.getProductDetail()
            this.getAccount()
            this.getOrder()
            this.getWarehouse()
        },
        updated(){
            if(!this.value1[0] || !this.value1[1]){
                this.allOrder = this.allOrderBackup
            }
        },
        methods: {
            moreCommentProduct(record){
                this.detailsProduct = record
                this.visible = true
                this.cacheData1 = record.listProductOrder.map(item => ({ ...item }));
            },
            deleteOrderSelected(){
                // console.log(this.allOrder);
                // console.log(this.selectedRowKeys);
                this.allOrder.forEach((item, key) =>{
                    this.selectedRowKeys.forEach(elem =>{
                        if(key == elem){
                            // const newElem = {...item}
                            // console.log(newElem);
                            this.deteleOrder(item.id)
                        }
                    })
                })
                this.getOrder()
                this.selectedRowKeys = []
            },
            onChangeDate(){
                const startDate = this.value1[0]
                const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
                // this.allOrder.map(item => console.log(new Date(item.dateOrder)))
                console.log(startDate);
                console.log(endDate);
                if(this.value1[0] && this.value1[1]){
                    const a = this.allOrderBackup.filter(item => new Date(item.dateOrder) >= startDate &&  new Date(item.dateOrder) <= endDate)
                    this.allOrder = a
                }
            },
            onOk(value) {
            console.log('onOk: ', value);
            },
            onChange(value, dateString) {
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            },
            saveEdit(record){
                const newData = [...this.allOrder];
                const newCacheData = [...this.cacheData];
                const target = newData.filter(item => item.id === record.id)[0];
                const targetCache = newCacheData.filter(item => item.id === record.id)[0];
                if (target && targetCache) {
                    delete target.editable;
                    target.dateOrder = new Date().toJSON(),
                    this.updateOrderId(record.id, target)
                    this.getOrder()
                    this.allOrder = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
            },
            handleChange(value, record, column) {
                const newData = [...this.allOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                if (target) {
                    target[column] = value;
                    this.allOrder = newData;
                }
            },
            handleChange1(value, record, column) {
                const newData = [...this.detailsProduct.listProductOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                if (target) {
                    target[column] = Number(value);
                    this.detailsProduct.listProductOrder = newData;
                }
            },
            cancel(record) {
                const newData = [...this.allOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                    delete target.editable;
                    this.allOrder = newData;
                }
            },
            cancel1(record) {
                const newData = [...this.detailsProduct.listProductOrder];
                const target = newData.filter(item => item.id == record.id)[0];
                this.editingKey1 = '';
                if (target) {
                    Object.assign(target, this.cacheData1.filter(item => item.id == record.id)[0]);
                    delete target.editable1;
                    this.detailsProduct.listProductOrder = newData;
                }
                this.amountBackup = []
            },
            edit(record) {
                const newData = [...this.allOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                this.editingKey = record.id;
                if (target) {
                    target.editable = true;
                    this.allOrder = newData;
                }
            },
            edit1(record) {
                const newData = [...this.detailsProduct.listProductOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                this.amountBackup = {...record}
                this.editingKey1 = record.id;
                if (target) {
                    target.editable1 = true;
                    this.detailsProduct.listProductOrder = newData;
                }
            },
            save1(record) {
                const newData = [...this.detailsProduct.listProductOrder];
                const newCacheData = [...this.cacheData1];
                const target = newData.filter(item => item.id == record.id)[0];
                const targetCache = newCacheData.filter(item => item.id == record.id)[0];
                if (target && targetCache) {

                    this.productAll.forEach(item => {
                        if(item.id == target.idProduct){
                            if(item.product_amount >= target.amount){

                                delete target.editable1;
                                this.detailsProduct.listProductOrder = newData;
                                target.time = new Date().toJSON(),
                                this.updateOrderId(this.detailsProduct.id, this.detailsProduct)

                                const newCount = item.product_amount + Number(this.amountBackup.amount) - Number(target.amount)
                                const newQuantitySold = item.quantity_sold - Number(this.amountBackup.amount) + Number(target.amount)
                                const newElem = {
                                    ...item,
                                    product_amount: newCount,
                                    quantity_sold: newQuantitySold
                                }
                                this.updateProductDetail(item.id, newElem)
                                
                                this.allWarehouse.forEach(item => {
                                    if(item.idProduct == target.idProduct && this.amountBackup.amount != target.amount){
                                        const b = {
                                            ...item,
                                            listExportGoods: item.listExportGoods.concat({
                                                id: [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                                                count: Number(target.amount) - Number(this.amountBackup.amount),
                                                time: new Date()
                                            })
                                        }
                                        this.updateWarehouseId(item.id, b)
                                    }
                                })

                                this.getOrder()
                                this.getWarehouse()
                                this.getProductDetail()
                                Object.assign(targetCache, target);
                                this.cacheData1 = newCacheData;
                                this.editingKey1 = '';
                                this.amountBackup = []
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
            },
            saveAddProductOrder(){
                if(this.amountAddProductOrder && this.idAddProductOrder){
                    const a = {
                        "id": [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                        "idProduct": Number(this.idAddProductOrder),
                        "amount": Number(this.amountAddProductOrder),
                        "time": new Date().toJSON(),
                    }
                    const newData = [...this.detailsProduct.listProductOrder];
                    const newCacheData = [...this.cacheData1];
                    // this.detailsProduct = [...this.detailsProduct.listProductOrder]
                    this.productAll.forEach(item => {
                        if(item.id == this.idAddProductOrder){
                            if(item.product_amount >= this.amountAddProductOrder){
                                this.detailsProduct.listProductOrder = newData.concat(a);
                                const newCount = item.product_amount - Number(this.amountAddProductOrder)
                                const newQuantitySold = item.quantity_sold + Number(this.amountAddProductOrder)
                                const newElem = {
                                    ...item,
                                    product_amount: newCount,
                                    quantity_sold: newQuantitySold
                                }
                                this.updateProductDetail(item.id, newElem)
                                
                                this.allWarehouse.forEach(item => {
                                    if(item.idProduct == this.idAddProductOrder){
                                        const b = {
                                            ...item,
                                            listExportGoods: item.listExportGoods.concat({
                                                id: [...Array(30)].map(() => Math.random().toString(36)[2]).join(''),
                                                count: Number(this.amountAddProductOrder),
                                                time: new Date()
                                            })
                                        }
                                        this.updateWarehouseId(item.id, b)
                                    }
                                })
                                
                                this.updateOrderId(this.detailsProduct.id, this.detailsProduct)
                                this.getOrder()
                                this.getWarehouse()
                                this.getProductDetail()
                                this.cacheData1 = newCacheData;
                                this.editingKey1 = '';
                                this.idAddProductOrder = ''
                                this.amountAddProductOrder = ''
                                this.isAddProductOrder = true
                                this.amountBackup = []
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
            deleteOrder(item){
                this.updateOrderId(item.id)
                this.getOrder()
            },
            deleteProductOrder(record){
                let newData = [...this.detailsProduct.listProductOrder];
                const newCacheData = [...this.cacheData1];
                this.detailsProduct.listProductOrder = newData.filter(item => item.id !== record.id)
                newData = this.detailsProduct.listProductOrder
                this.updateOrderId(this.detailsProduct.id, this.detailsProduct)
                this.getOrder()
                this.cacheData1 = newCacheData;
                this.editingKey1 = '';
            },
            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },
            onSelectChange1(selectedRowKeys1) {
                this.selectedRowKeys1 = selectedRowKeys1;
            },
            async getOrder(){
                const {data} = await PostsRepository.getOrder();
                this.allOrder = data.sort(this.sort.fn)
                this.allOrderBackup = data.sort(this.sort.fn)
                this.cacheData = data.map(item => ({ ...item }));
            },
            async updateOrderId(id, payload){
                const {data} = await PostsRepository.updateOrderId(id, payload);
                this.allOrder = data
            },
            async deteleOrder(id){
                const {data} = await PostsRepository.deteleOrder(id);
                this.allOrder = data
            },
            async getProductDetail(){
                const {data} = await PostsRepository.getProductDetail();
                this.productAll = data
            },
            async updateProductDetail(id, payload){
                const {data} = await PostsRepository.updateProductDetail(id, payload);
                this.productAll = data
            },
            async getAccount(){
                const {data} = await PostsRepository.getAccount();
                this.accountAll = data
            },
            async getWarehouse(){
                const {data} = await PostsRepository.getWarehouse();
                this.allWarehouse = data
            },
            async updateWarehouseId(id, payload){
                const {data} = await PostsRepository.updateWarehouseId(id, payload);
                this.allWarehouse = data
            },
        },
        filters: {
            filterPrice: function (data) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
        },
    }
</script>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

<style lang="scss">
.select-type{
    border: 1px solid #bdbdbd;
    width: 80px;
    height: 30px;
    border-radius: 2px;
    &:focus-visible{
    outline: #bdbdbd;
    }
}
.order-manager{
    
}
.ant-table-thead > tr > th.ant-table-column-has-actions{
    padding: 5px !important;
}
a[disabled]{
    color: rgb(197, 197, 197);;
}
</style>