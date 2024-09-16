const db = require('../config/database');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const husbandController = {
    // Create Husband
    createHusband: async (request, h) => {
        try {
            const { user_id, nama, no_hp, image } = request.payload;

            if (!user_id) {
                return h.response({
                    status: 'fail',
                    message: 'Failed to add husband data. Please provide the husband data id.',
                }).code(400);
            }
            created_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
            updated_at = dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

            const [result] = await db.query(
                `INSERT INTO Suami (user_id, nama, no_hp, image, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, nama, no_hp, image, created_at, updated_at]
            );

            if (result.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to add husband data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM Suami WHERE id = ?`,
                [result.insertId]
            );

            return h.response({ success: true, data: newData[0], message: 'Insert data succesfully.' }).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },

    // Get Single Husband
    getHusband: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM Suami WHERE id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ success: false, message: 'Husband not found' }).code(404);
            }

            return h.response({ success: true, data: data[0], message: 'Get data by id successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ success: false, message: 'Error fetching document' }).code(500);
        }
    },

    // Get All Husbands
    getAllHusband: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM Suami`
            );

            return h.response({ success: true, data: data, message: 'Get data successfully.' }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ success: false, message: 'Error fetching documents' }).code(500);
        }
    },

    // Update Husband
    updateHusband: async (request, h) => {
        try {
            const { id } = request.params;
            const { user_id, email, nama } = request.payload;

            const updatedItem = {
                user_id,
                email,
                nama,
                updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE Suami SET ? WHERE id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Husband not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM Suami WHERE id = ?`,
                [id]
            );

            return h.response({ success: true, data: updatedData[0], message: 'Updated data succesfully.' }).code(200);
        } catch (error) {
            console.error('Error updating document:', error);
            return h.response({ success: false, message: 'Error updating document' }).code(500);
        }
    },

    // Delete Husband
    deleteHusband: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM Suami WHERE id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Husband not found' }).code(404);
            }

            return h.response({ success: true, message: 'Husband deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ success: false, message: 'Error deleting document' }).code(500);
        }
    },
};

module.exports = husbandController;
