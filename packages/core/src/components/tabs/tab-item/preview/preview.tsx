import { h } from '@stencil/core';
import {
  DBExampleStringGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../../utils/preview/preview-types';

interface TabItemDefaultPropsType {
  tab1: DBExampleStringGenerator;
  tab2: DBExampleStringGenerator;
  tab3: DBExampleStringGenerator;
}

const TabItemDefaultProps: TabItemDefaultPropsType = {
  tab1: DefaultDBExampleGenerators.string,
  tab2: DefaultDBExampleGenerators.string,
  tab3: DefaultDBExampleGenerators.string,
};

const TabItemDefault = (params: TabItemDefaultPropsType) => {
  const tab1ID = params.tab1.value();
  return (
    <br-tab-item value={tab1ID}>
      <span>{tab1ID}</span>
    </br-tab-item>
  );
};

export const TabItemDefaultPreview: DesignbaseComponentExample<TabItemDefaultPropsType> = {
  name: 'Default',
  params: TabItemDefaultProps,
  render: TabItemDefault,
};
