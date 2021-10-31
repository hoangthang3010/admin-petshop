<template>
    <div class="user-manager">
        <h3>Quản lý tài khoản</h3>
        <div>
            <select id="cars" class="select-type" name="cars" v-model="valueSelect">
                <option value="all">Khách hàng</option>
                <option value="dog">Quản trị viện</option>
            </select>
        </div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="allAccount"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <template
                v-for="col in ['fullname', 'username', 'email','phonenumber']"
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
            <template
                slot="status"
                slot-scope="text, record"
            >
                <div :key="record.editable">
                    <template>
                        <a-switch 
                            v-if="record.status == 'activate'" 
                            default-checked 
                            :disabled="record.editable ? disabled : ''"
                            @change="onChangeStatusAccount(record)"
                        />
                        <a-switch 
                            v-else  
                            :disabled="record.editable ? disabled : ''"
                            @change="onChangeStatusAccount(record)"
                        />
                    </template>
                </div>
            </template>
            <template
                slot="birthday"
                slot-scope="text, record"
            >
                <date-picker
                    v-if="record.editable"
                    style="width: 100%" 
                    v-model="record.birthday" 
                    valueType="format"
                ></date-picker>
                <template v-else>
                {{text}}
                </template>
            </template>
            <template
                slot="sex"
                slot-scope="text, record"
            >
                <a-select
                    v-if="record.editable" 
                    v-model="record.sex" 
                    style="width: 67px" 
                >
                    <a-select-option title="Nam" value="0">
                        Nam
                    </a-select-option>
                    <a-select-option title="Nữ" value="1">
                        Nữ
                    </a-select-option>
                    <a-select-option title="Khác" value="2" >
                        Khác
                    </a-select-option>
                </a-select>
                <template v-else>
                {{ text == '0' ? 'Nam' : text == '1' ? 'Nữ':'Khác'}}
                </template>
            </template>
            <template
                slot="avatar"
                slot-scope="text, record"
            >
                <template v-if="record.editable" style="text-align: center">
                    <div style="text-align: center; width: 90px; position: relative">
                        <img
                        style="height: 60px; margin-bottom: 10px; border: 1px solid rgb(238, 238, 238)"
                            :src="record.avatar" alt="Ảnh đại diện"
                        />
                        <div style="height: 20px">
                            <span v-if="changeImage">
                                <a @click="onChangeImage">Thay ảnh</a>
                                <a-divider type="vertical" />
                                <a @click="onDeleteImage(record)">Xóa</a>     
                            </span>
                            <span v-else class="change-image">
                                <a @click="onCancelImage(record)">Hủy</a>
                                <a-divider type="vertical" />
                                <input type="file" accept="image/jpeg" @change="(e) =>uploadImage(e,record)">
                            </span>
                        </div>
                    </div>
                </template>
                <div class="image" v-else>
                    <img
                        :src="record.avatar" alt="Ảnh đại diện"
                    />
                </div>
            </template>
            <template slot="action" slot-scope="text, record">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="() => save(record)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(record)">Cancel</a>
                    </span>
                    <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => edit(record)">Chỉnh sửa</a>
                        <a-divider type="vertical" />
                        <a @click="deleteAccount(record)">Xóa</a>
                        <!-- <a-divider type="vertical" />
                        <a @click="moreCommentProduct(record)">Chi tiết</a> -->
                    </span>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Ảnh',
    dataIndex: 'avatar',
    scopedSlots: { customRender: 'avatar' },
    width: 120,
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'fullname',
    width: '10%',
    scopedSlots: { customRender: 'fullname' },
    sorter: (a, b) => {
       var n1 = a.fullname.toLowerCase() 
       var n2 = b.fullname.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'username',
    width: '12%',
    scopedSlots: { customRender: 'username' },
    sorter: (a, b) => {
       var n1 = a.username.toLowerCase() 
       var n2 = b.username.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    scopedSlots: { customRender: 'email' },
    // width: '15%',
    sorter: (a, b) => {
       var n1 = a.email.toLowerCase() 
       var n2 = b.email.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phonenumber',
    scopedSlots: { customRender: 'phonenumber' },
    width: '10%',
    sorter: (a, b) => {
       var n1 = a.phonenumber.toLowerCase() 
       var n2 = b.phonenumber.toLowerCase()
       if (n1 < n2)
        {return -1}
        if (n1 > n2)
        {return 1}
        return 0
    },
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'birthday',
    scopedSlots: { customRender: 'birthday' },
    width: '11%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' },
    width: 90,
    sorter: (a, b) => a.sex - b.sex,
  },
  {
    title: 'Trạng thái tài khoản',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: 80,
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
    title: 'Id người dùng',
    dataIndex: 'userId',
    width: '15%',
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    scopedSlots: { userId: 'content' },
    // width: '15%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    // scopedSlots: { customRender: 'time' },
    // width: '15%'
  },
  {
    title: 'Hành động',
    width: '0%',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
const innerData = [];
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    userId: '2014-12-24 23:12:00',
    content: 'This is production name',
    time: 'Upgraded: 56',
  });
}
import {RepositoryFactory} from '../api/RepositoryFactory';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
const emailValidator = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
const phoneValidate = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/

