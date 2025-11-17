/**
 * Storage Service
 * Handles local database operations using SQLite
 */

import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';

let db = null;

/**
 * Get database instance
 */
const getDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('iriz.db');
  }
  return db;
};

/**
 * Initialize the database and create tables
 */
export const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    const database = await getDatabase();
    
    // Create captures table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS captures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imageUri TEXT,
        thumbnailUri TEXT,
        boxedImageUrl TEXT,
        text TEXT NOT NULL,
        confidence REAL,
        timestamp TEXT NOT NULL,
        language TEXT DEFAULT 'eng',
        orientation INTEGER DEFAULT 0,
        detections TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Migration: Add new columns if they don't exist (for existing databases)
    try {
      await database.execAsync(`
        ALTER TABLE captures ADD COLUMN boxedImageUrl TEXT;
      `);
      console.log('Added boxedImageUrl column');
    } catch (e) {
      // Column already exists, ignore error
    }
    
    try {
      await database.execAsync(`
        ALTER TABLE captures ADD COLUMN detections TEXT;
      `);
      console.log('Added detections column');
    } catch (e) {
      // Column already exists, ignore error
    }
    
    // Create indexes for better query performance
    await database.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON captures(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_confidence ON captures(confidence);
    `);
    
    // Ensure capture images directory exists
    const captureDir = `${FileSystem.documentDirectory}captures/`;
    const dirInfo = await FileSystem.getInfoAsync(captureDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(captureDir, { intermediates: true });
      console.log('Created captures directory');
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

/**
 * Save a capture to history
 * @param {Object} capture - Capture data
 * @param {string} capture.imageUri - Image URI (local saved file)
 * @param {string} capture.thumbnailUri - Thumbnail URI
 * @param {string} capture.boxedImageUrl - Cloudinary URL for boxed image
 * @param {string} capture.text - Extracted text
 * @param {number} capture.confidence - OCR confidence score
 * @param {string} capture.timestamp - ISO timestamp
 * @param {string} capture.language - Language code
 * @param {number} capture.orientation - Image orientation
 * @param {Array} capture.detections - Array of detection objects with cropped URLs
 * @returns {Promise<number>} - Inserted capture ID
 */
export const saveCapture = async (capture) => {
  try {
    console.log('Saving capture to database...');
    const database = await getDatabase();
    
    const { 
      imageUri, 
      thumbnailUri,
      boxedImageUrl,
      text, 
      confidence, 
      timestamp, 
      language, 
      orientation,
      detections 
    } = capture;
    
    // Validate required fields
    if (!text || !timestamp) {
      throw new Error('Text and timestamp are required');
    }
    
    // Serialize detections array to JSON string
    const detectionsJson = detections ? JSON.stringify(detections) : null;
    
    // Insert into database
    const result = await database.runAsync(
      `INSERT INTO captures (imageUri, thumbnailUri, boxedImageUrl, text, confidence, timestamp, language, orientation, detections) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imageUri || null, 
        thumbnailUri || null,
        boxedImageUrl || null,
        text, 
        confidence || 0, 
        timestamp, 
        language || 'eng', 
        orientation || 0,
        detectionsJson
      ]
    );
    
    console.log('Capture saved successfully with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Save capture error:', error);
    throw error;
  }
};

/**
 * Get all captures from history
 * @param {Object} options - Query options
 * @param {number} options.limit - Max number of results
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.orderBy - Order by field
 * @param {string} options.order - ASC or DESC
 * @returns {Promise<Array>} - Array of captures
 */
export const getAllCaptures = async (options = {}) => {
  try {
    const database = await getDatabase();
    const { limit, offset, orderBy = 'timestamp', order = 'DESC' } = options;
    
    let query = `SELECT * FROM captures ORDER BY ${orderBy} ${order}`;
    const params = [];
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    const captures = await database.getAllAsync(query, params);
    console.log(`Retrieved ${captures.length} captures from database`);
    return captures;
  } catch (error) {
    console.error('Get captures error:', error);
    throw error;
  }
};

/**
 * Search captures by text
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Matching captures
 */
export const searchCaptures = async (searchTerm) => {
  try {
    const database = await getDatabase();
    const captures = await database.getAllAsync(
      'SELECT * FROM captures WHERE text LIKE ? ORDER BY timestamp DESC',
      [`%${searchTerm}%`]
    );
    console.log(`Found ${captures.length} captures matching "${searchTerm}"`);
    return captures;
  } catch (error) {
    console.error('Search captures error:', error);
    throw error;
  }
};

