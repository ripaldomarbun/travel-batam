# Website Security (Defensive) — Agent Instructions

> Part 1: Instructions · Part 2: Checklist · Part 3: Headers & server config

Help the user find and fix security weaknesses in websites **they own or are authorized to work on**, and write new code securely by default.

Respond in the user's language (if they write Indonesian, answer in Indonesian, informal tone is fine). Keep technical terms (XSS, CSRF, CSP) in English.

---

# Part 1 — Instructions

## Scope and boundaries

In scope: code review, config review, hardening checklists, secure code examples, incident-response basics, explaining vulnerabilities so they can be fixed.

Out of scope: working exploit code, payload lists meant for attacking third-party sites, bypassing authentication on systems the user does not own, phishing/malware. If a request looks offensive against a system the user doesn't control, decline that part and offer the defensive angle instead (how to detect and prevent it). Showing a _minimal_ vulnerable-vs-fixed snippet to explain a bug is fine, because understanding the flaw is how people fix it.

## Workflow

1. **Identify context.** Stack (language/framework), hosting (shared hosting, VPS, cloud), what the site handles (login, payments, personal data, uploads, admin panel). Ask only if it changes the advice and can't be inferred from the code or files given.
2. **Pick the mode:**
   - _Review mode_ (user shares code/config/URL structure): walk through the checklist in Part 2 below, but only report items relevant to what you actually see.
   - _Build mode_ (user asks to write a feature): write it securely by default and note the security decisions briefly.
   - _Hardening mode_ (user asks "how do I secure my site"): produce a prioritized plan. Use Part 3 below for ready-to-use server/header configs.
3. **Prioritize by real risk**, not by length of list. Data exposure, auth bypass, injection, and exposed secrets come before missing headers.
4. **Give the fix, not just the finding.** Every issue gets a concrete corrected snippet or config line in the user's stack.
5. **State uncertainty.** If you can't see the full code (middleware, server config), say what you assumed and what to verify.

## Priority order (what to look at first)

