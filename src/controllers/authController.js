const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const supabase = require('../config/supabase'); 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function validateGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      isValid: true,
      credentials: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    };
  } catch (error) {
    console.error('Error validating Google token:', error.message);
    return {
      isValid: false,
      credentials: null,
    };
  }
}

async function upsertUser(credentials) {
  const { data, error } = await supabase
    .from('Users')
    .upsert(
      { 
        google_id: credentials.id, 
        email: credentials.email, 
        role: 'user',
        updated_at: new Date().toISOString()
      },
      { onConflict: ['email'] }
    );

  if (error) {
    console.error('Error inserting/updating user in Supabase:', error.message);
    throw new Error('Error inserting/updating user in Supabase');
  }
  return data;
}

const authController = {
  SignIn: async(request, h) => {
    const code = request.query.code;

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        grant_type: 'authorization_code'
      });

      if (!response.data || !response.data.id_token) {
        throw new Error('Failed to get id_token from Google response');
      }

      const idToken = response.data.id_token;
      const { isValid, credentials } = await validateGoogleToken(idToken);

      if (isValid) {
        await upsertUser(credentials);

        return h.response({
          message: 'Login successful',
          user: credentials
        }).code(200);
      } else {
        return h.response({
          message: 'Invalid token'
        }).code(401);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error.message);
      return h.response({
        message: 'Error exchanging code for token'
      }).code(500);
    }
  },

  CallbackSignIn: async(request, h) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=http://localhost:3000/auth/google/callback&` +
      `response_type=code&` +
      `scope=email profile`;
    return h.redirect(redirectUrl);
  },
};

module.exports = authController;
