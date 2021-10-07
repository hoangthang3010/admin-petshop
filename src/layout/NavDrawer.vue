<template>
  <div>
    <div className="topnav" 
      :style="`width: calc(100% - ${drawerWidth}px); 
                margin-left: ${drawerWidth}px; 
                height: 55px`"
    >
      <a-button v-if="drawerWidth == 0" type="primary" @click="showDrawer">
        Open
      </a-button>
      <a-button v-else type="primary" @click="onClose">
        Close
      </a-button>
      <a>Quản lý bán dodof cho t</a>
      <div style="margin-left: auto; margin-top: 15px">
        <!-- <a>{{username}}</a> -->
        <!-- <a href='./admin' @click={logOut}>Thoát</a> -->
      </div>
      
    </div>
    <a-drawer
      title="Basic Drawer"
      :placement="placement"
      :closable="false"
      :visible="visible"
      :mask="false"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    <div  
        class="children"  
        :style="`width: calc(100% - ${drawerWidth}px);
          margin-left: ${drawerWidth}px;
          height: 500px;
          background-color: #FAFAFA;
          height: 580px;
          overflow-y: scroll`"
      >
        <router-view/>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: true,
      placement: 'left',
      drawerWidth: 255
    };
  },
  methods: {
    showDrawer() {
      this.drawerWidth = 255
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      this.drawerWidth = 0
    }
  },
};
</script>