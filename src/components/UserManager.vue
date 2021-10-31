<template>
    <div class="user-manager">
        <h3>Quản lý tài khoản</h3>
        <div>
            <select id="cars" class="select-type" name="cars" v-model="valueSelect">
                <option value="client">Khách hàng</option>
                <option value="admin">Quản trị viên</option>
            </select>
            <a-button v-show="valueSelect == 'admin' && isAddAccount" type="primary" @click="isAddAccount = !isAddAccount">
                Thêm
            </a-button>
            <!-- <template> -->
                <div class="add-comment row add-account" v-show="!isAddAccount && valueSelect=='admin'">
                    <span>{{!isAddAccount ? 'Thêm tài khoản admin: ' : ''}}</span>
                    <a-input class="col-2" v-model="usernameAddAccount" placeholder="Tên đăng nhập" />
                    <a-input class="col-2" v-model="emailAddAccount" placeholder="Email" />
                    <a-input-password class="col-2" v-model="passwordAddAccount" placeholder="Mật khẩu" />
                    <a-input-password class="col-2" v-model="rePasswordAddAccount" placeholder="Nhập lại mật khẩu" />
                    <input type="file" accept="image/jpeg" @change="uploadImageAddAccount">
                    <img v-show="imageAddAccount"  class="image-add" :src="imageAddAccount" alt="Ảnh đại diện">
                    <div class="col-10"></div>
                    <div class="button-add-account">
                        <a-button type="primary" @click="saveAddAccount">
                            Lưu
                        </a-button>
                        <a-button type="danger" v-show="!isAddAccount" @click="handleCancelAdd">
                            Hủy
                        </a-button>
                    </div>
                </div>
            <!-- </template> -->
        </div>
        <div style="display: none">{{allAccount.length}}</div>
        <a-table
            style="border-bottom: 1px solid #e8e8e8"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="accountfilter"
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
                    {{ text ? text : '-Trống-'}}
                    </template>
                </div>
            </template>
            <template
                slot="status"
                slot-scope="text, record"
            >
            <!-- {{record.id}}-{{record.status}} -->
                <div :key="record.id">
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
                {{text ? text : '-Trống-'}}
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
                {{ text == '0' ? 'Nam' : text == '1' ? 'Nữ' : text == '2' ? 'Khác' : '-Trống-'}}
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
    title: 'Giới tính',
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
            changeImage: true,
            valueSelect: "client",
            isAddAccount: true,
            usernameAddAccount: '',
            emailAddAccount: '',
            imageAddAccount: null,
            passwordAddAccount: '',
            rePasswordAddAccount: ''
        }
    },
    created(){
        this.getCommentProduct()
        this.getAccount()
    },
    watch:{
        allAccount(){
            this.accountfilter()
        }
    },
    computed:{
        accountfilter(){
                if(this.valueSelect == 'client'){
                    return this.allAccount.filter(item => item.role == 'user')
                
                }
                else return this.allAccount.filter(item => item.role == 'admin')
            },
    },
    methods:{
        handleCancelAdd(){
            this.usernameAddAccount = ''
            this.emailAddAccount = ''
            this.imageAddAccount = null
            this.isAddAccount = true
        },
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
            else if(!phoneValidate.test(record.phonenumber) && this.valueSelect == "user"){
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
                    this.$forceUpdate()
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
        saveAddAccount(){
            const checkUsername = this.allAccount.map(item =>{
                    return item.username;
                }).indexOf(this.usernameAddAccount);
            const checkEmail = this.allAccount.map(item =>{
                    return item.email;
                }).indexOf(this.emailAddAccount);
            const a = {
                "username": this.usernameAddAccount,
                "email": this.emailAddAccount,
                "password": this.passwordAddAccount,
                "time": new Date(),
                "role": this.valueSelect,
                "status": "activate",
                "avatar": this.imageAddAccount ? this.imageAddAccount : "https://www.unmc.edu/cihc/_images/faculty/default.jpg"
            }
            if(!this.usernameAddAccount || !this.emailAddAccount || !this.passwordAddAccount || !this.rePasswordAddAccount){
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
            else if(Number(checkUsername) > -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Tên đăng nhập tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else if(Number(checkEmail) > -1){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Email đã tồn tại',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else if(this.rePasswordAddAccount != this.passwordAddAccount){
                this.$notification['error']({
                    message: 'Thêm thất bại',
                    description:
                    'Mật khẩu không khớp',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                });
            }
            else{
                this.createAccount(a)
                this.getAccount(this.valueSelect)
                this.isAddAccount = true
                this.$notification['success']({
                    message: 'Thêm tài khoản thành công',
                    duration: 2,
                    style: {
                        top: `75px`,
                        marginBottom: '10px'
                    },
                })
                this.usernameAddAccount = ''
                this.emailAddAccount = ''
                this.imageAddAccount = null
            }
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
        uploadImageAddAccount(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                this.imageAddAccount = e.target.result;
                console.log(this.imageAddAccount);
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
            this.cacheData = data.map(item => ({ ...item }));
            this.allAccount = data
            // 
        },
        async updateAccount(id, payload){
            const {data} = await PostsRepository.updateAccount(id, payload);
            this.allAccount = data
        },
        async createAccount(payload){
            const {data} = await PostsRepository.createAccount(payload);
            this.allAccount = data
        },
    }
}
</script>

<style lang="scss">
/* .editable-row-operations a {
  margin-right: 8px;
} */
.user-manager{
    .select-type{
        width: 100px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    .ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body{
        max-height: 60vh !important;
    }
    .add-account{
        position: relative;
        justify-content: space-between;
    }
    .image-add{
        position: absolute;
        bottom: 120%;
        width: 90px;
        height: 90px;
        right: 35%;
    }
    .button-add-account{
        margin-top: 10px;
        display: flex;
        flex: end;
    }
    .ant-input-affix-wrapper .ant-input-suffix{
        right: 24px !important
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