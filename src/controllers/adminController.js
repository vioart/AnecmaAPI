const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const adminController = {
    DasboardAdmin: async (request, h) => {
        try {
            // Query untuk total data dalam tabel IbuHamil
            const [totalIbuHamil] = await db.query(
                `SELECT COUNT(*) AS total FROM IbuHamil`
            );

            // Query untuk total data dengan nilai 'Rendah' di tabel ResikoAnemia
            const [totalResikoRendah] = await db.query(
                `SELECT COUNT(*) AS total FROM ResikoAnemia WHERE resiko = 'Rendah'`
            );

            // Query untuk total data dengan nilai 'Tinggi' di tabel ResikoAnemia
            const [totalResikoTinggi] = await db.query(
                `SELECT COUNT(*) AS total FROM ResikoAnemia WHERE resiko = 'Tinggi'`
            );

            // Query untuk rata-rata kolom konsumsi_ttd_id dari tabel KonsumsiTTD
            const [averageKonsumsiTTD] = await db.query(
                `SELECT AVG(konsumsi_ttd_id) AS average FROM KonsumsiTTD`
            );

            // Mengembalikan respons dengan data yang diminta
            return h.response({
                success: true,
                data: {
                    totalIbuHamil: totalIbuHamil[0].total,
                    totalResikoRendah: totalResikoRendah[0].total,
                    totalResikoTinggi: totalResikoTinggi[0].total,
                    averageKonsumsiTTD: averageKonsumsiTTD[0].average
                },
                message: "Data fetched successfully."
            }).code(200);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    TableDashboardAdmin: async (request, h) => {
        try {
            // Query untuk menampilkan data ibu_hamil_id, nama, usia, resiko, konsumsi_ttd, nilai_hb
            const [data] = await db.query(`
                SELECT
                    ih.ibu_hamil_id,
                    ih.nama,
                    ih.usia,
                    ra.resiko,
                    COALESCE(ctt.konsumsi_ttd_count, 0) AS konsumsi_ttd,
                    COALESCE(chb.nilai_hb, 0) AS nilai_hb
                FROM IbuHamil ih
                LEFT JOIN ResikoAnemia ra ON ih.ibu_hamil_id = ra.ibu_hamil_id
                LEFT JOIN (
                    SELECT ibu_hamil_id, COUNT(*) AS konsumsi_ttd_count
                    FROM KonsumsiTTD
                    GROUP BY ibu_hamil_id
                ) ctt ON ih.ibu_hamil_id = ctt.ibu_hamil_id
                LEFT JOIN (
                    SELECT ibu_hamil_id, nilai_hb
                    FROM CekHB
                    WHERE created_at = (
                        SELECT MAX(created_at)
                        FROM CekHB chb
                        WHERE chb.ibu_hamil_id = CekHB.ibu_hamil_id
                    )
                ) chb ON ih.ibu_hamil_id = chb.ibu_hamil_id
            `);

            // Mengembalikan respons dengan data yang diminta
            return h.response({
                success: true,
                data: data,
                message: "Table data fetched successfully."
            }).code(200);
        } catch (error) {
            console.error('Error fetching table data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    GetDataPuskesmas: async (request, h) => {
        try {
            // Query untuk mengambil semua data dari tabel Puskesmas
            const [data] = await db.query(`
                SELECT puskesmas_id, nama_puskesmas, kecamatan, no_hp
                FROM Puskesmas
            `);

            // Mengembalikan respons dengan data yang diminta
            return h.response({
                success: true,
                data: data,
                message: "Data Puskesmas fetched successfully."
            }).code(200);
        } catch (error) {
            console.error('Error fetching Puskesmas data:', error);
            return h.response({ success: false, message: 'There is an error.' }).code(500);
        }
    },

    DetailDataPuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Puskesmas not found' }).code(404);
            }

            return h.response({ success: true, data: data[0] }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    CreateDataPuskesmas: async (request, h) => {
        try {
            const { nama_puskesmas, alamat, kecamatan, no_hp } = request.payload;

            if (!nama_puskesmas) {
                return h.response({
                    success: false,
                    message: 'Failed to add puskesmas data. Please provide the puskesmas data name.',
                }).code(400);
            }
            created_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            updated_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            const [result] = await db.query(
                `INSERT INTO Puskesmas (nama_puskesmas, alamat, kecamatan, no_hp, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nama_puskesmas, alamat, kecamatan, no_hp, created_at, updated_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add puskesmas data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Data inserted successfully.' }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    UpdateDataPuskesmas: async (request, h) => {
        try {
            const { id } = request.params;
            const { nama_puskesmas, alamat, kecamatan, no_hp } = request.payload;

            const updatedItem = {
                nama_puskesmas,
                alamat,
                kecamatan,
                no_hp,
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE Puskesmas SET ? WHERE puskesmas_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Puskesmas not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Data successfuly updated.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    DeleteDataPuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Puskesmas not found' }).code(404);
            }

            return h.response({ success: true, message: 'Puskesmas deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    GetDataPetugas: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT 
                    PetugasPuskesmas.petugas_id, 
                    Puskesmas.nama_puskesmas, 
                    PetugasPuskesmas.nama, 
                    PetugasPuskesmas.jabatan 
                FROM PetugasPuskesmas
                JOIN Puskesmas ON PetugasPuskesmas.puskesmas_id = Puskesmas.puskesmas_id`
            );
    
            return h.response({ success: true, data: data, message: 'Get data successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    DetailDataPetugas: async (request, h) => {
        try {
            const { petugas_id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [petugas_id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Petugas not found' }).code(404);
            }

            return h.response({ success: true, data: data[0], message: 'Get data successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    CreateDataPetugas: async (request, h) => {
        try {
            const { user_id, puskesmas_id, nama, no_hp, jabatan, image } = request.payload;

            if (!puskesmas_id) {
                return h.response({
                    success: false,
                    message: 'Failed to add puskesmas officer data. Please provide the puskesmas officer data id.',
                }).code(400);
            }

            const [result] = await db.query(
                `INSERT INTO PetugasPuskesmas (user_id, puskesmas_id, nama, no_hp, jabatan, image, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, puskesmas_id, nama, no_hp, jabatan, image, dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'), dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add puskesmas officer data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Insert data successfuly.' }).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    }, 

    UpdateDataPetugas: async (request, h) => {
        try {
            const { petugas_id } = request.params;
            const { user_id, puskesmas_id, nama, no_hp, jabatan, image } = request.payload;

            const updatedItem = {
                user_id,
                puskesmas_id,
                nama,
                no_hp,
                jabatan,
                image,
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE PetugasPuskesmas SET ? WHERE petugas_id = ?`,
                [updatedItem, petugas_id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Petugas not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [petugas_id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Data updated successfully.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    DeleteDataPetugas: async (request, h) => {
        try {
            const { petugas_id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [petugas_id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Petugas not found' }).code(404);
            }

            return h.response({ success: true, message: 'Data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    }
}


module.exports = adminController;