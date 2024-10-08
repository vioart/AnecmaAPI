const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const educationController = {
    // Create Education
    createEducation: async (request, h) => {
        try {
            const {
                judul,
                konten,
                jenis,
                kategori,
                created_by
            } = request.payload;

            if (!judul) {
                return h.response({
                    success: false,
                    message: 'Failed to add education data. Please provide the education data title.',
                }).code(400);
            }

            const newItem = {
                judul,
                konten,
                jenis,
                kategori,
                created_by,
                created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            const [result] = await db.query(
                `INSERT INTO Edukasi (judul, konten, jenis, kategori, created_by, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [judul, konten, jenis, kategori, created_by, newItem.created_at, newItem.updated_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add education data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM Edukasi WHERE edukasi_id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Inserted data successfully.' }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    // Get Single Education
    getEducation: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM Edukasi WHERE edukasi_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Education not found' }).code(404);
            }

            return h.response({ success: true, data: data[0], message: 'Get data by id successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    // Get All Education
    getAllEducation: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM Edukasi`
            );

            return h.response({ success: true, data: data, message: 'Get data successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ success: false, message: 'Error fetching data' }).code(500);
        }
    },

    // Update Education
    updateEducation: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                judul,
                konten,
                jenis,
                kategori,
                created_by,
            } = request.payload;

            const updatedItem = {
                judul,
                konten,
                jenis,
                kategori,
                created_by,
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
            };

            // Remove undefined values
            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE Edukasi SET ? WHERE edukasi_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Education not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM Edukasi WHERE edukasi_id = ?`,
                [id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Updated data successfully.' }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    // Delete Education
    deleteEducation: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM Edukasi WHERE edukasi_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Education not found' }).code(404);
            }

            return h.response({ success: true, message: 'Education deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
};

module.exports = educationController;
