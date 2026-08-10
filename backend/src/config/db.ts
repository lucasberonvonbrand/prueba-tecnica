import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://root:secret@localhost:27017?authSource=admin';
const dbName = process.env.MONGO_DB_NAME || 'gestor_articulos';

class DatabaseConfig {
  private static instance: DatabaseConfig;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(uri);
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async connect(): Promise<Db> {
    if (!this.db) {
      for (let i = 0; i < 10; i++) {
        try {
          await this.client.connect();
          this.db = this.client.db(dbName);
          console.log(`Conectado exitosamente a MongoDB: ${dbName}`);
          return this.db;
        } catch (error: any) {
          console.error(`Error conectando a MongoDB (intento ${i+1}/10):`, error.message);
          // Esperamos 2 segundos antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      console.error('No se pudo conectar a MongoDB después de múltiples intentos.');
      process.exit(1);
    }
    return this.db;
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('La base de datos no está inicializada. Llama a connect() primero.');
    }
    return this.db;
  }
}

export const dbConfig = DatabaseConfig.getInstance();
