const db = require('../config/database');
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const fs = require('fs').promises; 
const path = require('path');
const cron = require('node-cron');

dayjs.extend(utc);
dayjs.extend(timezone);

// Fungsi untuk mengirimkan pesan ke WhatsApp
const sendWhatsAppMessage = async (chatId, mediaCaption, mediaBase64, mediaName) => {
  try {

    const response = await axios({
      method: 'POST',
      url: 'https://waapi.app/api/v1/instances/21145/client/action/send-media',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer oJMZLrI4uL69lALWXcnzGvlz7MxRCDQYsHx7F0Vs90710d4e',
      },
      data: {
        chatId,
        mediaCaption,
        mediaBase64,
        mediaName
      },
    });
    console.log('Message sent successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const alertController = {
  alertTTD: async (request, h) => {
    // Jalankan cron job setiap menit
    cron.schedule('* * * * * *', async () => {
      try {
        // Ambil semua data ReminderTTD yang aktif
        const [reminderTTDs] = await db.query(
          'SELECT r.ibu_hamil_id, r.waktu_reminder_1, r.is_active_reminder_1, r.waktu_reminder_2, r.is_active_reminder_2, i.no_hp ' +
          'FROM ReminderTTD r ' +
          'JOIN IbuHamil i ON r.ibu_hamil_id = i.ibu_hamil_id ' +
          'WHERE r.is_active_reminder_1 = 1 OR r.is_active_reminder_2 = 1'
        );

        // Dapatkan waktu saat ini di zona waktu WIB (Asia/Jakarta)
        const currentTime = dayjs().tz('Asia/Jakarta').format('HH:mm:ss');

        for (const reminder of reminderTTDs) {

          let reminderSent = false;
          let reminderType = '';

          if (reminder.is_active_reminder_1 === 1 && currentTime === reminder.waktu_reminder_1) {
            reminderSent = true;
            reminderType = 'reminder_1';
          } else if (reminder.is_active_reminder_2 === 1 && currentTime === reminder.waktu_reminder_2) {
            reminderSent = true;
            reminderType = 'reminder_2';
          }

          if (reminderSent) {
            // Persiapkan gambar
            const imagePath = path.join(__dirname, '../img/logo.png');
            const imageBuffer = await fs.readFile(imagePath);
            const imageBase64 = imageBuffer.toString('base64');

            const mediaBase64 = imageBase64;
            console.log('Image size:', imageBuffer.length, 'bytes');

            // Add a media name
            const mediaName = 'logo.png';
            const mediaCaption = 'Waktunya minum tablet tambah darah!';

            // Ubah nomor telepon menjadi format dengan kode negara Indonesia
            const chatId = reminder.no_hp.replace(/^0/, '62') + '@c.us';
            
            // Kirim pesan WhatsApp
            await sendWhatsAppMessage(chatId, mediaCaption, mediaBase64, mediaName);

            console.log(`Reminder sent to ${chatId} at ${currentTime}`);

            // Update is_active_reminder sesuai dengan jenis reminder yang dikirim
            const updateField = reminderType === 'reminder_1' ? 'is_active_reminder_1' : 'is_active_reminder_2';
            await db.query(
              `UPDATE ReminderTTD SET ${updateField} = 0 WHERE ibu_hamil_id = ?`,
              [reminder.ibu_hamil_id]
            );

            console.log(`Updated ${updateField} to 0 for ibu_hamil_id: ${reminder.ibu_hamil_id}`);
          }
        }
      } catch (error) {
        console.error('Error in cron job:', error);
      }
    });

    console.log('Alert TTD cron job started');
  },

  stopAlertTTD: () => {
    // Hentikan semua cron job
    cron.getTasks().forEach(task => task.stop());
    console.log('Alert TTD cron job stopped');
  },

  // Metode lain yang mungkin diperlukan
};

module.exports = alertController;