1. Exposed secrets (API keys, DB passwords, `.env`, `.git` folder reachable from web)
2. Injection (SQL, command, template) and XSS
3. Authentication and session handling
4. Authorization (can user A access user B's data by changing an ID?)
5. File upload handling
6. CSRF on state-changing requests
7. Transport and headers (HTTPS, HSTS, CSP, cookies flags)
8. Dependencies and patching
9. Logging, backups, error disclosure
10. Rate limiting and abuse protection

For why each matters and how to fix it per stack, see Part 2 (Checklist) below.

## Output format for reviews

Use this structure so the user can act quickly. Tables work well because findings are easy to scan and rank:

```
## Ringkasan
[1-2 sentences: overall posture + the single most urgent thing]

## Temuan
| # | Severity | Masalah | Lokasi | Perbaikan singkat |
|---|----------|---------|--------|-------------------|
| 1 | High     | ...     | file:line | ... |

## Detail & kode perbaikan
### 1. [Nama temuan]
**Risiko:** what an attacker could do, in plain words
**Kode rentan:** (minimal snippet)
**Perbaikan:** (corrected snippet)

## Langkah berikutnya
Numbered, ordered by priority. Include how to verify each fix.
```

Severity guide: **Critical** = remote data theft/takeover without login; **High** = needs low-effort conditions (e.g., logged-in user reads others' data); **Medium** = needs unusual conditions or limited impact; **Low** = defense-in-depth.

Do not pad the table with Low items when a Critical exists. Lead with what matters. Don't invent findings: if the code looks fine in an area, say so briefly.

## Secure-by-default rules when writing code

These apply whenever you generate code that touches user input, auth, or data:

- **Queries:** parameterized queries / ORM bindings only. Never concatenate user input into SQL.
- **Output:** escape on output according to context (HTML, attribute, JS, URL). Prefer framework auto-escaping; flag every raw/unescaped output (`{!! !!}`, `innerHTML`, `dangerouslySetInnerHTML`, `|safe`, `echo $_GET`).
- **Passwords:** hash with Argon2id or bcrypt (PHP `password_hash`, Laravel `Hash::make`, Node `argon2`/`bcrypt`). Never MD5/SHA1/plain.
- **Sessions/cookies:** `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`; regenerate session ID on login; set idle and absolute timeouts.
- **Authorization:** check ownership/role on the server for every object access, not just in the UI. Use policies/middleware.
- **CSRF:** tokens on all state-changing form requests (framework built-in), or SameSite plus custom header for APIs.
- **Uploads:** allowlist extensions and verify MIME server-side, rename files randomly, store outside web root or in object storage, set size limits, never execute uploaded files.
- **Secrets:** environment variables or a secret manager; `.env` never committed and never inside web root; rotate anything that was ever exposed.
- **Errors:** generic messages to users, detailed errors to logs only. Debug mode off in production.
- **Validation:** validate on the server (type, length, format, allowlist); client-side validation is only UX.
- **Rate limiting:** on login, password reset, OTP, and any expensive endpoint.

## Common mistakes to watch for in this user's likely context

Small business, institutional, and freelance-client sites often run on shared hosting or a single VPS with WordPress or custom PHP. The recurring problems there are: default admin paths and weak admin passwords with no 2FA, `.env`/backup `.sql`/`.zip` files left in the web root, outdated plugins/CMS, `display_errors` on, no HTTPS redirect, direct database credentials committed to a repo, and upload folders that allow PHP execution. Check these early when the context fits.

## If the site may already be compromised

Switch to incident mode: (1) don't delete evidence yet, take a backup copy of files and logs; (2) change all credentials (hosting, DB, admin, FTP/SSH, API keys); (3) look for unknown admin users, recently modified files, unfamiliar PHP files in upload/cache folders, odd cron jobs; (4) restore from a known-clean backup or reinstall core and plugins from official sources; (5) patch the entry point before bringing the site back; (6) enable monitoring. Details in Part 2, section 13 (Incident response).

## Verification

Suggest safe ways for the owner to verify fixes on their own site: browser DevTools (headers, cookies), `curl -I https://domain`, Mozilla Observatory, securityheaders.com, SSL Labs, `npm audit` / `composer audit` / `pip-audit`, and framework linters. Remind them to test on staging first when possible.

---

# Part 2 — Website Security Checklist

Contents: 1 Secrets · 2 Injection · 3 XSS · 4 Authentication · 5 Authorization · 6 CSRF · 7 File upload · 8 Transport & cookies · 9 Dependencies · 10 Errors & logging · 11 Rate limiting · 12 Backups · 13 Incident response

Use only the sections relevant to the code in front of you.

---

## 1. Secrets and exposed files

**Check**

- `.env`, `.git/`, `config.php.bak`, `*.sql`, `*.zip`, `phpinfo.php`, `composer.json`/`package.json` reachable via browser
- Keys hardcoded in JS shipped to the browser (anything in frontend code is public)
- Credentials committed to Git history (deleting the file later does not remove it from history)

**Fix**

- Web root should contain only public files (Laravel: point the server at `public/`)
- Block dotfiles and backups at the web server (see Part 3)
- Move secrets to environment variables; rotate anything already leaked
- Add `.env` to `.gitignore`; use `git filter-repo` or rotate keys if leaked in history

## 2. Injection (SQL, command, template)

**Vulnerable pattern**

```php
$q = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";
```

**Fixed**

```php
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $_POST['email']]);
```

- Laravel: use Eloquent / query builder bindings; be careful with `DB::raw`, `whereRaw` (pass bindings as the second argument)
- Node: `db.query('... WHERE id = $1', [id])`, never template strings
- Python: `cursor.execute('... WHERE id = %s', (id,))`
- Avoid `exec`, `system`, `shell_exec`, `child_process.exec` with user input; use argument arrays and allowlists
- Column/table names and `ORDER BY` cannot be parameterized: allowlist them

## 3. Cross-Site Scripting (XSS)

- Rely on auto-escaping templates (Blade `{{ }}`, Twig, Jinja2, React JSX)
- Red flags: `{!! $x !!}`, `echo $_GET[...]`, `innerHTML`, `document.write`, `dangerouslySetInnerHTML`, `v-html`, `|safe`
- If HTML from users must be allowed (rich text editor), sanitize with a maintained library (DOMPurify, HTMLPurifier) using an allowlist
- Add a Content-Security-Policy as a second layer (not a replacement for escaping)
- Never put user data inside `<script>` blocks or inline event handlers without proper JSON encoding

## 4. Authentication

- Hash passwords with Argon2id/bcrypt; enforce a sensible minimum length (12+) and check against breached-password lists where possible, rather than forcing odd complexity rules
- Same error message for "user not found" and "wrong password"
- Lock out or throttle after repeated failures; add 2FA for admin accounts
- Password reset: random single-use tokens, short expiry, stored hashed, invalidated after use
- Regenerate the session ID after login; invalidate on logout; set session timeouts
- Do not put tokens in URLs; do not log passwords or tokens
- JWT: pin the algorithm, short expiry, store in HttpOnly cookie rather than localStorage when possible, have a revocation plan

## 5. Authorization (access control)

The most common serious bug in custom apps (IDOR / broken access control).

**Vulnerable**

```php
// /invoice.php?id=123 — any logged-in user can read any invoice
$invoice = Invoice::find($_GET['id']);
```

**Fixed**

```php
$invoice = Invoice::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
// or use a Policy: $this->authorize('view', $invoice);
```

- Enforce on the server for every request, including APIs and AJAX endpoints
- Hiding a button in the UI is not access control
- Admin routes behind middleware; deny by default
- Prevent mass assignment (`$fillable` in Laravel, serializers/allowlists elsewhere) so users can't set `role=admin`

## 6. CSRF

- Forms that change state need a CSRF token (Laravel `@csrf`, Django `{% csrf_token %}`, Express `csurf` replacement such as `csrf-csrf`)
- Use POST/PUT/DELETE for state changes, never GET
- `SameSite=Lax` cookies reduce risk but do not replace tokens for sensitive actions
- Pure token-based APIs (Authorization header, no cookies) are not CSRF-prone, but check CORS

## 7. File upload

- Allowlist extensions (e.g., jpg, png, pdf) and verify real MIME type server-side (`finfo`, `file-type`)
- Rename to random names; ignore the user-supplied filename
- Store outside web root, or in object storage; serve through a controller if access control is needed
- Disable script execution in upload directories (see Part 3)
- Limit size; re-encode images when possible to strip embedded payloads
- Never trust `Content-Type` sent by the client

## 8. Transport and cookies

- HTTPS everywhere, 301 redirect from HTTP, HSTS after confirming HTTPS works for all subdomains
- TLS 1.2+ only; auto-renew certificates (Let's Encrypt)
- Cookies: `Secure; HttpOnly; SameSite=Lax`
- Security headers: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame protection (`frame-ancestors` or X-Frame-Options)
- CORS: never `Access-Control-Allow-Origin: *` together with credentials; allowlist specific origins

## 9. Dependencies and platform

- Keep CMS core, plugins, themes, framework, and PHP/Node/Python runtime updated; remove unused plugins
- Run `composer audit`, `npm audit`, `pip-audit`; enable Dependabot or Renovate
- Download plugins/themes only from official sources (nulled/cracked themes are a classic backdoor source)
- Pin versions with lock files; review new dependencies before adding
- WordPress: change default `admin` user, limit login attempts, 2FA, disable file editing (`DISALLOW_FILE_EDIT`), restrict `xmlrpc.php` if unused

## 10. Errors and logging

- Production: debug off (`APP_DEBUG=false`, `display_errors=Off`, `DEBUG=False`)
- Log auth events, permission failures, admin actions; never log passwords, full card numbers, or tokens
- Custom error pages that don't leak stack traces, paths, or versions
- Remove `X-Powered-By` and server version banners (minor, but free)
- Review logs regularly or alert on spikes of 401/403/500

## 11. Rate limiting and abuse

- Login, registration, password reset, OTP, contact forms, search, and expensive endpoints
- Laravel `throttle` middleware, `express-rate-limit`, Nginx `limit_req`, or Cloudflare rules
- CAPTCHA / Turnstile on public forms to reduce spam and credential stuffing
- Consider a WAF (Cloudflare, ModSecurity) as an extra layer, not a substitute for fixing code

## 12. Backups

- Automated, off-server, tested restores; keep several generations
- Backups themselves must not be in the web root or publicly reachable
- Encrypt backups that contain personal data

## 13. Incident response (site possibly compromised)

1. **Preserve:** copy current files, DB dump, and access/error logs before cleaning
2. **Contain:** put the site in maintenance mode; change hosting, DB, admin, FTP/SSH passwords and API keys
3. **Investigate:** look for unknown admin users, files modified recently (`find . -mtime -7 -type f`), unfamiliar PHP files in uploads/cache/tmp, suspicious `eval`/`base64_decode` code, odd cron jobs, changed `.htaccess`
4. **Eradicate:** restore from a known-clean backup, or reinstall core/plugins from official sources and compare
5. **Fix the entry point:** outdated plugin, weak password, vulnerable upload, exposed secret; otherwise reinfection is likely
6. **Recover and monitor:** re-enable the site, watch logs, set up file-integrity monitoring and alerts
7. **Notify** affected users where personal data was exposed, following applicable law (in Indonesia, UU PDP) and internal policy

---

# Part 3 — Headers and Server Config (copy-paste starting points)

Always test on staging first. A strict CSP in particular can break inline scripts, third-party widgets, and analytics. Start with `Content-Security-Policy-Report-Only`, check the browser console, then enforce.

Contents: Recommended headers · Nginx · Apache (.htaccess) · Express (Helmet) · Laravel · Cookie settings · Block sensitive files · Disable PHP execution in uploads

---

## Recommended headers

| Header                    | Value                                          | Purpose                                      |
| ------------------------- | ---------------------------------------------- | -------------------------------------------- |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains`          | Force HTTPS (add `preload` only when sure)   |
| Content-Security-Policy   | see below                                      | Limits where scripts/styles/images load from |
| X-Content-Type-Options    | `nosniff`                                      | Stops MIME sniffing                          |
| Referrer-Policy           | `strict-origin-when-cross-origin`              | Limits URL leakage                           |
| Permissions-Policy        | `camera=(), microphone=(), geolocation=()`     | Disable unused browser features              |
| X-Frame-Options           | `SAMEORIGIN` (or CSP `frame-ancestors 'self'`) | Anti-clickjacking                            |

Baseline CSP for a simple site (adjust to the real resources used):

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'
```

Avoid `'unsafe-inline'` and `'unsafe-eval'` for `script-src`; use nonces or hashes if inline scripts are needed.

---

## Nginx

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_protocols TLSv1.2 TLSv1.3;
    server_tokens off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'" always;

    # Block dotfiles (except .well-known for certificates)
    location ~ /\.(?!well-known) { deny all; }

    # Block backups, dumps, and config leftovers
    location ~* \.(sql|bak|old|orig|swp|zip|tar|gz|log|env|ini)$ { deny all; }

    # No PHP execution in uploads
    location ~* ^/(uploads|storage)/.*\.php$ { deny all; }

    # Basic rate limit for login (define zone in http {} block:
    # limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;)
    location = /login {
        limit_req zone=login burst=5 nodelay;
        # proxy_pass / fastcgi_pass ...
    }
}
```

---

## Apache (.htaccess)

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Content-Security-Policy "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"
</IfModule>

# Hide server info
ServerSignature Off

# Disable directory listing
Options -Indexes

# Block dotfiles and sensitive extensions
<FilesMatch "(^\.|\.(sql|bak|old|orig|swp|log|env|ini)$)">
  Require all denied
</FilesMatch>
```

Disable PHP in uploads, put this `.htaccess` inside the uploads folder:

```apache
<FilesMatch "\.(php|phtml|php[0-9]|phar)$">
  Require all denied
</FilesMatch>
```

---

## Express (Helmet + rate limit)

```js
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
  }),
);

app.use("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 2,
    },
  }),
);
```

---

## Laravel

`.env` (production):

```
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
SESSION_LIFETIME=120
```

- Web server document root must be `public/`, never the project root
- Throttle routes: `Route::middleware('throttle:5,1')->post('/login', ...)`
- Use Policies / Gates for authorization, `$fillable` for mass assignment
- Run `composer audit` and `php artisan config:cache` in production
- Add headers via a middleware (or `spatie/laravel-csp` for CSP)

```php
public function handle($request, Closure $next)
{
    $response = $next($request);
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
    $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return $response;
}
```

---

## PHP (plain) quick settings

```ini
display_errors = Off
log_errors = On
expose_php = Off
session.cookie_httponly = 1
session.cookie_secure = 1
session.cookie_samesite = Lax
session.use_strict_mode = 1
allow_url_include = Off
```

Call `session_regenerate_id(true)` after successful login.

---

## Verifying

```bash
curl -I https://example.com            # check headers
curl -I https://example.com/.env       # should be 403/404, not 200
curl -I http://example.com             # should 301 to https
```

External checkers (for your own domain): securityheaders.com, Mozilla Observatory, SSL Labs.
