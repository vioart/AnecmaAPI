const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const motherController = {
    DasboardMother: async (request, h) => {
        try {
            // Ambil user_id dari token yang terverifikasi
            const user_id = request.auth.credentials.id;

            // Ambil data user dari tabel Users berdasarkan user_id
            const [ibuHamil] = await db.query(
                'SELECT ibu_hamil_id, nama FROM IbuHamil WHERE user_id = ? LIMIT 1', 
                [user_id]
            );

            if (!ibuHamil) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            // Ambil data resiko anemia dari tabel ResikoAnemia berdasarkan ibu_hamil_id
            const [ResikoAnemia] = await db.query(
                'SELECT resiko FROM ResikoAnemia WHERE ibu_hamil_id = ? LIMIT 1', 
                [ibuHamil[0].ibu_hamil_id]
            );

            if (!ResikoAnemia) {
                return h.response({ success: false, message: 'Failed to retrieve resiko data' }).code(500);
            }

            // Ambil nilai HB dari tabel CekHB berdasarkan ibu_hamil_id, urutkan berdasarkan waktu terbaru
            const [CekHB] = await db.query(
                'SELECT nilai_hb FROM CekHB WHERE ibu_hamil_id = ? ORDER BY created_at DESC LIMIT 1', 
                [ibuHamil[0].ibu_hamil_id]
            );

            if (!CekHB) {
                return h.response({ success: false, message: 'Failed to retrieve HB data' }).code(500);
            }

            // Gabungkan data dari ketiga tabel
            const dashboardData = {
                nama: ibuHamil[0].nama,
                resiko: ResikoAnemia[0].resiko,
                nilai_hb: CekHB[0].nilai_hb
            };

            return h.response({ success: true, data: dashboardData, message: "Data retrieved successfully." }).code(200);
        } catch (error) {
            console.error('Error retrieving user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    EducationPregnantMother: async (request, h) => {
        try {
            // Fetch all data from the 'Edukasi' table
            const [data] = await db.query('SELECT * FROM Edukasi');
    
            if (!data.length) {
                return h.response({ success: false, message: 'No data found' }).code(404);
            }
    
            return h.response({ success: true, data: data, message: 'Data retrieved successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    ConsultationPregnantMother: async (request, h) => {
        try {
            // Ambil user_id dari token yang terverifikasi
            const user_id = request.auth.credentials.id;

            // Ambil data ibu hamil dari tabel IbuHamil berdasarkan user_id
            const [ibuHamil] = await db.query(
                'SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ? LIMIT 1',
                [user_id]
            );

            if (!ibuHamil) {
                return h.response({ status: 'fail', message: 'User data not found' }).code(404);
            }

            const [petugasData] = await db.query(
                'SELECT petugas_id, nama, jabatan, no_hp FROM PetugasPuskesmas',
            );

            if (!petugasData) {
                return h.response({ status: 'fail', message: 'Petugas data not found' }).code(404);
            }

            return h.response({
                status: 'success',
                data: petugasData,
                message: 'Data retrieved successfully.'
            }).code(200);

        } catch (error) {
            console.error('Error retrieving consultation data:', error);
            return h.response({ status: 'fail', message: 'Error retrieving consultation data' }).code(500);
        }
    },

    ProfileMother: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { nama, usia, no_hp } = request.payload;

            // Update data in the IbuHamil table based on user_id
            const [result] = await db.query(
                'UPDATE IbuHamil SET nama = ?, usia = ?, no_hp = ? WHERE user_id = ?', 
                [nama, usia, no_hp, user_id]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to update IbuHamil data or user not found' }).code(404);
            }

            // Fetch updated data to return in the response
            const [updatedData] = await db.query(
                'SELECT nama, usia, no_hp FROM IbuHamil WHERE user_id = ?', 
                [user_id]
            );

            return h.response({ success: true, data: updatedData[0], message: "Data updated successfully." }).code(200);
        } catch (error) {
            console.error('Error updating user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    PregnancyPersonalData: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const {
                hari_pertama_haid,
                tempat_tinggal_ktp,
                tempat_tinggal_kelurahan,
                pendidikan_terakhir,
                pekerjaan
            } = request.payload;

            // Update data in the IbuHamil table based on user_id
            const [result] = await db.query(
                `UPDATE IbuHamil
                SET hari_pertama_haid = ?, tempat_tinggal_ktp = ?, tempat_tinggal_kelurahan = ?, 
                pendidikan_terakhir = ?, pekerjaan = ?
                WHERE user_id = ?`,
                [
                    hari_pertama_haid,
                    tempat_tinggal_ktp,
                    tempat_tinggal_kelurahan,
                    pendidikan_terakhir,
                    pekerjaan,
                    user_id
                ]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'No data updated or user not found' }).code(404);
            }

            // Fetch the updated data to return in the response
            const [updatedData] = await db.query(
                `SELECT hari_pertama_haid, tempat_tinggal_ktp, tempat_tinggal_kelurahan, pendidikan_terakhir, pekerjaan 
                FROM IbuHamil
                WHERE user_id = ?`,
                [user_id]
            );

            return h.response({ success: true, data: updatedData[0], message: "Data updated successfully." }).code(200);
        } catch (error) {
            console.error('Error updating user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    HusbandData: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { nama_suami, no_hp_suami, email_suami } = request.payload;

            // Update data in the IbuHamil table based on user_id
            const [result] = await db.query(
                `UPDATE IbuHamil
                SET nama_suami = ?, no_hp_suami = ?, email_suami = ?
                WHERE user_id = ?`,
                [nama_suami, no_hp_suami, email_suami, user_id]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'No data updated or user not found' }).code(404);
            }

            // Fetch updated data to return in the response
            const [updatedData] = await db.query(
                `SELECT nama_suami, no_hp_suami, email_suami FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            return h.response({ success: true, data: updatedData[0], message: "Data updated successfully." }).code(200);
        } catch (error) {
            console.error('Error updating user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    CalculatorAnemia: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { usia_kehamilan, jumlah_anak, konsumsi_ttd_7hari, hasil_hb, riwayat_anemia, resiko } = request.payload;

            // Fetch ibu_hamil_id from the IbuHamil table based on user_id
            const [ibuHamil] = await db.query(
                `SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            if (ibuHamil.length === 0) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            const ibu_hamil_id = ibuHamil[0].ibu_hamil_id;

            // Upsert data in the ResikoAnemia table based on ibu_hamil_id
            const [upsertResult] = await db.query(
                `INSERT INTO ResikoAnemia (ibu_hamil_id, usia_kehamilan, jumlah_anak, konsumsi_ttd_7hari, hasil_hb, riwayat_anemia, resiko, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    usia_kehamilan = VALUES(usia_kehamilan), 
                    jumlah_anak = VALUES(jumlah_anak), 
                    konsumsi_ttd_7hari = VALUES(konsumsi_ttd_7hari),
                    hasil_hb = VALUES(hasil_hb),
                    riwayat_anemia = VALUES(riwayat_anemia),
                    resiko = VALUES(resiko)`,
                [ibu_hamil_id, usia_kehamilan, jumlah_anak, konsumsi_ttd_7hari, hasil_hb, riwayat_anemia, resiko]
            );


            // Fetch updated data to return in the response
            const [updatedData] = await db.query(
                `SELECT usia_kehamilan, jumlah_anak, konsumsi_ttd_7hari, hasil_hb, riwayat_anemia, resiko, created_at
                FROM ResikoAnemia
                WHERE ibu_hamil_id = ?`,
                [ibu_hamil_id]
            );

            return h.response({ success: true, data: updatedData[0], message: "Data processed successfully." }).code(200);
        } catch (error) {
            console.error('Error updating user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    EatingJurnal: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const {
                sarapan_karbohidrat, 
                sarapan_lauk_hewani, 
                sarapan_lauk_nabati,
                sarapan_sayur,
                sarapan_buah,
                makan_siang_karbohidrat,
                makan_siang_lauk_hewani,
                makan_siang_lauk_nabati,
                makan_siang_sayur,
                makan_siang_buah,
                makan_malam_karbohidrat,
                makan_malam_lauk_hewani,
                makan_malam_lauk_nabati,
                makan_malam_sayur,
                makan_malam_buah,
                total_kalori
            } = request.payload;

            // Fetch ibu_hamil_id from IbuHamil table based on user_id
            const [ibuHamil] = await db.query(
                `SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            if (ibuHamil.length === 0) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            const ibu_hamil_id = ibuHamil[0].ibu_hamil_id;

            // Set timezone to Jakarta
            const tanggal = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const created_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            // Insert data into JurnalMakan table
            const [insertResult] = await db.query(
                `INSERT INTO JurnalMakan (
                    ibu_hamil_id, tanggal, sarapan_karbohidrat, sarapan_lauk_hewani, sarapan_lauk_nabati,
                    sarapan_sayur, sarapan_buah, makan_siang_karbohidrat, makan_siang_lauk_hewani,
                    makan_siang_lauk_nabati, makan_siang_sayur, makan_siang_buah, makan_malam_karbohidrat,
                    makan_malam_lauk_hewani, makan_malam_lauk_nabati, makan_malam_sayur, makan_malam_buah,
                    total_kalori, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ibu_hamil_id, tanggal, sarapan_karbohidrat, sarapan_lauk_hewani, sarapan_lauk_nabati,
                    sarapan_sayur, sarapan_buah, makan_siang_karbohidrat, makan_siang_lauk_hewani,
                    makan_siang_lauk_nabati, makan_siang_sayur, makan_siang_buah, makan_malam_karbohidrat,
                    makan_malam_lauk_hewani, makan_malam_lauk_nabati, makan_malam_sayur, makan_malam_buah,
                    total_kalori, created_at
                ]
            );

            if (insertResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to insert data' }).code(500);
            }

            // Fetch the inserted data
            const [insertedData] = await db.query(
                `SELECT * FROM JurnalMakan WHERE ibu_hamil_id = ? ORDER BY created_at DESC LIMIT 1`,
                [ibu_hamil_id, tanggal]
            );

            return h.response({ success: true, data: insertedData[0], message: "Data inserted successfully." }).code(200);
        } catch (error) {
            console.error('Error inserting user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    ConsumptionTTD: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { minum_vit_c } = request.payload;

            // Fetch ibu_hamil_id from IbuHamil table based on user_id
            const [ibuHamil] = await db.query(
                `SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            if (ibuHamil.length === 0) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            const ibu_hamil_id = ibuHamil[0].ibu_hamil_id;

            // Set timezone to Jakarta
            const tanggal_waktu = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            const created_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            // Insert data into KonsumsiTTD table
            const [insertResult] = await db.query(
                `INSERT INTO KonsumsiTTD (ibu_hamil_id, tanggal_waktu, minum_vit_c, created_at)
                 VALUES (?, ?, ?, ?)`,
                [ibu_hamil_id, tanggal_waktu, minum_vit_c, created_at]
            );

            if (insertResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to insert data' }).code(500);
            }

            // Fetch the inserted data
            const [insertedData] = await db.query(
                `SELECT * FROM KonsumsiTTD WHERE ibu_hamil_id = ? AND tanggal_waktu = ?`,
                [ibu_hamil_id, tanggal_waktu]
            );

            return h.response({ success: true, data: insertedData[0], message: "Data inserted successfully." }).code(200);
        } catch (error) {
            console.error('Error inserting user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    HistoryHB: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { nilai_hb } = request.payload;

            // Fetch ibu_hamil_id from IbuHamil table based on user_id
            const [ibuHamil] = await db.query(
                `SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            if (ibuHamil.length === 0) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            const ibu_hamil_id = ibuHamil[0].ibu_hamil_id;

            // Set timezone to Jakarta
            const tanggal = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD');
            const created_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            // Insert data into CekHB table
            const [insertResult] = await db.query(
                `INSERT INTO CekHB (ibu_hamil_id, tanggal, nilai_hb, created_at)
                 VALUES (?, ?, ?, ?)`,
                [ibu_hamil_id, tanggal, nilai_hb, created_at] 
            );

            if (insertResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to insert data' }).code(500);
            }

            // Fetch the inserted data
            const [insertedData] = await db.query(
                `SELECT * FROM CekHB WHERE ibu_hamil_id = ? ORDER BY created_at DESC LIMIT 1`,
                [ibu_hamil_id]
            );

            return h.response({ success: true, data: insertedData[0], message: "Data inserted successfully." }).code(200);
        } catch (error) {
            console.error('Error inserting user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    ReminderTTD: async (request, h) => {
        try {
            const user_id = request.auth.credentials.id;
            const { waktu_reminder_1, is_active_reminder_1, waktu_reminder_2, is_active_reminder_2 } = request.payload;
            
            // Validasi ulang jika diperlukan sebelum disimpan
            if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(waktu_reminder_1) || !/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(waktu_reminder_2)) {
                return h.response({ success: false, message: 'Invalid time format' }).code(400);
            }

            // Fetch ibu_hamil_id from IbuHamil table based on user_id
            const [ibuHamil] = await db.query(
                `SELECT ibu_hamil_id FROM IbuHamil WHERE user_id = ?`,
                [user_id]
            );

            if (ibuHamil.length === 0) {
                return h.response({ success: false, message: 'User data not found' }).code(404);
            }

            const ibu_hamil_id = ibuHamil[0].ibu_hamil_id;

            // Check if data already exists in ReminderTTD table for ibu_hamil_id
            const [reminderData] = await db.query(
                `SELECT * FROM ReminderTTD WHERE ibu_hamil_id = ?`,
                [ibu_hamil_id]
            );

            const currentTime = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            if (reminderData.length > 0) {
                // Update existing data
                const [updateResult] = await db.query(
                    `UPDATE ReminderTTD
                     SET waktu_reminder_1 = ?, is_active_reminder_1 = ?, waktu_reminder_2 = ?, is_active_reminder_2 = ?, updated_at = ?
                     WHERE ibu_hamil_id = ?`,
                    [waktu_reminder_1, is_active_reminder_1, waktu_reminder_2, is_active_reminder_2, currentTime, ibu_hamil_id]
                );

                if (updateResult.affectedRows === 0) {
                    return h.response({ success: false, message: 'Failed to update data' }).code(500);
                }

                // Fetch the updated data
                const [updatedData] = await db.query(
                    `SELECT * FROM ReminderTTD WHERE ibu_hamil_id = ?`,
                    [ibu_hamil_id]
                );

                return h.response({ success: true, data: updatedData[0], message: "Data updated successfully." }).code(200);
            } else {
                // Insert new data
                const [insertResult] = await db.query(
                    `INSERT INTO ReminderTTD (ibu_hamil_id, waktu_reminder_1, is_active_reminder_1, waktu_reminder_2, is_active_reminder_2, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [ibu_hamil_id, waktu_reminder_1, is_active_reminder_1, waktu_reminder_2, is_active_reminder_2, currentTime, currentTime]
                );                

                if (insertResult.affectedRows === 0) {
                    return h.response({ success: false, message: 'Failed to insert data' }).code(500);
                }

                // Fetch the inserted data
                const [insertedData] = await db.query(
                    `SELECT * FROM ReminderTTD WHERE ibu_hamil_id = ?`,
                    [ibu_hamil_id]
                );

                return h.response({ success: true, data: insertedData[0], message: "Data inserted successfully." }).code(200);
            }
        } catch (error) {
            console.error('Error processing user data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },
}

module.exports = motherController;