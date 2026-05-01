(function () {
    const MAJOR_ADMIN_EMAIL = "bigbeautifuluganda@gmail.com";
    const ACCOUNT_FUNCTION_NAME = "account-admin";
    const supabase = window.ExploreUgandaSupabase;
    const authPanel = document.getElementById("auth-panel");
    const dashboardPanel = document.getElementById("dashboard-panel");
    const sessionSummary = document.getElementById("session-summary");
    const signOutButton = document.getElementById("sign-out-button");
    const statusEl = document.getElementById("platform-status");
    const dashboardTitle = document.getElementById("dashboard-title");
    const dashboardNote = document.getElementById("dashboard-note");
    const loginForm = document.getElementById("login-form");
    const googleSignInButton = document.getElementById("google-sign-in-button");
    const blogForm = document.getElementById("blog-form");
    const touristDetailsForm = document.getElementById("tourist-details-form");
    const saveBlogButton = document.getElementById("save-blog-button");
    const submitBlogButton = document.getElementById("submit-blog-button");
    const profileForm = document.getElementById("profile-form");
    const souvenirForm = document.getElementById("souvenir-form");

    let currentUser = null;
    let currentProfile = null;
    let currentEditingPost = null;

    if (!supabase) {
        sessionSummary.textContent = "Supabase is not available. Check the CDN script and project keys.";
        return;
    }

    function setStatus(message, isError) {
        statusEl.textContent = message || "";
        statusEl.classList.toggle("is-error", Boolean(isError));
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function slugify(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function isStaff() {
        if (isMajorAdmin()) {
            return true;
        }

        if (!currentProfile || !["admin", "staff"].includes(currentProfile.role) || !currentProfile.is_active) {
            return false;
        }

        return !currentProfile.account_expires_at || new Date(currentProfile.account_expires_at) > new Date();
    }

    function isMajorAdmin() {
        return currentUser && String(currentUser.email || "").toLowerCase() === MAJOR_ADMIN_EMAIL;
    }

    function isActiveTourist() {
        if (!currentProfile || currentProfile.role !== "tourist" || !currentProfile.is_active) {
            return false;
        }

        return !currentProfile.account_expires_at || new Date(currentProfile.account_expires_at) > new Date();
    }

    function canWritePosts() {
        return isStaff() || isActiveTourist();
    }

    function canTouristEditPost(post) {
        return isStaff() || ["draft", "rejected"].includes(post.status);
    }

    function formatDate(value) {
        if (!value) {
            return "Not set";
        }
        return new Date(value).toLocaleString();
    }

    function labelize(value) {
        return String(value || "unknown")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function entityLabel(value) {
        const labels = {
            profiles: "Account",
            blog_posts: "Blog Post",
            souvenirs: "Souvenir"
        };
        return labels[value] || labelize(value);
    }

    function auditDetail(item) {
        const before = item.old_data || {};
        const after = item.new_data || {};
        const details = [];

        if (before.status || after.status) {
            details.push(`Status: ${before.status || "new"} to ${after.status || "deleted"}`);
        }

        if (before.role || after.role) {
            details.push(`Role: ${before.role || "new"} to ${after.role || "deleted"}`);
        }

        if (before.is_active !== undefined || after.is_active !== undefined) {
            details.push(`Active: ${before.is_active === undefined ? "new" : before.is_active ? "yes" : "no"} to ${after.is_active === undefined ? "deleted" : after.is_active ? "yes" : "no"}`);
        }

        if (before.account_expires_at || after.account_expires_at) {
            details.push(`Expiry: ${formatDate(before.account_expires_at)} to ${formatDate(after.account_expires_at)}`);
        }

        return details.length ? details.join(". ") : "Full before/after data is stored in Supabase.";
    }

    function toInputDateTime(value) {
        if (!value) {
            return "";
        }
        const date = new Date(value);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    }

    function defaultExpiry() {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    }

    async function callAccountFunction(payload) {
        const { data, error } = await supabase.functions.invoke(ACCOUNT_FUNCTION_NAME, {
            body: payload
        });

        if (error) {
            throw error;
        }

        if (data && data.error) {
            throw new Error(data.error);
        }

        return data;
    }

    function selectedTextOr(textarea, fallback) {
        return textarea.value.slice(textarea.selectionStart, textarea.selectionEnd).trim() || fallback;
    }

    function insertAtCursor(textarea, value) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = `${textarea.value.slice(0, start)}${value}${textarea.value.slice(end)}`;
        textarea.focus();
        textarea.selectionStart = start + value.length;
        textarea.selectionEnd = start + value.length;
    }

    function insertContentBlock(type) {
        const contentField = blogForm.elements.content;
        const selectedText = selectedTextOr(contentField, type === "paragraph" ? "Write this paragraph." : "Section heading");
        let snippet = "";

        if (type === "h2") {
            snippet = `\n<h2>${escapeHtml(selectedText)}</h2>\n`;
        } else if (type === "h3") {
            snippet = `\n<h3>${escapeHtml(selectedText)}</h3>\n`;
        } else if (type === "paragraph") {
            snippet = `\n<p>${escapeHtml(selectedText)}</p>\n`;
        } else if (type === "image") {
            const imagePath = window.prompt("Image path or URL", "images/gorilla.webp");
            if (!imagePath) {
                return;
            }
            const imageAlt = window.prompt("Image description", "Uganda travel photo") || "";
            const caption = window.prompt("Caption", "") || "";
            snippet = `\n<figure>\n<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(imageAlt)}">\n${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>\n` : ""}</figure>\n`;
        }

        insertAtCursor(contentField, snippet);
    }

    function sanitizeArticleHtml(value) {
        const template = document.createElement("template");
        const allowedTags = new Set(["A", "BLOCKQUOTE", "BR", "EM", "FIGCAPTION", "FIGURE", "H2", "H3", "IMG", "LI", "OL", "P", "STRONG", "UL"]);
        const allowedAttributes = {
            A: new Set(["href", "target", "rel"]),
            IMG: new Set(["src", "alt", "loading"])
        };

        template.innerHTML = value;
        template.content.querySelectorAll("*").forEach((element) => {
            if (["IFRAME", "SCRIPT", "STYLE"].includes(element.tagName)) {
                element.remove();
                return;
            }

            if (!allowedTags.has(element.tagName)) {
                element.replaceWith(...element.childNodes);
                return;
            }

            Array.from(element.attributes).forEach((attribute) => {
                if (!allowedAttributes[element.tagName] || !allowedAttributes[element.tagName].has(attribute.name)) {
                    element.removeAttribute(attribute.name);
                }
            });

            if (element.tagName === "A") {
                element.rel = "noopener noreferrer";
                element.target = "_blank";
            }

            if (element.tagName === "IMG") {
                element.loading = "lazy";
            }
        });

        return template.innerHTML.trim();
    }

    function resetBlogForm() {
        blogForm.reset();
        currentEditingPost = null;
        saveBlogButton.textContent = "Save Draft";
        submitBlogButton.hidden = false;
    }

    function loadPostIntoForm(post) {
        currentEditingPost = post;
        Object.keys(post).forEach((key) => {
            if (blogForm.elements[key]) {
                blogForm.elements[key].value = post[key] || "";
            }
        });

        saveBlogButton.textContent = isStaff() ? "Save Changes" : "Save Draft";
        submitBlogButton.hidden = isStaff() && !["draft", "rejected"].includes(post.status);
        setTab("writer-panel");
    }

    function setTab(tabId) {
        document.querySelectorAll(".tab-button").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.tab === tabId);
        });
        document.querySelectorAll(".tab-panel").forEach((panel) => {
            panel.classList.toggle("is-active", panel.id === tabId);
        });
    }

    async function loadProfile() {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        currentProfile = data;
    }

    function renderAccess() {
        const profileName = currentProfile && currentProfile.full_name ? currentProfile.full_name : currentUser.email;
        const role = isMajorAdmin() ? "major admin" : currentProfile ? currentProfile.role : "missing profile";
        const expiry = currentProfile && currentProfile.account_expires_at ? ` Expires: ${formatDate(currentProfile.account_expires_at)}.` : "";

        authPanel.hidden = true;
        dashboardPanel.hidden = false;
        signOutButton.hidden = false;
        sessionSummary.textContent = `${profileName} (${role}).${expiry}`;
        dashboardTitle.textContent = isMajorAdmin() ? "Major Admin Dashboard" : isStaff() ? "Staff Content Dashboard" : "Tourist Writer Dashboard";
        dashboardNote.textContent = isStaff()
            ? "You can manage accounts, review stories, publish souvenirs, and inspect the audit trail."
            : "You can write drafts and submit posts for staff review while your account is active.";
        if (isMajorAdmin()) {
            dashboardNote.textContent = "You control admin and staff accounts, tourist writer access, content review, souvenirs, and the full audit trail.";
        }
        if (!isMajorAdmin() && currentProfile && ["admin", "staff"].includes(currentProfile.role) && !isStaff()) {
            dashboardNote.textContent = "This admin/staff account is disabled or expired. Contact the major admin to restore access.";
        } else if (!isStaff() && !isActiveTourist()) {
            dashboardNote.textContent = "This tourist writer account is expired or disabled. Please contact staff to extend access.";
        }

        blogForm.querySelectorAll("input, textarea, button").forEach((field) => {
            field.disabled = !canWritePosts();
        });
        touristDetailsForm.hidden = currentProfile && currentProfile.role !== "tourist";
        touristDetailsForm.querySelectorAll("input, textarea, button").forEach((field) => {
            field.disabled = !isActiveTourist();
        });

        document.querySelectorAll(".staff-only").forEach((element) => {
            element.hidden = !isStaff();
        });

        profileForm.querySelectorAll("option[value='admin'], option[value='staff']").forEach((option) => {
            option.hidden = !isMajorAdmin();
            option.disabled = !isMajorAdmin();
        });

        if (!isStaff()) {
            setTab("writer-panel");
        }
    }

    async function loadSession() {
        const { data } = await supabase.auth.getSession();
        currentUser = data.session && data.session.user;

        if (!currentUser) {
            currentProfile = null;
            authPanel.hidden = false;
            dashboardPanel.hidden = true;
            signOutButton.hidden = true;
            sessionSummary.textContent = "Not signed in.";
            return;
        }

        try {
            await loadProfile();
            renderAccess();
            await Promise.all([
                loadMyPosts(),
                currentProfile && currentProfile.role === "tourist" ? loadTouristDetails() : Promise.resolve(),
                isStaff() ? loadReviewPosts() : Promise.resolve(),
                isStaff() ? loadProfiles() : Promise.resolve(),
                isStaff() ? loadSouvenirs() : Promise.resolve(),
                isStaff() ? loadOrders() : Promise.resolve(),
                isStaff() ? loadAudit() : Promise.resolve()
            ]);
        } catch (error) {
            sessionSummary.textContent = "Signed in, but the profile could not be loaded.";
            setStatus(error.message, true);
        }
    }

    function blogPayload(status, isExistingPost) {
        const formData = new FormData(blogForm);
        const title = formData.get("title").trim();
        const payload = {
            title,
            slug: formData.get("slug").trim() || slugify(title),
            excerpt: formData.get("excerpt").trim(),
            cover_image_path: formData.get("cover_image_path").trim(),
            content: sanitizeArticleHtml(formData.get("content").trim()),
            status
        };

        if (!isExistingPost) {
            payload.author_id = currentUser.id;
        }

        return payload;
    }

    async function loadTouristDetails() {
        const { data, error } = await supabase
            .from("tourist_writer_details")
            .select("*")
            .eq("profile_id", currentUser.id)
            .maybeSingle();

        if (error) {
            setStatus(error.message, true);
            return;
        }

        touristDetailsForm.elements.display_name.value = data && data.display_name || currentProfile && currentProfile.full_name || "";
        touristDetailsForm.elements.country.value = data && data.country || "";
        touristDetailsForm.elements.short_bio.value = data && data.short_bio || "";
        touristDetailsForm.elements.profile_image_path.value = data && data.profile_image_path || "";
        touristDetailsForm.elements.instagram_url.value = data && data.instagram_url || "";
        touristDetailsForm.elements.website_url.value = data && data.website_url || "";
    }

    async function saveBlog(requestedStatus) {
        if (!canWritePosts()) {
            throw new Error("This account is expired or disabled, so it cannot save or submit blog posts.");
        }

        const id = blogForm.elements.id.value;
        const status = id && isStaff() && requestedStatus === "draft"
            ? currentEditingPost && currentEditingPost.status || "submitted"
            : requestedStatus;
        const payload = blogPayload(status, Boolean(id));
        const request = id
            ? supabase.from("blog_posts").update(payload).eq("id", id).select().single()
            : supabase.from("blog_posts").insert(payload).select().single();
        const { data, error } = await request;

        if (error) {
            throw error;
        }

        blogForm.elements.id.value = data.id;
        currentEditingPost = data;
        setStatus(status === "submitted" ? "Blog post submitted for review." : id && isStaff() ? "Blog post changes saved." : "Blog draft saved.");
        await Promise.all([loadMyPosts(), isStaff() ? loadReviewPosts() : Promise.resolve()]);
    }

    async function loadMyPosts() {
        const list = document.getElementById("my-posts-list");
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("author_id", currentUser.id)
            .order("updated_at", { ascending: false });

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map(renderMyPost).join("") : "<p>No posts yet.</p>";
    }

    function renderMyPost(post) {
        const canEdit = canWritePosts() && canTouristEditPost(post);
        const submitButton = canWritePosts() && (post.status === "draft" || post.status === "rejected")
            ? `<button type="button" class="small-button" data-submit-blog="${escapeHtml(post.id)}">Submit</button>`
            : "";

        return `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(post.status)}</span>
                <h4>${escapeHtml(post.title)}</h4>
                <div class="meta-grid">
                    <span>Updated: ${escapeHtml(formatDate(post.updated_at))}</span>
                    <span>Submitted: ${escapeHtml(formatDate(post.submitted_at))}</span>
                    <span>Approved: ${escapeHtml(formatDate(post.approved_at))}</span>
                    <span>Published: ${escapeHtml(formatDate(post.published_at))}</span>
                </div>
                <div class="card-actions">
                    ${canEdit ? `<button type="button" class="small-button" data-edit-blog="${escapeHtml(post.id)}">Edit</button>` : ""}
                    ${submitButton}
                </div>
            </article>
        `;
    }

    async function loadReviewPosts() {
        const list = document.getElementById("review-posts-list");
        const { data, error } = await supabase
            .from("blog_post_accountability")
            .select("*")
            .in("status", ["submitted", "approved", "rejected", "published"])
            .order("updated_at", { ascending: false });

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map(renderReviewPost).join("") : "<p>No posts are waiting for review.</p>";
    }

    function renderReviewPost(post) {
        return `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(post.status)}</span>
                <h4>${escapeHtml(post.title)}</h4>
                <div class="meta-grid">
                    <span>Author: ${escapeHtml(post.author_display_name || post.author_name)}</span>
                    <span>Country: ${escapeHtml(post.author_country)}</span>
                    <span>Submitted by: ${escapeHtml(post.submitted_by_name)}</span>
                    <span>Approved by: ${escapeHtml(post.approved_by_name)}</span>
                    <span>Published by: ${escapeHtml(post.published_by_name)}</span>
                    <span>Last edited by: ${escapeHtml(post.last_edited_by_name)}</span>
                    <span>Updated: ${escapeHtml(formatDate(post.updated_at))}</span>
                </div>
                ${post.author_bio ? `<p class="audit-detail">${escapeHtml(post.author_bio)}</p>` : ""}
                <div class="card-actions">
                    <button type="button" class="small-button" data-edit-blog="${escapeHtml(post.id)}">Edit</button>
                    <button type="button" class="small-button" data-review-status="approved" data-post-id="${escapeHtml(post.id)}">Approve</button>
                    <button type="button" class="small-button" data-review-status="published" data-post-id="${escapeHtml(post.id)}">Publish</button>
                    <button type="button" class="small-button" data-review-status="rejected" data-post-id="${escapeHtml(post.id)}">Reject</button>
                    <button type="button" class="small-button" data-delete-post="${escapeHtml(post.id)}">Delete</button>
                </div>
            </article>
        `;
    }

    async function loadProfiles() {
        const list = document.getElementById("profiles-list");
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map(renderProfile).join("") : "<p>No profiles found.</p>";
    }

    function renderProfile(profile) {
        const protectedAccount = ["admin", "staff"].includes(profile.role);
        const canManageProfile = isMajorAdmin() || !protectedAccount;
        const protectedNote = protectedAccount && !isMajorAdmin()
            ? `<p class="audit-detail">Only ${MAJOR_ADMIN_EMAIL} can edit, disable, extend, or delete admin/staff accounts.</p>`
            : "";

        return `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(profile.role)}</span>
                <h4>${escapeHtml(profile.full_name || profile.id)}</h4>
                <div class="meta-grid">
                    <span>Email: ${escapeHtml(profile.email)}</span>
                    <span>ID: ${escapeHtml(profile.id)}</span>
                    <span>Active: ${profile.is_active ? "Yes" : "No"}</span>
                    <span>Expires: ${escapeHtml(formatDate(profile.account_expires_at))}</span>
                    <span>Updated: ${escapeHtml(formatDate(profile.updated_at))}</span>
                </div>
                <div class="card-actions">
                    ${canManageProfile ? `<button type="button" class="small-button" data-edit-profile="${escapeHtml(profile.id)}">Edit</button>` : ""}
                    ${canManageProfile ? `<button type="button" class="small-button" data-extend-profile="${escapeHtml(profile.id)}">Extend 30 Days</button>` : ""}
                    ${canManageProfile ? `<button type="button" class="small-button" data-toggle-profile="${escapeHtml(profile.id)}" data-active="${profile.is_active ? "false" : "true"}">${profile.is_active ? "Disable" : "Enable"}</button>` : ""}
                    ${canManageProfile ? `<button type="button" class="small-button" data-delete-profile="${escapeHtml(profile.id)}">Delete Profile</button>` : ""}
                </div>
                ${protectedNote}
            </article>
        `;
    }

    async function loadSouvenirs() {
        const list = document.getElementById("souvenirs-list");
        const { data, error } = await supabase
            .from("souvenir_accountability")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map(renderSouvenir).join("") : "<p>No souvenirs found.</p>";
    }

    function renderSouvenir(item) {
        return `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(item.status)}</span>
                <h4>${escapeHtml(item.name)}</h4>
                <div class="meta-grid">
                    <span>Created by: ${escapeHtml(item.created_by_name)}</span>
                    <span>Updated by: ${escapeHtml(item.updated_by_name)}</span>
                    <span>Published by: ${escapeHtml(item.published_by_name)}</span>
                    <span>Published: ${escapeHtml(formatDate(item.published_at))}</span>
                </div>
                <div class="card-actions">
                    <button type="button" class="small-button" data-edit-souvenir="${escapeHtml(item.id)}">Edit</button>
                    <button type="button" class="small-button" data-publish-souvenir="${escapeHtml(item.id)}">Publish</button>
                    <button type="button" class="small-button" data-delete-souvenir="${escapeHtml(item.id)}">Delete</button>
                </div>
            </article>
        `;
    }

    async function loadOrders() {
        const list = document.getElementById("orders-list");
        const { data, error } = await supabase
            .from("souvenir_order_accountability")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map(renderOrder).join("") : "<p>No souvenir orders yet.</p>";
    }

    function renderOrder(order) {
        return `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(order.order_status)}</span>
                <h4>${escapeHtml(order.order_number || order.id)}</h4>
                <div class="meta-grid">
                    <span>Customer: ${escapeHtml(order.customer_name)}</span>
                    <span>Email: ${escapeHtml(order.customer_email)}</span>
                    <span>Phone: ${escapeHtml(order.customer_phone)}</span>
                    <span>Total: ${escapeHtml(order.currency)} ${Number(order.total || 0).toLocaleString()}</span>
                    <span>Payment: ${escapeHtml(order.payment_status)}</span>
                    <span>Created: ${escapeHtml(formatDate(order.created_at))}</span>
                    <span>Updated by: ${escapeHtml(order.updated_by_name)}</span>
                </div>
                ${order.notes ? `<p class="audit-detail">${escapeHtml(order.notes)}</p>` : ""}
                <div class="card-actions">
                    <button type="button" class="small-button" data-order-status="processing" data-order-id="${escapeHtml(order.id)}">Processing</button>
                    <button type="button" class="small-button" data-order-status="shipped" data-order-id="${escapeHtml(order.id)}">Shipped</button>
                    <button type="button" class="small-button" data-order-status="completed" data-order-id="${escapeHtml(order.id)}">Completed</button>
                    <button type="button" class="small-button" data-payment-status="successful" data-order-id="${escapeHtml(order.id)}">Paid</button>
                    <button type="button" class="small-button" data-order-status="cancelled" data-order-id="${escapeHtml(order.id)}">Cancel</button>
                </div>
            </article>
        `;
    }

    async function loadAudit() {
        const list = document.getElementById("audit-list");
        const { data, error } = await supabase
            .from("audit_log_details")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(80);

        if (error) {
            list.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
            return;
        }

        list.innerHTML = data.length ? data.map((item) => `
            <article class="data-card">
                <span class="status-pill">${escapeHtml(labelize(item.action))}</span>
                <h4>${escapeHtml(item.entity_title || item.entity_id)}</h4>
                <div class="meta-grid">
                    <span>Actor: ${escapeHtml(item.actor_name || item.actor_id)}</span>
                    <span>Role: ${escapeHtml(item.actor_role)}</span>
                    <span>Item type: ${escapeHtml(entityLabel(item.entity_type))}</span>
                    <span>Time: ${escapeHtml(formatDate(item.created_at))}</span>
                    <span>Item ID: ${escapeHtml(item.entity_id)}</span>
                </div>
                <p class="audit-detail">${escapeHtml(auditDetail(item))}</p>
            </article>
        `).join("") : "<p>No audit activity yet.</p>";
    }

    async function getTableRow(table, id) {
        const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
        if (error) {
            throw error;
        }
        return data;
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const { error } = await supabase.auth.signInWithPassword({
            email: formData.get("email"),
            password: formData.get("password")
        });
        if (error) {
            setStatus(error.message, true);
            return;
        }
        setStatus("Signed in.");
        await loadSession();
    });

    if (googleSignInButton) {
        googleSignInButton.addEventListener("click", async () => {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: window.location.href
                }
            });

            if (error) {
                setStatus(error.message, true);
            }
        });
    }

    signOutButton.addEventListener("click", async () => {
        await supabase.auth.signOut();
        setStatus("Signed out.");
        await loadSession();
    });

    document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", () => setTab(button.dataset.tab));
    });

    blogForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await saveBlog("draft");
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    submitBlogButton.addEventListener("click", async () => {
        try {
            await saveBlog("submitted");
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    document.querySelectorAll("[data-insert-block]").forEach((button) => {
        button.addEventListener("click", () => insertContentBlock(button.dataset.insertBlock));
    });

    document.getElementById("clear-blog-form").addEventListener("click", resetBlogForm);

    touristDetailsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!isActiveTourist()) {
            setStatus("This tourist account is expired or disabled, so it cannot update tourist details.", true);
            return;
        }

        const formData = new FormData(touristDetailsForm);
        const payload = {
            profile_id: currentUser.id,
            display_name: formData.get("display_name").trim(),
            country: formData.get("country").trim(),
            short_bio: formData.get("short_bio").trim(),
            profile_image_path: formData.get("profile_image_path").trim(),
            instagram_url: formData.get("instagram_url").trim(),
            website_url: formData.get("website_url").trim()
        };

        try {
            const { error } = await supabase.from("tourist_writer_details").upsert(payload);
            if (error) {
                throw error;
            }
            setStatus("Tourist details saved.");
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    document.getElementById("default-expiry-button").addEventListener("click", () => {
        profileForm.elements.account_expires_at.value = defaultExpiry();
    });

    document.getElementById("clear-profile-form").addEventListener("click", () => profileForm.reset());

    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(profileForm);
        const payload = {
            id: formData.get("id").trim(),
            email: formData.get("email").trim(),
            password: formData.get("password").trim(),
            full_name: formData.get("full_name").trim(),
            role: formData.get("role"),
            account_expires_at: formData.get("account_expires_at") ? new Date(formData.get("account_expires_at")).toISOString() : null,
            is_active: formData.get("is_active") === "on"
        };

        try {
            if (["admin", "staff"].includes(payload.role) && !isMajorAdmin()) {
                throw new Error(`Only ${MAJOR_ADMIN_EMAIL} can create or update admin/staff accounts.`);
            }

            await callAccountFunction({
                action: payload.id ? "update" : "create",
                account: payload
            });
            setStatus(payload.id ? "Account updated." : "Account created.");
            profileForm.reset();
            await loadProfiles();
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    souvenirForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(souvenirForm);
        const id = formData.get("id");
        const payload = {
            name: formData.get("name").trim(),
            slug: formData.get("slug").trim() || slugify(formData.get("name")),
            description: formData.get("description").trim(),
            price: Number(formData.get("price") || 0),
            currency: formData.get("currency").trim() || "UGX",
            image_path: formData.get("image_path").trim(),
            stock_status: formData.get("stock_status").trim() || "in_stock",
            status: formData.get("status")
        };
        const request = id
            ? supabase.from("souvenirs").update(payload).eq("id", id)
            : supabase.from("souvenirs").insert(payload);

        try {
            const { error } = await request;
            if (error) {
                throw error;
            }
            setStatus("Souvenir saved.");
            souvenirForm.reset();
            await loadSouvenirs();
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    document.getElementById("clear-souvenir-form").addEventListener("click", () => souvenirForm.reset());

    document.addEventListener("click", async (event) => {
        const target = event.target;

        try {
            if (target.dataset.editBlog) {
                const post = await getTableRow("blog_posts", target.dataset.editBlog);
                loadPostIntoForm(post);
            }

            if (target.dataset.submitBlog) {
                if (!canWritePosts()) {
                    throw new Error("This account is expired or disabled, so it cannot submit blog posts.");
                }

                const { error } = await supabase.from("blog_posts").update({ status: "submitted" }).eq("id", target.dataset.submitBlog);
                if (error) {
                    throw error;
                }
                setStatus("Blog post submitted.");
                await loadMyPosts();
            }

            if (target.dataset.reviewStatus) {
                const { error } = await supabase.from("blog_posts").update({ status: target.dataset.reviewStatus }).eq("id", target.dataset.postId);
                if (error) {
                    throw error;
                }
                setStatus(`Blog post marked ${target.dataset.reviewStatus}.`);
                await Promise.all([loadReviewPosts(), loadAudit()]);
            }

            if (target.dataset.deletePost && window.confirm("Delete this blog post?")) {
                const { error } = await supabase.from("blog_posts").delete().eq("id", target.dataset.deletePost);
                if (error) {
                    throw error;
                }
                setStatus("Blog post deleted.");
                await Promise.all([loadReviewPosts(), loadAudit()]);
            }

            if (target.dataset.editProfile) {
                const profile = await getTableRow("profiles", target.dataset.editProfile);
                profileForm.elements.id.value = profile.id;
                profileForm.elements.email.value = profile.email || "";
                profileForm.elements.password.value = "";
                profileForm.elements.full_name.value = profile.full_name || "";
                profileForm.elements.role.value = profile.role;
                profileForm.elements.account_expires_at.value = toInputDateTime(profile.account_expires_at);
                profileForm.elements.is_active.checked = Boolean(profile.is_active);
            }

            if (target.dataset.extendProfile) {
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 30);
                await callAccountFunction({
                    action: "update",
                    account: {
                        id: target.dataset.extendProfile,
                        account_expires_at: expiry.toISOString(),
                        is_active: true
                    }
                });
                setStatus("Profile extended by 30 days.");
                await Promise.all([loadProfiles(), loadAudit()]);
            }

            if (target.dataset.toggleProfile) {
                await callAccountFunction({
                    action: target.dataset.active === "true" ? "enable" : "disable",
                    account: {
                        id: target.dataset.toggleProfile
                    }
                });
                setStatus("Profile status updated.");
                await Promise.all([loadProfiles(), loadAudit()]);
            }

            if (target.dataset.deleteProfile && window.confirm("Delete this account? Blog and audit history remain.")) {
                await callAccountFunction({
                    action: "delete",
                    account: {
                        id: target.dataset.deleteProfile
                    }
                });
                setStatus("Account deleted.");
                await Promise.all([loadProfiles(), loadAudit()]);
            }

            if (target.dataset.editSouvenir) {
                const item = await getTableRow("souvenirs", target.dataset.editSouvenir);
                Object.keys(item).forEach((key) => {
                    if (souvenirForm.elements[key]) {
                        souvenirForm.elements[key].value = item[key] || "";
                    }
                });
                setTab("souvenirs-panel");
            }

            if (target.dataset.publishSouvenir) {
                const { error } = await supabase.from("souvenirs").update({ status: "published" }).eq("id", target.dataset.publishSouvenir);
                if (error) {
                    throw error;
                }
                setStatus("Souvenir published.");
                await Promise.all([loadSouvenirs(), loadAudit()]);
            }

            if (target.dataset.deleteSouvenir && window.confirm("Delete this souvenir?")) {
                const { error } = await supabase.from("souvenirs").delete().eq("id", target.dataset.deleteSouvenir);
                if (error) {
                    throw error;
                }
                setStatus("Souvenir deleted.");
                await Promise.all([loadSouvenirs(), loadAudit()]);
            }

            if (target.dataset.orderStatus) {
                const { error } = await supabase
                    .from("souvenir_orders")
                    .update({ order_status: target.dataset.orderStatus })
                    .eq("id", target.dataset.orderId);
                if (error) {
                    throw error;
                }
                setStatus(`Order marked ${target.dataset.orderStatus}.`);
                await Promise.all([loadOrders(), loadAudit()]);
            }

            if (target.dataset.paymentStatus) {
                const { error } = await supabase
                    .from("souvenir_orders")
                    .update({ payment_status: target.dataset.paymentStatus })
                    .eq("id", target.dataset.orderId);
                if (error) {
                    throw error;
                }
                setStatus(`Payment marked ${target.dataset.paymentStatus}.`);
                await Promise.all([loadOrders(), loadAudit()]);
            }
        } catch (error) {
            setStatus(error.message, true);
        }
    });

    document.getElementById("refresh-my-posts").addEventListener("click", loadMyPosts);
    document.getElementById("refresh-review-posts").addEventListener("click", loadReviewPosts);
    document.getElementById("refresh-profiles").addEventListener("click", loadProfiles);
    document.getElementById("refresh-souvenirs").addEventListener("click", loadSouvenirs);
    document.getElementById("refresh-orders").addEventListener("click", loadOrders);
    document.getElementById("refresh-audit").addEventListener("click", loadAudit);

    supabase.auth.onAuthStateChange(() => {
        loadSession();
    });

    loadSession();
})();
