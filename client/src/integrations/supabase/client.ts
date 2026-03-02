import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wmdhifivavcvranxknnm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZGhpZml2YXZjdnJhbnhrbm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MDU3NDMsImV4cCI6MjA4Nzk4MTc0M30.lB0iVspUoynzd--4aOctGJ-X1sghHcntmW2C_LqQJ-c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);