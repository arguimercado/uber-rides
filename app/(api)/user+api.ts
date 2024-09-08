import { neon } from '@neondatabase/serverless';

export async function  POST(request: Request) {
    
    try {
        
        const sql = neon('postgresql://ride_db_owner:Pg2NrYUS3lsz@ep-morning-cake-a1rue3r5.ap-southeast-1.aws.neon.tech/ride_db?sslmode=require');
        const {name,email,clerkId} = await request.json();
      
    
        if(!name || !email || !clerkId ) {
            return Response.json({
                error: 'Missing required fields',
                status: 400
            });
        }
        const strSql = `INSERT INTO users (
                name, 
                email, 
                clerk_id
            ) 
            VALUES (
                '${name}', 
                '${email}',
                '${clerkId}'
            );`
            
        const response = await sql(strSql);
    
        return new Response(JSON.stringify({data: response}),{status: 201})
    }
    catch(error) {
        console.log(error);
        return Response.json({error: error},{status: 500})
    }
}