<template>
    <div>
        <h3>Quản lý giống nòi</h3>
        <a-button v-show="isAddRace" type="primary" @click="isAddRace = !isAddRace">
            Thêm
        </a-button>
        <template>
            <div class="add-star add-comment row" v-show="!isAddRace">
                <span class="col-2">{{!isAddRace ? 'Thêm giống nòi:' : ''}}</span>
                <a-input class="col-2" v-model="titleRaceAdd" placeholder="Tên giống nòi" />
                <a-input class="col-2" v-model="nameRaceAdd" placeholder="Loại giống nòi" />
                <a-button type="primary" @click="saveAddStar">
                    Lưu
                </a-button>
                <a-button type="danger" v-show="!isAddRace" @click="handleCancelAdd">
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
                <input type="button" @click="deleteRaceSelected" value="Xóa">
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
            <template
                v-for="col in ['titleRace', 'name']"
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
                        <a @click="onDeleteRace(record, key)">Xóa</a>
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
    dataIndex: 'titleRace',
    // width: '15%'
    scopedSlots: { customRender: 'titleRace' },
  },
  {
    title: 'Loại giống nòi',
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
            isAddRace: true,
            editingKey: '',
            countStar: 0,
            titleRaceAdd: '',
            nameRaceAdd: '',
            value1: ['',''],
            cacheData: []
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
            this.allRace = this.allRaceBackup
        }
    },
    methods:{
        edit(record) {
            const newData = [...this.allRace];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allRace = newData;
            }
        },
        cancel(record) {
            const newData = [...this.allRace];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                delete target.editable;
                this.allRace = newData;
            }
        },
        saveEdit(record) {
            const newData = [...this.allRace];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id === record.id)[0];
            const targetCache = newCacheData.filter(item => item.id === record.id)[0];
            if (target && targetCache) {
                delete target.editable;
                target.time = new Date().toJSON(),
                this.updateRaceId(record.id, target)
                this.getRace()
                this.allRace = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            this.editingKey = '';
        },
        handleChange(value, record, column) {
            const newData = [...this.allRace];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.allRace = newData;
            }
        },
        onDeleteRace(item){
            this.deleteRace(item.id)
            this.getRace()
        },
        deleteRaceSelected(){
            this.allRace.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deleteRace(item.id)
                    }
                })
            })
            // await this.getAccount()
            // await this.getProductDetail()
            this.getRace()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allRaceBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allRace = a
            }
        },
        saveAddStar(){
            const checkTitle = this.allRace.map(item =>{
                    return item.titleRace.toLowerCase().trim();
                }).indexOf(this.titleRaceAdd.toLowerCase().trim());
            const checkName = this.allRace.map(item =>{
                    return item.name.toLowerCase().trim();
                }).indexOf(this.nameRaceAdd.toLowerCase().trim());
            const a = {
                "titleRace": this.titleRaceAdd.trim(),
                "name": this.nameRaceAdd.toLowerCase().trim(),
                "time": new Date()
            }
            if(!this.titleRaceAdd || !this.nameRaceAdd){
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
                    'Tên giống nòi tồn tại',
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
                    'Loại giống nòi tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else{
                this.createRace(a)
                this.getRace()
                this.isAddRace = true
                this.titleRaceAdd = ''
                this.nameRaceAdd = ''
            }
        },
        handleCancelAdd(){
            this.isAddRace = true
            this.titleRaceAdd = ''
            this.nameRaceAdd = ''
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        async getRace(){
            const {data} = await PostsRepository.getRace();
            this.allRace = data
            this.allRaceBackup = data
            this.cacheData = data.map(item => ({ ...item }));
        },
        async deleteRace(id){
            const {data} = await PostsRepository.deleteRace(id);
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