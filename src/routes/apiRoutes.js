const Joi = require('joi');
const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');
const husbandController = require('../controllers/husbandController');
const educationController = require('../controllers/educationController');
const healthCenterController = require('../controllers/healthCenterController');


const apiRoutes = [
    // Information API
    {
        method: 'GET', 
        path: '/',
        handler: async (request, h) => {
            try {
                const welcomeMessage = 'Welcome to our Anemia API!';
                return h.response({ status: 'success', message: welcomeMessage}).code(200);
            } catch (error) {
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
                    name: 'Anemia API',
                    version: '1.0.0',
                    description:
                        "A RESTful API for managing anemia risk calculator data, meal journals, iron supplement reminders, and iron supplement consumption provides endpoints for creating, updating, deleting, and managing data of pregnant women, husbands, and healthcare workers."
                };
                return h.response(apiInfo).code(200);
            } catch (error) {
                return h.response({ error: 'Failed to retrieve API information.' }).code(500);
            }
        },
    },
    {
      method: 'GET',
      path: '/auth/google/callback',
      handler: authController.SignIn,
    },
    {
      method: 'GET',
      path: '/auth/google',
      handler:authController.CallbackSignIn,
    },

    // Data Pregnant Mother
    {
        method: 'GET',
        path: '/mother',
        handler: dataController.getAllPregnantMother,
    },
    {
        method: 'GET',
        path: '/mother/{id}',
        options: {
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
            validate: {
              payload: Joi.object({
                user_id: Joi.number().integer().label('user_id'),
                nama: Joi.string().allow('').label('nama'),
                usia: Joi.number().integer().label('usia'),
                hari_pertama_haid: Joi.date().iso().label('hari_pertama_haid'),
                tempat_tinggal_ktp: Joi.string().allow('').label('tempat_tinggal_ktp'),
                tempat_tinggal_kelurahan: Joi.string().allow('').label('tempat_tinggal_kelurahan'),
                pendidikan_terakhir: Joi.string().allow('').label('pendidikan_terakhir'),
                pekerjaan: Joi.string().allow('').label('pekerjaan'),
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
            validate: {
              payload: Joi.object({
                user_id: Joi.number().integer().label('user_id'),
                nama: Joi.string().allow('').label('nama'),
                usia: Joi.number().integer().label('usia'),
                hari_pertama_haid: Joi.date().iso().label('hari_pertama_haid'),
                tempat_tinggal_ktp: Joi.string().allow('').label('tempat_tinggal_ktp'),
                tempat_tinggal_kelurahan: Joi.string().allow('').label('tempat_tinggal_kelurahan'),
                pendidikan_terakhir: Joi.string().allow('').label('pendidikan_terakhir'),
                pekerjaan: Joi.string().allow('').label('pekerjaan'),
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
        handler: dataController.getAllRiskAnemia,
    },
    {
        method: 'GET',
        path: '/risk-anemia/{id}',
        options: {
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
        handler: dataController.getAllEatingJournal,
    },
    {
        method: 'GET',
        path: '/eating-journal/{id}',
        options: {
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
      handler: dataController.getAllCheckHB,
  },
  {
      method: 'GET',
      path: '/check-hb/{id}',
      options: {
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
        handler: dataController.getAllReminderTtd,
    },
    {
        method: 'GET',
        path: '/reminder-ttd/{id}',
        options: {
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
            validate: {
              payload: Joi.object({
                ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
                waktu_reminder_1: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_1'),
                waktu_reminder_2: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_2'),
                is_active: Joi.boolean().label('is_active'),
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
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              waktu_reminder_1: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_1'),
              waktu_reminder_2: Joi.string().regex(/^\d{2}:\d{2}:\d{2}$/).required().label('waktu_reminder_2'),
              is_active: Joi.boolean().label('is_active'),
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
        handler: dataController.getAllConsumptionTtd,
    },
    {
        method: 'GET',
        path: '/consumption-ttd/{id}',
        options: {
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
            validate: {
              payload: Joi.object({
                ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
                tanggal_waktu: Joi.string()
                .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                  .required().label('tanggal_waktu'),
                minum_vit_c: Joi.boolean().label('minum_vit_c'),
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
          validate: {
            payload: Joi.object({
              ibu_hamil_id: Joi.number().integer().label('ibu_hamil_id'),
              tanggal_waktu: Joi.string()
                .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                .required().label('tanggal_waktu'),
              minum_vit_c: Joi.boolean().label('minum_vit_c'),
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
      handler: educationController.getAllEducation,
  },
  {
      method: 'GET',
      path: '/education/{id}',
      options: {
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
        handler: husbandController.getAllHusband,
    },
    {
        method: 'GET',
        path: '/husband/{id}',
        options: {
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
        handler: healthCenterController.getAllOfficer,
    },
    {
        method: 'GET',
        path: '/puskesmas-officer/{petugas_id}',
        options: {
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
            validate: {
              payload: Joi.object({
                  user_id: Joi.number().integer().label('user_id'),
                  puskesmas_id: Joi.number().integer().label('puskesmas_id'),
                  nama: Joi.string().allow('').label('nama'),
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
      path: '/puskesmas-officer/{id}',
      options: {
          payload: {
            multipart: true,
          },
          validate: {
            payload: Joi.object({
              user_id: Joi.number().integer().label('user_id'),
              puskesmas_id: Joi.number().integer().label('puskesmas_id'),
              nama: Joi.string().allow('').label('nama'),
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
      path: '/puskesmas-officer/{id}',
      options: {
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: healthCenterController.deleteOfficer,
    },

    // Data Puskesmas 
    {
        method: 'GET',
        path: '/puskesmas',
        handler: healthCenterController.getAllPuskesmas,
    },
    {
        method: 'GET',
        path: '/puskesmas/{id}',
        options: {
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
            validate: {
              payload: Joi.object({
                nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
                alamat: Joi.string().allow('').label('alamat')
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
          validate: {
            payload: Joi.object({
              nama_puskesmas: Joi.string().allow('').label('nama_puskesmas'),
              alamat: Joi.string().allow('').label('alamat')
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
          validate: {
            params: Joi.object({
              id: Joi.number().required(),
            }),
          },
      },
      handler: healthCenterController.deletePuskesmas,
    },
];

module.exports = apiRoutes;