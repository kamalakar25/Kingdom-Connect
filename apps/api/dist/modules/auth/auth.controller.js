"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const AuthService = __importStar(require("./auth.service"));
const api_utils_1 = require("../../utils/api.utils");
const register = async (req, res) => {
    const { email, password, locale } = req.body;
    const result = await AuthService.register(email, password, locale);
    return api_utils_1.ApiResponse.success(res, result, 'User registered successfully', 201);
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    return api_utils_1.ApiResponse.success(res, result, 'Login successful');
};
exports.login = login;
const me = (req, res) => {
    // @ts-ignore
    return api_utils_1.ApiResponse.success(res, req.user);
};
exports.me = me;
