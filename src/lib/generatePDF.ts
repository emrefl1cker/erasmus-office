import type { IlanData } from './constants'
import { HIBE_GRUPLARI, PUAN_TABLOSU } from './constants'

// Türkçe karakter dönüştürme (jsPDF latin-1 uyumluluğu için)
function tr(s: string): string {
  return s
    .replace(/İ/g, 'I').replace(/ı/g, 'i')
    .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U').replace(/ü/g, 'u')
    .replace(/Ş/g, 'S').replace(/ş/g, 's')
    .replace(/Ö/g, 'O').replace(/ö/g, 'o')
    .replace(/Ç/g, 'C').replace(/ç/g, 'c')
}

export async function generateIlanPDF(data: IlanData): Promise<void> {
  // Dynamic import — runs only in browser
  const jsPDFModule = await import('jspdf')
  const { default: jsPDF } = jsPDFModule
  await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 18
  const contentW = W - margin * 2
  let y = 18

  const BLUE  = [0, 51, 153] as [number,number,number]
  const WHITE = [255,255,255] as [number,number,number]
  const LIGHT = [232,239,255] as [number,number,number]
  const ALT   = [240,244,255] as [number,number,number]
  const DARK  = [30, 41, 59] as [number,number,number]
  const GRAY  = [100,116,139] as [number,number,number]
  const BORDER= [200,210,230] as [number,number,number]

  function setFont(bold = false, size = 10, color: [number,number,number] = DARK) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }

  function sectionHeader(title: string) {
    doc.setFillColor(...BLUE)
    doc.rect(margin, y, contentW, 8, 'F')
    setFont(true, 9.5, WHITE)
    doc.text(tr(title), margin + 3, y + 5.5)
    y += 11
  }

  function bullet(text: string, indent = 3) {
    setFont(false, 9, DARK)
    const lines = doc.splitTextToSize(tr('• ' + text), contentW - indent - 2)
    doc.text(lines, margin + indent, y)
    y += lines.length * 4.5 + 1
  }

  function checkPageBreak(needed = 20) {
    if (y + needed > 280) { doc.addPage(); y = 18 }
  }

  // ── BAŞLIK ──────────────────────────────────────────────────────
  setFont(true, 13, BLUE)
  const titleText = tr(`ERASMUS+ ${data.ilanLabel.toUpperCase()} HAREKETLILIGI BASVURU ILAN METNI`)
  const titleLines = doc.splitTextToSize(titleText, contentW)
  doc.text(titleLines, W/2, y, { align: 'center' })
  y += titleLines.length * 7 + 3

  setFont(false, 9.5, GRAY)
  doc.text(tr(`Proje: ${data.projeNo}`), W/2, y, { align: 'center' })
  y += 5
  doc.text(tr(`Akademik Yil: ${data.akademikYil}   |   Cagri: ${data.cagri}   |   Donem: ${data.donem}`), W/2, y, { align: 'center' })
  y += 5

  // Divider
  doc.setDrawColor(...BLUE)
  doc.setLineWidth(0.8)
  doc.line(margin, y, margin + contentW, y)
  y += 6

  // ── ÖN LİSANS ŞARTLARI ─────────────────────────────────────────
  checkPageBreak()
  sectionHeader('ON LISANS VE LISANS DUZEYLERI ICIN BASVURU SARTLARI NELERDİR?')
  const lisansBullets = [
    'Tam zamanli ogrenci olmak.',
    'En az bir yariyil egitime devam etmis olmak.',
    'Guncel genel not ortalamasinin on lisans ve Lisans duzeyinde en az 2.20/4.00 olmasi.',
    'Erasmus+ kapsaminda alinacak dersler Ingilizce disinda bir dilde verilmekte ise ogrencinin ilgili dili asgari duzeyde bilmesi ve belgelendirmesi gerekir.',
    'Cift anadal ogrencileri bir basvuru doneminde iki anadaldan biri icin basvuru yapabilir.',
    'Ingilizce ve Turkce dil hazirlik programi ve bilimsel hazirlik programi ogrencileri basvuramaz.',
    'Kayit donduran ogrenciler, kayit dondurudukları donemde ogrenim hareketliligi gerceklestiremez.',
    'Ayni ogretim duzeyi icerisinde Erasmus+ hareketlilik sureleri toplamda 12 ayi gecemez.',
  ]
  lisansBullets.forEach(b => { checkPageBreak(8); bullet(b) })
  y += 3

  // ── LİSANSÜSTÜ ŞARTLARI ────────────────────────────────────────
  checkPageBreak()
  sectionHeader('LISANSUSTU DUZEYLERI ICIN BASVURU SARTLARI NELERDİR?')
  const lisansstuBullets = [
    'Tam zamanli ogrenci olmak.',
    'Guncel genel not ortalamasinin lisansustu duzeyinde en az 2.50/4.00 olmasi gerekir.',
    'Not ortalamasi olusmanis lisansustu ogrenciler, bir onceki mezun olduklari lisans ya da yuksek lisans ortalamalari ile basvurabilirler.',
    'Arastirma gorevlilerinin basvuru sirasinda ilgili birim yoneticisinden yazili onay almis olmasi gerekir.',
    'Tez danismani ve anabilim dali baskaninin olumlu gorusu ile Enstitu yonetim kurulu karari gerekebilir.',
  ]
  lisansstuBullets.forEach(b => { checkPageBreak(8); bullet(b) })
  y += 3

  // ── TAKVİM ─────────────────────────────────────────────────────
  checkPageBreak(50)
  sectionHeader('BASVURULAR NE ZAMAN ACILACAK?');
  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [[tr('Olay'), tr('Tarih')]],
    body: [
      [tr('Basvuru Sureci'),                   tr(data.takvim.basvuru)],
      [tr('Erasmus+ Yabanci Dil Sinavi'),       tr(data.takvim.dil_sinavi)],
      [tr('On Degerlendirme Sonuclari'),        tr(data.takvim.on_degerlendirme)],
      [tr('Itiraz Sureci'),                     tr(data.takvim.itiraz)],
      [tr('Nihai Degerlendirme Sonuclari'),     tr(data.takvim.nihai)],
    ],
    headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 9 },
    bodyStyles:  { fontSize: 9, textColor: DARK },
    alternateRowStyles: { fillColor: ALT },
    columnStyles: { 0: { cellWidth: 65 }, 1: { cellWidth: contentW - 65 } },
    tableLineColor: BORDER,
    tableLineWidth: 0.3,
  })
  y = (doc as any).lastAutoTable.finalY + 6

  // ── BAŞVURU SİSTEMİ ─────────────────────────────────────────────
  checkPageBreak()
  sectionHeader('BASVURULAR NEREDEN ALINACAK VE NELERE DIKKAT ETMELIYIM?')
  const basvuruBullets = [
    'Basvurular https://turnaportal.ua.gov.tr/ adresi uzerinden e-devlet kimlik dogrulamasi ile alinacaktir.',
    'Basvuru sirasinda tum ogrencilerin QR kodlu, onaylanabilir transkript yuklemesi gerekmektedir.',
    'Tercih edecefiniz universitemin son nomination tarihi, basvuru tarihi ve belgelerini mutlaka kontrol ediniz.',
    'Tercih edilen universitelerden birine yerlestirilmis olmak kabul belgesi almanizi garanti etmez.',
    'Metinde yer almayan sorulariminiz icin erasmus@fbu.edu.tr adresine iletebilirsiniz.',
    'Basvuru sistemine yuklenecek tum belgelerin PDF formatinda olmasi gerekir.',
  ]
  basvuruBullets.forEach(b => { checkPageBreak(8); bullet(b) })
  y += 3

  // ── HİBE ────────────────────────────────────────────────────────
  checkPageBreak(60)
  sectionHeader('HIBE NASIL ALIRIM?');
  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [[tr('Misafir Olunacak Ulke'), tr('Aylik Hibe')]],
    body: HIBE_GRUPLARI.map(g => [tr(g.ulkeler), tr(g.hibe)]),
    headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 9 },
    bodyStyles:  { fontSize: 8.5, textColor: DARK },
    alternateRowStyles: { fillColor: ALT },
    columnStyles: { 0: { cellWidth: contentW - 30 }, 1: { cellWidth: 30, halign: 'center' } },
    tableLineColor: BORDER,
    tableLineWidth: 0.3,
  })
  y = (doc as any).lastAutoTable.finalY + 4

  const hibeBullets = [
    'Ogrenim Hareketliliginden faydalanacak ogrencilere en fazla 5 ay icin hibe destegi saglanir.',
    `Toplam hibeli kontenjan sayisi: ${data.kontenjan}`,
    'Butce planlamasina gore bu sayi artabilir.',
    'Her fakulteden basvuran en yuksek puanli ogrenci oncelikli olarak hibe destegi alacaktir.',
  ]
  hibeBullets.forEach((b, i) => {
    checkPageBreak(8)
    setFont(i === 1, 9, i === 1 ? BLUE : DARK)
    const lines = doc.splitTextToSize('• ' + b, contentW - 5)
    doc.text(lines, margin + 3, y)
    y += lines.length * 4.5 + 1
  })
  y += 3

  // ── PUAN HESAPLAMA ──────────────────────────────────────────────
  checkPageBreak(70)
  sectionHeader('PUAN HESAPLAMASI NASIL YAPILIR?');
  (doc as any).autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [[tr('Secim Kriterleri'), tr('Puanlama')]],
    body: PUAN_TABLOSU.map(p => [tr(p.kriter), tr(p.puan)]),
    headStyles: { fillColor: BLUE, textColor: WHITE, fontStyle: 'bold', fontSize: 9 },
    bodyStyles:  { fontSize: 8.5, textColor: DARK },
    alternateRowStyles: { fillColor: ALT },
    columnStyles: { 0: { cellWidth: contentW - 50 }, 1: { cellWidth: 50, halign: 'center' } },
    tableLineColor: BORDER,
    tableLineWidth: 0.3,
  })
  y = (doc as any).lastAutoTable.finalY + 6

  // ── İLETİŞİM ────────────────────────────────────────────────────
  checkPageBreak(25)
  doc.setDrawColor(...BLUE)
  doc.setLineWidth(0.5)
  doc.line(margin, y, margin + contentW, y)
  y += 6

  setFont(true, 10, BLUE)
  doc.text(tr('BIZE NASIL ULASABILIRSINIZ?'), W/2, y, { align: 'center' })
  y += 6

  setFont(false, 9, DARK)
  const contactLines = [
    tr('Ofis: Uluslararasi Is Birlikleri ve Degisim Programlari Ofisi — F Blok L1-13'),
    'E-posta: erasmus@fbu.edu.tr',
    'Instagram: @fbu.erasmus',
  ]
  contactLines.forEach(l => { doc.text(l, W/2, y, { align: 'center' }); y += 5 })

  // ── DOSYA ADI ve İNDİR ──────────────────────────────────────────
  const filename = `erasmus_ilan_${data.ilanTipi}_${data.akademikYil.replace('-','_')}_${data.cagri.toLowerCase().replace(/\s/g,'_')}.pdf`
  doc.save(filename)
}
