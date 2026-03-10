import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'node:dns/promises';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export const collections = {
    PRODUCTS: 'products',
};

let client;
let clientPromise;

const getConnectionDetails = () => {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!uri) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    if (!dbName) {
        throw new Error('Please define the DB_NAME environment variable inside .env.local');
    }

    return { uri, dbName };
};

const initializeClient = () => {
    const { uri } = getConnectionDetails();
    
    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                }
            });
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        clientPromise = client.connect();
    }
    
    return clientPromise;
};

export const dbConnect = async (cname) => {
    try {
        const { dbName } = getConnectionDetails();
        
        if (!clientPromise) {
            clientPromise = initializeClient();
        }
        
        const client = await clientPromise;
        return client.db(dbName).collection(cname);
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export default clientPromise;