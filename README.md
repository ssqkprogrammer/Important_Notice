# ADMIN

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

<!-- Taqiq google sheets -->

function onEdit(e) {
if (!e || !e.source) return;

    var sheet = e.source.getActiveSheet();
    var range = e.range;
    var editedValue = range.getValue();
    var userEmail = Session.getActiveUser().getEmail();
    var ownerEmail = e.source.getOwner().getEmail();
    var allowedEmails = ["surxonfilarmoniya@gmail.com", "samandarprogrammer97@gmail.com", "samandartasnim@gmail.com"];

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var lockSheet = ss.getSheetByName("LockData");

    if (!lockSheet) {
        lockSheet = ss.insertSheet("LockData");
        lockSheet.hideSheet();
        lockSheet.appendRow(["Cell", "Value"]);
    }

    var cellKey = sheet.getName() + "!" + range.getA1Notation();
    var lockValues = lockSheet.getRange("A:B").getValues();
    var previousValue = null;
    var isLocked = false;

    for (var i = 0; i < lockValues.length; i++) {
        if (lockValues[i][0] === cellKey) {
            previousValue = lockValues[i][1];
            // range.setBackground("#dde4f0");
            isLocked = true;
            break;
        }
    }

    // ✅ **Agar foydalanuvchi yaratuvchi bo'lsa:**
    if (userEmail === ownerEmail) {
        if (editedValue === "") {
            range.setValue(previousValue); // O'chirishni oldini olish
            SpreadsheetApp.getUi().alert("Маълумотни ўчириб бўлмайди, фақат ўзгартириш мумкин!");
        }
        return;
    }

    // ✅ **Agar foydalanuvchi yaratuvchi bo'lmasa va katak allaqachon bloklangan bo'lsa**
    if (isLocked) {
        if (editedValue === "" || editedValue !== previousValue) {
            range.setValue(previousValue); // Eski qiymatni qaytarish
        }

        SpreadsheetApp.getUi().alert(
            "Бир марта ёзганингиздан кейин қайта ўзгартириш мумкин эмас! Агар хато ёзган бўлсангиз, ВЕРА опага мурожаат қилинг! Телефон: 97 243 63 33"
        );

        return;
    }

    // ✅ **Yangi ma'lumotni saqlash va himoya qilish**
    lockSheet.appendRow([cellKey, editedValue]);
    //  range.setBackground("#dde4f0");
    var protection = range.protect();
    protection.removeEditors(protection.getEditors());
    protection.setWarningOnly(false);

    // ✅ **Vaqt chegaralarini belgilash**
    var thresholdTime = 8.148 * 60; // 08:00 = 480 daqiqa
    var endTime = 14 * 60; // 16:00 = 960 daqiqa

    // ✅ **Agar qiymat matn shaklida kiritilgan bo‘lsa**
    if (typeof editedValue === "string") {
        var timePattern = /^([0-9]|[01]\d|2[0-3])[:\-]([0-5]\d)$/; // 8:00, 08:00, 08-00, 9:30 kabi formatlarni tekshiradi

        if (timePattern.test(editedValue)) {
            var parts = editedValue.split(/[:\-]/); // ":" yoki "-" bo'lsa, ajratish
            var hours = parseInt(parts[0], 10);
            var minutes = parseInt(parts[1], 10);

            var editedTime = hours * 60 + minutes; // Soatni daqiqaga o'zgartirish

            // ✅ **Faqat 08:00 dan katta va 16:00 dan kichik bo‘lsa qizil rang**
            if (editedTime > thresholdTime && editedTime < endTime) {
                range.setBackground("#FF9999"); // Qizil rang
            }
        }
    }

    // ✅ **Agar foydalanuvchi vaqtni Google Sheets vaqt formatida kiritgan bo‘lsa**
    if (Object.prototype.toString.call(editedValue) === "[object Date]") {
        var hours = editedValue.getHours();
        var minutes = editedValue.getMinutes();

        var editedTime = hours * 60 + minutes; // Soatni daqiqaga o'zgartirish

        // ✅ **Faqat 08:00 dan katta va 16:00 dan kichik bo‘lsa qizil rang**
        if (editedTime > thresholdTime && editedTime < endTime) {
            range.setBackground("#FF9999"); // Qizil rang
        }
    }

}
