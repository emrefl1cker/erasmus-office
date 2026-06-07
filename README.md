# FBÜ Erasmus+ Ofis Araçları

Fenerbahçe Üniversitesi Uluslararası Ofisi — İlan PDF Oluşturucu

## Yerel Geliştirme

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Vercel'e Deploy (emrevenehir.xyz için)

### 1. GitHub'a yükle
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/KULLANICI_ADI/erasmus-ofis.git
git push -u origin main
```

### 2. Vercel bağla
- https://vercel.com → "Add New Project" → GitHub repo'yu seç
- Framework: **Next.js** (otomatik algılar)
- "Deploy" tıkla → ~2 dakika

### 3. Domain bağla
Vercel dashboard → Settings → Domains → `emrevenehir.xyz` ekle

Domain sağlayıcınızda (Namecheap, GoDaddy vb.) DNS ayarı:
- Tip: `A`  Değer: `76.76.21.21`
- Tip: `CNAME`  Ad: `www`  Değer: `cname.vercel-dns.com`

### 4. SSL
Vercel otomatik olarak HTTPS sertifikası oluşturur (Let's Encrypt).

---

## Klasör Yapısı

```
src/
  app/
    page.tsx          ← Ana sayfa (İlan oluşturucu)
    layout.tsx        ← Root layout
    globals.css       ← Global stiller
  lib/
    constants.ts      ← Sabit veriler, tipler
    generatePDF.ts    ← jsPDF ile PDF üretimi (browser'da çalışır)
  components/         ← Gelecekte eklenecek componentler
```

## Yakında Eklenecekler
- [ ] Mail şablonları (ilan yayımı, başvuru açılışı, dil sınavı, sonuçlar)
- [ ] Sosyal medya post oluşturucu
- [ ] Checklist yönetimi
- [ ] Döküman/rehber arşivi
