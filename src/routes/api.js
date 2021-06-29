/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ headers }) {
    return {
        body: { headers }
    }
}