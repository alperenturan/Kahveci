# Google Sheets Kurulum Rehberi 📊

Kahve kayıtlarının anlık olarak Google Sheet dosyanıza düşmesi için aşağıdaki adımları sırasıyla takip edin.

## 1. Google Sheet Hazırlığı
1. Yeni bir [Google Sheet](https://sheets.new) dosyası açın.
2. İlk satıra (başlıklar) şunları yazın:
   - A1: `Tarih`
   - B1: `İsim`
   - C1: `Kahve Türü`
   - D1: `Fiyat`

## 2. Apps Script Kodunu Ekleme
1. Üst menüden **Uzantılar (Extensions)** -> **Apps Script**'e tıklayın.
2. Açılan penceredeki kodu silin ve yerine aşağıdaki kodu yapıştırın:

```javascript
// Google Apps Script - Kahve Takip Backend
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Verileri tabloya ekle (Tarih, İsim, Tür, Fiyat)
  sheet.appendRow([
    data.timestamp,
    data.name,
    data.coffeeType,
    data.price
  ]);
  
  return ContentService.createTextOutput("Başarılı").setMimeType(ContentService.MimeType.TEXT);
}
```

## 3. Yayına Alma (Deployment)
1. Sağ üstteki **Dağıt (Deploy)** butonuna basın ve **Yeni dağıtım (New deployment)** seçeneğini seçin.
2. Tür seçin (Select type) kısmından **Web uygulaması (Web app)** seçeneğini işaretleyin.
3. Ayarları şu şekilde yapın:
   - **Açıklama:** Kahve Takip API
   - **Uygulamayı şu kişi olarak çalıştır (Execute as):** Ben (Me)
   - **Erişimi olanlar (Who has access):** Herkes (Anyone) -- *Not: Bu seçenek "Herkes" olmalıdır ki uygulama giriş yapmadan veri gönderebilsin.*
4. **Dağıt (Deploy)** deyin (Gerekli izinleri onaylayın).
5. Size verilen **Web Uygulaması URL'sini (Web App URL)** kopyalayın.

## 4. Uygulamaya Bağlama
1. Hazırladığımız Kahve Takip uygulamasına gidin.
2. Sağ üstteki **Ayarlar (Dişli çark)** simgesine tıklayın.
3. Kopyaladığınız URL'yi oraya yapıştırın ve **Kaydet** deyin.

Artık her kahve seçimi otomatik olarak tablonuza eklenecektir! 🎉
