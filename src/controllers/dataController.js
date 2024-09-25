const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const dataController = {
    createPregnantMother: async (request, h) => {
        try {
            const {
                user_id,
                nama,
                usia,
                no_hp,
                hari_pertama_haid,
                tempat_tinggal_ktp,
                tempat_tinggal_kelurahan,
                pendidikan_terakhir,
                pekerjaan,
                image,
                nama_suami,
                no_hp_suami,
                email_suami,
            } = request.payload;

            if (!nama) {
                return h.response({
                    success: false,
                    message: 'Failed to add pregnant mother data. Please provide the pregnant mother name.',
                }).code(400);
            }

            const newItem = {
                user_id,
                nama,
                usia,
                no_hp,
                hari_pertama_haid,
                tempat_tinggal_ktp,
                tempat_tinggal_kelurahan,
                pendidikan_terakhir,
                pekerjaan,
                image,
                nama_suami,
                no_hp_suami,
                email_suami,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            const [result] = await db.query(
                `INSERT INTO IbuHamil (user_id, nama, usia, no_hp, hari_pertama_haid, tempat_tinggal_ktp, tempat_tinggal_kelurahan, pendidikan_terakhir, pekerjaan, image, nama_suami, no_hp_suami, email_suami, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newItem.user_id, newItem.nama, newItem.usia, newItem.no_hp, newItem.hari_pertama_haid, newItem.tempat_tinggal_ktp, newItem.tempat_tinggal_kelurahan, newItem.pendidikan_terakhir, newItem.pekerjaan, newItem.image, newItem.nama_suami, newItem.no_hp_suami, newItem.email_suami, newItem.created_at, newItem.updated_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add pregnant mother data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM IbuHamil WHERE ibu_hamil_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Insert data successfully.' }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    getPregnantMother: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM IbuHamil WHERE ibu_hamil_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Mother pregnant not found' }).code(404);
            }

            return h.response({ success: true, data: data[0], message: 'Get data by id successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    getAllPregnantMother: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM IbuHamil`
            );

            return h.response({ success: true, data: data, message: 'Get data successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    updatePregnantMother: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                user_id,
                nama,
                usia,
                hari_pertama_haid,
                tempat_tinggal_ktp,
                tempat_tinggal_kelurahan,
                pendidikan_terakhir,
                pekerjaan,
                nama_suami,
                no_hp_suami,
                email_suami,
            } = request.payload;

            const updatedItem = {
                user_id,
                nama,
                usia,
                hari_pertama_haid,
                tempat_tinggal_ktp,
                tempat_tinggal_kelurahan,
                pendidikan_terakhir,
                pekerjaan,
                nama_suami,
                no_hp_suami,
                email_suami,
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            // Remove undefined values
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE IbuHamil SET ? WHERE ibu_hamil_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Mother Pregnant not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM IbuHamil WHERE ibu_hamil_id = ?`,
                [id]
            );

            return h.response({ status: 'success', data: updatedData[0], message: 'Update data successfully.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deletePregnantMother: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM IbuHamil WHERE ibu_hamil_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Mother Pregnant not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Mother Pregnant deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Anemia Risk Calculator
    createRiskAnemia: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                usia_kehamilan,
                jumlah_anak,
                riwayat_anemia,
                konsumsi_ttd_7hari,
                hasil_hb,
                resiko,
            } = request.payload;

            if (!ibu_hamil_id) {
                return h.response({
                    success: false,
                    message: 'Failed to add Risk Anemia data. Please provide the risk anemia data id.',
                }).code(400);
            }

            const newItem = {
                ibu_hamil_id,
                usia_kehamilan,
                jumlah_anak,
                riwayat_anemia,
                konsumsi_ttd_7hari,
                hasil_hb,
                resiko,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            };

            const [result] = await db.query(
                `INSERT INTO ResikoAnemia (ibu_hamil_id, usia_kehamilan, jumlah_anak, riwayat_anemia, konsumsi_ttd_7hari, hasil_hb, resiko, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [newItem.ibu_hamil_id, newItem.usia_kehamilan, newItem.jumlah_anak, newItem.riwayat_anemia, newItem.konsumsi_ttd_7hari, newItem.hasil_hb, newItem.resiko, newItem.created_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add Risk Anemia data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM ResikoAnemia WHERE resiko_anemia_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0] }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    getRiskAnemia: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM ResikoAnemia WHERE resiko_anemia_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Risk of Anemia not found' }).code(404);
            }

            return h.response({ success: true, data: data[0] }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    getAllRiskAnemia: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM ResikoAnemia`
            );

            return h.response({ success: true, data }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    updateRiskAnemia: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                usia_kehamilan,
                jumlah_anak,
                riwayat_anemia,
                konsumsi_ttd_7hari,
                hasil_hb,
                resiko,
            } = request.payload;

            const updatedItem = {
                ibu_hamil_id,
                usia_kehamilan,
                jumlah_anak,
                riwayat_anemia,
                konsumsi_ttd_7hari,
                hasil_hb,
                resiko
            };

            // Remove undefined values
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE ResikoAnemia SET ? WHERE resiko_anemia_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Risk of Anemia data not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM ResikoAnemia WHERE resiko_anemia_id = ?`,
                [id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Updated data successfully.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    deleteRiskAnemia: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM ResikoAnemia WHERE resiko_anemia_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Risk of Anemia data not found' }).code(404);
            }

            return h.response({ success: true, message: 'Risk of Anemia data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
    
    // Eating Journal
    createEatingJournal: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                tanggal,
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
                total_kalori,
            } = request.payload;

            if (!ibu_hamil_id) {
                return h.response({
                    success: false,
                    message: 'Failed to add eating journal data. Please provide the eating journal id.',
                }).code(400);
            }

            const newItem = {
                ibu_hamil_id,
                tanggal,
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
                total_kalori,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            };

            const [result] = await db.query(
                `INSERT INTO JurnalMakan (ibu_hamil_id, tanggal, sarapan_karbohidrat, sarapan_lauk_hewani, sarapan_lauk_nabati, sarapan_sayur, sarapan_buah, makan_siang_karbohidrat, makan_siang_lauk_hewani, makan_siang_lauk_nabati, makan_siang_sayur, makan_siang_buah, makan_malam_karbohidrat, makan_malam_lauk_hewani, makan_malam_lauk_nabati, makan_malam_sayur, makan_malam_buah, total_kalori, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newItem.ibu_hamil_id, newItem.tanggal, newItem.sarapan_karbohidrat, newItem.sarapan_lauk_hewani, newItem.sarapan_lauk_nabati, newItem.sarapan_sayur, newItem.sarapan_buah, newItem.makan_siang_karbohidrat, newItem.makan_siang_lauk_hewani, newItem.makan_siang_lauk_nabati, newItem.makan_siang_sayur, newItem.makan_siang_buah, newItem.makan_malam_karbohidrat, newItem.makan_malam_lauk_hewani, newItem.makan_malam_lauk_nabati, newItem.makan_malam_sayur, newItem.makan_malam_buah, newItem.total_kalori, newItem.created_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add Eating Journal data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM JurnalMakan WHERE jurnal_makan_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Insert data successfully.' }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    getEatingJournal: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM JurnalMakan WHERE jurnal_makan_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Eating Journal data not found' }).code(404);
            }

            return h.response({ success: true, data: data[0], message: 'Get data by id successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    getAllEatingJournal: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM JurnalMakan`
            );

            return h.response({ status: 'success', data }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    updateEatingJournal: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                tanggal,
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
                total_kalori,
            } = request.payload;

            const updatedItem = {
                ibu_hamil_id,
                tanggal,
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
                total_kalori,
            };

            // Remove undefined values
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE JurnalMakan SET ? WHERE jurnal_makan_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ status: false, message: 'Eating Journal data not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM JurnalMakan WHERE jurnal_makan_id = ?`,
                [id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Updated data successfully.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    deleteEatingJournal: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM JurnalMakan WHERE jurnal_makan_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Eating Journal data not found' }).code(404);
            }

            return h.response({ success: true, message: 'Eating Journal data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    // Reminder TTD
    createReminderTtd: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                waktu_reminder_1,
                is_active_reminder_1,
                waktu_reminder_2,
                is_active_reminder_2,
            } = request.payload;
    
            if (!ibu_hamil_id) {
                const response = h.response({
                    status: false,
                    message: 'Failed to add reminder ttd data. Please provide the ibu_hamil_id.',
                });
                response.code(400);
                return response;
            }
    
            const newItem = {
                ibu_hamil_id,
                waktu_reminder_1,
                is_active_reminder_1,
                waktu_reminder_2,
                is_active_reminder_2,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            };
    
            const [results] = await db.query(
                'INSERT INTO ReminderTTD SET ?',
                newItem
            );
    
            const responsePayload = {
                success: true,
                data: {
                    id: results.insertId,
                    ...newItem
                },
                message: 'Insert data successfully.'
            };
    
            return h.response(responsePayload).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },    
    
    getReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'SELECT * FROM ReminderTTD WHERE reminder_id = ?',
                [id]
            );
    
            if (results.length === 0) {
                return h.response({ success: false, message: 'Reminder TTD data not found' }).code(404);
            }
    
            const responsePayload = {
                success: true,
                data: results[0],
                message: 'Get data by id successfully.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ success: false, message: 'Error fetching document' }).code(500);
        }
    },    

    getAllReminderTtd: async (request, h) => {
        try {
            const [results] = await db.query(
                'SELECT * FROM ReminderTTD'
            );
    
            return h.response({ success: true, data: results }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ success: false, message: 'Error fetching documents' }).code(500);
        }
    },
    
    updateReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                waktu_reminder_1,
                is_active_reminder_1,
                waktu_reminder_2,
                is_active_reminder_2,
            } = request.payload;
    
            const updatedItem = {
                ibu_hamil_id,
                waktu_reminder_1,
                is_active_reminder_1,
                waktu_reminder_2,
                is_active_reminder_2,
                updated_at: new Date()
            };
    
            const [results] = await db.query(
                'UPDATE ReminderTTD SET ? WHERE reminder_id = ?',
                [updatedItem, id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Reminder TTD not found' }).code(404);
            }
    
            const [updatedResults] = await db.query(
                'SELECT * FROM ReminderTTD WHERE reminder_id = ?',
                [id]
            );
    
            const responsePayload = {
                success: true,
                data: updatedResults[0],
                message: 'Updated data successfully.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    deleteReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'DELETE FROM ReminderTTD WHERE reminder_id = ?',
                [id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Reminder TTD data not found' }).code(404);
            }
    
            return h.response({ success: true, message: 'Reminder TTD data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ success: false, message: 'Error deleting document' }).code(500);
        }
    },
    
    // Check HB
    createCheckHB: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                tanggal,
                nilai_hb,
            } = request.payload;
    
            if (!ibu_hamil_id) {
                const response = h.response({
                    success: false,
                    message: 'Failed to add Check HB data. Please provide the ibu_hamil_id.',
                });
                response.code(400);
                return response;
            }
    
            const newItem = {
                ibu_hamil_id,
                tanggal,
                nilai_hb,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };
    
            const [results] = await db.query(
                'INSERT INTO CekHB SET ?',
                newItem
            );
    
            const responsePayload = {
                success: true,
                data: {
                    cek_hb_id: results.insertId,
                    ...newItem
                },
                message: 'Insert data successfully.'
            };
    
            return h.response(responsePayload).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
    
    getCheckHB: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'SELECT * FROM CekHB WHERE cek_hb_id = ?',
                [id]
            );
    
            if (results.length === 0) {
                return h.response({ success: false, message: 'Check HB data not found' }).code(404);
            }
    
            const responsePayload = {
                success: true,
                data: results[0],
                message: 'Get data by id successfully.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ success: false, message: 'Error fetching document' }).code(500);
        }
    },
    
    getAllCheckHB: async (request, h) => {
        try {
            const [results] = await db.query(
                'SELECT * FROM CekHB'
            );
    
            return h.response({ success: true, data: results }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ success: false, message: 'Error fetching documents' }).code(500);
        }
    },

    updateCheckHB: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                tanggal,
                nilai_hb,
            } = request.payload;
    
            const updatedItem = {
                ibu_hamil_id,
                tanggal,
                nilai_hb,
            };
    
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });
    
            const [results] = await db.query(
                'UPDATE CekHB SET ? WHERE cek_hb_id = ?',
                [updatedItem, id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Check HB data not found' }).code(404);
            }
    
            const [updatedResults] = await db.query(
                'SELECT * FROM CekHB WHERE cek_hb_id = ?',
                [id]
            );
    
            const responsePayload = {
                success: true,
                data: updatedResults[0],
                message: 'Updated data successfully.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
    
    deleteCheckHB: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'DELETE FROM CekHB WHERE cek_hb_id = ?',
                [id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Check HB data not found' }).code(404);
            }
    
            return h.response({ success: true, message: 'Check HB deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ success: false, message: 'Error deleting document' }).code(500);
        }
    },

    // Konsumsi TTD
    createConsumptionTtd: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                tanggal_waktu,
                minum_vit_c,
            } = request.payload;
    
            if (!ibu_hamil_id) {
                const response = h.response({
                    success: false,
                    message: 'Failed to add consumption ttd data. Please provide the ibu_hamil_id.',
                });
                response.code(400);
                return response;
            }
    
            const newItem = {
                ibu_hamil_id,
                tanggal_waktu,
                minum_vit_c,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };
    
            const [results] = await db.query(
                'INSERT INTO KonsumsiTTD SET ?',
                newItem
            );
    
            const responsePayload = {
                success: true,
                data: {
                    konsumsi_ttd_id: results.insertId,
                    ...newItem
                },
                message: 'Insert data successfully.'
            };
    
            return h.response(responsePayload).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
    
    getConsumptionTtd: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'SELECT * FROM KonsumsiTTD WHERE konsumsi_ttd_id = ?',
                [id]
            );
    
            if (results.length === 0) {
                return h.response({ success: false, message: 'Consumption ttd data not found' }).code(404);
            }
    
            const responsePayload = {
                success: true,
                data: results[0],
                message: 'Get data by id successfully.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ success: false, message: 'Error fetching document' }).code(500);
        }
    },
    
    getAllConsumptionTtd: async (request, h) => {
        try {
            const [results] = await db.query(
                'SELECT * FROM KonsumsiTTD'
            );
    
            return h.response({ success: true, data: results }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ success: false, message: 'Error fetching documents' }).code(500);
        }
    },
    
    updateConsumptionTtd: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                tanggal_waktu,
                minum_vit_c,
            } = request.payload;
    
            const updatedItem = {
                ibu_hamil_id,
                tanggal_waktu,
                minum_vit_c,
            };
    
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });
    
            const [results] = await db.query(
                'UPDATE KonsumsiTTD SET ? WHERE konsumsi_ttd_id = ?',
                [updatedItem, id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Consumption ttd data not found' }).code(404);
            }
    
            const [updatedResults] = await db.query(
                'SELECT * FROM KonsumsiTTD WHERE konsumsi_ttd_id = ?',
                [id]
            );
    
            const responsePayload = {
                success: true,
                data: updatedResults[0],
                message: 'Updated data successfuly.'
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
    
    deleteConsumptionTtd: async (request, h) => {
        try {
            const { id } = request.params;
    
            const [results] = await db.query(
                'DELETE FROM KonsumsiTTD WHERE konsumsi_ttd_id = ?',
                [id]
            );
    
            if (results.affectedRows === 0) {
                return h.response({ success: false, message: 'Consumption ttd data not found' }).code(404);
            }
    
            return h.response({ success: true, message: 'Consumption TTD deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ success: false, message: 'Error deleting document' }).code(500);
        }
    },
};

module.exports = dataController;