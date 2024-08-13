const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uasnzjxzgufjqgbsruce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc256anh6Z3VmanFnYnNydWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NDkwNTIsImV4cCI6MjAzODUyNTA1Mn0.cHCfQ2LaLn8agr2T7h6k8cezCUE-zhUTr3xPlIcNCZU';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;