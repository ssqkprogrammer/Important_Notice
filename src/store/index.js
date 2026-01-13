import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    // baseUrl: "http://localhost:9001",
    baseUrl: "https://oldapihr.movaro.net",
    data_add: false,
    delete: false,
    data_block: false,
    data_error: false,
    data_delete: false,
    data_send_basket: false,
    apiDataUser: null,
    user_id: null,
    user_role: null,
    nomzodlar: null,
  },
  getters: {
    getApiDataUser: (state) => state.apiDataUser,
    getApiDataUserid: (state) => state.user_id,
    getApiDataUserRole: (state) => state.user_role,
    getApiDataNomzodlar: (state) => state.nomzodlar,
  },
  mutations: {
    DELETE(state, payload) {
      state.delete = payload;
    },
    DATA_BLOCK(state, payload) {
      state.data_block = payload;
    },
    DATA_ADD(state, payload) {
      state.data_add = payload;
    },
    DATA_ERROR(state, payload) {
      state.data_error = payload;
    },
    DATA_DELETE(state, payload) {
      state.data_delete = payload;
    },
    DATA_SEND_BASKET(state, payload) {
      state.data_send_basket = payload;
    },
    SET_API_DATA_USER(state, payload) {
      state.apiDataUser = payload;
    },
    SET_API_DATA_USER_ID(state, payload) {
      state.user_id = payload;
    },
    SET_API_DATA_USER_ROLE(state, payload) {
      state.user_role = payload;
    },
    SET_API_DATA_NOMZODLAR(state, payload) {
      state.nomzodlar = payload;
    },
  },
  actions: {
    async getUserOne({ commit, state }) {
      try {
        let token = localStorage.getItem("token");
        if (!token) {
          console.error("Token topilmadi.");
          return;
        }

        // 1️⃣ Tokenni decode qilish uchun API chaqiramiz
        const decodeResponse = await axios.get(
          `${state.baseUrl}/api/user/decodeToken`,
          {
            headers: { authorization: token }, // Tokenni header orqali yuborish
          }
        );

        if (
          !decodeResponse.data.decodeToken ||
          !decodeResponse.data.decodeToken.id
        ) {
          console.error("Token decoding muvaffaqiyatsiz.");
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 200);

          return;
        }

        const userId = decodeResponse.data.decodeToken.id; // ID ni olamiz

        // 2️⃣ Olingan ID orqali foydalanuvchi ma'lumotlarini olish
        const userResponse = await axios.get(
          `${state.baseUrl}/api/user/byid/${userId}`
        );

        let role = userResponse.data.role;
        console.log(role);

        commit("SET_API_DATA_USER", userResponse.data); // 🔥 Foydalanuvchi ma’lumotlarini saqlash
        commit("SET_API_DATA_USER_ID", userId); // 🔥 Foydalanuvchi ma’lumotlarini saqlash
        commit("SET_API_DATA_USER_ROLE", role); // 🔥 Foydalanuvchi ma’lumotlarini saqlash
      } catch (error) {
        console.error("API xatosi:", error);
      }
    },
    async getNomzodlar({ commit, state }) {
      try {
        const response = await axios.get(
          `${state.baseUrl}/api/category_vakant/all`
        );

        commit("SET_API_DATA_NOMZODLAR", response.data); // 🔥 Foydalanuvchi ma’lumotlarini saqlash
      } catch (error) {
        console.error("API xatosi:", error);
      }
    },
  },
  modules: {},
});
