export const config = {
    config: {
        user: process.env.DATABASE_USER || '',
        database: process.env.DATABASE_DB || '',
        password: process.env.DATABASE_PASSWORD || '',
        host: process.env.DATABASE_HOST || 'localhost',
        ssl: true
    },
    table: 'users'
}
