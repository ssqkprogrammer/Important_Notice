<template>
  <div class="login-page d-flex align-items-center justify-content-center">
    <div class="card login-card shadow-sm p-4">
      <div class="text-center mb-4">
        <h1 class="h5 fw-bold mb-1">SURXON SANOAT QURILISH KAMPANIYASIDAGI CHET EL FUQAROLARINI HISOBINI YURITISH UCHUN</h1>
        <p class="text-muted mb-0">Iltimos, tizimga kiring</p>
      </div>

      <form @submit.prevent="login" novalidate>
        <div class="mb-3">
          <label for="login" class="form-label">Login</label>
          <input
            v-mask="'##-###-##-##'"
            class="form-control"
            :class="{ 'is-invalid': checkPhone && !data.phone }"
            id="login"
            placeholder="88-888-88-88"
            v-model="data.phone"
            autofocus
          />
          <div class="invalid-feedback">
            Iltimos, telefon raqamingizni kiriting
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Parol</label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': checkPassword && !data.password }"
            id="password"
            placeholder="Parolingizni yozing..."
            v-model="data.password"
          />
          <div class="invalid-feedback">Iltimos, parolingizni kiriting</div>
        </div>

        <p class="text-center text-danger mb-3">{{ xato }}</p>

        <button
          type="submit"
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          :disabled="loading"
          :aria-busy="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ loading ? "Kutilmoqda..." : "Kirish" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkPhone: false,
      checkPassword: false,
      loading: false,
      data: {
        phone: null,
        password: null,
      },
      xato: null,
    };
  },
  watch: {
    "data.phone"(newVal) {
      if (newVal) {
        this.checkPhone = false;
      }
    },
    "data.password"(newVal) {
      if (newVal) {
        this.checkPassword = false;
      }
    },
  },
  methods: {
    login() {
      if (this.loading) return; // prevent duplicate submissions

      this.xato = null;

      if (!this.data.phone || !this.data.password) {
        this.checkPhone = !this.data.phone;
        this.checkPassword = !this.data.password;
        return;
      }

      this.loading = true;

      const payload = {
        phone: this.data.phone.replace(/-/g, ""),
        password: this.data.password,
      };

      this.axios
        .post(`${this.$store.state.baseUrl}/api/user/login`, payload)
        .then((res) => {
          if (res.data && res.data.success) {
            localStorage.setItem("token", res.data.token);
            this.loading = false;
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            this.xato = "Login yoki parol xato";
            this.loading = false;
          }
        })
        .catch((err) => {
          this.xato = "Tizimda xatolik yuz berdi";
          this.loading = false;
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e9f0ff 100%);
  padding: 2rem;
}
.login-card {
  width: 100%;
  max-width: 420px;
  border: none;
  border-radius: 0.75rem;
  background: #fff;
}
</style>
