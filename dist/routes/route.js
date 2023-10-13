"use strict";
// src/routes/translate.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const model_1 = __importDefault(require("../models/model"));
const router = express_1.default.Router();
// Middleware to check the translation in the database
const checkDatabase = async (query, sourceLanguage, destinationLanguage) => {
    return model_1.default.findOne({ query, sourceLanguage, destinationLanguage });
};
router.get('/', async (req, res) => {
    const query = req.query.query;
    const source_language = req.query.source_language;
    const destination_language = req.query.destination_language;
    if (query && source_language && destination_language) {
        try {
            // Check if translation is available in the database
            const translation = await checkDatabase(query, source_language, destination_language);
            if (translation) {
                res.json({ translation: translation.translation });
            }
            else {
                // Use Google Translate API to fetch the translation
                const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source_language}&tl=${destination_language}&dt=t&q=${query}`;
                const response = await axios_1.default.get(googleTranslateUrl);
                const translatedText = response.data[0][0][0];
                // Save the translation in the database
                const newTranslation = new model_1.default({
                    query,
                    sourceLanguage: source_language,
                    destinationLanguage: destination_language,
                    translation: translatedText,
                });
                await newTranslation.save();
                res.json({ translation: translatedText });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }
    else {
        res.status(400).json({ error: 'Missing or invalid parameters' });
    }
});
router.get('/all', async (req, res) => {
    try {
        const allTranslations = await model_1.default.find();
        const translationsMap = {};
        allTranslations.forEach((translation) => {
            translationsMap[translation.query] = translation.translation;
        });
        res.json(translationsMap);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.default = router;
