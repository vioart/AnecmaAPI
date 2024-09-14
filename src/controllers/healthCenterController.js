const db = require('../config/database'); // Assuming this is your MySQL connection

const healthCenterController = {
    // Create Officer
    createOfficer: async (request, h) => {
        try {
            const { user_id, puskesmas_id, nama } = request.payload;

            if (!puskesmas_id) {
                return h.response({
                    status: 'fail',
                    message: 'Failed to add puskesmas officer data. Please provide the puskesmas officer data id.',
                }).code(400);
            }

            const [result] = await db.query(
                `INSERT INTO PetugasPuskesmas (user_id, puskesmas_id, nama, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?)`,
                [user_id, puskesmas_id, nama, new Date().toISOString(), new Date().toISOString()]
            );

            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Failed to add puskesmas officer data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [result.insertId]
            );

            return h.response({ status: 'success', data: newData[0] }).code(201);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Get Single Officer
    getOfficer: async (request, h) => {
        try {
            const { petugas_id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [petugas_id]
            );

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            return h.response({ status: 'success', data: data[0] }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    // Get All Officers
    getAllOfficer: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM PetugasPuskesmas`
            );

            return h.response({ status: 'success', data }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    // Update Officer
    updateOfficer: async (request, h) => {
        try {
            const { id } = request.params;
            const { user_id, puskesmas_id, nama } = request.payload;

            const updatedItem = {
                user_id,
                puskesmas_id,
                nama,
                updated_at: new Date().toISOString()
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const [updateResult] = await db.query(
                `UPDATE PetugasPuskesmas SET ? WHERE petugas_id = ?`,
                [updatedItem, id]
            );

            if (updateResult.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [id]
            );

            return h.response({ status: 'success', data: updatedData[0] }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Delete Officer
    deleteOfficer: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM PetugasPuskesmas WHERE petugas_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Officer deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Create Puskesmas
    createPuskesmas: async (request, h) => {
        try {
            const { nama_puskesmas, alamat } = request.payload;

            if (!nama_puskesmas) {
                return h.response({
                    status: 'fail',
                    message: 'Failed to add puskesmas data. Please provide the puskesmas data name.',
                }).code(400);
            }

            const newItem = {
                nama_puskesmas,
                alamat,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const [result] = await db.query(
                `INSERT INTO Puskesmas (nama_puskesmas, alamat, created_at, updated_at) 
                 VALUES (?, ?, ?, ?)`,
                [nama_puskesmas, alamat, new Date().toISOString(), new Date().toISOString()]
            );

            if (result.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Failed to add puskesmas data' }).code(400);
            }

            const [newData] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [result.insertId]
            );

            return h.response({ status: 'success', data: newData[0] }).code(201);
        } catch (error) {
            console.error('Error adding data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Get Single Puskesmas
    getPuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const [data] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }

            return h.response({ status: 'success', data: data[0] }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    // Get All Puskesmas
    getAllPuskesmas: async (request, h) => {
        try {
            const [data] = await db.query(
                `SELECT * FROM Puskesmas`
            );

            return h.response({ status: 'success', data }).code(200);
        } catch (error) {
            console.error('Error fetching data:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    // Update Puskesmas
    updatePuskesmas: async (request, h) => {
        try {
            const { id } = request.params;
            const { nama_puskesmas, alamat } = request.payload;

            const updatedItem = {
                nama_puskesmas,
                alamat,
                updated_at: new Date().toISOString()
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
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }

            const [updatedData] = await db.query(
                `SELECT * FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            return h.response({ status: 'success', data: updatedData[0] }).code(200);
        } catch (error) {
            console.error('Error updating data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Delete Puskesmas
    deletePuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const [deleteResult] = await db.query(
                `DELETE FROM Puskesmas WHERE puskesmas_id = ?`,
                [id]
            );

            if (deleteResult.affectedRows === 0) {
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Puskesmas deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting data:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

};


module.exports = healthCenterController;