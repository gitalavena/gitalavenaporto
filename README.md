# IMC 2025 – Data Processing & Email Automation

![Badge Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)
![Badge Stack](https://img.shields.io/badge/Stack-Google_Sheets_%7C_Apps_Script-blue?style=for-the-badge&logo=google-sheets)
![Badge AI](https://img.shields.io/badge/AI_Assisted-ChatGPT_%26_Gemini-74aa9c?style=for-the-badge&logo=openai&logoColor=white)

Sistem otomatisasi ini dirancang untuk menangani ratusan data peserta IMC 2025. Mengintegrasikan **Complex Spreadsheet Logic** dengan **Google Apps Script** untuk menghilangkan proses verifikasi manual yang rentan *human error*.

---

## Masalah & Solusi
| Masalah (Sebelumnya) | Solusi (Sistem Ini) |
| :--- | :--- |
| Data pembayaran terpecah di kolom berbeda (Bundle 1/2/3). | **Auto-Consolidation** menggunakan `ARRAYFORMULA` bersyarat. |
| Verifikasi manual satu per satu. | **2-Stage Gate Check** (Sekretaris & Bendahara). |
| Kirim email manual ke 3-4 orang per tim untuk puluhan tim. | **Instan & Otomatis** mengirim email HTML ke seluruh anggota tim saat diverifikasi. |

---

## System Workflow

Diagram alur sistem dengan logika verifikasi bertingkat dan siklus revisi (*Feedback Loop*).

```mermaid
graph LR
    %% Setup Node Utama
    Start((Mulai)) --> Input[Data Masuk]
    Input --> Process[Query & Array]
    Process --> Gate1{Cek Berkas}
    
    %% Alur Sukses (Garis Lurus)
    Gate1 -- OK --> Gate2{Cek Bayar}
    Gate2 -- OK --> Trigger((Trigger))
    Trigger --> Script[Apps Script]
    Script --> Email[📧 Email Terkirim]

    %% Alur Revisi (Looping Putus-putus)
    Gate1 -- Salah --> Rev1[Revisi Berkas]
    Rev1 -.-> |Cek Ulang| Gate1
    
    Gate2 -- Salah --> Rev2[Revisi Bayar]
    Rev2 -.-> |Cek Ulang| Gate2

    %% Styling
    classDef green fill:#e6fffa,stroke:#00b894,stroke-width:2px;
    classDef red fill:#fff5f5,stroke:#ff7675,stroke-width:2px;
    classDef blue fill:#e7f5ff,stroke:#0984e3,stroke-width:2px;

    class Gate1,Gate2,Trigger,Email green;
    class Rev1,Rev2 red;
    class Input,Process,Script blue;
```
### Penjelasan Detail Alur Kerja (Workflow Breakdown)

Berdasarkan diagram di atas, sistem bekerja dengan **Logika Pengecekan Bertahap (Multi-Stage Verification)** yang terdiri dari tiga fase utama:

#### 1. Ingestion & Processing (Biru)
* **Data Entry:** Peserta mengisi Google Form.
* **Auto-Cleaning:** Data mentah langsung diproses oleh rumus `QUERY` dan `ARRAYFORMULA` di sheet `DATA` untuk memisahkan bukti bayar dan merapikan format teks.

#### 2. Verification Gates & Feedback Loop (Hijau & Merah)
Ini adalah inti dari kontrol kualitas data. Terdapat dua gerbang (*gate*) verifikasi:

* **Gate 1: Cek Berkas (Sekretaris)**
    * Sekretaris memeriksa validitas dokumen (KTM, Surat Aktif).
    * ✅ **Jika Valid:** Lanjut ke Gate 2.
    * 🔄 **Jika Salah (Looping):** Status menjadi "Revisi". Sekretaris menghubungi peserta. Setelah peserta memperbaiki berkas, Sekretaris melakukan **Cek Ulang** (kembali ke awal Gate 1).

* **Gate 2: Cek Bayar (Bendahara)**
    * Bendahara mencocokkan nominal transfer dengan bukti upload.
    * ✅ **Jika Valid:** Bendahara mencentang `CHECKBOX` (Trigger).
    * 🔄 **Jika Salah (Looping):** Status "Revisi Bayar". Peserta diminta transfer ulang/konfirmasi. Setelah beres, Bendahara melakukan **Cek Ulang** (kembali ke awal Gate 2).

#### 3. Automation Execution (Biru Muda)
* **Trigger:** Centang pada kolom Bendahara (`TRUE`) secara otomatis memicu Apps Script.
* **Action:** Script mengirim email notifikasi HTML ke seluruh anggota tim dalam hitungan detik.
* **Finish:** Proses selesai, peserta terkonfirmasi.

---

## Tampilan Sistem

### **1. Dashboard Verifikasi (Google Sheets)**
Menggunakan *Conditional Formatting* dan *Data Validation* untuk memudahkan panitia.
![sheet-dashboard](assets/rumus.png)

### **2. Output: Email HTML Otomatis**
Email yang diterima peserta berisi sapaan personal dan tombol CTA (Call to Action).
![email-sent](assets/email.png)

---

## Core Technology (Technical Deep Dive)

Bagian ini menjelaskan logika kompleks yang berjalan di belakang layar.

### 1. Google Sheets: Dynamic Data Consolidation
Tantangan utama adalah menyatukan data bukti bayar yang tersebar di kolom berbeda tergantung pilihan paket peserta. Untuk itu digunakan **Nested IF didalam ArrayFormula**:

```excel
=ARRAYFORMULA(IFERROR(
  IF(IMPORTRANGE("URL";"Responses!AB2:AB")<>""; IMPORTRANGE("URL";"Responses!AB2:AB");
  IF(IMPORTRANGE("URL";"Responses!AC2:AC")<>""; IMPORTRANGE("URL";"Responses!AC2:AC");
  IF(IMPORTRANGE("URL";"Responses!AD2:AD")<>""; IMPORTRANGE("URL";"Responses!AD2:AD"); "")))
))
```
### 2. Apps Script: Event-Driven Automation
Sistem ini menggunakan *Custom Script* yang ditulis dalam JavaScript (Google Apps Script) untuk menangani logika pengiriman email secara backend.

**Fitur Kunci Script:**
* **Smart Trigger (`onEdit`):** Skrip didesain presisi untuk hanya aktif jika (dan hanya jika) kolom **CHECKBOX** (Kolom J) dicentang. Edit di kolom lain tidak akan memicu skrip, menghemat kuota eksekusi Google.
* **Anti-Spam Guardrail:** Mencegah email ganda! Sebelum mengirim, skrip mengecek "Cell Note". Jika sudah ada catatan "Terkirim", proses dibatalkan otomatis.
* **HTML Templating:** Email yang dikirim bukan teks biasa, melainkan HTML yang dirender dengan logo *branding* IMC dan tombol CTA (Call to Action) ke grup WhatsApp.
**Klik link di bawah untuk membaca kode lengkapnya:**

[**LIHAT SOURCE CODE APPS SCRIPT**](scripts/kirimEmailVerifikasiTim.js)

*(Link di atas akan membuka file kodingan langsung di repository ini)*

---

## 👥 Kontributor

![System Architect](https://img.shields.io/badge/Gita_Lavena_Yumandari-Lead_System_Architect_%26_Excel_Specialist-blue?style=for-the-badge) 
> Perancangan alur sistem (workflow), arsitektur database, dan logika rumus kompleks (`QUERY`/`ARRAYFORMULA`).

![Automation Engineer](https://img.shields.io/badge/Yohanes_Deo_Pringgondani-Automation_Engineer_%26_Scripting-green?style=for-the-badge) 
> Implementasi kode backend, penanganan *trigger* otomatisasi, dan sistem *rendering* email HTML.

<br>

> **Cross-Functional Collaboration:** Proyek ini dikerjakan dengan prinsip *Cross-Functional*. Kedua kontributor memiliki pemahaman penuh (*Full-Stack*) terhadap seluruh sistem, sehingga mampu menangani logika Excel maupun koding Apps Script secara bergantian (*interchangeable*).

---
