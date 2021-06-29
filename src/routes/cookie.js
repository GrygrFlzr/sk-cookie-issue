/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
    return {
        headers: {
            'Set-Cookie': `blah=${JSON.stringify(new Date())}; HttpOnly`,
            'Location': '/',
        },
        status: 307,
    }
}