import { Schema } from 'mongoose';
import { AddressInfo } from '../types/address-info';

export const AddressInfoSchema: Schema = new Schema<AddressInfo>(
  {
    AddressLine1: { type: String, required: true },
    AddressLine2: { type: String, default: null },
    Town: { type: String, required: true },
    StateOrProvince: { type: String, required: true, index: true },
    Postcode: { type: String, required: true },
    CountryID: { type: Number, required: true },
    Latitude: { type: Number, required: true, index: true },
    Longitude: { type: Number, required: true, index: true },
    ContactTelephone1: { type: String, default: null },
    ContactTelephone2: { type: String, default: null },
    ContactEmail: { type: String, required: true },
    AccessComments: { type: String, required: true },
    RelatedURL: { type: String, default: null },
    Distance: { type: Number, default: null },
    DistanceUnit: { type: Number, required: true },
    Title: { type: String, required: true }
  },
  { _id: false }
);
