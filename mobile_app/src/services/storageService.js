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

/**
 * Get daily capture counts for the last n days
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} - Array of { date, count }
 */
export const getDailyCaptureCounts = async (days = 7) => {
  try {
    const database = await getDatabase();
    // SQLite strftime to group by day
    const query = `
      SELECT strftime('%Y-%m-%d', timestamp) as date, COUNT(*) as count 
      FROM captures 
      WHERE timestamp >= date('now', '-${days} days')
      GROUP BY date
      ORDER BY date ASC
    `;
    const results = await database.getAllAsync(query);
    return results;
  } catch (error) {
    console.error('Get daily stats error:', error);
    // Fallback for testing if date function fails or returns empty
    return [];
  }
};

/**
 * Get language distribution
 * @returns {Promise<Array>} - Array of { language, count }
 */
export const getLanguageDistribution = async () => {
  try {
    const database = await getDatabase();
    const query = `
      SELECT language, COUNT(*) as count 
      FROM captures 
      GROUP BY language
      ORDER BY count DESC
    `;
    const results = await database.getAllAsync(query);
    return results;
  } catch (error) {
    console.error('Get language stats error:', error);
    return [];
  }
};

/**
 * Get scans by time of day
 * @returns {Promise<Array>} - Array of { period, count }
 */
export const getScansByTimeOfDay = async () => {
  try {
    const database = await getDatabase();
    // Extract hour from timestamp (ISO format YYYY-MM-DDTHH:MM:SS.sssZ)
    // We'll use SQLite's strftime('%H', timestamp)
    const query = `
      SELECT strftime('%H', timestamp) as hour, COUNT(*) as count 
      FROM captures 
      GROUP BY hour
    `;
    const results = await database.getAllAsync(query);
    
    // Process results into periods
    const periods = {
      'Morning': 0,   // 6-11
      'Afternoon': 0, // 12-17
      'Evening': 0,   // 18-23
      'Night': 0      // 0-5
    };
    
    results.forEach(row => {
      const hour = parseInt(row.hour, 10);
      if (hour >= 6 && hour < 12) periods['Morning'] += row.count;
      else if (hour >= 12 && hour < 18) periods['Afternoon'] += row.count;
      else if (hour >= 18 && hour <= 23) periods['Evening'] += row.count;
      else periods['Night'] += row.count;
    });
    
    return Object.keys(periods).map(key => ({
      period: key,
      count: periods[key]
    }));
  } catch (error) {
    console.error('Get time of day stats error:', error);
    return [];
  }
};

/**
 * Get confidence distribution
 * @returns {Promise<Array>} - Array of { range, count }
 */
export const getConfidenceDistribution = async () => {
  try {
    const database = await getDatabase();
    // Group by ranges: 0-50, 50-75, 75-90, 90-100
    const query = `
      SELECT 
        CASE 
          WHEN confidence >= 90 THEN 'Excellent (90-100%)'
          WHEN confidence >= 75 THEN 'Good (75-89%)'
          WHEN confidence >= 50 THEN 'Fair (50-74%)'
          ELSE 'Poor (<50%)'
        END as range,
        COUNT(*) as count
      FROM captures
      GROUP BY range
      ORDER BY min(confidence) DESC
    `;
    const results = await database.getAllAsync(query);
    return results;
  } catch (error) {
    console.error('Get confidence stats error:', error);
    return [];
  }
};

/**
 * Seed database with dummy data
 * @returns {Promise<void>}
 */
export const seedDatabase = async () => {
  try {
    console.log('Seeding database with dummy data...');
    const database = await getDatabase();
    
    const languages = ['eng', 'spa', 'fra', 'deu', 'jpn'];
    const texts = [
      'WARNING: HIGH VOLTAGE',
      'No Parking Anytime',
      'Restaurant Open 24/7',
      'Speed Limit 50',
      'Construction Ahead',
      'Welcome to City Center',
      'Exit 24B',
      'Bus Stop',
      'Coffee Shop',
      'Library Entrance'
    ];

    // Generate 20 records
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30); // Random date in last 30 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      // Random time
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
      
      const confidence = 40 + Math.random() * 60; // Random confidence 40-100
      const text = texts[Math.floor(Math.random() * texts.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];
      
      await database.runAsync(
        `INSERT INTO captures (text, confidence, timestamp, language, orientation, detections) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          text,
          confidence,
          date.toISOString(),
          language,
          0,
          JSON.stringify([]) // Empty detections for dummy data
        ]
      );
    }
    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Seed database error:', error);
    throw error;
  }
};

/**
 * Get captures by confidence range
 * @param {number} min - Minimum confidence
 * @param {number} max - Maximum confidence
 * @returns {Promise<Array>} - Captures in range
 */
export const getCapturesByConfidenceRange = async (min, max) => {
  try {
    const database = await getDatabase();
    const captures = await database.getAllAsync(
      'SELECT * FROM captures WHERE confidence >= ? AND confidence < ? ORDER BY timestamp DESC',
      [min, max]
    );
    return captures;
  } catch (error) {
    console.error('Get captures by confidence range error:', error);
    throw error;
  }
};

/**
 * Get captures by time of day period
 * @param {string} period - 'Morning', 'Afternoon', 'Evening', 'Night'
 * @returns {Promise<Array>} - Captures in period
 */
export const getCapturesByTimeOfDay = async (period) => {
  try {
    const database = await getDatabase();
    let hourCondition = '';
    
    switch(period) {
      case 'Morning': // 6-11
        hourCondition = "CAST(strftime('%H', timestamp) AS INTEGER) >= 6 AND CAST(strftime('%H', timestamp) AS INTEGER) < 12";
        break;
      case 'Afternoon': // 12-17
        hourCondition = "CAST(strftime('%H', timestamp) AS INTEGER) >= 12 AND CAST(strftime('%H', timestamp) AS INTEGER) < 18";
        break;
      case 'Evening': // 18-23
        hourCondition = "CAST(strftime('%H', timestamp) AS INTEGER) >= 18 AND CAST(strftime('%H', timestamp) AS INTEGER) <= 23";
        break;
      case 'Night': // 0-5
        hourCondition = "CAST(strftime('%H', timestamp) AS INTEGER) >= 0 AND CAST(strftime('%H', timestamp) AS INTEGER) < 6";
        break;
      default:
        return [];
    }
    
    const query = `SELECT * FROM captures WHERE ${hourCondition} ORDER BY timestamp DESC`;
    const captures = await database.getAllAsync(query);
    return captures;
  } catch (error) {
    console.error('Get captures by time of day error:', error);
    throw error;
  }
};

/**
 * Alias for getScansByTimeOfDay to match component usage
 */
export const getPeakScanningTimes = getScansByTimeOfDay;