export default {
    components: { DatePicker },
    data() {
        return {
            columns,
            innerColumns,
            selectedRowKeys: [],
            allAccount: [],
            editingKey: '',
            innerData,
            visible: false,
            replyComment: [],
            cacheData: [],
            changeImage: true
        }
    },
    created(){
        this.getCommentProduct()
        this.getAccount()
    },
    methods:{
        onChangeImage(){
            this.changeImage = false
            this.$forceUpdate()
        },
        onCancelImage(record){
            this.changeImage = true
            const newData = [...this.allAccount];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            target.avatar = targetCache.avatar
            this.$forceUpdate()
        },
        moreCommentProduct(item) {
            this.replyComment = item
            this.visible = true;
        },
        handleOk() {
            // console.log(e);
            // this.visible = false;
        },
        onChangeStatusAccount(record){
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id == record.id)[0];
            if (target && record.status == "activate") {
                target["status"] = "deactivate";
                this.allAccount = newData;
            }
            else{
                target["status"] = "activate";
                this.allAccount = newData;
            }
        },
        handleChange(value, record, column) {
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id == record.id)[0];
            if (target) {
                target[column] = value;
                this.allAccount = newData;
            }
        },
        edit(record) {
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id === record.id)[0];
            this.editingKey = record.id;
            if (target) {
                target.editable = true;
                this.allAccount = newData;
            }
        },
        save(record) {
            const newData = [...this.allAccount];
            const newCacheData = [...this.cacheData];
            const target = newData.filter(item => item.id == record.id)[0];
            const targetCache = newCacheData.filter(item => item.id == record.id)[0];
            let checkUsername = 0
            let checkemail = 0
            newData.map(item =>{
               if(item.username == record.username){ 
                   checkUsername+=1
                }
               if(item.email == record.email){ 
                   checkemail+=1
                }
            })
            if(checkUsername>1){
                this.$notification['error']({
                    message: 'Tên đăng nhập đã tồn tại',
                    description:
                    '',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
            }
            else if(checkemail>1){
                this.$notification['error']({
                    message: 'Email đã tồn tại',
                    description:
                    '',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
            }
            else if(!emailValidator.test(record.email)){
                this.$notification['error']({
                    message: 'Email không đúng định dạng',
                    description:
                    '',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
            }
            else if(!phoneValidate.test(record.phonenumber)){
                this.$notification['error']({
                    message: 'Số điện thoại không đúng định dạng',
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
                    this.updateAccount(record.id, target)
                    this.getAccount()
                    this.allAccount = newData;
                    Object.assign(targetCache, target);
                    this.cacheData = newCacheData;
                }
                this.editingKey = '';
                this.changeImage = false
            }
        },
        cancel(record) {
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id == record.id)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter(item => item.id == record.id)[0]);
                target.editable = false;
                this.allAccount = newData;
            }
            this.changeImage = false
        },
        onDeleteImage(record){
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id == record.id)[0];
            target.avatar = "https://www.unmc.edu/cihc/_images/faculty/default.jpg"
        },
        deleteAccount(item){
            this.deteleAccount(item.id)
            this.getAccount()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        uploadImage(e, record){
            const newData = [...this.allAccount];
            const target = newData.filter(item => item.id == record.id)[0];
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                target.avatar = e.target.result;
            };
        },
        async getCommentProduct(){
            const {data} = await PostsRepository.getCommentProduct();
            this.allAccount = data
        // this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleAccount(id){
            const {data} = await PostsRepository.deteleAccount(id);
            this.allAccount = data
        },
        async getAccount(){
            const {data} = await PostsRepository.getAccount();
            this.allAccount = data.filter(item => item.role == 'user')
            this.cacheData = data.map(item => ({ ...item }));
            // 
        },
        async updateAccount(id, payload){
            const {data} = await PostsRepository.updateAccount(id, payload);
            this.allAccount = data.filter(item => item.role == 'user')
        },
    }
}
</script>

<style lang="scss">
/* .editable-row-operations a {
  margin-right: 8px;
} */
.user-manager{
    .ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body{
        max-height: 60vh !important;
    }
}
.ant-modal{
    width: 900px !important;
    top: 40px !important
}
.ant-table-thead > tr > th, .ant-table-tbody > tr > td{
    padding: 16px  5px!important;
    .image{
        width: 90px;
        border: 1px solid rgb(238, 238, 238);
        text-align: center;
        img{
            height: 88px;
        }
    }
}
.upload-image{
    // position: absolute;
    // width: 400px;
    // text-align: left;
}
.change-image{
    display: flex;
    align-items: center;
    width: max-content;
}
</style>