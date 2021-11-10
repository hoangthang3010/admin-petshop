<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo">
          <router-link to="/">
            <font-awesome-icon 
                class="header__top__mid__clientcare__icon"
                :icon="['fa', 'home']" 
                color="white"
                />
            <span> Chào</span>
            <span> Thắng</span>
          </router-link>
      </div>
      <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1">
          <router-link to="/product">
              <a-icon type="user" />
              <span>
                  Quản lý sản phẩm
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/order">
            <a-icon type="video-camera" />
            <span>
                Quản lý đơn hàng
            </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/user">
            <a-icon type="upload" />
            <span>Quản lý người dùng</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/rateproduct">
              <a-icon type="user" />
              <span>
                  Quản lý đánh giá
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="5">
          <router-link to="/commentproduct">
            <a-icon type="video-camera" />
              <span>
                  Quản lý bình luận
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="6">
          <router-link to="/race">
            <a-icon type="user" />
              <span>
                  Quản lý giống nòi
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="7">
          <router-link to="/typeproduct">
            <a-icon type="upload" />
              <span>
                  Quản lý loại sản phẩm
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="8">
          <router-link to="/slide">
              <a-icon type="video-camera" />
              <span>
                  Quản lý slide
              </span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="9">
          <router-link to="/warehouse">
              <a-icon type="user" />
              <span>
                  Quản lý kho hàng
              </span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style lang="scss">
#components-layout-demo-custom-trigger{
    flex-direction: inherit;
    height: 635px;
    overflow: hidden;
    .ant-layout-content{
        overflow-y: scroll;
    }
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  svg{
    font-size: 25px;
    margin-right: 10px;
  }
  .router-link-active{
    span{
      font-weight: bold;
      font-size: 14px;
      color: white;
    }
  }
}
</style>
