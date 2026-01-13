<template>
  <nav>
    <div class="nav-wrapper d-flex align-items-center justify-content-between">
      <div class="bars">
        <i class="fa-solid fa-bars"></i>
      </div>
      <div class="nav-right d-flex align-items-center">
        <h4 class="me-2">{{ data.role }}</h4>
        <h4 class="me-2">{{ data.name }}</h4>

        <button class="btn btn-danger" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Chiqish
        </button>
      </div>
    </div>
  </nav>
</template>

Toq kunlarei

<script>
export default {
  data() {
    return {
      data: {},
    };
  },
  created() {},
  methods: {
    logout() {
      localStorage.clear();

      window.location.reload();
    },
  },
  computed: {
    apiDataUser() {
      return this.$store.state.apiDataUser; // Vuex state’dan olish
    },
  },
  watch: {
    apiDataUser(newValue) {
      this.data = newValue; // State o‘zgarganda lokal o‘zgaruvchiga yozish
    },
  },
  mounted() {
    this.$store.dispatch("getUserOne"); // API dan ma’lumot olish
  },
};
</script>

<style scoped>
nav {
  width: 100%;
  padding: 15px;
  background-color: #11101d;
  z-index: 60;
}

.nav-wrapper h4 {
  font-family: "Poppins";
  font-size: 16px;
  text-transform: capitalize;
  color: white;
}
.bars {
  cursor: pointer;
  visibility: hidden;
}
.bars i {
  color: white;
  /* display: none; */

  font-size: 20px;
}
/* media  */
@media (max-width: 1280px) {
  .bars {
    visibility: visible;
  }
}
</style>
