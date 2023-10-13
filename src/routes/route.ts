
import express from 'express';
import axios from 'axios';
import TranslationModel, { ITranslation } from '../models/model';

const router = express.Router();

const checkDatabase = async (
  query: string,
  sourceLanguage: string,
  destinationLanguage: string
) => {
  return TranslationModel.findOne({ query, sourceLanguage, destinationLanguage });
};

router.get('/', async (req, res) => {
  const query: string | undefined = req.query.query as string | undefined;
  const source_language: string | undefined = req.query.source_language as string | undefined;
  const destination_language: string | undefined = req.query.destination_language as string | undefined;

  if (query && source_language && destination_language) {
    try {
      const translation = await checkDatabase(query, source_language, destination_language);

      if (translation) {
        res.json({ translation: translation.translation });
      } else {
       
        const googleTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source_language}&tl=${destination_language}&dt=t&q=${query}`;

        const response = await axios.get(googleTranslateUrl);
        const translatedText = response.data[0][0][0];

        // Save the translation in the database
        const newTranslation = new TranslationModel({
          query,
          sourceLanguage: source_language,
          destinationLanguage: destination_language,
          translation: translatedText,
        });
        await newTranslation.save();

        res.json({ translation: translatedText });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  } else {
    res.status(400).json({ error: 'Missing or invalid parameters' });
  }
});
router.get('/all', async (req, res) => {
  try {
    const allTranslations: ITranslation[] = await TranslationModel.find();
    const translationsMap: Record<string, string> = {};

    allTranslations.forEach((translation) => {
      translationsMap[translation.query] = translation.translation;
    });

    res.json(translationsMap);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

export default router;
