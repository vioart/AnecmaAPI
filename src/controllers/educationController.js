const supabase = require('../config/supabase'); 

const educationController = {
    // Education
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
            const response = h.response({
                status: 'fail',
                message: 'Failed to add education data. Please provide the education data id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                judul,
                konten,
                jenis,
                kategori,
                created_by,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
            .from('Edukasi')
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
    
    getEducation: async (request, h) => {
        try {
            const { id } = request.params;
    
            const { data, error } = await supabase
                .from('Edukasi')
                .select('*')
                .eq('edukasi_id', id)
                .single();
            
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Education not found' }).code(404);
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

    getAllEducation: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('Edukasi')
                .select('*');
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
    
            return h.response({ status: 'success', data: data }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
        }
    },

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
                updated_at: new Date().toISOString()
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
            .from('Edukasi')
            .update(updatedItem)
            .eq('edukasi_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Education not found' }).code(404);
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

    deleteEducation: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('Edukasi')
            .delete()
            .eq('edukasi_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Education not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Education deleted successfully' }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
}

module.exports = educationController;