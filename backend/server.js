const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

// Get MongoDB URI from environment variables
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

const dbName = 'passmanager';
const collectionName = 'passwords';

const app = express()
const port = process.env.PORT || 3000;

// Configure CORS with specific origins
const allowedOrigins = [
    'http://localhost:5173',  // Vite default dev server
    'http://localhost:3000',  // Common React dev server
    'https://your-vercel-app.vercel.app'  // Your Vercel frontend URL
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS with options
app.use(cors(corsOptions));
app.use(bodyparser.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

// Connect to MongoDB
let db, collection;

async function getCollection() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    if (!db) {
        db = client.db(dbName);
    }
    if (!collection) {
        collection = db.collection(collectionName);
        // Create an index on the id field
        try {
            await collection.createIndex({ id: 1 }, { unique: true });
            console.log('Created index on id field');
        } catch (error) {
            if (error.codeName !== 'IndexOptionsConflict') {
                console.error('Error creating index:', error);
                throw error;
            }
            // Index already exists, which is fine
        }
    }
    return collection;
}

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        await getCollection(); // Initialize collection
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// Initialize connection
connectToMongo();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', dbStatus: client.topology.isConnected() ? 'connected' : 'disconnected' });
});

// Get all passwords
app.get('/', async (req, res) => {
    try {
        const collection = await getCollection();
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ error: 'Failed to fetch passwords', details: error.message });
    }
});

// Save a Password
app.post('/', async (req, res) => {
    try {
        const password = req.body;
        console.log('Saving password:', { ...password, password: '***' });
        
        if (!password.site || !password.username || !password.password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const collection = await getCollection();
        const result = await collection.insertOne({
            ...password,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('Saved document ID:', result.insertedId);
        res.status(201).json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error saving password:', error);
        res.status(500).json({ success: false, error: 'Failed to save password', details: error.message });
    }
});

// Delete the password
app.delete('/', async (req, res) => {
    try {
        const collection = await getCollection();
        const { id } = req.body;
        console.log('Deleting password with id:', id);
        
        if (!id) {
            return res.status(400).json({ success: false, error: 'Missing id in request' });
        }
        
        const result = await collection.deleteOne({ id });
        console.log('Delete result:', result);
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Password not found' });
        }
        
        res.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ error: 'Failed to delete password', details: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Connected to database: ${dbName}`);
});

// Handle process termination
process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await client.close();
    process.exit(0);
});
