<template>
    <div class="user-manager">
        <h3>Quản lý slide</h3>
        <a-button v-show="isAddSlide" type="primary" @click="isAddSlide = !isAddSlide">
            Thêm
        </a-button>
        <template>
            <!-- <div class="add-star add-comment row" v-show="!isAddSlide">
                <span class="col-2">{{!isAddSlide ? 'Thêm giống nòi:' : ''}}</span>
                <a-input class="col-2" v-model="titleRaceAdd" placeholder="Tên giống nòi" />
                <a-input class="col-2" v-model="nameRaceAdd" placeholder="Loại giống nòi" />
                <a-button type="primary" @click="saveAddStar">
                    Lưu
                </a-button>
                <a-button type="danger" v-show="!isAddSlide" @click="handleCancelAdd">
                    Hủy
                </a-button>
            </div> -->
            <a-button v-show="valueSelect == 'admin' && isAddAccount" type="primary" @click="isAddAccount = !isAddAccount">
                Thêm
            </a-button>
            <div class="add-comment row add-account" v-show="!isAddSlide">
                <span class="col-1">{{!isAddSlide ? 'Thêm slide:' : ''}}</span>
                <a-input class="col-2" v-model="idProductAdd" placeholder="Id sản phẩm" />
                <a-input class="col-4" v-model="contentSliddeAdd" placeholder="Nội dung" />
                <div>
                    <input type="file" accept="image/jpeg" @change="uploadImageAddSlide">
                <!-- <img v-show="imageAddSlide"  class="image-add" :src="imageAddSlide" alt="Ảnh đại diện"> -->
                    <a @click="handlePreviewImage(imageAddSlide)" style="text-decoration: underline">Xem</a>
                </div>
                <div>
                    <a-button type="primary" @click="saveAddSlide">
                        Lưu
                    </a-button>
                    <a-button type="danger" v-show="!isAddAccount" @click="handleCancelAdd">
                        Hủy
                    </a-button>
                </div>
            </div>
        </template>
        <div class="toolbar-top" style="margin-top: 10px">
            <div>
                <span>Có {{allSlide.length}} slides</span>
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
            :data-source="allSlide"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template
                v-for="col in ['idProduct', 'content']"
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
                        <!-- {{productAll.filter(item=> item.id == record.idProduct )}} -->
                    {{ col == 'idProduct' ? text + ' - ' + productAll.filter(item=> item.id == record.idProduct )[0].title : text ? text : '-Trống-'}}
                    </template>
                </div>
            </template>
            <template
                slot="image"
                slot-scope="text, record"
            >
                <template v-if="record.editable" style="text-align: center">
                    <div style="text-align: center; width: 90px; position: relative">
                        <img
                        style="height: 60px; margin-bottom: 10px; border: 1px solid rgb(238, 238, 238)"
                            :src="record.image" alt="Ảnh slide"
                        />
                        <div style="height: 20px"> 
                            <span v-if="changeImage">
                                <a @click="onChangeImage">Thay ảnh</a>
                                <!-- <a-divider type="vertical" />
                                <a @click="onDeleteImage(record)">Xóa</a> -->
                            </span>
                            <span v-else class="change-image">
                                <a @click="onCancelImage(record)">Hủy</a>
                                <a-divider type="vertical" />
                                <input type="file" accept="image/jpeg" @change="(e) =>uploadImage(e,record)">
                            </span>
                        </div>
                    </div>
                </template>
                <div class="image" style="width: 166px" v-else>
                    <img
                        @click="handlePreviewImage(record.image)"
                        :src="record.image" alt="Ảnh slide"
                    />
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
                        <a @click="deleteSlide(record, key)">Xóa</a>
                    </span>
                </div>
            </template>
        </a-table>
        <a-modal v-model="visible" title="Xem ảnh">
            <img
                :src="previewImage" alt="Ảnh slide"
            />
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id slide',
    dataIndex: 'id',
    width: '6%',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: 'Ảnh',
    dataIndex: 'image',
    width: '24%',
    scopedSlots: { customRender: 'image' },
  },
  {
    title: 'Id sản phẩm - Tên sản phẩm',
    dataIndex: 'idProduct',
    width: '15%',
    scopedSlots: { customRender: 'idProduct' },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    // width: '15%'
    scopedSlots: { customRender: 'content' },
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
            allSlide: [],
            allSlideBackup: [],
            productAll: [],
            accountAll: [],
            isAddSlide: true,
            editingKey: '',
            countStar: 0,
            titleRaceAdd: '',
            nameRaceAdd: '',
            value1: ['',''],
            cacheData: [],
            imageAddSlide: null,
            changeImage: true,
            previewImage: null,
            visible: false,
            idProductAdd: ''
        }
    },
    components: {DatePicker},
    async created(){
        // await this.getAccount()
        await this.getProductDetail()
        this.getSlide()
    },
    updated(){
        if(!this.value1[0] || !this.value1[1]){
            this.allSlide = this.allSlideBackup
        }
    },
    methods:{
        handlePreviewImage(image){
            this.previewImage = image
            this.visible = true
        },
        edit(record) {
            const newData = [...this.allSlide];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allSlide = newData;
            }
        },
        cancel(record) {
            const newData = [...this.allSlide];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id === record.id)[0]);
                delete target.editable;
                this.allSlide = newData;
            }
        },
        handleChange(value, record, column) {
            const newData = [...this.allSlide];
            const target = newData.filter(item => item.id === record.id)[0];
            if (target) {
                target[column] = value;
                this.allSlide = newData;
            }
        },
        deleteSlide(item){
            this.deteleSlide(item.id)
            this.getSlide()
        },
        deleteRaceSelected(){
            this.allSlide.forEach((item, key) =>{
                this.selectedRowKeys.forEach(elem =>{
                    if(key == elem){
                        this.deteleSlide(item.id)
                    }
                })
            })
            // await this.getAccount()
            // await this.getProductDetail()
            this.getSlide()
            this.selectedRowKeys = []
        },
        onChangeDate(){
            const startDate = this.value1[0]
            const endDate = new Date(this.value1[1].setTime(this.value1[1].getTime() + 23 * 3600 * 1000+59*60*1000 + 59*1000));
            if(this.value1[0] && this.value1[1]){
                const a = this.allSlideBackup.filter(item => new Date(item.time) >= startDate &&  new Date(item.time) <= endDate)
                this.allSlide = a
            }
        },
        saveEdit(record) {
            const checkIdProduct = this.productAll.map(item =>{
                    return item.id;
                }).indexOf(Number(record.idProduct));
            const newData = [...this.allSlide];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            if(Number(checkIdProduct) == -1){
                this.$notification['error']({
                    message: 'Id sản phẩm không tồn tại',
                    description:
                    '',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
            }
            else {
                if (target && targetCache) {
                    delete target.editable;
                    target.time = new Date().toJSON();
                    this.updateSlideId(record.id, target)
                    this.getSlide()
                    this.allSlide = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                    this.$forceUpdate()
                }
                this.editingKey = '';
                this.changeImage = false
            }
        },
        saveAddSlide(){
            const checkIdProduct = this.productAll.map(item =>{
                    return item.id;
                }).indexOf(Number(this.idProductAdd));
            const a = {
                "idProduct": this.idProductAdd,
                "content": this.contentSliddeAdd,
                "time": new Date(),
                "image": this.imageAddSlide
            }
            if(!this.idProductAdd || !this.imageAddSlide){
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
            else if(Number(checkIdProduct) == -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Id sản phẩm không tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else{
                this.createSlide(a)
                this.getSlide()
                this.isAddSlide = true
                this.$notification['success']({
                    message: 'Thêm tài khoản thành công',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
                this.idProductAdd = ''
                this.contentSliddeAdd = ''
                this.imageAddSlide = null
            }
        },
        handleCancelAdd(){
            this.isAddSlide = true
            this.idProductAdd = ''
            this.contentSliddeAdd = ''
            this.imageAddSlide = null
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        onChangeImage(){
            this.changeImage = false
            this.$forceUpdate()
        },
        onCancelImage(record){
            this.changeImage = true
            const newData = [...this.allSlide];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            target.image = targetCache.image
            this.$forceUpdate()
        },
        uploadImage(e, record){
            const newData = [...this.allSlide];
            const target = newData.filter(item => item.id == record.id)[0];
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                target.image = e.target.result;
            };
        },
        uploadImageAddSlide(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                this.imageAddSlide = e.target.result;
            };
        },
        async getSlide(){
            const {data} = await PostsRepository.getSlide();
            this.allSlide = data
            this.allSlideBackup = data
            this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleSlide(id){
            const {data} = await PostsRepository.deteleSlide(id);
            this.allSlide = data
        },
        async updateSlideId(id, payload){
            const {data} = await PostsRepository.updateSlideId(id, payload);
            this.allSlide = data
        },
        async createSlide(payload){
            const {data} = await PostsRepository.createSlide(payload);
            this.allSlide= data
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