# Explore Uganda Content Platform Setup

This project includes a Supabase-backed content platform in `platform.html`.

## What It Supports

- Admin and staff profiles
- A major admin account controlled by `bigbeautifuluganda@gmail.com`
- Simple UI account creation, updates, disabling, and deletion through a secure Edge Function
- Tourist writer profiles with expiry dates
- Reusable tourist author details: display name, country, bio, profile image, Instagram, and website
- Tourist blog drafts and submissions
- Tourist-authored blog content with inline headings, paragraphs, and image blocks
- Staff review, approval, rejection, publishing, and deletion
- Admin/staff editing of submitted blog posts before approval or publishing
- Souvenir creation and publishing
- Souvenir order and order-item records for checkout/payment follow-up
- Public storage buckets for blog images, souvenir images, and profile images
- Audit history for content and profile changes
- Permanent actor snapshots showing which admin or staff member created, updated, approved, published, rejected, or deleted an item
- Blog post history remains after a profile/account is deleted

## Setup Steps

1. Create or open the Explore Uganda Supabase project.
2. Run `supabase/explore_uganda_schema.sql` in the Supabase SQL Editor. This creates the account roles, profiles, tourist writer details, blog posts, souvenirs, souvenir orders, audit logs, views, triggers, row-level-security policies, indexes, and public media buckets.
3. Deploy the `account-admin` Edge Function from `supabase/functions/account-admin`.
4. Make sure the Edge Function has these environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Create the major admin user in Supabase Authentication with this email: `bigbeautifuluganda@gmail.com`.
6. Add that user's profile row in the `profiles` table:

```sql
insert into public.profiles (id, email, full_name, role, is_active)
values ('PASTE_BIGBEAUTIFULUGANDA_AUTH_USER_ID_HERE', 'bigbeautifuluganda@gmail.com', 'Major Admin', 'admin', true);
```

7. Open `platform.html` and sign in as `bigbeautifuluganda@gmail.com`.
8. Use the Accounts tab to create admin, staff, and tourist writer accounts with email, temporary password, role, expiry, and active status.
9. Use Set 30 Days for tourist writers.

## Major Admin Rule

Only `bigbeautifuluganda@gmail.com` can create, update, disable, extend, or delete Admin and Staff profiles.

Other admins and staff can manage tourist writer profiles, review posts, publish content, manage souvenirs, and view audit history, but they cannot control Admin or Staff accounts.

Disabled or expired Admin/Staff profiles lose staff permissions. The major admin email remains the recovery authority.

## Publishing Flow

Tourist writers can save drafts and submit posts while their account is active. Once a post is submitted, staff control review and publishing. If a post needs tourist edits, staff can reject it and the tourist can edit and resubmit.

Tourist writers can place section headings, paragraphs, and image blocks inside the article content. Submitted posts can be opened from the Review Queue, edited by admin/staff, saved, then approved or published.

Tourist writers can save their author details once in My Tourist Details. Those details are shown with submitted posts in the Review Queue, so tourists do not need to type their bio, country, profile image, or social links again for every blog.

## Accountability

The Audit History tab shows who performed each important action, including account creation, account updates, account deletion, blog approval, blog publishing, blog deletion, souvenir creation, souvenir publishing, and souvenir deletion.

Each audit row stores the admin/staff ID, name, and role as they were at the time of the action. This means old audit history still makes sense even if that staff profile is later renamed, disabled, or deleted.

Blog posts keep an author-name snapshot. If a tourist, staff, or admin profile is deleted later, their blog posts remain in the database instead of being deleted with the account.

## Important Security Note

Do not put a Supabase service-role key in browser JavaScript. The included `account-admin` Edge Function is the safe place for account creation, updates, disabling, and deletion. After it is deployed, admins and tourists use the dashboard UI instead of writing code or pasting database rows.
