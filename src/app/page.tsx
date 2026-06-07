'use client'
import { useState } from 'react'
import { ILAN_TIPLERI, CAGRI_OPTIONS, DONEM_OPTIONS, type IlanData } from '@/lib/constants'
import { generateIlanPDF } from '@/lib/generatePDF'
import { FileText, CheckCircle, ChevronRight, Download, AlertCircle } from 'lucide-react'

const SECTIONS = ['İlan Tipi', 'Proje Bilgileri', 'Takvim']

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  )
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all placeholder:text-slate-300"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all"
      >
        <option value="">Seçiniz...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5 shadow-sm">
      <div className="bg-[#003399] px-5 py-3">
        <span className="text-white text-sm font-bold tracking-wide">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

const INIT_TAKVIM = { basvuru: '', dil_sinavi: '', on_degerlendirme: '', itiraz: '', nihai: '' }

export default function IlanPage() {
  const [step, setStep] = useState(0)
  const [ilanTipi, setIlanTipi] = useState('')
  const [projeNo, setProjeNo] = useState('2025-1-TR01-KA131-HED-000307638')
  const [akademikYil, setAkademikYil] = useState('')
  const [cagri, setCagri] = useState('')
  const [donem, setDonem] = useState('')
  const [kontenjan, setKontenjan] = useState('')
  const [takvim, setTakvim] = useState(INIT_TAKVIM)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const setTk = (k: keyof typeof INIT_TAKVIM, v: string) => setTakvim(t => ({ ...t, [k]: v }))

  const ilanLabel = ILAN_TIPLERI.find(t => t.id === ilanTipi)?.label || ''

  const step0OK = !!ilanTipi
  const step1OK = !!projeNo && !!akademikYil && !!cagri && !!donem && !!kontenjan
  const step2OK = Object.values(takvim).every(v => !!v)
  const allOK = step0OK && step1OK && step2OK

  const handleGenerate = async () => {
    setLoading(true); setError(''); setDone(false)
    try {
      const data: IlanData = { ilanTipi, ilanLabel, projeNo, akademikYil, cagri, donem, kontenjan, takvim }
      await generateIlanPDF(data)
      setDone(true)
    } catch (e: unknown) {
      setError('PDF oluşturulurken hata oluştu: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-[#003399] rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Erasmus+ İlan Oluşturucu</h1>
            <p className="text-blue-200 text-sm mt-0.5">Fenerbahçe Üniversitesi — Uluslararası Ofis</p>
          </div>
        </div>

        {/* Adım göstergesi */}
        <div className="flex items-center gap-2 mb-6">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${step === i ? 'bg-[#003399] text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                ${step === i ? 'bg-white text-[#003399]' : 'bg-slate-100 text-slate-400'}`}>
                {i + 1}
              </span>
              {s}
            </button>
          ))}
        </div>

        {/* ADIM 0 — İlan Tipi */}
        {step === 0 && (
          <SectionBox title="HAREKETLİLİK TÜRÜ SEÇİN">
            <div className="grid grid-cols-2 gap-2">
              {ILAN_TIPLERI.map(t => (
                <button
                  key={t.id}
                  onClick={() => setIlanTipi(t.id)}
                  className={`p-3 rounded-lg text-left text-sm transition-all border
                    ${ilanTipi === t.id
                      ? 'border-[#003399] bg-[#E8EFFF] text-[#003399] font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              disabled={!step0OK}
              onClick={() => setStep(1)}
              className="mt-4 w-full py-3 rounded-xl bg-[#003399] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-blue-900 transition-colors"
            >
              Devam <ChevronRight className="w-4 h-4" />
            </button>
          </SectionBox>
        )}

        {/* ADIM 1 — Proje Bilgileri */}
        {step === 1 && (
          <SectionBox title="PROJE BİLGİLERİ">
            <Field label="Proje Numarası" value={projeNo} onChange={setProjeNo} placeholder="2025-1-TR01-KA131-HED-000XXXXXX" />
            <div className="grid grid-cols-2 gap-x-4">
              <Field label="Akademik Yıl" value={akademikYil} onChange={setAkademikYil} placeholder="2026-2027" />
              <Field label="Toplam Hibeli Kontenjan" value={kontenjan} onChange={setKontenjan} placeholder="6" />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <SelectField label="Çağrı" value={cagri} onChange={setCagri} options={CAGRI_OPTIONS} />
              <SelectField label="Dönem" value={donem} onChange={setDonem} options={DONEM_OPTIONS} />
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(0)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                ← Geri
              </button>
              <button disabled={!step1OK} onClick={() => setStep(2)}
                className="flex-1 py-2.5 rounded-xl bg-[#003399] text-white font-bold text-sm flex items-center justify-center gap-1 disabled:opacity-40 hover:bg-blue-900 transition-colors">
                Devam <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </SectionBox>
        )}

        {/* ADIM 2 — Takvim */}
        {step === 2 && (
          <SectionBox title="BAŞVURU TAKVİMİ">
            <Field label="Başvuru Süreci" value={takvim.basvuru} onChange={v => setTk('basvuru', v)} placeholder="4 Mayıs 2026 Pazartesi – 19 Mayıs 2026 Salı" />
            <Field label="Erasmus+ Yabancı Dil Sınavı" value={takvim.dil_sinavi} onChange={v => setTk('dil_sinavi', v)} placeholder="20 Mayıs – 19 Haziran tarih aralığı" />
            <Field label="Ön Değerlendirme Sonuçları" value={takvim.on_degerlendirme} onChange={v => setTk('on_degerlendirme', v)} placeholder="24 Haziran 2026 Çarşamba" />
            <Field label="İtiraz Süreci" value={takvim.itiraz} onChange={v => setTk('itiraz', v)} placeholder="24-28 Haziran 2026" />
            <Field label="Nihai Değerlendirme Sonuçları" value={takvim.nihai} onChange={v => setTk('nihai', v)} placeholder="17 Temmuz 2026 Cuma" />

            {/* Özet kartı */}
            {allOK && (
              <div className="bg-[#E8EFFF] border border-[#C7D7FF] rounded-xl p-4 mb-4 text-sm">
                <div className="font-bold text-[#003399] mb-1">
                  ERASMUS+ {ilanLabel.toUpperCase()} HAREKETLİLİĞİ
                </div>
                <div className="text-slate-600 leading-relaxed text-xs">
                  <span className="font-semibold">Proje:</span> {projeNo}<br />
                  <span className="font-semibold">Yıl:</span> {akademikYil} &nbsp;
                  <span className="font-semibold">Çağrı:</span> {cagri} &nbsp;
                  <span className="font-semibold">Dönem:</span> {donem} &nbsp;
                  <span className="font-semibold">Kontenjan:</span> {kontenjan}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-green-700 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" /> PDF indirildi!
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                ← Geri
              </button>
              <button
                disabled={!allOK || loading}
                onClick={handleGenerate}
                className="flex-1 py-3 rounded-xl bg-[#003399] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-blue-900 transition-colors"
              >
                {loading ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Oluşturuluyor...</>
                ) : (
                  <><Download className="w-4 h-4" /> PDF İndir</>
                )}
              </button>
            </div>
          </SectionBox>
        )}
      </div>
    </div>
  )
}
