# SvelteKit Same-origin Cookie Problem

## Reproduction

```bash
pnpm i
pnpm dev
```

Visit http://localhost:3000 and click `Change cookie`.

## The Issue

Currently, all absolute fetch requests are treated as cross-origin, and cookies are not passed through. This does not adequately cover the three main cases of same-origin sites where cookies are shared:
- Different port on the same domain, e.g. `localhost:3000` and `localhost:5000`
- Subdomains, e.g. `api.domain.com` and `domain.com`
- The same domain and port, but specified as an absolute path to satisfy some library (e.g. Apollo, which sucks)

However, this is not a trivial fix:
- Passing in cookies for all external requests would lead to indiscriminately sending cookies to cross-origin domains, which is wasted bandwidth at best and a security violation at worst.
- **Browsers do not send the domain associated with cookies**. A SvelteKit server hosted at `sub.domain.com` can receive cookies from `domain.com` OR `sub.domain.com` and cannot distinguish the two.

The lack of domain information presents various issues and limitations for potential solutions.

**[Loose]** If we assume that received cookies all belong to the second-level domain:
- We must identify what a "second-level domain" actually is (e.g. `domain.co.uk` exists, so we cannot blindly assume the level of the domain based on the number of separators)
- This is a security issue for subdomains that are shared with others, as is common in shared hosting (e.g. vercel, github pages, js.org) as it can happily send *all* `vercel.app` cookies to `malicious.vercel.app`
- This assumption is invalid for any pages hosted on direct IP addresses (eg. https://1.1.1.1 from Cloudflare)

**[Strict]** If we pick the strictest domain and assume received cookies belong to the current domain of the application:
- A SvelteKit app hosted at `sub.domain.com` would have to assume `domain.com` cookies as `sub.domain.com` cookies, and so `api.domain.com` would not be eligible to receive the cookies from server-side fetch using this algorithm, despite the fact that they would normally be passed by the browser clientside.
- The above behavior would require extensive documentation, as it would be a difference between the client and the server fetch.

The above also assumes we can adequately identify the current host. The `Host` HTTP header can be manipulated by the client, which seems questionable. A configurable setting may lead unaware devs to emulate the loose mode to "make things work" and turn the feature into a footgun.