<template>
    <div>
        <h3>Quản lý bình luận sản phẩm</h3>
        <a-table
            style="border-bottom: 1px solid #e8e8e8"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="allCommentProduct"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <div slot="action" slot-scope="text, record, key">
                <a>Chỉnh sửa</a>
                <a-divider type="vertical" />
                <a @click="deleteCommentProduct(record, key)">Xóa</a>
            </div>
        </a-table>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'productId',
    width: '10%'
  },
  {
    title: 'Id người dùng',
    dataIndex: 'userId',
    width: '10%'
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    // width: '15%'
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    // width: '15%'
  },
  {
    title: 'Hành động',
    width: '15%',
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
            allCommentProduct: []
        }
    },
    // watch:{
    //     allCommentProduct(){
    //         this.getCommentProduct()
    //     }
    // },
    created(){
        this.getCommentProduct()
    },
    methods:{
        deleteCommentProduct(item){
            this.deteleCommentProductId(item.id)
            this.getCommentProduct()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        async getCommentProduct(){
            const {data} = await PostsRepository.getCommentProduct();
            this.allCommentProduct = data
        },
        async deteleCommentProductId(id){
            const {data} = await PostsRepository.deteleCommentProductId(id);
            this.allCommentProduct = data
        }
    }
}
</script>

<style scoped>

</style>