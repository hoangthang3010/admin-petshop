<template>
    <div>
        <h3>Quản lý giống nòi</h3>
        <a-button v-show="isAddStar" type="primary" @click="isAddStar = !isAddStar">
            Thêm
        </a-button>
        <template>
            <div class="add-star add-comment row" v-show="!isAddStar">
                <span class="col-2">{{!isAddStar ? 'Thêm giống nòi:' : ''}}</span>
                <a-input class="col-2" v-model="idProductAdd" placeholder="Tên giống nòi" />
                <a-input class="col-2" v-model="idProductAdd" placeholder="Loại giống nòi" />
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
                <span>Có {{allRace.length}} đánh giá</span>
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
            :data-source="allRace"
            :scroll="{ y: 355 }"
            :pagination = false
        >
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
    title: 'Id giống nòi',
    dataIndex: 'id',
    // width: '40%'
    scopedSlots: { customRender: 'id' },
  },
  {
    title: 'Tên giống nòi',
    dataIndex: 'title',
    // width: '15%'
    scopedSlots: { customRender: 'title' },
  },
  {
    title: 'Loại giống nòi',
    dataIndex: 'name',
    // width: '15%'
    scopedSlots: { customRender: 'name' },
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
            allRace: [],
            allRaceBackup: [],
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
        // await this.getAccount()
        // await this.getProductDetail()
        this.getRace()
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
        async getRace(){
            const {data} = await PostsRepository.getRace();
            this.allRace = data
            this.allRaceBackup = data
        },
        async deteleRace(id){
            const {data} = await PostsRepository.deteleRace(id);
            this.allRace = data
        },
        async updateRaceId(id, payload){
            const {data} = await PostsRepository.updateRaceId(id, payload);
            this.allRace = data
        },
        async createRace(payload){
            const {data} = await PostsRepository.createRace(payload);
            this.allRace= data
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