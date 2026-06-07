export const ILAN_TIPLERI = [
  { id: 'ogrenci_ogrenim',      label: 'Öğrenci Öğrenim',                   kod: 'KA131' },
  { id: 'ogrenci_staj',         label: 'Öğrenci Staj',                       kod: 'KA131' },
  { id: 'personel_ders',        label: 'Personel Ders Verme',                kod: 'KA131' },
  { id: 'personel_egitim',      label: 'Personel Eğitim Alma',               kod: 'KA131' },
  { id: 'doktora_staj',         label: 'Kısa Dönem Doktora Staj',            kod: 'KA131' },
  { id: 'karma_ogrenci_ogrenim',label: 'Karma Yoğun Öğrenci Öğrenim',       kod: 'KA131' },
  { id: 'karma_ogrenci_staj',   label: 'Karma Yoğun Öğrenci Staj',          kod: 'KA131' },
  { id: 'karma_personel_ders',  label: 'Karma Yoğun Personel Ders Verme',   kod: 'KA131' },
  { id: 'karma_personel_egitim',label: 'Karma Yoğun Personel Eğitim Alma',  kod: 'KA131' },
]

export const CAGRI_OPTIONS = ['Birinci', 'İkinci', 'Üçüncü']
export const DONEM_OPTIONS  = ['Güz', 'Bahar', 'Güz & Bahar (Yıllık)']

export const HIBE_GRUPLARI = [
  {
    ulkeler: 'Almanya, Avusturya, Belçika, Çek Cumhuriyeti, Danimarka, Estonya, Finlandiya, Fransa, Güney Kıbrıs Rum Yönetimi, Hollanda, İrlanda, İspanya, İsveç, İtalya, İzlanda, Letonya, Lihtenştayn, Lüksemburg, Malta, Norveç, Portekiz, Slovakya, Slovenya, Yunanistan',
    hibe: '600 Euro',
  },
  {
    ulkeler: 'Bulgaristan, Hırvatistan, Kuzey Makedonya, Litvanya, Macaristan, Polonya, Romanya, Sırbistan',
    hibe: '450 Euro',
  },
]

export const PUAN_TABLOSU = [
  { kriter: 'Akademik Başarı Düzeyi (GNO)',                    puan: '%50 (100 puan üzerinden)' },
  { kriter: 'Dil Seviyesi (en az B1)',                          puan: '%50 (100 puan üzerinden)' },
  { kriter: 'Şehit ve gazi çocuklarına',                        puan: '+15 puan' },
  { kriter: 'Engelli öğrencilere',                              puan: '+10 puan' },
  { kriter: '2828 Sayılı Kanun kapsamındaki öğrencilere',       puan: '+10 puan' },
  { kriter: 'AFAD\'dan afetzede yardımı alanlar',               puan: '+10 puan' },
  { kriter: 'Aynı proje türünde daha önce yararlanma',          puan: '-10 puan' },
  { kriter: 'Vatandaşı olunan ülkede hareketliliğe katılma',    puan: '-10 puan' },
  { kriter: 'Feragat bildirimi yapmadan katılmama',             puan: '-10 puan' },
  { kriter: 'İki hareketlilik türüne aynı anda başvurma',       puan: '-10 puan' },
  { kriter: 'Toplantılara mazeretsiz katılmama (tekrar başvuruda)', puan: '-5 puan' },
  { kriter: 'Dil sınavına mazeretsiz girmeme (tekrar başvuruda)',   puan: '-5 puan' },
]

export interface IlanData {
  ilanTipi:    string
  ilanLabel:   string
  projeNo:     string
  akademikYil: string
  cagri:       string
  donem:       string
  kontenjan:   string
  takvim: {
    basvuru:          string
    dil_sinavi:       string
    on_degerlendirme: string
    itiraz:           string
    nihai:            string
  }
}
