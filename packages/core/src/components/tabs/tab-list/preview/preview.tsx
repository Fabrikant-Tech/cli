import { h } from '@stencil/core';
import {
  DBExampleStringGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../../utils/preview/preview-types';

interface TabListDefaultPropsType {
  tab1: DBExampleStringGenerator;
  tab2: DBExampleStringGenerator;
  tab3: DBExampleStringGenerator;
}

const TabListDefaultProps: TabListDefaultPropsType = {
  tab1: DefaultDBExampleGenerators.string,
  tab2: DefaultDBExampleGenerators.string,
  tab3: DefaultDBExampleGenerators.string,
};

const TabListDefault = (params: TabListDefaultPropsType) => {
  const tab1ID = params.tab1.value();
  const tab2ID = params.tab2.value();
  const tab3ID = params.tab3.value();
  return (
    <br-tab-list value={tab1ID}>
      <br-tab-item value={tab1ID}>
        <span>{tab1ID}</span>
      </br-tab-item>
      <br-tab-item value={tab2ID}>
        <span>{tab2ID}</span>
      </br-tab-item>
      <br-tab-item value={tab3ID}>
        <span>{tab3ID}</span>
      </br-tab-item>
    </br-tab-list>
  );
};

export const TabListDefaultPreview: DesignbaseComponentExample<TabListDefaultPropsType> = {
  name: 'Default',
  params: TabListDefaultProps,
  render: TabListDefault,
};
