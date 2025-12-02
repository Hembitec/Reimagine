import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ChatMessage, AppMode, SuggestedStyle } from "../types";

// Ensure API key is present
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'MISSING_KEY' });

/**
 * Analyzes a product image and suggests 3 distinct photography styles.
 * Uses 'gemini-2.5-flash'.
 */
export const analyzeProduct = async (base64Image: string): Promise<SuggestedStyle[]> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      You are a world-class Creative Director and Product Photographer.
      Analyze the attached product image (material, color, shape, vibe).
      
      Based on your analysis, suggest 3 DISTINCT, high-quality advertising photography styles that would best sell this specific product.
      
      1. Style 1: Safe/Commercial (Clean, professional)
      2. Style 2: Contextual/Lifestyle (In use or in environment)
      3. Style 3: Creative/Artistic (Bold colors, dramatic lighting, or unique props)

      Return the response in JSON format with this schema:
      [
        {
          "label": "Short Title (e.g. 'Minimalist Studio')",
          "description": "One sentence explaining why this fits.",
          "prompt": "A highly detailed image generation prompt describing the background, lighting, and mood. Do not describe the product itself, only the scene around it.",
          "color": "A tailwind gradient class string (e.g. 'from-blue-500 to-purple-500') representing the mood."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              description: { type: Type.STRING },
              prompt: { type: Type.STRING },
              color: { type: Type.STRING }
            },
            required: ["label", "description", "prompt", "color"]
          }
        }
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No JSON response from analysis");

    const suggestions = JSON.parse(jsonText);
    return suggestions.map((s: any, index: number) => ({
      id: `suggested-prod-${index}-${Date.now()}`,
      ...s
    }));

  } catch (error) {
    console.error("Error analyzing product:", error);
    return [
      { id: 'err1', label: 'Studio Clean', description: 'A safe, professional look.', prompt: 'Professional studio photography, soft lighting, clean grey background', color: 'from-gray-200 to-gray-400' },
      { id: 'err2', label: 'Warm Lifestyle', description: 'Cozy and inviting.', prompt: 'Warm wooden table, sunlight streaming in, cozy atmosphere', color: 'from-orange-200 to-amber-200' },
      { id: 'err3', label: 'Bold Pop', description: 'Stand out with color.', prompt: 'Bright colorful background, pop art style, hard shadows', color: 'from-pink-400 to-purple-400' }
    ];
  }
};

/**
 * Analyzes a room image and suggests 3 distinct interior design renovations.
 * Uses 'gemini-2.5-flash'.
 */
export const analyzeRoom = async (base64Image: string): Promise<SuggestedStyle[]> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const prompt = `
      You are a Senior Interior Architect and Designer.
      Analyze the attached room photo. Identify the room type (e.g. Kitchen, Bedroom), the architectural features (windows, ceiling height, floor material), and the lighting.
      
      Based on the EXISTING GEOMETRY, suggest 3 distinct redesign styles that would work perfectly for this specific space.
      
      1. Style 1: A refreshing update that respects the current structure (e.g. Modern, Scandi).
      2. Style 2: A bold contrast to the current look (e.g. Industrial if currently plain, or Colorful if currently beige).
      3. Style 3: A luxury/high-end interpretation of the space.

      Return the response in JSON format with this schema:
      [
        {
          "label": "Short Title (e.g. 'Japandi Zen')",
          "description": "Why this fits the room's architecture.",
          "prompt": "A specific interior design prompt describing the style, materials, colors, and mood.",
          "color": "A tailwind gradient class string (e.g. 'from-stone-500 to-stone-300') representing the mood."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              description: { type: Type.STRING },
              prompt: { type: Type.STRING },
              color: { type: Type.STRING }
            },
            required: ["label", "description", "prompt", "color"]
          }
        }
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No JSON response from analysis");

    const suggestions = JSON.parse(jsonText);
    return suggestions.map((s: any, index: number) => ({
      id: `suggested-room-${index}-${Date.now()}`,
      ...s
    }));

  } catch (error) {
    console.error("Error analyzing room:", error);
    return [
      { id: 'err1', label: 'Modern Refresh', description: 'Clean lines for this space.', prompt: 'Modern interior design, bright, white walls, oak floor, minimal furniture', color: 'from-blue-500 to-cyan-400' },
      { id: 'err2', label: 'Industrial Loft', description: 'Leverage the structure.', prompt: 'Industrial style, exposed raw materials, metal accents, leather furniture', color: 'from-gray-600 to-gray-400' },
      { id: 'err3', label: 'Cozy Sanctuary', description: 'Warm and inviting.', prompt: 'Warm cozy interior, soft textiles, warm lighting, plants, beige tones', color: 'from-orange-500 to-amber-400' }
    ];
  }
};

/**
 * Generates a new design based on an input image, prompt, and active mode.
 * Uses 'gemini-2.5-flash-image' (Nano Banana).
 */
export const generateDesign = async (
  base64Image: string,
  prompt: string,
  mode: AppMode
): Promise<string> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    let enhancedPrompt = '';

    if (mode === 'interior') {
        enhancedPrompt = `
**Overview:**
You are an expert AI Interior Designer and Architect. The user has provided a photo of a room and wants to see it redesigned in a specific style.

**Role:**
Act as a professional interior designer visualizing a renovation for a client. Your goal is to produce a photorealistic image that strictly adheres to the structural constraints of the original photo while completely transforming the aesthetic.

**Structure:**
1. Analyze the input image to understand the geometry (walls, ceiling, floor, windows, doors).
2. Identify the user's requested style: "${prompt}".
3. Replace furniture, decor, colors, and materials to match this style.
4. Generate the final photorealistic output.

