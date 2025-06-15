
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://itlqxqigopkagqfyxbtz.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bHF4cWlnb3BrYWdxZnl4YnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NjIwMTAsImV4cCI6MjA2MzQzODAxMH0.kGToN_8gwQrKG2nJhinB2zxfaT-nFOzuyQDK1I43GZQ';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  