exports.handler = async (event) => {
    const html = `
    <html>
    <head><title>Terrys API</title></head>
    <body><h1>This is using API Gateway and Lambda! This destroys itself at 8pmEST and builds again 6amEST</h1></body>
    </html>`;
        
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: html,
    };
};
