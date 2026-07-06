import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qftrkbyaccuukvytqnvw.supabase.co";
const SUPABASE_KEY = "sb_publishable_82Y6NaWFvzTVGutSoaFMFQ_4q7P1XgY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
