<template>
    <!-- HTML SCSS JSResult Skip Results Iframe
EDIT ON -->
  <div>
  <div id="app">
    <user-table></user-table>
  </div>
  <template id="pagination">
    <ul class="pagination">
      <li v-for="(i,key) in maxPages" :key="key">
        <a href='#'
          :class="{'active': currentPage === i}"
          @click="$emit('change', i)">
          {{ i}}
        </a>
      </li>
    </ul>
  </template>

  <template id="user-table">
    <div>
      <header class="table-info">
        <p>
          Viewing {{ resultIndexBeg }} - {{ resultIndexEnd }} of {{ totalData }} results
        </p>
      <pagination-control
        @change="changePage"
        :current-page="page"
        :max-pages="totalPages">
      </pagination-control>
      </header>
      <table>
        <thead>
          <tr>
            <th v-for="col in userCols" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <img class="avatar" :src="user.avatar" alt="">
            </td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
          </tr>        
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
const pagination = Vue.component('pagination-control', {
  template: '#pagination',
  data() {
    return {};
  },
  props: {
    currentPage: {
      default: 1,
      required: true,
    },
    maxPages: {
      type: Number,
      default: 1,
      required: true,
    },
  },
});

const userTable = Vue.component('user-table', {
  template: '#user-table',
  components: { 'pagination-control': pagination },
  data() {
    return {
      baseUrl: 'https://reqres.in/api/users',
      page: 1,
      perPage: 4,
      totalPages: 0,
      users: [],
      userCols: ['Id', 'Avatar', 'First Name', 'Last Name']
    };
  },
  computed: {
    resultIndexBeg() {
      // Don't do this
      return this.users.length > 0 ? this.users[0].id : 0;
    },
    resultIndexEnd() {
      // Don't do this
      return this.users.length > 0 ? this.users[this.users.length - 1].id : 0;
    },
  },
  methods: {
    getData() {
      try {
        fetch(`${this.baseUrl}?page=${this.page}&per_page=${this.perPage}`)
          .then((response) => response.json())
          .then((json) => {
          this.totalPages = json.total_pages;
          this.totalData = json.total;
          this.users = json.data;
        });
      }
      catch(err) {
        
      }

    },
    changePage(page) {
      this.page = page;
    },
  },
  watch: {
    page: {
      immediate: true,
      handler(newVal, oldVal) {
        this.getData();
      },
    },
  },
});


new Vue({
  el: '#app',
});
</script>