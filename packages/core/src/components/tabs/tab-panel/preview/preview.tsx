import { h } from '@stencil/core';
import {
  DBExampleStringGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../../utils/preview/preview-types';

interface TabPanelDefaultPropsType {
  tab1: DBExampleStringGenerator;
  tab2: DBExampleStringGenerator;
  tab3: DBExampleStringGenerator;
}

const TabPanelDefaultProps: TabPanelDefaultPropsType = {
  tab1: DefaultDBExampleGenerators.string,
  tab2: DefaultDBExampleGenerators.string,
  tab3: DefaultDBExampleGenerators.string,
};

const TabPanelDefault = (params: TabPanelDefaultPropsType) => {
  const tab1ID = params.tab1.value();
  const tab2ID = params.tab2.value();
  const tab3ID = params.tab3.value();
  return (
    <br-tab-content value={tab1ID}>
      <br-tab-panel value={tab1ID}>
        <span>{tab1ID}</span>
      </br-tab-panel>
      <br-tab-panel value={tab2ID}>
        <span>{tab2ID}</span>
      </br-tab-panel>
      <br-tab-panel value={tab3ID}>
        <span>{tab3ID}</span>
      </br-tab-panel>
    </br-tab-content>
  );
};

export const TabPanelDefaultPreview: DesignbaseComponentExample<TabPanelDefaultPropsType> = {
  name: 'Default',
  params: TabPanelDefaultProps,
  render: TabPanelDefault,
};
