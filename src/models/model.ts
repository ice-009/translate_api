import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation extends Document {
  sourceLanguage: string;
  destinationLanguage: string;
  query: string;
  translation: string;
}

const TranslationSchema = new Schema<ITranslation>({
  sourceLanguage: String,
  destinationLanguage: String,
  query: String,
  translation: String,
});

export default mongoose.model<ITranslation>('Translation', TranslationSchema);
