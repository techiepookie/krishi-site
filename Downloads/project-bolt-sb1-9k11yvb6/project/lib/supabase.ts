import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpjgkrcctrbdwqlnwqky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamdrcmNjdHJiZHdxbG53cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODk2NzQsImV4cCI6MjA2Njc2NTY3NH0.XntvE0KiOvOVOUJUh2ZGUkQn9jUo5lzQnZlfZbXA3OE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);