const Joi = require('joi');
const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');
const husbandController = require('../controllers/husbandController');
const educationController = require('../controllers/educationController');
const healthCenterController = require('../controllers/healthCenterController');
const alertController = require('../controllers/alertController');
const motherController = require('../controllers/motherController');
const adminController = require('../controllers/adminController');
const verifyToken = require('../Middleware/middleware');


const apiRoutes = [
    // Information API
    {
        method: 'GET', 
        path: '/',
        handler: async (request, h) => {
            try {
                const welcomeMessage = 'Welcome to our Anecma API!';
                return h.response({ success: true, message: welcomeMessage}).code(200);
            } catch {
                return h.response({ error: 'Failed to retrive homepage.'}.code(500));
            }
        },
    },
    {
        method: 'GET', 
        path: '/api/v1',
        handler: async (request, h) => {
            try {
                const apiInfo = {
                    name: 'Anecma API',
                    version: '1.0.0',
                    description:
                        "A RESTful API for managing anemia risk calculator data, meal journals, iron supplement reminders, and iron supplement consumption provides endpoints for creating, updating, deleting, and managing data of pregnant women, husbands, and healthcare workers."
                };
                return h.response(apiInfo).code(200);
            } catch {
                return h.response({ error: 'Failed to retrieve API information.' }).code(500);
            }
        },
    },
    {
      method: 'POST',
      path: '/api/auth/callback/google',
      options: {
          payload: {
            multipart: true,
          },
          validate: {
            payload: Joi.object({
              provider: Joi.string().allow('').label('provider'),
              user: Joi.object({
                email: Joi.string().email().required()
              }).required(),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: authController.login,
    },

    // Page Dasboard Istri
    {
      method: 'GET',
      path: '/istri/dashboard',
      options: {
        pre: [verifyToken], // Middleware untuk verifikasi token
      },
      handler: motherController.DasboardMother,
    },

    // Page Education Istri
    {
      method: 'GET',
      path: '/istri/edukasi',
      options: {
        pre: [verifyToken],
      },
      handler: motherController.EducationPregnantMother,
    },

    // Page Consultation Istri
    {
      method: 'GET',
      path: '/istri/konsultasi',
      options: {
        pre: [verifyToken],
      },
      handler: motherController.ConsultationPregnantMother,
    },

    // Page Update profile Istri
    {
      method: 'PUT',
      path: '/istri/profile',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            nama: Joi.string().allow('').label('nama'),
            usia: Joi.number().integer().label('usia'),            
            no_hp: Joi.string().allow('').label('no_hp'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.ProfileMother,
    },

    // Page Update Data diri Istri
    {
      method: 'PUT',
      path: '/istri/profile/data-diri',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            hari_pertama_haid: Joi.date().iso().label('hari_pertama_haid'),
            tempat_tinggal_ktp: Joi.string().allow('').label('tempat_tinggal_ktp'),
            tempat_tinggal_kelurahan: Joi.string().allow('').label('tempat_tinggal_kelurahan'),
            pendidikan_terakhir: Joi.string().allow('').label('pendidikan_terakhir'),
            pekerjaan: Joi.string().allow('').label('pekerjaan'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.PregnancyPersonalData,
    },

    // Page Update Data Suami pada Istri
    {
      method: 'PUT',
      path: '/istri/profile/data-suami',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            nama_suami: Joi.string().allow('').label('nama_suami'),
            no_hp_suami: Joi.string().allow('').label('no_hp_suami'),
            email_suami: Joi.string().allow('').label('email_suami'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.HusbandData,
    },

    // Page Update Data Suami pada Istri
    {
      method: 'POST',
      path: '/istri/dashboard/kalkulator-anemia',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            usia_kehamilan: Joi.number().integer().label('usia_kehamilan'),
            jumlah_anak: Joi.number().integer().label('jumlah_anak'),            
            konsumsi_ttd_7hari: Joi.number().integer().label('konsumsi_ttd_7hari'),
            hasil_hb: Joi.number().precision(2).required().label('hasil_hb'),
            riwayat_anemia: Joi.number().integer().label('riwayat_anemia'),
            resiko: Joi.string().allow('').label('resiko'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.CalculatorAnemia,
    },

    // Page Jurnal Makan
    {
      method: 'POST',
      path: '/istri/dashboard/jurnal-makan',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            sarapan_karbohidrat: Joi.number().integer().label('sarapan_karbohidrat'),
            sarapan_lauk_hewani: Joi.number().integer().label('sarapan_lauk_hewani'),
            sarapan_lauk_nabati: Joi.number().integer().label('sarapan_lauk_nabati'),
            sarapan_sayur: Joi.number().integer().label('sarapan_sayur'),
            sarapan_buah: Joi.number().integer().label('sarapan_buah'),
            makan_siang_karbohidrat: Joi.number().integer().label('makan_siang_karbohidrat'),
            makan_siang_lauk_hewani: Joi.number().integer().label('makan_siang_lauk_hewani'),
            makan_siang_lauk_nabati: Joi.number().integer().label('makan_siang_lauk_nabati'),
            makan_siang_sayur: Joi.number().integer().label('makan_siang_sayur'),
            makan_siang_buah: Joi.number().integer().label('makan_siang_buah'),
            makan_malam_karbohidrat: Joi.number().integer().label('makan_malam_karbohidrat'),
            makan_malam_lauk_hewani: Joi.number().integer().label('makan_malam_lauk_hewani'),
            makan_malam_lauk_nabati: Joi.number().integer().label('makan_malam_lauk_nabati'),
            makan_malam_sayur: Joi.number().integer().label('makan_malam_sayur'),
            makan_malam_buah: Joi.number().integer().label('makan_malam_buah'),
            total_kalori: Joi.number().precision(2).required().label('total_kalori'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.EatingJurnal,
    },

    // Page Jurnal Makan
    {
      method: 'POST',
      path: '/istri/dashboard/konsumsi-ttd',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            minum_vit_c: Joi.number().integer().label('minum_vit_c'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.ConsumptionTTD,
    },

    {
      method: 'POST',
      path: '/istri/dashboard/riwayat',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            nilai_hb: Joi.string().allow('').label('nilai_hb'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      
      handler: motherController.HistoryHB,
    },

    {
      method: 'POST',
      path: '/istri/dashboard/reminder-ttd',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            waktu_reminder_1: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).label('waktu_reminder_1'),
            is_active_reminder_1: Joi.number().integer().label('is_active_reminder_1'),
            waktu_reminder_2: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).label('waktu_reminder_2'),
            is_active_reminder_2: Joi.number().integer().label('is_active_reminder_2'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      handler: motherController.ReminderTTD,
    },

    {
      method: 'POST',
      path: '/istri/dashboard/reminder-ttd/alert',
      options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            chatId: Joi.string().allow('').label('chatId'), // Nomor telepon penerima
            mediaUrl: Joi.string().allow('').label('mediaUrl'),    
            mediaCaption: Joi.string().allow('').label('mediaCaption'),  
            mediaBase64: Joi.string().allow(null, '').label('mediaBase64'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
      },
      handler: alertController.alertTTD,
    },






    // Page Dasboard Suami
    // {
    //   method: 'GET',
    //   path: '/suami/dashboard',
    //   options: {
    //     pre: [verifyToken], // Middleware untuk verifikasi token
    //   },
    //   handler: husbandController.DasboardHusband,
    // },

    // Page Dasboard admin
    {
      method: 'GET',
      path: '/admin/dashboard',
      options: {
        pre: [verifyToken], // Middleware untuk verifikasi token
      },
      handler: adminController.DasboardAdmin,
    },

    // Page Dasboard Admin Table
    {
      method: 'GET',
      path: '/admin/dashboard/data',
      options: {
        pre: [verifyToken],
      },
      handler: adminController.TableDashboardAdmin,
    },

    // Page Data Puskesmas
    {
      method: 'GET',
      path: '/admin/data-puskesmas',
      options: {
        pre: [verifyToken],
      },
      handler: adminController.GetDataPuskesmas,
    },

    {
      method: 'GET',
      path: '/admin/data-puskesmas/{id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: adminController.DetailDataPuskesmas,
    },
    {
      method: 'POST',
      path: '/admin/data-puskesmas',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
              alamat: Joi.string().allow('').label('alamat'),
              kecamatan: Joi.string().allow('').label('kecamatan'),
              no_hp: Joi.string().allow('').label('no_hp'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: adminController.CreateDataPuskesmas,
  },
  {
    method: 'PUT',
    path: '/admin/data-puskesmas/{id}',
    options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
            alamat: Joi.string().allow('').label('alamat'),
            kecamatan: Joi.string().allow('').label('kecamatan'),
            no_hp: Joi.string().allow('').label('no_hp'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
    },
    handler: adminController.UpdateDataPuskesmas,
  },
  {
    method: 'DELETE',
    path: '/admin/data-puskesmas/{id}',
    options: {
        pre: [verifyToken],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
    },
    handler: adminController.DeleteDataPuskesmas,
  },

  // Page Data Petugas
  {
    method: 'GET',
    path: '/admin/data-petugas',
    options: {
      pre: [verifyToken],
    },
    handler: adminController.GetDataPetugas,
  },
  {
      method: 'GET',
      path: '/admin/data-petugas/{petugas_id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              petugas_id: Joi.number().required(),
            }),
          },
      },
      handler: adminController.DetailDataPetugas,
  },
  {
      method: 'POST',
      path: '/admin/data-petugas',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
                user_id: Joi.number().integer().label('user_id'),
                puskesmas_id: Joi.number().integer().label('puskesmas_id'),
                nama: Joi.string().allow('').label('nama'),
                no_hp: Joi.string().allow('').label('no_hp'),
                jabatan: Joi.string().allow('').label('jabatan'),
                image: Joi.string().allow('').label('image'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: adminController.CreateDataPetugas,
  },
  {
    method: 'PUT',
    path: '/admin/data-petugas/{petugas_id}',
    options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            user_id: Joi.number().integer().label('user_id'),
            puskesmas_id: Joi.number().integer().label('puskesmas_id'),
            nama: Joi.string().allow('').label('nama'),
            no_hp: Joi.string().allow('').label('no_hp'),
            jabatan: Joi.string().allow('').label('jabatan'),
            image: Joi.string().allow('').label('image'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
    },
    handler: adminController.UpdateDataPetugas,
  },
  {
    method: 'DELETE',
    path: '/admin/data-petugas/{petugas_id}',
    options: {
        pre: [verifyToken],
        validate: {
          params: Joi.object({
            petugas_id: Joi.number().required(),
          }),
        },
    },
    handler: adminController.DeleteDataPetugas,
  },






  

    // Data Pregnant Mother
    {
        method: 'GET',
        path: '/mother',
        options: {
          pre: [verifyToken],
        },
        handler: dataController.getAllPregnantMother,
    },
    {
        method: 'GET',
        path: '/mother/{id}',
        options: {
            pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.number().required(),
              }),
            },
        },
        handler: dataController.getPregnantMother,
    },
    {
        method: 'POST',
        path: '/mother',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                user_id: Joi.number().integer().label('user_id'),
                nama: Joi.string().allow('').label('nama'),
                usia: Joi.number().integer().label('usia'),
                no_hp: Joi.string().allow('').label('no_hp'),
                hari_pertama_haid: Joi.date().iso().label('hari_pertama_haid'),
                tempat_tinggal_ktp: Joi.string().allow('').label('tempat_tinggal_ktp'),
                tempat_tinggal_kelurahan: Joi.string().allow('').label('tempat_tinggal_kelurahan'),
                pendidikan_terakhir: Joi.string().allow('').label('pendidikan_terakhir'),
                pekerjaan: Joi.string().allow('').label('pekerjaan'),
                image: Joi.string().allow('').label('image'),
                nama_suami: Joi.string().allow('').label('nama_suami'),
                no_hp_suami: Joi.string().allow('').label('no_hp_suami'),
                email_suami: Joi.string().allow('').label('email_suami'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: dataController.createPregnantMother,
    },
    {
        method: 'PUT',
        path: '/mother/{id}',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                user_id: Joi.number().integer().label('user_id'),
                nama: Joi.string().allow('').label('nama'),
                usia: Joi.number().integer().label('usia'),
                no_hp: Joi.string().allow('').label('no_hp'),
                hari_pertama_haid: Joi.date().iso().label('hari_pertama_haid'),
                tempat_tinggal_ktp: Joi.string().allow('').label('tempat_tinggal_ktp'),
                tempat_tinggal_kelurahan: Joi.string().allow('').label('tempat_tinggal_kelurahan'),
                pendidikan_terakhir: Joi.string().allow('').label('pendidikan_terakhir'),
                pekerjaan: Joi.string().allow('').label('pekerjaan'),
                image: Joi.string().allow('').label('image'),
                nama_suami: Joi.string().allow('').label('nama_suami'),
                no_hp_suami: Joi.string().allow('').label('no_hp_suami'),
                email_suami: Joi.string().allow('').label('email_suami'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: dataController.updatePregnantMother
    },
    {
        method: 'DELETE',
        path: '/mother/{id}',
        options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
        },
        handler: dataController.deletePregnantMother

    },

    // Data Calculator Anemia
    {
        method: 'GET',
        path: '/risk-anemia',
        options: {
          pre: [verifyToken],
        },
        handler: dataController.getAllRiskAnemia,
    },
    {
        method: 'GET',
        path: '/risk-anemia/{id}',
        options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.string().required(),
            }),
          },
        },
        handler: dataController.getRiskAnemia,
    },
    {
        method: 'POST',
        path: '/risk-anemia',
        options: {
          pre: [verifyToken],
          payload: {
            multipart: true,
          },
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              usia_kehamilan: Joi.number().integer().label('usia_kehamilan'),
              jumlah_anak: Joi.number().integer().label('jumlah_anak'),
              riwayat_anemia: Joi.boolean().label('riwayat_anemia'),
              konsumsi_ttd_7hari: Joi.number().integer().label('konsumsi_ttd_7hari'),
              hasil_hb: Joi.number().precision(2).required().label('hasil_hb'),
              resiko: Joi.string().allow('').label('resiko'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
        },
        handler: dataController.createRiskAnemia,
    },
    {
      method: 'PUT',
      path: '/risk-anemia/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              usia_kehamilan: Joi.number().integer().label('usia_kehamilan'),
              jumlah_anak: Joi.number().integer().label('jumlah_anak'),
              riwayat_anemia: Joi.string().allow('').label('riwayat_anemia'),
              konsumsi_ttd_7hari: Joi.number().integer().label('konsumsi_ttd_7hari'),
              hasil_hb: Joi.string().allow('').label('hasil_hb'),
              resiko: Joi.string().allow('').label('resiko'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: dataController.updateRiskAnemia,
    },
    {
      method: 'DELETE',
      path: '/risk-anemia/{id}',
      options: {
        pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: dataController.deleteRiskAnemia,
    },

    // Data Eating Journal
    {
        method: 'GET',
        path: '/eating-journal',
        options: {
          pre: [verifyToken],
        },
        handler: dataController.getAllEatingJournal,
    },
    {
        method: 'GET',
        path: '/eating-journal/{id}',
        options: {
          pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.number().required(),
              }),
            },
        },
        handler: dataController.getEatingJournal,
    },
    {
        method: 'POST',
        path: '/eating-journal',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
                tanggal: Joi.date().iso().label('tanggal'),
                sarapan_karbohidrat: Joi.number().integer().label('sarapan_karbohidrat'),
                sarapan_lauk_hewani: Joi.number().integer().label('sarapan_lauk_hewani'),
                sarapan_lauk_nabati: Joi.number().integer().label('sarapan_lauk_nabati'),
                sarapan_sayur: Joi.number().integer().label('sarapan_sayur'),
                sarapan_buah: Joi.number().integer().label('sarapan_buah'),
                makan_siang_karbohidrat: Joi.number().integer().label('makan_siang_karbohidrat'),
                makan_siang_lauk_hewani: Joi.number().integer().label('makan_siang_lauk_hewani'),
                makan_siang_lauk_nabati: Joi.number().integer().label('makan_siang_lauk_nabati'),
                makan_siang_sayur: Joi.number().integer().label('makan_siang_sayur'),
                makan_siang_buah: Joi.number().integer().label('makan_siang_buah'),
                makan_malam_karbohidrat: Joi.number().integer().label('makan_malam_karbohidrat'),
                makan_malam_lauk_hewani: Joi.number().integer().label('makan_malam_lauk_hewani'),
                makan_malam_lauk_nabati: Joi.number().integer().label('makan_malam_lauk_nabati'),
                makan_malam_sayur: Joi.number().integer().label('makan_malam_sayur'),
                makan_malam_buah: Joi.number().integer().label('makan_malam_buah'),
                total_kalori: Joi.number().precision(2).required().label('total_kalori'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: dataController.createEatingJournal,
    },
    {
      method: 'PUT',
      path: '/eating-journal/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              tanggal: Joi.date().iso().label('tanggal'),
              sarapan_karbohidrat: Joi.number().integer().label('sarapan_karbohidrat'),
              sarapan_hewani: Joi.number().integer().label('sarapan_hewani'),
              sarapan_nabati: Joi.number().integer().label('sarapan_nabati'),
              sarapan_sayur: Joi.number().integer().label('sarapan_sayur'),
              sarapan_buah: Joi.number().integer().label('sarapan_buah'),
              makan_siang_karbohidrat: Joi.number().integer().label('makan_siang_karbohidrat'),
              makan_siang_lauk_hewani: Joi.number().integer().label('makan_siang_lauk_hewani'),
              makan_siang_lauk_nabati: Joi.number().integer().label('makan_siang_lauk_nabati'),
              makan_siang_sayur: Joi.number().integer().label('makan_siang_sayur'),
              makan_siang_buah: Joi.number().integer().label('makan_siang_buah'),
              makan_malam_karbohidrat: Joi.number().integer().label('makan_malam_karbohidrat'),
              makan_malam_lauk_hewani: Joi.number().integer().label('makan_malam_lauk_hewani'),
              makan_malam_lauk_nabati: Joi.number().integer().label('makan_malam_lauk_nabati'),
              makan_malam_sayur: Joi.number().integer().label('makan_malam_sayur'),
              makan_malam_buah: Joi.number().integer().label('makan_malam_buah'),
              total_kalori: Joi.number().precision(2).required().label('total_kalori'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: dataController.updateEatingJournal,
    },
    {
      method: 'DELETE',
      path: '/eating-journal/{id}',
      options: {
        pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: dataController.deleteEatingJournal,
    },

    // Check HB
    {
      method: 'GET',
      path: '/check-hb',
      options: {
        pre: [verifyToken],
      },
      handler: dataController.getAllCheckHB,
  },
  {
      method: 'GET',
      path: '/check-hb/{id}',
      options: {
        pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: dataController.getCheckHB,
  },
  {
      method: 'POST',
      path: '/check-hb',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              tanggal: Joi.date().iso().label('tanggal'),
              nilai_hb: Joi.number().precision(2).label('nilai_hb'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: dataController.createCheckHB,
  },
  {
    method: 'PUT',
    path: '/check-hb/{id}',
    options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              tanggal: Joi.date().iso().label('tanggal'),
              nilai_hb: Joi.number().precision(2).label('nilai_hb'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
    },
    handler: dataController.updateCheckHB,
  },
  {
    method: 'DELETE',
    path: '/check-hb/{id}',
    options: {
      pre: [verifyToken],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
    },
    handler: dataController.deleteCheckHB,
  },

    // Data Reminder TTD
    {
        method: 'GET',
        path: '/reminder-ttd',
        options: {
          pre: [verifyToken],
        },
        handler: dataController.getAllReminderTtd,
    },
    {
        method: 'GET',
        path: '/reminder-ttd/{id}',
        options: {
            pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.number().required(),
              }),
            },
        },
        handler: dataController.getReminderTtd,
    },
    {
        method: 'POST',
        path: '/reminder-ttd',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
                waktu_reminder_1: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_1'),
                is_active_reminder_1: Joi.number().integer().label('is_active_reminder_1'),
                waktu_reminder_2: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_2'),
                is_active_reminder_2: Joi.number().integer().label('is_active_reminder_2'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: dataController.createReminderTtd,
    },
    {
      method: 'PUT',
      path: '/reminder-ttd/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              waktu_reminder_1: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_1'),
              is_active_reminder_1: Joi.number().integer().label('is_active_reminder_1'),
              waktu_reminder_2: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_2'),
              is_active_reminder_2: Joi.number().integer().label('is_active_reminder_2'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: dataController.updateReminderTtd,
    },
    {
      method: 'DELETE',
      path: '/reminder-ttd/{id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: dataController.deleteReminderTtd,
    },

    // Consumption TTD
    {
        method: 'GET',
        path: '/consumption-ttd',
        options: {
          pre: [verifyToken],
        },
        handler: dataController.getAllConsumptionTtd,
    },
    {
        method: 'GET',
        path: '/consumption-ttd/{id}',
        options: {
            pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.number().required(),
              }),
            },
        },
        handler: dataController.getConsumptionTtd,
    },
    {
        method: 'POST',
        path: '/consumption-ttd',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
                tanggal_waktu: Joi.string()
                .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                  .required().label('tanggal_waktu'),
                minum_vit_c: Joi.number().integer().label('minum_vit_c'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: dataController.createConsumptionTtd,
    },
    {
      method: 'PUT',
      path: '/consumption-ttd/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              tanggal_waktu: Joi.string()
                .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                .required().label('tanggal_waktu'),
              minum_vit_c: Joi.number().integer().label('minum_vit_c'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: dataController.updateConsumptionTtd,
    },
    {
      method: 'DELETE',
      path: '/consumption-ttd/{id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: dataController.deleteConsumptionTtd,
    },

    // Data Education
    {
      method: 'GET',
      path: '/education',
      options: {
        pre: [verifyToken],
      },
      handler: educationController.getAllEducation,
  },
  {
      method: 'GET',
      path: '/education/{id}',
      options: {
        pre: [verifyToken],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
      },
      handler: educationController.getEducation,
  },
  {
      method: 'POST',
      path: '/education',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              judul: Joi.string().allow('').label('judul'),
              konten: Joi.string().allow('').label('konten'),
              jenis: Joi.string().allow('').label('jenis'),
              kategori: Joi.string().allow('').label('kategori'),
              created_by: Joi.number().integer().label('created_by'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: educationController.createEducation,
  },
  {
    method: 'PUT',
    path: '/education/{id}',
    options: {
        payload: {
          multipart: true,
        },
        pre: [verifyToken],
        validate: {
          payload: Joi.object({
            judul: Joi.string().allow('').label('judul'),
            konten: Joi.string().allow('').label('konten'),
            jenis: Joi.string().allow('').label('jenis'),
            kategori: Joi.string().allow('').label('kategori'),
            created_by: Joi.number().integer().label('created_by'),
          }),
          failAction: async (request, h, err) => {
            throw err;
          },
        },
    },
    handler: educationController.updateEducation,
  },
  {
    method: 'DELETE',
    path: '/education/{id}',
    options: {
      pre: [verifyToken],
        validate: {
          params: Joi.object({
            id: Joi.number().required(),
          }),
        },
    },
    handler: educationController.deleteEducation,
  },

    // Data Husband
    {
        method: 'GET',
        path: '/husband',
        options : {
          pre: [verifyToken],
        },
        handler: husbandController.getAllHusband,
    },
    {
        method: 'GET',
        path: '/husband/{id}',
        options: {
          pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.string().required(),
              }),
            },
        },
        handler: husbandController.getHusband,
    },
    {
        method: 'POST',
        path: '/husband',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                //id: Joi.number().integer().label('id'),
                user_id: Joi.number().integer().label('user_id'),
                email: Joi.string().allow('').label('email'),
                nama: Joi.string().allow('').label('nama'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: husbandController.createHusband,
    },
    {
      method: 'PUT',
      path: '/husband/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              user_id: Joi.number().integer().label('user_id'),
              email: Joi.string().allow('').label('email'),
              nama: Joi.string().allow('').label('nama'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: husbandController.updateHusband,
    },
    {
      method: 'DELETE',
      path: '/husband/{id}',
      options: {
        pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.string().required(),
            }),
          },
      },
      handler: husbandController.deleteHusband,
    },

    // Data Puskesmas Officer
    {
        method: 'GET',
        path: '/puskesmas-officer',
        options: {
          pre: [verifyToken],
        },
        handler: healthCenterController.getAllOfficer,
    },
    {
        method: 'GET',
        path: '/puskesmas-officer/{petugas_id}',
        options: {
            pre: [verifyToken],
            validate: {
              params: Joi.object({
                petugas_id: Joi.number().required(),
              }),
            },
        },
        handler: healthCenterController.getOfficer,
    },
    {
        method: 'POST',
        path: '/puskesmas-officer',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                  user_id: Joi.number().integer().label('user_id'),
                  puskesmas_id: Joi.number().integer().label('puskesmas_id'),
                  nama: Joi.string().allow('').label('nama'),
                  no_hp: Joi.string().allow('').label('no_hp'),
                  jabatan: Joi.string().allow('').label('jabatan'),
                  image: Joi.string().allow('').label('image'),
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: healthCenterController.createOfficer,
    },
    {
      method: 'PUT',
      path: '/puskesmas-officer/{petugas_id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              user_id: Joi.number().integer().label('user_id'),
              puskesmas_id: Joi.number().integer().label('puskesmas_id'),
              nama: Joi.string().allow('').label('nama'),
              no_hp: Joi.string().allow('').label('no_hp'),
              jabatan: Joi.string().allow('').label('jabatan'),
              image: Joi.string().allow('').label('image'),
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: healthCenterController.updateOfficer,
    },
    {
      method: 'DELETE',
      path: '/puskesmas-officer/{petugas_id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              petugas_id: Joi.number().required(),
            }),
          },
      },
      handler: healthCenterController.deleteOfficer,
    },

    // Data Puskesmas 
    {
        method: 'GET',
        path: '/puskesmas',
        options: {
          pre: [verifyToken],
        },
        handler: healthCenterController.getAllPuskesmas,
    },
    {
        method: 'GET',
        path: '/puskesmas/{id}',
        options: {
            pre: [verifyToken],
            validate: {
              params: Joi.object({
                id: Joi.number().required(),
              }),
            },
        },
        handler: healthCenterController.getPuskesmas,
    },
    {
        method: 'POST',
        path: '/puskesmas',
        options: {
            payload: {
              multipart: true,
            },
            pre: [verifyToken],
            validate: {
              payload: Joi.object({
                nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
                alamat: Joi.string().allow('').label('alamat'),
                kecamatan: Joi.string().allow('').label('kecamatan'),
                no_hp: Joi.string().allow('').label('no_hp')
              }),
              failAction: async (request, h, err) => {
                throw err;
              },
            },
        },
        handler: healthCenterController.createPuskesmas,
    },
    {
      method: 'PUT',
      path: '/puskesmas/{id}',
      options: {
          payload: {
            multipart: true,
          },
          pre: [verifyToken],
          validate: {
            payload: Joi.object({
              nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
              alamat: Joi.string().allow('').label('alamat'),
              kecamatan: Joi.string().allow('').label('kecamatan'),
              no_hp: Joi.string().allow('').label('no_hp')
            }),
            failAction: async (request, h, err) => {
              throw err;
            },
          },
      },
      handler: healthCenterController.updatePuskesmas,
    },
    {
      method: 'DELETE',
      path: '/puskesmas/{id}',
      options: {
          pre: [verifyToken],
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: healthCenterController.deletePuskesmas,
    },
];
alertController.alertTTD();

module.exports = apiRoutes;