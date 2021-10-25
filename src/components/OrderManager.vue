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
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
    export default {
        data() {
            return {
                columns,
                selectedRowKeys: [],
                editingKey: '',
                productAll: [],
                accountAll: [],
                cacheData: [],
                allOrder: [],
                allOrderBackup: [],
                value1: ['',''],
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
        },
        methods: {
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
                if(this.value1[0] || this.value1[1]){
                    const a = this.allOrder.filter(item => item.dateOrder > this.value1[0].toJSON() &&  item.dateOrder < this.value1[1].toJSON())
                    this.allOrder = a
                }
                else this.allOrder = this.allOrderBackup
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
            edit(record) {
                const newData = [...this.allOrder];
                const target = newData.filter(item => item.id === record.id)[0];
                this.editingKey = record.id;
                if (target) {
                    target.editable = true;
                    this.allOrder = newData;
                }
            },
            deleteOrder(item){
                this.updateOrderId(item.id)
                this.getOrder()
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
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
            async getAccount(){
                const {data} = await PostsRepository.getAccount();
                this.accountAll = data
            }
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
</style>