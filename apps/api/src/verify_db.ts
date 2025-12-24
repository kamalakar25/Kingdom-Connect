import prisma from './config/database';
import fs from 'fs';

async function main() {
    try {
        await prisma.$connect();
        console.log('VERIFICATION_SUCCESS: Database connected successfully');
        process.exit(0);
    } catch (error: any) {
        console.log('VERIFICATION_FAILURE: Database connection failed (see db_err.txt)');
        fs.writeFileSync('db_err.txt', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}

main();
