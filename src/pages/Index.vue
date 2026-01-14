<template>
  <main class="container2">
    <h2>Important Notice</h2>

    <!-- ADD/EDIT FORM (bitta forma) -->
    <form class="card form-card" @submit.prevent="handleSubmit">
      <h3>
        {{ editId ? "Ma'lumotni tahrirlash" : "Yangi ma'lumot qo‘shish" }}
      </h3>
      <select v-model="form.type_organization">
        <option value="">Tashkilot turi</option>
        <option value="company">Company</option>
        <option value="individual">Individual</option>
      </select>
      <input v-model="form.organization" placeholder="Tashkilot nomi" />
      <input v-model="form.full_name" placeholder="F.I.Sh" required />
      <input v-model="form.citizenship" placeholder="Fuqaroligi" />
      <input v-model="form.passport_number" placeholder="Passport raqami" />
      <label>Passport berilgan sana</label>
      <input type="date" v-model="form.passport_issued_date" />
      <input v-model="form.visa_type" placeholder="Visa turi" />
      <label>Visa boshlanish sanasi</label>
      <input type="date" v-model="form.visa_start_date" />
      <label>Visa tugash sanasi</label>
      <input type="date" v-model="form.visa_end_date" />
      <input
        v-model="form.temporary_address"
        placeholder="Vaqtinchalik manzil"
      />
      <input v-model="form.position" placeholder="Lavozim" />
      <label>Ish boshlash sanasi</label>
      <input type="date" v-model="form.work_start_date" />
      <input v-model="form.phone_number" placeholder="Telefon raqami" />
      <textarea v-model="form.comment" placeholder="Izoh"></textarea>
      <div class="modal-actions">
        <button type="submit" class="primary-btn">
          {{ editId ? "Saqlash" : "Qo‘shish" }}
        </button>
        <button v-if="editId" type="button" @click="cancelEdit">
          Bekor qilish
        </button>
      </div>
    </form>

    <!-- LIST -->
    <div class="card table-wrapper">
      <h3>Ro‘yxat</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tashkilot turi</th>
            <th>Tashkilot</th>
            <th>F.I.Sh</th>
            <th>Fuqaroligi</th>
            <th>Passport</th>
            <th>Passport sana</th>
            <th>Visa turi</th>
            <th>Visa boshi</th>
            <th>Visa oxiri</th>
            <th>Vaqtinchalik manzil</th>
            <th>Lavozim</th>
            <th>Ish boshlash</th>
            <th>Telefon</th>
            <th>Izoh</th>
            <th>Status</th>
            <th>Amallar</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in notices" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.type_organization }}</td>
            <td>{{ item.organization }}</td>
            <td>{{ item.full_name }}</td>
            <td>{{ item.citizenship }}</td>
            <td>{{ item.passport_number }}</td>
            <td>{{ formatDate(item.passport_issued_date) }}</td>
            <td>{{ item.visa_type }}</td>
            <td>{{ formatDate(item.visa_start_date) }}</td>
            <td>{{ formatDate(item.visa_end_date) }}</td>
            <td>{{ item.temporary_address }}</td>
            <td>{{ item.position }}</td>
            <td>{{ formatDate(item.work_start_date) }}</td>
            <td>{{ item.phone_number }}</td>
            <td class="comment">{{ item.comment }}</td>

            <td>
              <span :class="item.status">{{ item.status }}</span>
            </td>

            <td class="actions">
              <button @click="toggleStatus(item)">Status</button>
              <button class="edit-btn" @click="openEdit(item._id)">Edit</button>
              <button class="danger" @click="deleteNotice(item._id)">
                O‘chirish
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      notices: [],
      form: {
        type_organization: "",
        organization: "",
        full_name: "",
        citizenship: "",
        passport_number: "",
        passport_issued_date: "",
        visa_type: "",
        visa_start_date: "",
        visa_end_date: "",
        temporary_address: "",
        position: "",
        work_start_date: "",
        phone_number: "",
        comment: "",
        status: "active",
      },
      editId: null,
    };
  },

  created() {
    this.getAll();
  },

  methods: {
    // GET ALL
    getAll() {
      this.axios
        .get(`${this.$store.state.baseUrl}/api/important_notice/all`)
        .then((res) => {
          this.notices = res.data.data;
        })
        .catch(console.log);
    },
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleDateString("ru-RU");
    },

    // CREATE or UPDATE
    handleSubmit() {
      if (this.editId) {
        // UPDATE
        this.axios
          .put(
            `${this.$store.state.baseUrl}/api/important_notice/info/${this.editId}`,
            this.form
          )
          .then(() => {
            this.getAll();
            this.cancelEdit();
          })
          .catch(console.log);
      } else {
        // CREATE
        this.axios
          .post(
            `${this.$store.state.baseUrl}/api/important_notice/add`,
            this.form
          )
          .then(() => {
            this.getAll();
            this.resetForm();
          })
          .catch(console.log);
      }
    },

    // STATUS CHANGE
    toggleStatus(item) {
      const status = item.status === "active" ? "archive" : "active";
      this.axios
        .put(
          `${this.$store.state.baseUrl}/api/important_notice/status/${item._id}`,
          { status }
        )
        .then(() => {
          item.status = status;
        })
        .catch(console.log);
    },

    // DELETE
    deleteNotice(id) {
      if (!confirm("O‘chirishni xohlaysizmi?")) return;
      this.axios
        .delete(
          `${this.$store.state.baseUrl}/api/important_notice/delete/${id}`
        )
        .then(() => {
          this.notices = this.notices.filter((i) => i._id !== id);
        })
        .catch(console.log);
    },

    // EDIT
    openEdit(id) {
      this.editId = id;

      this.axios
        .get(`${this.$store.state.baseUrl}/api/important_notice/byid/${id}`)
        .then((res) => {
          const d = res.data.data;

          this.form = {
            type_organization: d.type_organization || "",
            organization: d.organization || "",
            full_name: d.full_name || "",
            citizenship: d.citizenship || "",
            passport_number: d.passport_number || "",
            passport_issued_date: d.passport_issued_date
              ? d.passport_issued_date.slice(0, 10)
              : "",
            visa_type: d.visa_type || "",
            visa_start_date: d.visa_start_date
              ? d.visa_start_date.slice(0, 10)
              : "",
            visa_end_date: d.visa_end_date ? d.visa_end_date.slice(0, 10) : "",
            temporary_address: d.temporary_address || "",
            position: d.position || "",
            work_start_date: d.work_start_date
              ? d.work_start_date.slice(0, 10)
              : "",
            phone_number: d.phone_number || "",
            comment: d.comment || "",
            status: d.status || "active",
          };
        })
        .catch((err) => {
          console.error("Edit load error:", err);
        });
    },

    cancelEdit() {
      this.editId = null;
      this.resetForm();
    },
    resetForm() {
      // Faqat yangi qo'shishda formani tozalash uchun
      this.form = {
        type_organization: "",
        organization: "",
        full_name: "",
        citizenship: "",
        passport_number: "",
        passport_issued_date: "",
        visa_type: "",
        visa_start_date: "",
        visa_end_date: "",
        temporary_address: "",
        position: "",
        work_start_date: "",
        phone_number: "",
        comment: "",
        status: "active",
      };
    },
  },
};
</script>
<style scoped>
.container2 {
  padding: 32px 10vw;
  background: #f7fafd;
  min-height: 100vh;
}

h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #2c3e50;
  font-size: 2.2rem;
  letter-spacing: 1px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 24px 20px;
  margin-bottom: 32px;
}

.form-card {
  max-width: 700px;
  margin: 0 auto 32px auto;
}

.table-wrapper {
  overflow-x: auto;
}

.comment {
  max-width: 200px;
  white-space: pre-wrap;
}

table {
  min-width: 1600px;
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 1rem;
}

th {
  background: #f0f4f8;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 6px;
}

input,
select,
textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 1rem;
  background: #f9fafb;
  transition: border 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  border: 1.5px solid #3498db;
  outline: none;
}

button {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 7px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

button.danger {
  background: #e74c3c;
}

button.edit-btn {
  background: #f1c40f;
  color: #222;
}

button.primary-btn {
  background: #3498db;
  color: #fff;
}

button:hover {
  opacity: 0.92;
}

.active {
  color: green;
  font-weight: bold;
}

.archive {
  color: gray;
  font-weight: bold;
}
</style>
