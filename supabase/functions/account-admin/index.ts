import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAJOR_ADMIN_EMAIL = "bigbeautifuluganda@gmail.com";

type AccountPayload = {
  id?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: "admin" | "staff" | "tourist";
  account_expires_at?: string | null;
  is_active?: boolean;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Account automation is not configured.");
    }

    const authHeader = request.headers.get("Authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      throw new Error("You must be signed in.");
    }

    const actor = authData.user;
    const { data: actorProfile, error: actorProfileError } = await adminClient
      .from("profiles")
      .select("id, role, is_active, account_expires_at")
      .eq("id", actor.id)
      .maybeSingle();

    if (actorProfileError) {
      throw actorProfileError;
    }

    const isMajorAdmin = actor.email?.toLowerCase() === MAJOR_ADMIN_EMAIL;
    const actorIsActive =
      actorProfile?.is_active &&
      (!actorProfile.account_expires_at || new Date(actorProfile.account_expires_at) > new Date());
    const isStaff = isMajorAdmin || (actorIsActive && ["admin", "staff"].includes(actorProfile?.role || ""));

    if (!isStaff) {
      throw new Error("Only active admins or staff can manage accounts.");
    }

    const body = await request.json();
    const action = String(body.action || "");
    const account: AccountPayload = body.account || {};

    if (!["create", "update", "enable", "disable", "delete"].includes(action)) {
      throw new Error("Unknown account action.");
    }

    if (action === "create" || action === "update") {
      const requestedRole = account.role || "tourist";
      if (["admin", "staff"].includes(requestedRole) && !isMajorAdmin) {
        throw new Error(`Only ${MAJOR_ADMIN_EMAIL} can manage admin/staff accounts.`);
      }
    }

    if (action === "update" && account.id) {
      const target = await getProfile(adminClient, account.id);
      if (["admin", "staff"].includes(target.role) && !isMajorAdmin) {
        throw new Error(`Only ${MAJOR_ADMIN_EMAIL} can manage admin/staff accounts.`);
      }
    }

    if (["enable", "disable", "delete"].includes(action)) {
      const target = await getProfile(adminClient, account.id);
      if (["admin", "staff"].includes(target.role) && !isMajorAdmin) {
        throw new Error(`Only ${MAJOR_ADMIN_EMAIL} can manage admin/staff accounts.`);
      }
    }

    if (action === "create") {
      if (!account.email || !account.password || !account.full_name) {
        throw new Error("Email, temporary password, and full name are required.");
      }

      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.full_name },
      });

      if (createError) {
        throw createError;
      }

      try {
        await upsertProfile(adminClient, {
          ...account,
          id: created.user.id,
          role: account.role || "tourist",
          is_active: account.is_active !== false,
          password: undefined,
        });
      } catch (profileError) {
        await adminClient.auth.admin.deleteUser(created.user.id);
        throw profileError;
      }

      return json({ ok: true, id: created.user.id });
    }

    if (action === "update") {
      if (!account.id) {
        throw new Error("Account ID is required.");
      }

      if (account.email || account.password) {
        const authUpdates: { email?: string; password?: string; user_metadata?: Record<string, string> } = {};
        if (account.email) authUpdates.email = account.email;
        if (account.password) authUpdates.password = account.password;
        if (account.full_name) authUpdates.user_metadata = { full_name: account.full_name };

        const { error: updateUserError } = await adminClient.auth.admin.updateUserById(account.id, authUpdates);
        if (updateUserError) {
          throw updateUserError;
        }
      }

      await upsertProfile(adminClient, {
        ...account,
        password: undefined,
      });
      return json({ ok: true, id: account.id });
    }

    if (action === "enable" || action === "disable") {
      const { error } = await adminClient
        .from("profiles")
        .update({ is_active: action === "enable" })
        .eq("id", account.id);

      if (error) {
        throw error;
      }

      return json({ ok: true, id: account.id });
    }

    if (action === "delete") {
      if (!account.id) {
        throw new Error("Account ID is required.");
      }

      const { error: deleteProfileError } = await adminClient.from("profiles").delete().eq("id", account.id);
      if (deleteProfileError) {
        throw deleteProfileError;
      }

      const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(account.id);
      if (deleteUserError) {
        throw deleteUserError;
      }

      return json({ ok: true, id: account.id });
    }

    throw new Error("Account action failed.");
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Account action failed." }, 400);
  }
});

async function getProfile(adminClient: ReturnType<typeof createClient>, id?: string) {
  if (!id) {
    throw new Error("Account ID is required.");
  }

  const { data, error } = await adminClient.from("profiles").select("*").eq("id", id).single();
  if (error) {
    throw error;
  }

  return data;
}

async function upsertProfile(adminClient: ReturnType<typeof createClient>, account: AccountPayload) {
  const payload: Record<string, unknown> = {
    id: account.id,
    email: account.email,
    full_name: account.full_name,
    role: account.role,
    account_expires_at: account.account_expires_at,
    is_active: account.is_active,
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const { error } = await adminClient.from("profiles").upsert(payload);
  if (error) {
    throw error;
  }
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
