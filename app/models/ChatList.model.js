import mongoose, { Schema } from 'mongoose';

import { connectTODB } from '../../lib/conn';

connectTODB();

const ChatListSchema = new Schema(
  {
    responseText:{
      type:String,
      trim:true,
    },
    inputText:{
      type:String,
      trim:true,
    },
    lang: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports =
  mongoose.models.ChatLists || mongoose.model('ChatLists', ChatListSchema);
