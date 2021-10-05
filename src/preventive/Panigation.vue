<template>
    <div id="app" class="col-sm-12">
        <div class="offset">
            <div 
                class="product__right__item col-3"
                v-for="(item, key) in displayedPosts" 
                :key="key"
            >
                <img :src="item.image"/>
                <router-link 
                    :to="`/purchase/${item.type}/${item.detail}/${key}`"
                    style="text-decoration: none"
                > 
                    <p class="product__right__item__name" :title="item.title">{{item.title}}</p>
                </router-link>
                <p class="product__right__item__price" :title="item.price">{{item.price}}</p>
            </div>
            <!-- {{productAll}} -->
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <button 
                            type="button" 
                            class="page-link" 
                            v-if="page != 1"
                             @click="page--"
                        >
                            Previous 
                        </button>
                    </li>
                    <li class="page-item">
                        <button 
                            type="button" 
                            class="page-link" 
                            v-for="(pageNumber, key) in pages.slice(page-1, page+5)"
                            :key="key"
                            @click="page = pageNumber"
                        > 
                            {{pageNumber }}</button>
                    </li>
                    <li class="page-item">
                        <button 
                            type="button" 
                            @click="page++" 
                            v-if="page < pages.length" 
                            class="page-link"
                        > 
                            Next 
                        </button>
                    </li>
                </ul>
            </nav>	
        </div>
    </div>
</template>
<script>
export default {
  data () {
		return {
			posts : [''],
			page: 1,
			perPage: 9,
			pages: [],		
		}
	},
    props: ["productAll"],
	methods:{
		getPosts () {	
            this.posts = this.productAll
    //   let data = [];
    //   for(let i = 0; i < 50; i++){
    //     this.posts.push({first: 'John',
    //            last:'Doe', 
    //            suffix:'#' + i});
    //   }  
		},
		setPages () {
			let numberOfPages = Math.ceil(this.posts.length / this.perPage);
			for (let index = 1; index <= numberOfPages; index++) {
				this.pages.push(index);
			}
		},
		paginate (posts) {
			let page = this.page;
			let perPage = this.perPage;
			let from = (page * perPage) - perPage;
			let to = (page * perPage);
			return  posts.slice(from, to);
		}
	},
	computed: {
		displayedPosts () {
			return this.paginate(this.posts);
		}
	},
	watch: {
		posts () {
			this.setPages();
		}
	},
	created(){
		this.getPosts();
	},
	filters: {
		trimWords(value){
			return value.split(" ").splice(0,20).join(" ") + '...';
		}
	}
}
</script>
<style>
button.page-link {
	display: inline-block;
}
button.page-link {
    font-size: 20px;
    color: #29b3ed;
    font-weight: 500;
}
.offset{
  width: 500px !important;
  margin: 20px auto;  
}
</style>