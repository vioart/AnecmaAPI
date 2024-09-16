const db = require('../config/database');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const authController = {
    login: async (request, h) => {
        try {
            const { provider, user: { email } } = request.payload;

            if (provider !== 'google') {
                return h.response({
                    success: false,
                    message: 'Unsupported provider.',
                }).code(400);
            }

            // Check if the user already exists based on email
            const [existingUser] = await db.query(
                `SELECT * FROM Users WHERE email = ?`,
                [email]
            );

            let user;

            if (existingUser.length > 0) {
                user = existingUser[0];
                console.log("User found:", user);
            } else {
                // Insert new user
                const newUser = {
                    email,
                    role: 'user',
                    created_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'),
                };

                const [insertResult] = await db.query(
                    `INSERT INTO Users (email, role, created_at, updated_at) VALUES (?, ?, ?, ?)`,
                    [newUser.email, newUser.role, newUser.created_at, newUser.updated_at]
                );

                if (insertResult.affectedRows === 0) {
                    return h.response({ success: false, message: 'Failed to create user' }).code(500);
                }

                
                user = { ...newUser, user_id: insertResult.insertId };

                // Insert into specific table based on role
                let insertTable;
                if (user.role === 'user') insertTable = 'IbuHamil';
                else if (user.role === 'suami') insertTable = 'Suami';
                else if (user.role === 'petugas') insertTable = 'Petugas';
                else if (user.role === 'super-admin') insertTable = 'Super-admin';

                if (insertTable) {
                    const [insertDataResult] = await db.query(
                        `INSERT INTO ${insertTable} (user_id, nama, created_at, updated_at) VALUES (?, ?, ?, ?)`,
                        [user.user_id, 'user', dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'), dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')]
                    );

                    if (insertDataResult.affectedRows === 0) {
                        return h.response({ success: false, message: `Failed to create ${insertTable}` }).code(500);
                    }
                }
            }

            // Pastikan bahwa user.id ada sebelum insert ke Account
            if (!user.user_id) {
                return h.response({ success: false, message: 'User ID is missing.' }).code(500);
            }

            // Check if the user's role is allowed
            const allowedRoles = ['user', 'super-admin', 'suami', 'petugas'];
            if (!allowedRoles.includes(user.role)) {
                return h.response({
                    success: false,
                    message: 'Unauthorized role.',
                }).code(403);
            }

            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in the environment variables.');
            }

            // Create token with 29 days expiration
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '29d' }
            );

            const expiresAt = dayjs().add(29, 'day').format('YYYY-MM-DD HH:mm:ss');
            const [upsertResult] = await db.query(
                `INSERT INTO Account (user_id, provider, access_token, expires_at, created_at) 
                 VALUES (?, ?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE access_token = VALUES(access_token), expires_at = VALUES(expires_at), created_at = VALUES(created_at)`,
                [user.user_id, 'google', token, expiresAt, dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')]
            );

            if (upsertResult.affectedRows === 0) {
                return h.response({ success: false, message: 'Failed to save token' }).code(500);
            }

            return h.response({
                success: true,
                data: { token },
                message: "User login successful."
            }).code(200);

        } catch (error) {
            console.error('Login error:', error);
            return h.response({ success: false, message: error.message }).code(500);
        }
    },
};


module.exports = authController;