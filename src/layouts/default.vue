<template>
  <div class="app-layout">
    <!-- Alerts -->
    <DataAdd v-if="$store.state.data_add" />
    <DataBlock v-if="$store.state.data_block" />
    <DataError v-if="$store.state.data_error" />
    <DataDelete v-if="$store.state.data_delete" />
    <DataSendBasket v-if="$store.state.data_send_basket" />
    <Delete v-if="$store.state.delete" />

    <!-- Header -->
    <div class="fixed-header">
      <Header />
    </div>

    <!-- Page Content -->
    <main class="page-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import DataAdd from "../components/alerts/DataAdd.vue";
import DataBlock from "../components/alerts/DataBlock.vue";
import DataError from "../components/alerts/DataError.vue";
import DataDelete from "../components/alerts/DataDelete.vue";
import DataSendBasket from "../components/alerts/DataSendBasket.vue";
import Delete from "../components/alerts/Delete.vue";

export default {
  components: {
    Header,
    DataAdd,
    DataBlock,
    DataError,
    DataDelete,
    DataSendBasket,
    Delete,
  },
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
}

/* Asosiy kontent */
.page-content {
  padding-top: 72px; /* Offset for fixed header */
  flex: 1;
  padding: 30px 40px;
}

/* API buttonlar */
.api-btns {
  display: flex;
  align-items: center;
  gap: 10px;
}

.api-btns button,
.api-btns a {
  width: 30px;
  height: 30px;
  background-color: #e74c3c;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

/* Fixed header */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

/* Responsive */
@media (max-width: 600px) {
  .page-content {
    padding: 15px 10px;
  }
}
</style>
