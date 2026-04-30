(function () {
    const SUPABASE_URL = "https://vhgagghjwjjsbnzsygmv.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hEhDgjmmmrtgNkYei1tDXQ_YH1lajx1";

    if (!window.supabase || !window.supabase.createClient) {
        window.ExploreUgandaSupabase = null;
        return;
    }

    window.ExploreUgandaSupabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
})();
