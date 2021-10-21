<template>
    <div>
        <h3>Quản lý đơn hàng</h3>
        <div style="margin-top: 10px">
            <span>Có {{allOrder.length}} đơn hàng</span>
            <a-divider type="vertical" />
            <span>Đã chọn {{selectedRowKeys.length}}</span>
            
            <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            :placeholder="['Start Time', 'End Time']"
            @change="onChange"
            @ok="onOk"
            />
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
                    <a-select-option value="unconfirmed">
                        Chưa xác nhận
                    </a-select-option>
                    <a-select-option value="confirmed">
                        Đã xác nhận
                    </a-select-option>
                    <a-select-option value="done" >
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
                slot-scope="text, record, key"
            >
                <div :key="col">
                    <a-input
                        v-if="record.editable" 
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, key, col)"
                    />
                    <template v-else>
                    {{ text ? text : '-'}}
                    </template>
                </div>
            </template>
            <template slot="action" slot-scope="text, record, key">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="() => saveEdit(key,record)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(key)">Cancel</a>
                    </span>
                    <span v-else>
                        <div>
                            <a :disabled="editingKey !== ''" @click="() => edit(key)">Chỉnh sửa</a>
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
    width: '9%',
    scopedSlots: { customRender: 'typePay' },
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'total',
    width: '9%',
    scopedSlots: { customRender: 'total' },
  },
  {
    title: 'Trạng thái',
    dataIndex: 'statusOrder',
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
    // width: '15%'
    scopedSlots: { customRender: 'address' },
  },
  {
    title: 'Thời gian',
    dataIndex: 'dateOrder',
    width: 190,
    scopedSlots: { customRender: 'dateOrder' },
  },
  {
    title: 'Hành động',
    width: 130,
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
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
                allOrder: []
            }
        },
        created(){
            this.getProductDetail()
            this.getAccount()
            this.getOrder()
        },
        methods: {
            onOk(value) {
            console.log('onOk: ', value);
            },
            onChange(value, dateString) {
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            },
            saveEdit(key, item){
                const newData = [...this.allOrder];
                const newCacheData = [...this.cacheData];
                const target = newData.filter((item, key1) => key === key1)[0];
                const targetCache = newCacheData.filter((item, key1) => key === key1)[0];
                if (target && targetCache) {
                    delete target.editable;
                    target.dateOrder = new Date().toJSON(),
                    this.updateOrderId(item.id, target)
                    this.getOrder()
                    this.allOrder = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
            },
            handleChange(value, key, column) {
                const newData = [...this.allOrder];
                const target = newData.filter((item, key1) => key === key1)[0];
                if (target) {
                    target[column] = value;
                    this.allOrder = newData;
                }
            },
            cancel(key) {
                const newData = [...this.allOrder];
                const target = newData.filter((item, key1) => key === key1)[0];
                this.editingKey = '';
                if (target) {
                    Object.assign(target, this.cacheData.filter((item, key1) => key === key1)[0]);
                    delete target.editable;
                    this.allOrder = newData;
                }
            },
            edit(key) {
                const newData = [...this.allOrder];
                const target = newData.filter((item, key1) => key === key1)[0];
                this.editingKey = key;
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
                this.allOrder = data
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
            // toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            },
        },
    }
</script>

<style scoped>

</style>