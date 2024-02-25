export async function GET(request) {

    const users = [{ name: "John Doe" }];

    return new Response(JSON.stringify(users), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}