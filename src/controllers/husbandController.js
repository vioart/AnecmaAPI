const supabase = require('../config/supabase'); 

const husbandController = {
    // Konsumsi TTD
    createHusband: async (request, h) => {
        try {
            const {
                user_id,
                email,
                nama,
            } = request.payload;
    
            if (!user_id) {
                const response = h.response({
                  status: 'fail',
                  message: 'Failed to add husband data. Please provide the husband data id.',
                });
                response.code(400);
                return response;
              }
          
            const { data, error } = await supabase
              .from('Suami')
              .insert([
                {
                  user_id,
                  email,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  nama,
                },
              ])
              .select('*');
        
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
          
            return h.response({ status: 'success', data: data }).code(201);
          
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getHusband: async (request, h) => {
        try {
            const { id } = request.params;
    
            const { data, error } = await supabase
                .from('Suami')
                .select('*')
                .eq('id', id)
                .single();
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
    
            if (!data.length) {
                return h.response({ status: 'fail', message: 'Husband not found' }).code(404);
            }
    
            const responsePayload = {
                status: 'success',
                data: data
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error fetching document:', error);
            return h.response({ status: 'fail', message: 'Error fetching document' }).code(500);
        }
    },

    getAllHusband: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('Suami')
                .select('*');
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
    
            return h.response({ status: 'success', data: data }).code(200);
        } catch (error) {
            console.error('Error fetching documents:', error);
            return h.response({ status: 'fail', message: 'Error fetching documents' }).code(500);
        }
    },

    updateHusband: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                user_id,
                email,
                nama,
            } = request.payload;

            const updatedItem = {
                user_id,
                email,
                nama,
                updated_at: new Date().toISOString()
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
                .from('Suami')
                .update(updatedItem)
                .eq('id', id)
                .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }

            if (!data.length) {
                return h.response({ status: 'fail', message: 'Husband not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };

            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error updating document:', error);
            return h.response({ status: 'fail', message: 'Error updating document' }).code(500);
        }
    },

    deleteHusband: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('Suami')
                .delete()
                .eq('id', id)
                .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }

            if (!data.length) {
                return h.response({ status: 'fail', message: 'Husband not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Husband deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
        }
    },
};


module.exports = husbandController;