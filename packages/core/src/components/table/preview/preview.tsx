import { h } from '@stencil/core';
import {
  DBExampleXCountGenerator,
  DBExampleYCountGenerator,
  DefaultDBExampleGenerators,
  DesignbaseComponentExample,
} from '../../../utils/preview/preview-types';

interface TableDefaultPropsType {
  columnCount: DBExampleXCountGenerator;
  rowCount: DBExampleYCountGenerator;
}

const TableDefaultProps: TableDefaultPropsType = {
  columnCount: DefaultDBExampleGenerators.xCount,
  rowCount: DefaultDBExampleGenerators.yCount,
};

const TableDefault = (params: TableDefaultPropsType) => {
  const columnCount = params.columnCount.value();
  const rowCount = params.rowCount.value();
  return (
    <br-table width="100%">
      <br-table-row slot="header">
        {Array.from({ length: columnCount }, (_, i) => (
          <br-table-header columnId={`column-${i + 1}`} key={i}>
            <span>Header {i + 1}</span>
          </br-table-header>
        ))}
      </br-table-row>
      {Array.from({ length: rowCount }, (_, i) => (
        <br-table-row key={i}>
          {Array.from({ length: columnCount }, (_, j) => (
            <br-table-cell columnId={`column-${j + 1}`} key={j}>
              <span>
                Cell {i + 1}-{j + 1}
              </span>
            </br-table-cell>
          ))}
        </br-table-row>
      ))}
    </br-table>
  );
};

export const TableDefaultPreview: DesignbaseComponentExample<TableDefaultPropsType> = {
  name: 'Default',
  params: TableDefaultProps,
  render: TableDefault,
};
