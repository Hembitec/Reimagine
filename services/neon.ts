
import { Pool } from '@neondatabase/serverless';
import { Project, ChatMessage, GeneratedImage, SuggestedStyle } from '../types';
import { uploadBase64Image } from './storage';

// CONNECTION STRING (From your provided input)
const CONNECTION_STRING = 'postgresql://neondb_owner:npg_FRoED7ki8JsH@ep-little-term-a8tw14po-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

const pool = new Pool({ connectionString: CONNECTION_STRING });

/**
 * Saves a full project to the cloud.
 * 1. Uploads Base64 images to Firebase Storage.
 * 2. Saves metadata and URLs to Neon DB.
 */
export const saveProjectToCloud = async (project: Project, userId: string, userEmail: string): Promise<void> => {
  try {
    // --- STEP 1: UPLOAD IMAGES ---
    
    // A. Original Image
    let originalImageUrl = null;
    if (project.originalImage) {
      originalImageUrl = await uploadBase64Image(
        project.originalImage, 
        userId, 
        project.id, 
        'original.jpg'
      );
    }

    // B. Generated Images
    const updatedGeneratedImages: GeneratedImage[] = [];
    for (const img of project.generatedImages) {
      const cloudUrl = await uploadBase64Image(
        img.url,
        userId,
        project.id,
        `generated_${img.id}.jpg`
      );
      updatedGeneratedImages.push({ ...img, url: cloudUrl });
    }

    // --- STEP 2: SAVE TO NEON DB ---
    
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Upsert User
      await client.query(`
        INSERT INTO users (id, email) VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET email = $2
      `, [userId, userEmail]);

      // 2. Upsert Project
      await client.query(`
        INSERT INTO projects (id, user_id, name, mode, updated_at, image_count)
        VALUES ($1, $2, $3, $4, to_timestamp($5 / 1000.0), $6)
        ON CONFLICT (id) DO UPDATE SET 
          name = $3, 
          mode = $4, 
          updated_at = to_timestamp($5 / 1000.0),
          image_count = $6
      `, [
        project.id, 
        userId, 
        project.name, 
        project.mode, 
        Date.now(),
        project.imageCount
      ]);

      // 3. Sync Images (Delete old for this project, Insert new)
      await client.query('DELETE FROM images WHERE project_id = $1', [project.id]);
      
      // Insert Original
      if (originalImageUrl) {
        await client.query(`
          INSERT INTO images (id, project_id, url, type, created_at)
          VALUES ($1, $2, $3, 'original', NOW())
        `, [`orig_${project.id}`, project.id, originalImageUrl]);
      }

      // Insert Generated
      for (const img of updatedGeneratedImages) {
        await client.query(`
          INSERT INTO images (id, project_id, url, prompt, style_name, type, created_at)
          VALUES ($1, $2, $3, $4, $5, 'generated', to_timestamp($6 / 1000.0))
        `, [img.id, project.id, img.url, img.prompt, img.styleName, img.timestamp]);
      }

      // 4. Sync Chats
      await client.query('DELETE FROM chats WHERE project_id = $1', [project.id]);
      for (const msg of project.chatMessages) {
        await client.query(`
          INSERT INTO chats (id, project_id, role, content, timestamp)
          VALUES ($1, $2, $3, $4, $5)
        `, [`chat_${project.id}_${msg.timestamp}`, project.id, msg.role, msg.content, msg.timestamp]);
      }

      await client.query('COMMIT');

    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Failed to save project to cloud:", error);
    throw error;
  }
};

/**
 * Fetches all projects for a user from Neon DB.
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
  try {
    const client = await pool.connect();
    
    // Get Projects
    const projectsRes = await client.query(`
      SELECT id, name, mode, EXTRACT(EPOCH FROM updated_at) * 1000 as updated_at, image_count
      FROM projects 
      WHERE user_id = $1 
      ORDER BY updated_at DESC
    `, [userId]);
    
    const projects: Project[] = [];

    for (const row of projectsRes.rows) {
      const projectId = row.id;

      // Get Images
      const imagesRes = await client.query(`
        SELECT id, url, prompt, style_name, type, EXTRACT(EPOCH FROM created_at) * 1000 as timestamp
        FROM images 
        WHERE project_id = $1
      `, [projectId]);

      const originalImg = imagesRes.rows.find(r => r.type === 'original');
      const generatedImgs = imagesRes.rows
        .filter(r => r.type === 'generated')
        .map(r => ({
          id: r.id,
          url: r.url,
          prompt: r.prompt,
          styleName: r.style_name,
          timestamp: Number(r.timestamp)
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      // Get Chats
      const chatsRes = await client.query(`
        SELECT role, content, timestamp
        FROM chats 
        WHERE project_id = $1
        ORDER BY timestamp ASC
      `, [projectId]);

      const chatMessages: ChatMessage[] = chatsRes.rows.map(r => ({
        role: r.role as 'user' | 'model' | 'system',
        content: r.content,
        timestamp: Number(r.timestamp),
        type: 'text'
      }));

      projects.push({
        id: projectId,
        name: row.name,
        createdAt: Number(row.updated_at), // Using updated_at for sort
        updatedAt: Number(row.updated_at),
        mode: row.mode as any,
        originalImage: originalImg ? originalImg.url : null,
        generatedImages: generatedImgs,
        chatMessages: chatMessages,
        suggestedStyles: [], // Not persisting style suggestions for now
        imageCount: row.image_count || 1
      });
    }

    client.release();
    return projects;

  } catch (error) {
    console.error("Failed to load projects from cloud:", error);
    return [];
  }
};

export const deleteProjectFromCloud = async (projectId: string): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM projects WHERE id = $1', [projectId]);
    } finally {
        client.release();
    }
}
