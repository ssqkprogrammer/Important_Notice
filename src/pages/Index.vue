script
<template>
  <main class="container">
    <div class="row justify-content-center g-3 my-2">
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Bo'sh ish o'rinlari</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ bushVakant }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Nomzodlar</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ nomzod }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Kelmaganlar</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ kelmadi }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Rad etilganlar</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ rad_etildi }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Zaxirada</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ zaxira }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Sinovda</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ sinov }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Ishga qabul qilinganlar</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ qabul_qilindi }}</h6>
          </div>
        </div>
      </div>
      <div class="col-11 col-sm-8 col-md-6 col-lg-4">
        <div class="card text-center text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Ishdan ketganlar</h5>
            <h6 class="card-subtitle mb-2 fs-1">{{ ishdan_ketdi }}</h6>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      bushVakant: 0,
      nomzod: 0,
      kelmadi: 0,
      rad_etildi: 0,
      zaxira: 0,
      sinov: 0,
      qabul_qilindi: 0,
      ishdan_ketdi: 0,
      other: 0,
      nomzodlar: [],
    };
  },
  created() {
    // Axios orqali ma'lumot olish
    this.axios
      .get(`${this.$store.state.baseUrl}/api/vakansiya/all`)
      .then((res) => {
        this.bushVakant = res.data.length;
        this.nomzod = res.data.length;
      })
      .catch((err) => {
        console.log(err);
      });

    // Category buyicha
    this.axios
      .get(`${this.$store.state.baseUrl}/api/vakant/all_filter`)
      .then((res) => {
        let result = res.data;
        // let nomzod = res.data.filter((item) => item == "suhbat");
        // console.log("vakant", nomzod.length);

        for (let item of result) {
          let holatNomi = null;
          let holatDate = null;
          let result_id = item.result_vakant?._id || null; // ResultVakant _id ni olish

          // result_vakant obyekti ichidagi holatlarni tekshirish
          for (let key in item.result_vakant) {
            if (
              typeof item.result_vakant[key] === "object" &&
              item.result_vakant[key]?.holat === true
            ) {
              holatNomi = key; // Holati true bo'lgan object nomini olish
              let rawDate = item.result_vakant[key].date || null; // Sana olish

              // Agar sana mavjud bo'lsa, formatini o'zgartirish
              if (rawDate) {
                let dateParts = rawDate.split("-"); // ["2025", "01", "15"]
                holatDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`; // 15.01.2025
              }

              break; // Birinchi true topilganda to'xtaymiz
            }
          }

          this.nomzodlar.push({
            _id: item._id,
            name: item.name,
            phone: item.phone,
            cat_name: item.cat_name,
            cat_id: item.cat_id,
            adress: item.adress,
            comment: item.comment,
            result_id: result_id, // Endi to'g'ri result_id olinyapti
            holat: {
              nomi: holatNomi,
              date: holatDate,
            },
          });
        }

        let nomzod = this.nomzodlar.filter(
          (item) =>
            item.holat.nomi == "suhbat" ||
            item.holat.nomi == null ||
            item.holat.nomi == "zaxira" ||
            item.holat.nomi == "sinov" ||
            item.holat.nomi == "kelmadi" ||
            item.holat.nomi == "other"
        );
        let kelmadi = this.nomzodlar.filter(
          (item) => item.holat.nomi == "kelmadi"
        );
        let rad_etildi = this.nomzodlar.filter(
          (item) => item.holat.nomi == "rad_etildi"
        );
        let zaxira = this.nomzodlar.filter(
          (item) => item.holat.nomi == "zaxira"
        );
        let qabul_qilindi = this.nomzodlar.filter(
          (item) => item.holat.nomi == "qabul_qilindi"
        );
        let sinov = this.nomzodlar.filter((item) => item.holat.nomi == "sinov");
        let ishdan_ketdi = this.nomzodlar.filter(
          (item) => item.holat.nomi == "ishdan_ketdi"
        );
        this.nomzod = nomzod.length;
        this.kelmadi = kelmadi.length;
        this.rad_etildi = rad_etildi.length;
        this.zaxira = zaxira.length;
        this.sinov = sinov.length;
        this.qabul_qilindi = qabul_qilindi.length;
        this.ishdan_ketdi = ishdan_ketdi.length;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {},
};
</script>
