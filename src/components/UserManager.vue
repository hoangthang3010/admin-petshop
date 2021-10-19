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
            <!-- <template>
                <a-table
                    slot="expandedRowRender"
                    :columns="innerColumns"
                    :data-source="innerData"
                    :pagination="false"
                >
                </a-table>
            </template> -->
            <template
                v-for="col in ['productId', 'userId', 'content']"
                :slot="col"
                slot-scope="text, record"
            >
                <div :key="col">
                    <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="e => handleChange(e.target.value, record.key, col)"
                    />
                    <template v-else>
                    {{ text }}
                    </template>
                </div>
            </template>
            <template slot="action" slot-scope="text, record, key">
                <div class="editable-row-operations">
                    <span v-if="record.editable">
                        <a @click="() => save(key)">Save</a>
                        <a-divider type="vertical" />
                        <a @click="() => cancel(key)">Cancel</a>
                    </span>
                    <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => edit(key)">Chỉnh sửa</a>
                        <a-divider type="vertical" />
                        <a @click="deleteCommentProduct(record, key)">Xóa</a>
                        <a-divider type="vertical" />
                        <a @click="moreCommentProduct(record)">Chi tiết</a>
                    </span>
                </div>
            </template>
        </a-table>
        {{allCommentProduct}}
        <a-modal v-model="visible" title="Bình luận" @ok="handleOk">
            <p>Bình luận: {{replyComment.content}}</p>
            <p>Có {{replyComment.content}} trả lời cho bình luận này</p>
            <a-table
                style="border-bottom: 1px solid #e8e8e8"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                :columns="innerColumns"
                :data-source="replyComment.reply"
                :scroll="{ y: 300 }"
                :pagination = false
            >
                <template
                    v-for="col in ['userId', 'content', 'time']"
                    :slot="col"
                    slot-scope="text, record"
                >
                    <div :key="col">
                        <a-input
                        v-if="record.editable"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.key, col)"
                        />
                        <template v-else>
                        {{ text }}
                        </template>
                    </div>
                </template>
                <template slot="action" slot-scope="text, record, key">
                    <div class="editable-row-operations">
                        <span v-if="record.editable">
                            <a @click="() => save(record.key)">Save</a>
                            <a-divider type="vertical" />
                            <a @click="() => cancel(record.key)">Cancel</a>
                        </span>
                        <span v-else>
                            <a :disabled="editingKey !== ''" @click="() => edit(key)">Chỉnh sửa</a>
                            <a-divider type="vertical" />
                            <a @click="deleteCommentProduct(record, key)">Xóa</a>
                        </span>
                    </div>
                </template>
            </a-table>
        </a-modal>
    </div>
</template>

<script>
const columns = [
  {
    title: 'Id sản phẩm',
    dataIndex: 'productId',
    width: '10%',
    scopedSlots: { customRender: 'productId' },
  },
  {
    title: 'Id người dùng',
    dataIndex: 'userId',
    width: '12%',
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: 'Nội dung',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' },
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
    width: '25%',
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
const PostsRepository = RepositoryFactory.communicationAPI('posts')
export default {
    data() {
        return {
            columns,
            innerColumns,
            selectedRowKeys: [],
            allCommentProduct: [],
            editingKey: '',
            innerData,
            visible: false,
            replyComment: []
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
        moreCommentProduct(item) {
            this.replyComment = item
            this.visible = true;
        },
        handleOk() {
            // console.log(e);
            // this.visible = false;
        },
        handleChange(value, key, column) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter((item, key1) => key === key1)[0];
            if (target) {
                target[column] = value;
                this.allCommentProduct = newData;
            }
            console.log(value);
        },
        edit(key) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter((item, key1) => key === key1)[0];
            this.editingKey = key;
            if (target) {
                target.editable = true;
                this.allCommentProduct = newData;
            }
        },
        save(key) {
            const newData = [...this.allCommentProduct];
            const newCacheData = [...this.cacheData];
            const target = newData.filter((item, key1) => key === key1)[0];
            const targetCache = newCacheData.filter((item, key1) => key === key1)[0];
            if (target && targetCache) {
                target.editable = false;
                this.allCommentProduct = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            this.editingKey = '';
        },
        cancel(key) {
            const newData = [...this.allCommentProduct];
            const target = newData.filter((item, key1) => key === key1)[0];
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.filter((item, key1) => key === key1)[0]);
                target.editable = false;
                this.allCommentProduct = newData;
            }
        },
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
        this.cacheData = data.map(item => ({ ...item }));
        },
        async deteleCommentProductId(id){
            const {data} = await PostsRepository.deteleCommentProductId(id);
            this.allCommentProduct = data
        }
    }
}
</script>

<style lang="scss">
/* .editable-row-operations a {
  margin-right: 8px;
} */
.ant-modal{
    width: 900px !important;
    top: 40px !important
}
</style>