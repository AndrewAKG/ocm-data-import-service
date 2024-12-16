import { Operator } from '@common/types/operator';
import { AddressInfoSchema } from './address-info.model'; // Import AddressInfoSchema
import mongoose, { Schema } from 'mongoose';
import { DocumentId } from '@common/types/mongo';

export type OperatorDocument = Omit<Operator, 'ID'> & DocumentId;

export const OperatorSchema: Schema<OperatorDocument> = new Schema<OperatorDocument>({
  _id: Number,
  Title: { type: String, required: true },
  WebsiteURL: { type: String, required: true },
  Comments: { type: String, required: false, default: null },
  PhonePrimaryContact: { type: String, required: false, default: null },
  PhoneSecondaryContact: { type: String, required: false, default: null },
  IsPrivateIndividual: { type: Boolean, required: true },
  AddressInfo: { type: AddressInfoSchema, required: false, default: null },
  BookingURL: { type: String, required: false },
  ContactEmail: { type: String, required: false },
  FaultReportEmail: { type: String, required: false },
  IsRestrictedEdit: { type: Boolean, required: true }
});

export const OperatorModel = mongoose.model<OperatorDocument>('Operator', OperatorSchema);
