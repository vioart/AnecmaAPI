const supabase = require('../config/supabase'); 

const dataController = {
    createPregnantMother: async (request, h) => {
        try {
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
    
            if (!nama) {
            const response = h.response({
                status: 'fail',
                message: 'Failed to add pregnant mother data. Please provide the pregnant mother name.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
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
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('IbuHamil')
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

    getPregnantMother: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('IbuHamil')
                .select('*')
                .eq('ibu_hamil_id', id)
                .single();

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Mother pregnant not found' }).code(404);
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

    getAllPregnantMother: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('IbuHamil')
                .select('*');
    
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(400);
            }
    
            return h.response({ status: 'success', data: data }).code(200);
        } catch (error) {
            return h.response({ status: 'fail', message: 'Error fetching data' }).code(500);
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
                updated_at: new Date().toISOString()
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
            .from('IbuHamil')
            .update(updatedItem)
            .eq('ibu_hamil_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Mother Pregnant not found' }).code(404);
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

    deletePregnantMother: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('IbuHamil')
            .delete()
            .eq('ibu_hamil_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Mother Pregnant not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Mother Pregnant deleted successfully' }).code(200);
        } catch (error) {
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
            const response = h.response({
                status: 'fail',
                message: 'Failed to add Risk Anemia data. Please provide the risk anemia data id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                ibu_hamil_id,
                usia_kehamilan,
                jumlah_anak,
                riwayat_anemia,
                konsumsi_ttd_7hari,
                hasil_hb,
                resiko,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
            .from('ResikoAnemia')
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
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    getRiskAnemia: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('ResikoAnemia')
                .select('*')
                .eq('resiko_anemia_id', id)
                .single();

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Risk of Anemia not found' }).code(404);
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

    getAllRiskAnemia: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('ResikoAnemia')
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

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
            .from('ResikoAnemia')
            .update(updatedItem)
            .eq('resiko_anemia_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Risk of Anemia data not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };

            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteRiskAnemia: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('ResikoAnemia')
            .delete()
            .eq('resiko_anemia_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Risk of Anemia data not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Risk of Anemia data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
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
            const response = h.response({
                status: 'fail',
                message: 'Failed to add eating journal data. Please provide the eating journal id.',
            });
            response.code(400);
            return response;
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
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('JurnalMakan')
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
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getEatingJournal: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('JurnalMakan')
                .select('*')
                .eq('jurnal_makan_id', id)
                .single();
            
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Eating jurnal data not found' }).code(404);
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

    getAllEatingJournal: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('JurnalMakan')
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

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
            .from('JurnalMakan')
            .update(updatedItem)
            .eq('jurnal_makan_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Eating Journal data not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteEatingJournal: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('JurnalMakan')
            .delete()
            .eq('jurnal_makan_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Eating Journal data not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Eating Journal data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
        }
    },

    // Reminder TTD
    createReminderTtd: async (request, h) => {
        try {
            const {
                ibu_hamil_id,
                waktu_reminder_1,
                waktu_reminder_2,
                is_active,
            } = request.payload;
    
            if (!ibu_hamil_id) {
            const response = h.response({
                status: 'fail',
                message: 'Failed to add reminder ttd data. Please provide the reminder ttd id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                ibu_hamil_id,
                waktu_reminder_1,
                waktu_reminder_2,
                is_active,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('ReminderTTD')
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
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('ReminderTTD')
                .select('*')
                .eq('reminder_id', id)
                .single();

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Reminder TTD data not found' }).code(404);
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

    getAllReminderTtd: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('ReminderTTD')
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

    updateReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;
            const {
                ibu_hamil_id,
                waktu_reminder_1,
                waktu_reminder_2,
                is_active,
            } = request.payload;

            const updatedItem = {
                ibu_hamil_id,
                waktu_reminder_1,
                waktu_reminder_2,
                is_active,
                updated_at: new Date().toISOString()
            };

            Object.keys(updatedItem).forEach(key => {
                if (updatedItem[key] === undefined) {
                    delete updatedItem[key];
                }
            });

            const { data, error } = await supabase
            .from('ReminderTTD')
            .update(updatedItem)
            .eq('reminder_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Reminder TTD not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteReminderTtd: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('ReminderTTD')
            .delete()
            .eq('reminder_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Reminder TTD data not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Reminder TTD data deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
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
                status: 'fail',
                message: 'Failed to add Check HB data. Please provide the Check HB id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                ibu_hamil_id,
                tanggal,
                nilai_hb,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
            .from('CekHB')
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
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getCheckHB: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('CekHB')
                .select('*')
                .eq('cek_hb_id', id)
                .single();
            
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Check HB data not found' }).code(404);
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

    getAllCheckHB: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('CekHB')
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

            const { data, error } = await supabase
            .from('CekHB')
            .update(updatedItem)
            .eq('cek_hb_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Check HB data not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteCheckHB: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('CekHB')
            .delete()
            .eq('cek_hb_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Check HB data not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Check HB deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
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
                status: 'fail',
                message: 'Failed to add consumption ttd data. Please provide the consumption ttd id.',
            });
            response.code(400);
            return response;
            }

            const newItem = {
                ibu_hamil_id,
                tanggal_waktu,
                minum_vit_c,
                created_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
            .from('KonsumsiTTD')
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
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },
    
    getConsumptionTtd: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
                .from('KonsumsiTTD')
                .select('*')
                .eq('konsumsi_ttd_id', id)
                .single();
            
            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Consumption ttd data not found' }).code(404);
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

    getAllConsumptionTtd: async (request, h) => {
        try {
            const { data, error } = await supabase
                .from('KonsumsiTTD')
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

            const { data, error } = await supabase
            .from('KonsumsiTTD')
            .update(updatedItem)
            .eq('konsumsi_ttd_id', id)
            .select('*');

            if (error) {
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Consumption ttd data not found' }).code(404);
            }

            const responsePayload = {
                status: 'success',
                data: data[0]
            };
    
            return h.response(responsePayload).code(200);
        } catch (error) {
            console.error('Error during request handling:', error);
            return h.response({ status: 'fail', message: error.message }).code(500);
        }
    },

    deleteConsumptionTtd: async (request, h) => {
        try {
            const { id } = request.params;

            const { data, error } = await supabase
            .from('KonsumsiTTD')
            .delete()
            .eq('konsumsi_ttd_id', id)
            .select('*');

            if (error) {
                console.error('Error deleting document:', error);
                return h.response({ status: 'fail', message: error.message }).code(500);
            }

            if (data.length === 0) {
                return h.response({ status: 'fail', message: 'Officer not found' }).code(404);
            }

            return h.response({ status: 'success', message: 'Consumption TTD deleted successfully' }).code(200);
        } catch (error) {
            console.error('Error deleting document:', error);
            return h.response({ status: 'fail', message: 'Error deleting document' }).code(500);
        }
    },


};

module.exports = dataController;