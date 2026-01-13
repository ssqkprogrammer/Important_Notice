<template>
  <div>
    <!-- Alerts -->
    <DataAdd v-if="$store.state.data_add" />
    <DataBlock v-if="$store.state.data_block" />
    <DataAdd v-if="$store.state.data_add" />
    <DataError v-if="$store.state.data_error" />
    <DataDelete v-if="$store.state.data_delete" />
    <DataSendBasket v-if="$store.state.data_send_basket" />
    <Delete v-if="$store.state.delete" />
    <!-- Site content -->
    <div class="remove_sidebar"></div>
    <div class="side_content_wrapper">
      <div class="sidebar">
        <Sidebar />
      </div>
      <div class="content">
        <Header />
        <div>
          <router-view class="routerview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Sidebar from "../components/SideBar.vue";
import DataAdd from "../components/alerts/DataAdd.vue";
import DataBlock from "../components/alerts/DataBlock.vue";
import DataError from "../components/alerts/DataError.vue";
import DataDelete from "../components/alerts/DataDelete.vue";
import DataSendBasket from "../components/alerts/DataSendBasket.vue";
import Delete from "../components/alerts/Delete.vue";
export default {
  components: {
    Header,
    Sidebar,
    DataAdd,
    DataError,
    DataDelete,
    DataSendBasket,
    DataBlock,
    Delete,
  },
  mounted() {
    let bars = document.querySelector(".bars");
    let sidebar = document.querySelector(".wrapper");
    let remove = document.querySelector(".remove_sidebar");
    bars.addEventListener("click", function () {
      sidebar.classList.toggle("active_sidebar");
      remove.classList.toggle("active_remove");
      if (sidebar.classList.contains("active_sidebar")) {
        document.body.style.overflow = "hidden";
      }
    });
    remove.addEventListener("click", function () {
      sidebar.classList.remove("active_sidebar");
      remove.classList.remove("active_remove");
      document.body.style.overflow = "";
    });
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
button {
  cursor: pointer;
}
ul {
  padding: 0;
  margin: 0;
}
li {
  padding: 0;
  margin: 0;
}
a {
  padding: 0;
  margin: 0;
  text-decoration: none;
}
h2,
h3,
h4,
h5,
h6,
h1 {
  margin: 0;
  padding: 0;
  line-height: normal;
}
body {
  overflow-x: hidden;
}
.side_content_wrapper {
  display: grid;
  grid-template-columns: 250px auto;
}
.about {
  padding: 40px 0;
}
.about-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.remove_sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  background-color: rgba(0, 0, 0, 0.507);
  z-index: 50;
}
/* api buttons  */
.api-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}
.api-btns button,
.api-btns a {
  width: 30px;
  height: 30px;
  background-color: red;
  border: none;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* media  */
@media (max-width: 1360px) {
  .side_content_wrapper {
    grid-template-columns: 230px auto;
  }
}
@media (max-width: 1280px) {
  .side_content_wrapper {
    grid-template-columns: 0 100%;
  }
  .active_remove {
    display: block !important;
  }
  .active_sidebar {
    left: 0 !important;
  }
}
</style>
