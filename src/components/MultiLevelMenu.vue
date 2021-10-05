<template>
    <div class="mutimenu">
        <!-- {{displayul}} -->
        <ul
            class="mutimenu__ul"
            v-for="(item, key) in menu" 
            :key="key"
        >
        <!-- :style="`border-left: 3px solid ${id == key ? 'orange' : 'white'}` -->
            <li 
                class="mutimenu__ul__li" 
                :style="`border-left:3px solid ${idli == item.name || id1 == item.name ? 'orange' : 'white'}`"
            >
                <!-- :style="`border-bottom:1px solid ${idli1 == key1 ? 'white' : '#ECECEC'}`" -->
                <router-link style="color: black; text-decoration: none"  :to ="`/product/${item.name}`">
                    <p 
                        class="mutimenu__ul__li__title"
                        @click="showBorderli(key, item.name)"
                        :style="`background-color: ${idli == item.name || id1 == item.name ? '#ECECEC' : 'white'}`"
                    >
                        {{item.title}}
                    </p>
                </router-link>
                <!-- <span
                    class="mutimenu__ul__li__icon"
                    v-if="item.type.length > 1"
                    @click="showDropDown(key)"
                >&#780;	</span> -->
                <div 
                    class="mutimenu__ul__li__icon"
                    :style="`transform: ${ displayul ==  item.name ? 'rotate(180deg)' : ''};
                             background-color: ${idli ==  item.name || id1 == item.name ? '#ECECEC' : 'white'}`"
                >
                    <font-awesome-icon
                        :icon="['fas', 'angle-down']" 
                        color="#939393"
                        v-if="item.type.length > 1"
                        @click="showDropDown(key, item.name)"
                    />
                </div>
                <ul 
                    class="mutimenu__ul__li__ul1"
                    v-for="(item1, key1) in item.type" 
                    :key="key1" 
                    :style="`display: ${displayul ==  item.name ? '' : 'none'}`"
                >
                    <router-link style="color: black; text-decoration: none" :to ="`/product/${item.name}/${item1.name}`">
                        <li 
                            class="mutimenu__ul__li__ul1__li1"
                            @click="showBorderli1(key,key1,item.name,item1.name)"
                            :style="`border-left:3px solid ${idli1 ==  item1.name? 'orange' : 'white'};
                                    background-color: ${idli1 ==  item1.name ? '#ECECEC' : 'white'};
                                    border-top:1px solid ${idli1 ==  item1.name ? '#00000026' : 'white'}
                                `"
                        >
                            {{item1.title}}
                        </li>
                     </router-link>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import '../scss/MultiLevelMenu.scss'
export default {
    data(){
        return{
            visible: false,
            id1: this.$route.params.id1,
            idli: this.$route.params.id,
            idli1: this.$route.params.id,
            displaybli1: null,
            displayul: this.$route.params.id1,
            menu: [
                {
                    title: "Tất cả",  
                    name: "all",
                    type: [
                        {
                            title: "Đồ cho Chó",
                            name: "dog",
                            type: []
                        },
                        {
                            title: "Đồ cho Mèo",
                            name: "cat",
                            type: []
                        },
                    ]
                },
                {
                    title: "Đồ ăn",
                    name: "food",
                    type: [
                        {
                            title: "Đồ ăn cho mèo",
                            name: "food_cat",
                        },
                        {
                            title: "Đồ ăn cho chó",
                            name: "food_dog",
                        },
                    ]
                },
                {
                    title: "Thuốc",
                    name: "medicine",
                    type: [
                        {
                            title: "Thuốc cho mèo",
                            name: "medicine_cat",
                        },
                        {
                            title: "Thuốc cho chó",
                            name: "medicine_dog",
                        },
                    ]
                }
            ]
        }
    },
    methods:{
        showBorderli(id, type){
            this.id1 = null
            this.$emit('type', type)
            console.log(id);
            this.idli=type
            this.idli1 = null
            this.displayul = null
            console.log(type);
            this.$emit('type', type)
            if (this.displayul !== type){
                this.displayul=type
                // console.log(id);
                // this.idli1=null
            }
            else{
                this.displayul = null
                // this.idli1=null
            }
            
        },
        showBorderli1(id,id1,type,type1){
            this.id1 = null
            console.log(id);
            console.log(id1);
            this.idli=type
            this.idli1=type1
            this.$emit('type', type1)
        },
        showDropDown(id, type){
            this.$emit('type', type)
            if (this.displayul !== type){
                this.displayul=type
                this.idli=type
                // console.log(id);
                // this.idli1=null
            }
            else{
                this.displayul = null
                // this.idli1=null
            }
        }
    }
}
</script>