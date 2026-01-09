import { GoogleGenerativeAI } from '@google/generative-ai';
import Word from '../models/Word.js';
import Topic from '../models/Topic.js';

/**
 * Process topic creation with AI-generated or manually provided words
 * @param {Object} data - The request data
 * @param {string} data.topic - Topic title
 * @param {string} data.entryMode - 'ai' or 'manual'
 * @param {string} data.comment - Optional context for AI (only used, not saved)
 * @param {Array<string>} data.words - Words array (for manual mode)
 * @param {string} userId - The user ID (owner)
 * @param {Object} userLanguages - User's languages
 * @param {string} userLanguages.mainLanguage - User's native language
 * @param {string} userLanguages.targetLanguage - Language being learned
 * @param {string} apiKey - User's Gemini API key
 * @returns {Promise<{topic: Object, words: Array}>}
 */
export async function saveTopic(data, userId, userLanguages, apiKey) {
    if (!apiKey) {
        throw new Error('API key is required. Please set your Gemini API key in your profile.');
    }

    const { topic, entryMode, comment, words } = data;
    const { mainLanguage, targetLanguage } = userLanguages;

    // Validate required fields
    if (!topic || !entryMode) {
        throw new Error('Topic and entryMode are required');
    }

    if (!mainLanguage || !targetLanguage) {
        throw new Error('User languages not set. Please configure your main and target languages in profile settings.');
    }

    let generatedWords = [];

    if (entryMode === 'manual') {
        if (!words || !Array.isArray(words) || words.length === 0) {
            throw new Error('Words array is required for manual mode');
        }
        generatedWords = await generateWordExplanations(words, mainLanguage, targetLanguage, apiKey);

    } else if (entryMode === 'ai') {
        generatedWords = await generateWordsFromTopic(topic, mainLanguage, targetLanguage, apiKey, comment || '');

    } else {
        throw new Error("Invalid entryMode. Must be 'manual' or 'ai'");
    }

    // Handle duplicate topic names
    const uniqueTitle = await getUniqueTopicTitle(topic, userId);

    // Create the topic
    const newTopic = new Topic({
        title: uniqueTitle,
        language: targetLanguage,
        owner: userId
    });

    const savedTopic = await newTopic.save();

    // Create Word documents for each generated word
    const wordDocuments = generatedWords.map(w => ({
        word: w.word,
        meaning: w.meaning,
        exampleSentence1: w.exampleSentence1,
        exampleWithGaps1: w.exampleWithGaps1,
        exampleSentence2: w.exampleSentence2,
        exampleWithGaps2: w.exampleWithGaps2,
        topic: savedTopic._id
    }));

    const savedWords = await Word.insertMany(wordDocuments);

    return {
        topic: savedTopic,
        words: savedWords
    };
}

/**
 * Get a unique topic title by appending a number if duplicates exist
 */
async function getUniqueTopicTitle(baseTitle, userId) {
    const existingTopic = await Topic.findOne({ title: baseTitle, owner: userId });

    if (!existingTopic) {
        return baseTitle;
    }

    // Find all topics with similar names
    const regex = new RegExp(`^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\d+)?$`);
    const similarTopics = await Topic.find({
        title: regex,
        owner: userId
    }).sort({ title: 1 });

    // Find the highest number
    let maxNumber = 0;
    similarTopics.forEach(t => {
        const match = t.title.match(/(\d+)$/);
        if (match) {
            maxNumber = Math.max(maxNumber, parseInt(match[1]));
        } else if (t.title === baseTitle) {
            maxNumber = Math.max(maxNumber, 0);
        }
    });

    return `${baseTitle} ${maxNumber + 1}`;
}
/**
 * Generate word explanations using Gemini AI
 */
async function generateWordExplanations(words, mainLanguage, targetLanguage, apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `You are a language learning assistant helping someone whose native language is ${mainLanguage} learn ${targetLanguage}.

For each of the following ${targetLanguage} words, provide:
1. A concise translation to ${mainLanguage}, or an explanation if no direct translation exists. If there are multiple valid translations, separate them with " / " (space-slash-space).
2. Two different example sentences in ${targetLanguage} showing natural usage
3. The same two sentences with the target word(s) replaced by gaps using "___". IMPORTANT: If a word is separable (like German separable verbs), use multiple "___" blanks to show where each part appears in the sentence.

Words to explain: ${words.join(', ')}

Format your response as a JSON array where each item has "word", "meaning", "exampleSentence1", "exampleWithGaps1", "exampleSentence2", and "exampleWithGaps2" fields.

Example for a regular word:
{
  "word": "beautiful",
  "meaning": "hermoso/a",
  "exampleSentence1": "The sunset is beautiful tonight.",
  "exampleWithGaps1": "The sunset is ___ tonight.",
  "exampleSentence2": "She wore a beautiful dress.",
  "exampleWithGaps2": "She wore a ___ dress."
}

Example for a separable word (German):
{
  "word": "aufstehen",
  "meaning": "to get up",
  "exampleSentence1": "Ich stehe jeden Tag um 7 Uhr auf.",
  "exampleWithGaps1": "Ich ___ jeden Tag um 7 Uhr ___.",
  "exampleSentence2": "Er steht immer früh auf.",
  "exampleWithGaps2": "Er ___ immer früh ___."
}

Provide ONLY the JSON array, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
}

/**
 * Generate vocabulary words based on a topic using Gemini AI
 */
async function generateWordsFromTopic(topic, mainLanguage, targetLanguage, apiKey, comment = '') {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const contextNote = comment ? `\nAdditional context: ${comment}` : '';
    const prompt = `You are a language learning assistant helping someone whose native language is ${mainLanguage} learn ${targetLanguage}.

Generate exactly 10 useful ${targetLanguage} vocabulary words related to the topic "${topic}".${contextNote}

For each word, provide:
1. A concise translation to ${mainLanguage}, or an explanation if no direct translation exists. If there are multiple valid translations, separate them with " / " (space-slash-space).
2. Two different example sentences in ${targetLanguage} showing natural usage
3. The same two sentences with the target word(s) replaced by gaps using "___". IMPORTANT: If a word is separable (like German separable verbs), use multiple "___" blanks to show where each part appears in the sentence.

Format your response as a JSON array with exactly 10 words. Each item should have "word", "meaning", "exampleSentence1", "exampleWithGaps1", "exampleSentence2", and "exampleWithGaps2" fields.

Example for a regular word:
{
  "word": "beautiful",
  "meaning": "hermoso/a",
  "exampleSentence1": "The sunset is beautiful tonight.",
  "exampleWithGaps1": "The sunset is ___ tonight.",
  "exampleSentence2": "She wore a beautiful dress.",
  "exampleWithGaps2": "She wore a ___ dress."
}

Example for a separable word (German):
{
  "word": "aufstehen",
  "meaning": "to get up",
  "exampleSentence1": "Ich stehe jeden Tag um 7 Uhr auf.",
  "exampleWithGaps1": "Ich ___ jeden Tag um 7 Uhr ___.",
  "exampleSentence2": "Er steht immer früh auf.",
  "exampleWithGaps2": "Er ___ immer früh ___."
}

Provide ONLY the JSON array with exactly 10 words, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
}
