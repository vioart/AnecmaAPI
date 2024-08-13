const supabase = require('../config/supabase'); 

const healthCenterController = {
    // Petugas Puskesmas
    createOfficer: async (request, h) => {
        try {
            const {
                user_id,
                puskesmas_id,
                nama,
            } = request.payload;
    
            if (!puskesmas_id) {
            const response = h.response({
                status: 'fail',
                message: 'Failed to add puskesmas officer data. Please provide the puskesmas officer data id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                user_id,
                puskesmas_id,
                nama,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
            .from('PetugasPuskesmas')
            .insert([newItem])
            .select('*');

            if (error) {
                console.error('Error adding document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };

            return h.response(responsePayload).code(201);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getOfficer: async (request, h) => {
        try {
            const { petugas_id } = request.params;
    
            const { data, error } = await supabase
                .from('PetugasPuskesmas')
                .select('*')
                .eq('petugas_id', petugas_id)
                .single();
            
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }
    
            const responsePayload = {
                status: 'success',
                data: data
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    getAllOfficer: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('PetugasPuskesmas')
                .select('*');
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
    
            return h.response({ status: 'success', data: data }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    updateOfficer: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                user_id,
                puskesmas_id,
                nama,
            } = request.payload;

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

            const { data, error } = await supabase
            .from('PetugasPuskesmas')
            .update(updatedItem)
            .eq('petugas_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteOfficer: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('PetugasPuskesmas')
            .delete()
            .eq('petugas_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Officer deleted successfully' }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    // Puskesmas
    createPuskesmas: async (request, h) => {
        try {
            const {
                nama_puskesmas,
                alamat,
            } = request.payload;
    
            if (!nama_puskesmas) {
                const response = h.response({
                    status: 'fail',
                    message: 'Failed to add puskesmas data. Please provide the puskesmas data name.',
                });
                response.code(400);
                return response;
            }
    
            const newItem = {
                nama_puskesmas,
                alamat,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
    
            const { data, error } = await supabase
                .from('Puskesmas')
                .insert([newItem])
                .select('*');
    
            if (error) {
                console.error('Error adding data:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }
    
            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(201);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getPuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('Puskesmas')
                .select('*')
                .eq('puskesmas_id', id)
                .single();

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }
            
            const responsePayload = {
                status: 'success',
                data: data
            };

            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    getAllPuskesmas: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('Puskesmas')
                .select('*');
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }

            return h.response({ status: 'success', data: data }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

    updatePuskesmas: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                nama_puskesmas,
                alamat,
            } = request.payload;

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

            const { data, error } = await supabase
            .from('Puskesmas')
            .update(updatedItem)
            .eq('puskesmas_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deletePuskesmas: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('Puskesmas')
            .delete()
            .eq('puskesmas_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Puskesmas not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Puskesmas deleted successfully' }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

};


module.exports = healthCenterController;