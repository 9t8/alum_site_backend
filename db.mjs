import connect from '@databases/sqlite-sync';

export const db = connect(process.env.DB_PATH);
