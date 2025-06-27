import { h } from '@stencil/core';
import {
  DBExampleUniqueIdGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../utils/preview/preview-types';

interface FieldDefaultPropsType {
  associatedId: DBExampleUniqueIdGenerator;
}

const FieldDefaultProps: FieldDefaultPropsType = {
  associatedId: DefaultDBExampleGenerators.uniqueId,
};

const FieldDefault = (params: FieldDefaultPropsType) => {
  return (
    <br-field width="100%">
      <br-field-label associatedInputId={params?.associatedId.value()}>
        <span>Field label</span>
      </br-field-label>
      <br-input id={params?.associatedId.value()} width="100%" />
    </br-field>
  );
};

export const FieldDefaultPreview: DesignbaseComponentExample<FieldDefaultPropsType> = {
  name: 'Default',
  params: FieldDefaultProps,
  render: FieldDefault,
};
