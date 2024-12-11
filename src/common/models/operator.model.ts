import { Operator } from '@common/types/operator';
import { AddressInfoSchema } from './address-info.model'; // Import AddressInfoSchema
import mongoose, { Schema, Document } from 'mongoose';

export type OperatorDocument = Operator & Document;

const OperatorSchema: Schema<OperatorDocument> = new Schema<OperatorDocument>({
  _id: Number,
  Title: { type: String, required: true },
  WebsiteURL: { type: String, required: true },
  Comments: { type: String, required: false, default: null },
  PhonePrimaryContact: { type: String, required: false, default: null },
  PhoneSecondaryContact: { type: String, required: false, default: null },
  IsPrivateIndividual: { type: Boolean, required: true },
  AddressInfo: { type: AddressInfoSchema, required: true },
  BookingURL: { type: String, required: true },
  ContactEmail: { type: String, required: true },
  FaultReportEmail: { type: String, required: true },
  IsRestrictedEdit: { type: Boolean, required: true }
});

export const OperatorModel = mongoose.model<OperatorDocument>('Operator', OperatorSchema);
