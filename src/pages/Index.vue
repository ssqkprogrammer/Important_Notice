<template>
  <main class="container2">
    <h2>Important Notice</h2>

    <!-- Add button to open modal -->
    <div class="top-actions">
      <button class="import-btn" @click="importFromJSON">
        📥 JSON dan yuklash
      </button>
      <button class="export-btn" @click="exportToJSON">
        📤 JSON ga eksport
      </button>
      <button class="primary-btn" @click="openAdd">Qo‘shish</button>
    </div>

    <!-- FORM moved into modal (opened when showModal is true) -->
    <div v-if="showModal" class="modal-overlay" @click.self="cancelEdit">
      <div class="modal-content card form-card">
        <form @submit.prevent="handleSubmit">
          <h3>
            {{ editId ? "Ma'lumotni tahrirlash" : "Yangi ma'lumot qo‘shish" }}
          </h3>
          <select v-model="form.type_organization">
            <option value="">Tashkilot turi</option>
            <option value="Қурилиш">Qurilish</option>
            <option value="Ишлаб чиқариш">Ishlab chiqarish</option>
            <option value="Хизмат кўрсатиш">Xizmat kursatish</option>
          </select>
          <input v-model="form.organization" placeholder="Tashkilot nomi" />
          <input v-model="form.full_name" placeholder="F.I.Sh" required />
          <input v-model="form.citizenship" placeholder="Fuqaroligi" />
          <input
            v-model="form.passport_number"
            type="text"
            placeholder="Passport raqami"
          />
          <label>Passport berilgan sana</label>
          <input type="date" v-model="form.passport_issued_date" />

          <label>Passport tugash sanasi</label>
          <input type="date" v-model="form.passport_end_date" />

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
          <input
            type="tel"
            v-model="form.phone_number"
            v-phone-mask
            inputmode="tel"
            placeholder="+998 (__) ___-__-__"
          />
          <textarea v-model="form.comment" placeholder="Izoh"></textarea>

          <div class="modal-actions">
            <button type="submit" class="primary-btn">
              {{ editId ? "Saqlash" : "Qo‘shish" }}
            </button>
            <button type="button" @click="cancelEdit">Bekor qilish</button>
          </div>
        </form>
      </div>
    </div>

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
            <th>Passport tugash</th>
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
            <td>{{ formatDate(item.passport_end_date) }}</td>
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
  directives: {
    phoneMask: {
      mounted(el) {
        const handler = (e) => {
          let v = el.value || "";
          let digits = v.replace(/\D/g, "");

          // If user typed full country code, strip it for formatting
          if (digits.startsWith("998")) digits = digits.slice(3);

          digits = digits.slice(0, 9); // Uzbek phone numbers have 9 local digits after +998

          if (digits.length === 0) {
            el.value = "";
            el.dispatchEvent(new Event("input"));
            return;
          }

          const a = digits.slice(0, 2);
          const b = digits.slice(2, 5);
          const c = digits.slice(5, 7);
          const d = digits.slice(7, 9);

          let masked = "+998 ";
          masked += a;
          if (a.length === 2) masked = `+998 (${a}) `;
          if (b) masked += b;
          if (c) masked += `-${c}`;
          if (d) masked += `-${d}`;

          el.value = masked;
          el.dispatchEvent(new Event("input"));
        };

        el._phoneMaskHandler = handler;
        el.addEventListener("input", handler);
      },
      beforeUnmount(el) {
        if (el._phoneMaskHandler)
          el.removeEventListener("input", el._phoneMaskHandler);
      },
    },

    numeric: {
      mounted(el) {
        const handler = () => {
          const v = el.value || "";
          const digits = v.replace(/\D/g, "");
          if (v !== digits) {
            el.value = digits;
            el.dispatchEvent(new Event("input"));
          }
        };

        el._numericHandler = handler;
        el.addEventListener("input", handler);
      },
      beforeUnmount(el) {
        if (el._numericHandler)
          el.removeEventListener("input", el._numericHandler);
      },
    },
  },
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
        passport_end_date: "",
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
      showModal: false, // NEW: control modal visibility
    };
  },

  created() {
    this.getAll();
  },

  methods: {
    // IMPORT FROM JSON FILE
    async importFromJSON() {
      if (
        !confirm("JSON faylidagi ma'lumotlarni bazaga yuklashni xohlaysizmi?")
      ) {
        return;
      }

      try {
        // Import JSON file
        const jsonData = await import("@/json/json.json");
        const data = jsonData.default || jsonData;

        // Convert date format from MM/DD/YYYY to YYYY-MM-DD
        const convertDate = (dateStr) => {
          if (!dateStr || dateStr === "_") return "";
          const parts = dateStr.split("/");
          if (parts.length === 3) {
            const [month, day, year] = parts;
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }
          return dateStr;
        };

        let successCount = 0;
        let errorCount = 0;

        // Import each record
        for (const item of data) {
          const formData = {
            type_organization: item.type_organization || "",
            organization: item.organization || "",
            full_name: item.full_name || "",
            citizenship: item.citizenship || "",
            passport_number: item.passport_number || "",
            passport_issued_date: convertDate(item.passport_issued_date),
            passport_end_date: convertDate(item.passport_end_date),
            visa_type: item.visa_type || "",
            visa_start_date: convertDate(item.visa_start_date),
            visa_end_date: convertDate(item.visa_end_date),
            temporary_address: item.temporary_address || "",
            position: item.position || "",
            work_start_date: convertDate(item.work_start_date),
            phone_number: item.phone_number || "",
            comment: item.comment || "",
            status: "active",
          };

          try {
            await this.axios.post(
              `${this.$store.state.baseUrl}/api/important_notice/add`,
              formData
            );
            successCount++;
          } catch (err) {
            console.error("Import error:", err);
            errorCount++;
          }
        }

        alert(
          `Import yakunlandi!\nMuvaffaqiyatli: ${successCount}\nXato: ${errorCount}`
        );
        this.getAll();
      } catch (err) {
        console.error("JSON yuklashda xatolik:", err);
        alert("JSON faylni yuklashda xatolik yuz berdi!");
      }
    },

    // EXPORT TO JSON FILE
    exportToJSON() {
      if (this.notices.length === 0) {
        alert("Eksport qilish uchun ma'lumot yo'q!");
        return;
      }

      // Convert date format from ISO to MM/DD/YYYY
      const convertDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      const exportData = this.notices.map((item) => ({
        type_organization: item.type_organization || "",
        organization: item.organization || "",
        full_name: item.full_name || "",
        citizenship: item.citizenship || "",
        passport_number: item.passport_number || "",
        passport_issued_date: convertDate(item.passport_issued_date),
        passport_end_date: convertDate(item.passport_end_date),
        visa_type: item.visa_type || "",
        visa_start_date: convertDate(item.visa_start_date),
        visa_end_date: convertDate(item.visa_end_date),
        temporary_address: item.temporary_address || "",
        position: item.position || "",
        work_start_date: convertDate(item.work_start_date),
        phone_number: item.phone_number || "",
        comment: item.comment || "",
      }));

      // Create JSON string with proper formatting
      const jsonString = JSON.stringify(exportData, null, 1);

      // Create blob and download
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `important_notice_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Ma'lumotlar muvaffaqiyatli eksport qilindi!");
    },

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

    // NEW: open add modal and reset form
    openAdd() {
      this.editId = null;
      this.resetForm();
      this.showModal = true;
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
            this.showModal = false; // close modal after add
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
            passport_end_date: d.passport_end_date
              ? d.passport_end_date.slice(0, 10)
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

          this.showModal = true; // OPEN modal when editing
        })
        .catch((err) => {
          console.error("Edit load error:", err);
        });
    },

    cancelEdit() {
      this.editId = null;
      this.resetForm();
      this.showModal = false; // close modal
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
        passport_end_date: "",
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

.top-actions {
  max-width: 700px;
  margin: 0 auto 12px auto;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

button.import-btn {
  background: #27ae60;
  color: #fff;
}

button.export-btn {
  background: #8e44ad;
  color: #fff;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
}
</style>