**Desired Actions:**
- Maintain the exact perspective and camera angle of the original image.
- Keep structural elements (windows, doors, fireplaces) in their original positions.
- Apply high-quality textures and realistic lighting appropriate for the style.
- Furnish the room naturally; do not leave it empty unless requested.

**Rules:**
- The room layout must remain unchanged.
- Lighting must follow the logic of the original scene (e.g., light coming from windows).

**IMPORTANT RULES (DO NOT IGNORE):**
- **PRESERVE GEOMETRY:** Do not warp walls or change the room's shape.
- **NO HALLUCINATIONS:** DO NOT put the room underwater. DO NOT add water unless it's a bathroom with a visible tub/sink. DO NOT make the room look abandoned.
- **REALISM:** The image must look like a photograph, not a sketch or a cartoon.

**Expected Output:**
- An 8k resolution, highly detailed, photorealistic interior design photograph.

**Do Not:**
- Do not change the view outside the windows significantly if visible.
- Do not add people or animals to the scene.
        `;
    } else {
        // Product Photography Mode
        enhancedPrompt = `
**Overview:**
You are an expert Product Photographer and Digital Artist. The user has provided a product image and needs it placed in a specific setting for marketing purposes.

**Role:**
Act as a commercial photographer creating high-end advertising assets. Your goal is to place the product naturally into a new environment without altering the product itself.

**Structure:**
1. Identify the main product object in the input image.
2. Mask out the product precisely.
3. Generate a new background based on the description: "${prompt}".
4. Composite the product into the scene with correct perspective, lighting, and shadows.

**Desired Actions:**
- Ensure the product is the clear focal point.
- Create realistic contact shadows where the product touches the surface.
- Match the lighting on the product to the new background environment.

**Rules:**
- The product must be placed on a surface (table, floor, podium) unless the prompt specifies floating.
- The background should be high-quality but not distract from the product.

**IMPORTANT RULES (DO NOT IGNORE):**
- **PRESERVE IDENTITY:** The product's shape, logo, text, and colors MUST remain 100% identical to the source image. Do not warp or distort it.
- **NO COMPETITORS:** Do not add other brand products to the scene.
- **SCALE:** Ensure the product scale is realistic relative to the background elements.

**Expected Output:**
- A professional, commercial-grade product photography shot suitable for advertising.

**Do Not:**
- Do not cut off parts of the product.
- Do not add random text or watermarks.
        `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating design:", error);
    throw error;
  }
};

/**
 * Chat with the expert.
 * Uses 'gemini-3-pro-preview' and supports multimodal input (images).
 */
export const chatWithExpert = async (
  history: ChatMessage[],
  newMessage: string,
  mode: AppMode,
  currentImage?: string | null // Optional current image context
): Promise<string> => {
  try {
    // Convert simple history to GenAI content format
    const chatHistory = history
      .filter(msg => msg.role !== 'system' && msg.type === 'text')
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));
    
    const systemInstruction = mode === 'interior' 
        ? `
**Overview:**
You are a world-class Interior Design Consultant acting as a helpful AI assistant. The user will show you an image of their room.

**Role:**
Your role is to guide users in redesigning their spaces, offer professional decorating advice, and suggest specific styles or improvements based on what you SEE in the image.

**Desired Actions:**
- Analyze the provided image deeply. If the user asks "What style is this?", look at the furniture and architecture to answer.
- Offer creative, practical design solutions.
- Suggest specific colors, materials, and furniture arrangements that fit the room's layout.
- **CRITICAL:** If you suggest a specific visual style or change, provide it as a clickable action using this format: \`[VISUALIZE: Style Name]\`.
  - Example: "You should try a [VISUALIZE: Modern Minimalist] look."
  - Example: "How about adding [VISUALIZE: Emerald Green Velvet Sofa]?"

**Rules:**
- Be encouraging, professional, and concise.
- Focus on interior design topics.
- Use the \`[VISUALIZE: ...]\` tag whenever suggesting a visual change.

**Do Not:**
- Do not give advice on structural engineering or construction safety.
`
        : `
**Overview:**
You are a professional Product Photographer and Creative Director acting as a helpful AI assistant. The user will show you a product image.

**Role:**
Your role is to help users create stunning marketing assets for their products by advising on composition, lighting, and background styles based on the product's visual characteristics.

**Desired Actions:**
- Analyze the product image. Identify materials, colors, and shape.
- Advise on photography techniques (lighting, angles, composition) that suit THIS product.
- Suggest background styles that complement the specific product.
- **CRITICAL:** If you suggest a specific visual style or background, provide it as a clickable action using this format: \`[VISUALIZE: Style Name]\`.
  - Example: "This would look great on a [VISUALIZE: Marble Podium with Sunlight]."
  - Example: "Try a [VISUALIZE: Dark Moody Studio] setting."

**Rules:**
- Be professional, artistic, and marketing-focused.
- Use the \`[VISUALIZE: ...]\` tag whenever suggesting a visual style.

**Do Not:**
- Do not give legal advice on trademarks or copyright.
`;

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: chatHistory,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const parts: any[] = [{ text: newMessage }];

    if (currentImage) {
        const cleanBase64 = currentImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        parts.push({
            inlineData: {
                data: cleanBase64,
                mimeType: 'image/jpeg',
            }
        });
        // Add a text hint to the model that this is the image being discussed
        parts.push({ text: "\n[System Note: The user has attached the current view of the image/design for context.]" });
    }

    // Fixed: Wrap message parts in an object
    const result = await chat.sendMessage({ message: parts });
    return result.text || "I'm sorry, I couldn't generate a response.";

  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};
