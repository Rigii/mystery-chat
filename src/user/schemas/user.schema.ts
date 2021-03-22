import * as mongoose from 'mongoose';
import { USER_GENDER, USER_ROLE } from '../constants';
import { statusEnum } from '../enums/status.enum';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true }, // necessary field
  status: {
    type: String,
    enum: Object.values(statusEnum),
    default: statusEnum.pending,
  }, // is Object.values needed?
  avatar: { type: String, default: null }, // unnecessary field
  avatarId: { type: String, default: null }, //id файла для операций с удалением/обновлением...
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true }, //, enum: Object.values(USER_GENDER)
  address: {
    country: { type: String, default: null },
    city: { type: String, default: null },
    addressLine1: { type: String, default: null },
    addressLine2: { type: String, default: null },
  },
  profession: { type: String, default: null },
  phone: { type: String, default: null },
  roles: { type: [String], required: true, enum: Object.values(USER_ROLE) },
  password: { type: String, required: true },
});

UserSchema.index({ email: 1 }, { unique: true }); 
// индекс под которым хранится эта коллекция в базе (индекс - это кеширование). 
// Нужен для оптимизации поиска в коллекции. Под капотом вызывает метод монго, createIndex.
// Вместо того, чтобы просматривать все документы, mongo сохраняет отдельный индекс 
// для быстрого доступа, например. здесь, чтобы проверить, существуют ли уже такие же значения, 
// если вставлен новый документ. Индексирование в целом имеет ту же идею