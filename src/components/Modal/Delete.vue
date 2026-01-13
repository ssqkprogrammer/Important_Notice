<template>
  <div class="modal_full" @click="$emit('closeDelModal', false)">
    <div class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Diqqat bilan o'qing!!</h5>
            <button
              @click="$emit('closeEditProject', false)"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body mt-2">
            <p>
              <b class="fs-4">
                Siz
                <span class="text-danger">{{ arxivName }}</span
                >ni o'chirmoqchimisiz !!!
              </b>
            </p>
          </div>
          <div class="modal-footer">
            <button @click="deleteInfo" type="button" class="btn btn-danger">
              O'chirish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["arxivName", "arxivId", "api"],
  methods: {
    deleteInfo() {
      let data = {
        status: "archive",
      };
      this.axios
        .delete(
          `${this.$store.state.baseUrl}/api/${this.api}/delete/${this.arxivId}`,
          data
        )
        .then((res) => {
          this.$store.commit("DELETE", true);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.modal_full {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>
