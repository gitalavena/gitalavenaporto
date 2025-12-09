function kirimEmailVerifikasiTim(e) {
  const NAMA_SHEET = "DATA"; // sesuaikan nama sheet
  const KOLOM_CHECKLIST = 10;    // Kolom J

  const KOLOM_NAMA_TIM = 1;
  const KOLOM_NAMA_KETUA = 2;
  const KOLOM_EMAIL_KETUA = 3;
  const KOLOM_NAMA_ANGGOTA_1 = 4;
  const KOLOM_EMAIL_ANGGOTA_1 = 5;
  const KOLOM_NAMA_ANGGOTA_2 = 6;
  const KOLOM_EMAIL_ANGGOTA_2 = 7;
  const KOLOM_NAMA_ANGGOTA_3 = 8;
  const KOLOM_EMAIL_ANGGOTA_3 = 9;

  // Mengambil informasi dari event 'edit' yang terjadi
  const range = e.range; // sel yang dicentang
  const sheet = range.getSheet();
  const barisEdit = range.getRow();

  // Pengecekan awal
  if (sheet.getName() !== NAMA_SHEET || range.getColumn() !== KOLOM_CHECKLIST || range.getValue() !== true) {
    return;
  }
  
  // Mencegah email dikirim ulang menggunakan "Catatan Sel"
  if (range.getNote() !== "") {
    return;
  }

  // Mengambil semua data yang diperlukan
  const namaTim = sheet.getRange(barisEdit, KOLOM_NAMA_TIM).getValue();
  const anggotaTim = [
    { nama: sheet.getRange(barisEdit, KOLOM_NAMA_KETUA).getValue(), email: sheet.getRange(barisEdit, KOLOM_EMAIL_KETUA).getValue() },
    { nama: sheet.getRange(barisEdit, KOLOM_NAMA_ANGGOTA_1).getValue(), email: sheet.getRange(barisEdit, KOLOM_EMAIL_ANGGOTA_1).getValue() },
    { nama: sheet.getRange(barisEdit, KOLOM_NAMA_ANGGOTA_2).getValue(), email: sheet.getRange(barisEdit, KOLOM_EMAIL_ANGGOTA_2).getValue() },
    { nama: sheet.getRange(barisEdit, KOLOM_NAMA_ANGGOTA_3).getValue(), email: sheet.getRange(barisEdit, KOLOM_EMAIL_ANGGOTA_3).getValue() }
  ];

  const wasapGrup = "https://ipb.link/grup-peserta-imc2025";
  const linkLogo = "https://drive.google.com/uc?id=1gePb_fYfm1SGm_uSEvRW6G_ySv3n9sDy";

  try {
    let emailTerkirim = 0;

    for (const anggota of anggotaTim) {
      if (anggota.nama && anggota.email) {
        
        // --- KODE HTML EMAIL ---
        const bodyText = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td style="padding: 20px 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <tr><td align="center" style="padding: 0; font-size: 0; line-height: 0;">
                  <img src="${linkLogo}" alt="IMC 2025 Banner" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border-top-left-radius: 12px; border-top-right-radius: 12px;" />
                </td></tr>
                <tr><td style="padding: 40px 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">Halo <strong>${anggota.nama}</strong>!</p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">Selamat! Pendaftaran Anda pada tim <strong>${namaTim}</strong> untuk kompetisi IMC 2025: Math Voyage telah berhasil kami verifikasi.</p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">Langkah selanjutnya adalah bergabung ke Grup WhatsApp resmi peserta. Seluruh informasi, jadwal, dan pengumuman akan disampaikan dalam grup tersebut. Pastikan seluruh anggota tim Anda telah bergabung ya!</p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td align="center" style="padding: 20px 0;">
                      <a href="${wasapGrup}" target="_blank" style="background-color: #007bff; color: white; padding: 15px 32px; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 8px; font-weight: bold;">Gabung Grup WhatsApp</a>
                    </td></tr>
                  </table>
                  
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

                  <h3 style="color: #333333; text-align: center;">Punya Pertanyaan?</h3>
                  <p style="color: #555555; font-size: 14px; line-height: 1.5; text-align: center;">Hubungi kami di sini yaa!:</p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td align="center" style="padding: 10px 0;">
                      <a href="https://wa.me/6281298346299" target="_blank" style="background-color: #1e428a; color: white; padding: 8px 16px; text-decoration: none; display: inline-block; font-size: 14px; border-radius: 20px; margin: 5px;">Kontak Daniel</a>
                      <a href="https://wa.me/628111775975" target="_blank" style="background-color: #1e428a; color: white; padding: 8px 16px; text-decoration: none; display: inline-block; font-size: 14px; border-radius: 20px; margin: 5px;">Kontak Fahmi</a>
                    </td></tr>
                  </table>

                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

                  <h3 style="color: #333333; text-align: center;">Find Us!</h3>
                  <p style="color: #555555; font-size: 14px; line-height: 1.5; text-align: center;">Informasi dan konten menarik seputar IMC 2025 dapat ditemukan di:</p>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr><td align="center" style="padding: 10px 0;">
                      <a href="https://www.instagram.com/imcipb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" style="text-decoration: none; margin: 0 10px;"><img src="https://drive.google.com/uc?id=1YSEfYXuhr5ONCTjMB_Y_Z35GV_keGb-y" width="32" alt="Instagram"></a>
                      <a href="https://www.tiktok.com/@imcipb?_t=ZS-8xdsLNatetu&_r=1" target="_blank" style="text-decoration: none; margin: 0 10px;"><img src="https://drive.google.com/uc?id=1PNjHZfdu5AMLq_z2j1iHu3bbFavwaqIw" width="32" alt="TikTok"></a>
                    </td></tr>
                  </table>
                  
                </td></tr>
                <tr><td style="padding: 30px 30px 20px 30px; text-align: left;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0;">Kami tunggu di IMC 2025. Sampai jumpa di kompetisi!</p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5; margin-top: 15px;">Sailing through numbers, navigating knowledge!,<br>Panitia IMC 2025</p>
                </td></tr>
              </table>
            </td></tr>
             <tr><td align="center" style="padding: 20px 0; text-align: center;">
                <p style="margin: 0; color: #888888; font-size: 12px;">&copy; 2025 IMC. Semua Hak Cipta Dilindungi.</p>
             </td></tr>
          </table>
        </body>
        </html>
        `;

        GmailApp.sendEmail(anggota.email, "Verifikasi Pendaftaran IMC 2025 Berhasil!", '', {
          name: 'IMC 2025',
          htmlBody: bodyText
        });

        emailTerkirim++;
      }
    }
    
    // Memberi tanda "sudah terkirim" dengan Cell Note
    range.setNote(`Email terkirim ke ${emailTerkirim} anggota pada ${new Date()}`);

  } catch (error) {
    range.setNote(`Gagal Kirim: ${error.toString()}`);
  }
}
