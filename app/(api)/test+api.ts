

export function GET(request: Request) {
  
    return new Response(JSON.stringify({data: {hello: "world"}}),{status: 200});
  }
  