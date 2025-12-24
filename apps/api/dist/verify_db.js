"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const fs_1 = __importDefault(require("fs"));
async function main() {
    try {
        await database_1.default.$connect();
        console.log('VERIFICATION_SUCCESS: Database connected successfully');
        process.exit(0);
    }
    catch (error) {
        console.log('VERIFICATION_FAILURE: Database connection failed (see db_err.txt)');
        fs_1.default.writeFileSync('db_err.txt', JSON.stringify(error, null, 2));
        process.exit(1);
    }
}
main();
