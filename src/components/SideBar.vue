<template>
  <div class="wrapper">
    <div class="logo">
      <!-- <img src="@/assets/bim-logo-white.png" alt="" /> -->
      <h2>SSQK</h2>
    </div>
    <div class="accordionn">
      <div v-for="(item, index) of sections" :key="index" class="accordionn">
        <div
          class="accordion_button_wrap"
          :class="{ 'bg-success': isActive(item.path) }"
        >
          <div @click="toNext(item.path)" class="accordion-btn">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      sections: [
        {
          title: "Asosiy sahifa",
          path: "/",
        },
        {
          title: "Vakansiyalar",
          path: "/vakansiya",
        },
        {
          title: "Nomzodlar",
          path: "/nomzod",
        },
        {
          title: "Arxiv",
          path: "/arxiv",
        },
        {
          title: "Qora ro'yhat",
          path: "/black_list",
        },
        {
          title: "Ro'yhatdan o'tkazish",
          path: "/register",
        },
        {
          title: "Tashkilotlar",
          path: "/organization_list",
        },
      ],
    };
  },
  computed: {
    apiDataUser() {
      return this.$store.state.apiDataUser; // Vuex state’dan olish
    },
  },
  methods: {
    toNext(par) {
      this.$router.push(par);
      let remove = document.querySelector(".remove_sidebar");
      let sidebar = document.querySelector(".wrapper");
      sidebar.classList.remove("active_sidebar");
      remove.classList.remove("active_remove");
    },
    isActive(path) {
      return this.$route.path === path;
    },
    watch: {
      apiDataUser(newValue) {
        this.user = newValue; // State o‘zgarganda lokal o‘zgaruvchiga yozish
      },
    },
    mounted() {
      this.$store.dispatch("getUserOne"); // API dan ma’lumot olish
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 250px;
  height: 100vh;
  padding: 15px 10px;
  background-color: #11101d;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: 0.2s;
}
.logo {
  display: flex;
  align-items: center;
}
.logo img {
  width: 50px;
}
.logo h2 {
  margin-top: 5px;
  margin-left: 10px;
  font-family: "Poppins";
  color: white;
  font-size: 20px;
  font-weight: 600;
}
.accordionn {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  margin-top: 10px;
}
.accordion_button_wrap {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  background-color: #2d2a50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 5px;
}
.accordion-btn {
  display: flex;
  align-items: center;
  color: #fff;
  width: 100%;
  height: 48px;
}

/* Aktiv sahifa uchun style */
.bg-success {
  background-color: #28a745 !important;
}

/* media  */
@media (max-width: 1360px) {
  .wrapper {
    width: 230px;
  }
}
@media (max-width: 1280px) {
  .wrapper {
    width: 270px;
    left: -100%;
    top: 0;
  }
}
@media (max-width: 500px) {
  .wrapper {
    width: 250px;
  }
}
</style>
