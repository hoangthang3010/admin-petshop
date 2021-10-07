<template>
    <div>
        <h3>Quản lý đánh giá sao sản phẩm</h3>
        <a-table
            style="border-bottom: 1px solid #e8e8e8"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            :data-source="allRateProduct"
            :scroll="{ y: 355 }"
            :pagination = false
        >
            <div slot="action" slot-scope="text, record, key">
                <a>Chỉnh sửa</a>
                <a-divider type="vertical" />
                <a @click="deleteRateProduct(record, key)">Xóa</a>
            </div>
        </a-table>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'productId',
    // width: '40%'
  },
  {
    title: 'Số sao đánh giá',
    dataIndex: 'star',
    // width: '15%'
  },
  {
    title: 'Id người dùng',
    dataIndex: 'userId',
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
            allRateProduct: []
        }
    },
    created(){
        this.getRateProduct()
    },
    methods:{
        deleteRateProduct(item){
            this.deleteRateProducId(item.id)
            this.getRateProduct()
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
        },
        async getRateProduct(){
            const {data} = await PostsRepository.getRateProduct();
            this.allRateProduct = data
        },
        async deleteRateProducId(id){
            const {data} = await PostsRepository.deleteRateProduct(id);
            this.allRateProduct = data
        }
    }
}
</script>

<style scoped>

</style>