/**
 * Filter captures by confidence
 * @param {number} minConfidence - Minimum confidence score
 * @returns {Promise<Array>} - Filtered captures
 */
export const filterByConfidence = async (minConfidence) => {
  try {
    const database = await getDatabase();
    const captures = await database.getAllAsync(
      'SELECT * FROM captures WHERE confidence >= ? ORDER BY timestamp DESC',
      [minConfidence]
    );
    console.log(`Found ${captures.length} captures with confidence >= ${minConfidence}`);
    return captures;
  } catch (error) {
    console.error('Filter captures error:', error);
    throw error;
  }
};

/**
 * Get captures by date range
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Promise<Array>} - Captures in date range
 */
export const getCapturesByDateRange = async (startDate, endDate) => {
  try {
    const database = await getDatabase();
    const captures = await database.getAllAsync(
      'SELECT * FROM captures WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
      [startDate, endDate]
    );
    console.log(`Found ${captures.length} captures between ${startDate} and ${endDate}`);
    return captures;
  } catch (error) {
    console.error('Get captures by date range error:', error);
    throw error;
  }
};

/**
 * Delete a capture by ID
 * @param {number} id - Capture ID
 * @returns {Promise<boolean>}
 */
export const deleteCapture = async (id) => {
  try {
    console.log('Deleting capture:', id);
    const database = await getDatabase();
    
    // Get capture to delete associated image
    const capture = await getCaptureById(id);
    if (capture && capture.imageUri) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(capture.imageUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(capture.imageUri, { idempotent: true });
          console.log('Deleted associated image:', capture.imageUri);
        }
      } catch (fileError) {
        console.warn('Could not delete image file:', fileError);
      }
    }
    
    // Delete from database
    await database.runAsync('DELETE FROM captures WHERE id = ?', [id]);
    console.log('Capture deleted successfully');
    return true;
  } catch (error) {
    console.error('Delete capture error:', error);
    throw error;
  }
};

/**
 * Clear all captures
 * @returns {Promise<boolean>}
 */
export const clearAllCaptures = async () => {
  try {
    console.log('Clearing all captures...');
    const database = await getDatabase();
    
    // Get all captures to delete images
    const captures = await getAllCaptures();
    for (const capture of captures) {
      if (capture.imageUri) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(capture.imageUri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(capture.imageUri, { idempotent: true });
          }
        } catch (fileError) {
          console.warn('Could not delete image file:', fileError);
        }
      }
    }
    
    // Clear database
    await database.runAsync('DELETE FROM captures');
    console.log('All captures cleared successfully');
    return true;
  } catch (error) {
    console.error('Clear captures error:', error);
    throw error;
  }
};

/**
 * Get capture by ID
 * @param {number} id - Capture ID
 * @returns {Promise<Object|null>}
 */
export const getCaptureById = async (id) => {
  try {
    const database = await getDatabase();
    const capture = await database.getFirstAsync(
      'SELECT * FROM captures WHERE id = ?',
      [id]
    );
    return capture || null;
  } catch (error) {
    console.error('Get capture error:', error);
    throw error;
  }
};

/**
 * Get database statistics
 * @returns {Promise<Object>} - Database stats
 */
export const getDatabaseStats = async () => {
  try {
    const database = await getDatabase();
    
    const totalResult = await database.getFirstAsync('SELECT COUNT(*) as total FROM captures');
    const avgConfidenceResult = await database.getFirstAsync('SELECT AVG(confidence) as avgConfidence FROM captures');
    const oldestResult = await database.getFirstAsync('SELECT MIN(timestamp) as oldest FROM captures');
    const newestResult = await database.getFirstAsync('SELECT MAX(timestamp) as newest FROM captures');
    
    return {
      totalCaptures: totalResult.total,
      averageConfidence: avgConfidenceResult.avgConfidence || 0,
      oldestCapture: oldestResult.oldest,
      newestCapture: newestResult.newest,
    };
  } catch (error) {
    console.error('Get database stats error:', error);
    throw error;
  }
};

/**
 * Export captures to JSON
 * @returns {Promise<string>} - JSON string of all captures
 */
export const exportCapturesToJSON = async () => {
  try {
    const captures = await getAllCaptures();
    return JSON.stringify(captures, null, 2);
  } catch (error) {
    console.error('Export captures error:', error);
    throw error;
  }
};
