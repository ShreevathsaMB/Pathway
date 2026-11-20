# Security Policy

## Supported Versions

Pathway is currently in early development. Security fixes are applied to the latest version on the `main` branch.

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ Yes |
| Older commits | ❌ No |

---

## 🔒 Reporting a Vulnerability

**Please do NOT report security vulnerabilities in a public GitHub Issue.**

If you discover a security issue — especially one that could expose user data, allow unauthorized access, or put vulnerable users at risk — please report it privately:

**Email:** vathsa2004@gmail.com  
**Subject:** `[SECURITY] Pathway – <brief description>`

Include in your report:
- A clear description of the vulnerability
- Steps to reproduce it
- What data or users could be affected
- Any suggested fix (optional but appreciated)

I will respond within **72 hours** and work with you to resolve it responsibly before any public disclosure.

---

## 🛡️ Security Notes for This Project

- **Never commit `.env` files** — the `.gitignore` blocks this by default
- **API keys** must always go in `.env`, never hardcoded in source files
- **User data** (stories, mood logs, chat history) must be treated with extra care — many users share sensitive personal situations
- **Anonymous posts** must remain truly anonymous — do not log or expose IP addresses linked to anonymous content
- The Safety page contains crisis-related content — any change to helpline numbers or legal advice must be verified before merging

---

## 🙏 Thank You

Security researchers who responsibly disclose vulnerabilities help protect real people using this platform. Thank you for taking the time to report issues privately.
