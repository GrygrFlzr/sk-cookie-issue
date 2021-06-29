<script context="module">
	/** @type */
	export async function load({ fetch }) {
		// all of these are same origin
		const internal = await fetch('/api');
		const sameDomainPort = await fetch('http://localhost:3000/api');
		const sameDomainDifferentPort = await fetch('http://localhost:5000/api');

		return {
			props: {
				internal: await internal.json(),
				sameDomainPort: await sameDomainPort.json(),
				sameDomainDifferentPort: await sameDomainDifferentPort.json()
			}
		};
	}
</script>

<script>
	/** @typedef {{
	 *  headers: Record<string, string>
	 * }} ApiResponse */

	/** @type {ApiResponse} */
	export let internal;
	/** @type {ApiResponse} */
	export let sameDomainPort;
	/** @type {ApiResponse} */
	export let sameDomainDifferentPort;
</script>

<a href="/cookie">Change cookie</a>

<h1>Internal</h1>
<pre><code>{JSON.stringify(internal.headers, null, 2)}</code></pre>
<h1>Same Domain and Port</h1>
<pre><code>{JSON.stringify(sameDomainPort.headers, null, 2)}</code></pre>
<h1>Same Domain, Different port</h1>
<pre><code>{JSON.stringify(sameDomainDifferentPort.headers, null, 2)}</code></pre>
