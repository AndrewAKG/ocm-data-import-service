import { CountryDocument } from '@common/models/country.model';
import { Country } from '@common/types/country';

export const transformCountry = (country: Country): CountryDocument => {
  const { ID, ...rest } = country;
  return {
    ...rest,
    _id: ID
  };
};
