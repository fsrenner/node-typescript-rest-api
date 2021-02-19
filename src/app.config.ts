export class AppConfig {
    public static readonly port: number = Number(process.env.PORT) || 3000;
    public static readonly host: string = process.env.HOST || 'localhost';
}