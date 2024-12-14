import { OperatorDocument } from '@common/models/operator.model';
import { Operator } from '@common/types/operator';

export const transformOperator = (operator: Operator): OperatorDocument => {
  const { ID, ...rest } = operator;
  return {
    ...rest,
    _id: ID
  };
};
