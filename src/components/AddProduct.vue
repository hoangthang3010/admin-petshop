<template>
    <div class="add-product">
        <div class="container" :style="`width: ${isShowDescribe ? '1200px': '600px'}`">
            <h4>Thêm sản phẩm</h4>
            <div>
                <div class="row">
                    <div :class="isShowDescribe ? 'col-6' : 'col-12'" style="min-height: 390px; margin-bottom: 10px">
                        <div class="row">
                            <div class="col-3">Tên sản phẩm <span class="obligatory">*</span></div>
                            <div class="col-9">
                                <input type="text" v-model="nameProduct">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">Loại thú cưng</div>
                            <div class="col-3">
                                <select id="cars" class="select-type" name="cars" v-model="valueSelectType">
                                    <option value="dog">Chó</option>
                                    <option value="cat">Mèo</option>
                                </select>
                            </div>
                            <div class="col-3">Loại sản phẩm</div>
                            <div class="col-3">
                                <select id="cars" class="select-type" name="cars" v-model="valueSelectTypeProduct">
                                    <option value="food">Thức ăn</option>
                                    <option value="medicine">Thuốc</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3">Giá <span class="obligatory">*</span></div>
                            <div class="col-3"><input type="number" v-model="priceProduct"></div>
                            <div class="col-3">Khuyến mãi</div>
                            <div class="col-3"><input type="number" v-model="saleProduct"></div>
                        </div>
                        <div class="row">
                            <div class="col-3">Số lượng <span class="obligatory">*</span></div>
                            <div class="col-3"><input type="number" v-model="amountProduct"></div>
                            <div class="col-3">Mô tả</div>
                            <div class="col-3"><input type="button" value="Thêm" @click="isShowDescribe = !isShowDescribe"></div>
                        </div>
                        <div class="row">
                            <div class="col-3">Ảnh <span class="obligatory">*</span></div>
                            <div class="col-9">
                                <input type="file" style="border: none" accept="image/jpeg" @change="uploadImage">
                                <img v-show="previewImage" :src="previewImage" alt="Ảnh sản phẩm">
                            </div>
                        </div>
                    </div>
                    <div class="col-6" v-show="isShowDescribe">
                        <div class="row" v-for="(item, key) in describe" :key="key">
                            <div class="col-3">{{item.title}}</div>
                            <div class="col-9"><input type="text" v-model="item.info"></div>
                        </div>
                    </div>
                </div>
                <!-- <div class="row">
                    <div class="col-3">Mô tả</div>
                    <div class="col-9"></div>
                </div> -->
            </div>
            <div>
                <input type="button" @click="onSave" value="Thêm">
                <input type="button" value="Hủy">
            </div>
        </div>
    </div>
</template>

<script>
import {RepositoryFactory} from '../api/RepositoryFactory';
const PostsRepository = RepositoryFactory.communicationAPI('posts')
    export default {
        data() {
            return {
                valueSelectType: 'dog',
                valueSelectTypeProduct: 'food',
                describe: [ 
                    {
                    "name": "function",
                    "title": "Công dụng",
                    "info": ""
                    },
                    {
                    "name": "quality_index",
                    "title": "Chỉ tiêu chất lượng",
                    "info": ""
                    },
                    {
                    "name": "main_ingredient",
                    "title": "Thành phần chính",
                    "info": ""
                    },
                    {
                    "name": "user_manual",
                    "title": "Hướng dẫn sử dụng",
                    "info": ""
                    },
                    {
                    "name": "TCCS",
                    "title": "TCCS số",
                    "info": ""
                    },
                    {
                    "name": "date_of_manufacture",
                    "title": "Số lô, ngày sản xuất",
                    "info": ""
                    },
                    {
                    "name": "expiration_date",
                    "title": "Hạn sử dụng",
                    "info": ""
                    },
                    {
                    "name": "net_weight",
                    "title": "Khối lượng tịnh",
                    "info": ""
                    },
                    {
                    "name": "origin",
                    "title": "Xuất xứ",
                    "info": ""
                    },
                    {
                    "name": "producer",
                    "title": "Nhà sản xuất",
                    "info": ""
                    },
                    {
                    "name": "address",
                    "title": "Địa chỉ",
                    "info": ""
                    }
                ],
                previewImage: null,
                nameProduct: '',
                priceProduct: '',
                saleProduct: 0,
                amountProduct: '',
                productAdd: [],
                followData: [],
                isShowDescribe: false
            }
        },
        beforeUpdate(){
            this.productAdd = {
                "type": this.valueSelectType,
                "title": this.nameProduct,
                "image": this.previewImage,
                "price": Number(this.priceProduct),
                "sale": Number(this.saleProduct),
                "type_product": this.valueSelectTypeProduct,
                "detail": this.valueSelectTypeProduct + '_' + this.valueSelectType,
                "product_amount": Number(this.amountProduct),
                "count": 1,
                // "describe": this.describe
            }
            if(this.isShowDescribe){
                Object.assign(this.productAdd, {"describe": this.describe})
            }
            // this.productAdd.push(this.describe)
            // Object.assign(this.productAdd,this.describe)
        },
        // updated(){
        //     if(!this.nameProduct) this.nameProduct = true
        // },
        methods:{
            onSave(){
                if(!this.nameProduct || !this.priceProduct || !this.amountProduct || !this.previewImage){
                    this.$notification['error']({
                        message: 'Thêm sản phẩm thất bại',
                        description:
                        'Vui lòng nhập lại đầy đủ các trường còn thiếu',
                        duration: 2,
                        style: {
                            marginTop: `75px`,
                            marginBottom: '-50px'
                        },
                    });
                }
                else{
                    this.$notification['success']({
                        message: 'Thêm sản phẩm thành công',
                        duration: 2,
                        style: {
                            marginTop: `75px`,
                            marginBottom: '-50px'
                        },
                    });
                    this.addProductDetail()
                    this.$emit('isShowFormAdd');
                }
            },
            uploadImage(e){
                const image = e.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    this.previewImage = e.target.result;
                    // console.log(this.previewImage);
                };
            },
            async addProductDetail(){
                const {data} = await PostsRepository.createProductDetail(this.productAdd);
                this.followData = data
            }
        }
    }
</script>

<style scoped lang="scss">
.add-product{
    .container{
        padding: 15px;
        // min-width: 1200px;
        min-height: 200px;
        background-color: white;
        >div{
            width: 100%;
            >div{
                padding: 0px 30px;
                >div{
                    padding: 0;
                    >div{
                        margin: 6px 0px;
                        div>select,
                        div>input{
                            height: 28px;
                            width: 100%;
                            border: 1px solid #bdbdbd;
                            // padding: 10px 30px 10px 10px ;
                            &:focus-visible{
                                outline: #bdbdbd;
                            }
                        }
                        div>img{
                            max-height: 160px
                        }
                    }
                }
            }
        }
        .obligatory{
            color: red;
        }
    }
}
</style>