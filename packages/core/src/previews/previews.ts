import { AccordionDefaultPreview } from '../components/accordion/preview/preview';
import { AvatarDefaultPreview } from '../components/avatar/preview/preview';
import { BadgeDefaultPreview } from '../components/badge/preview/preview';
import { BannerDefaultPreview } from '../components/banner/preview/preview';
import { ButtonDefaultPreview } from '../components/button/preview/preview';
import { CheckboxDefaultPreview } from '../components/checkbox/preview/preview';
import { ComboSelectDefaultPreview } from '../components/combo-select/preview/preview';
import { ConfirmationDefaultPreview } from '../components/confirmation/preview/preview';
import { ContainerDefaultPreview } from '../components/container/preview/preview';
import { ContextMenuDefaultPreview } from '../components/context-menu/preview/preview';
import { ControlGroupDefaultPreview } from '../components/control-group/preview/preview';
import { DialogDefaultPreview } from '../components/dialog/preview/preview';
import { DrawerDefaultPreview } from '../components/drawer/preview/preview';
import { FieldDefaultPreview } from '../components/field/preview/preview';
import { GridDefaultPreview } from '../components/grid/preview/preview';
import { InfoDisplayDefaultPreview } from '../components/info-display/preview/preview';
import { LayoutHeaderContentDefaultPreview } from '../components/layout/layout-header-content/preview/preview';
import { LayoutSidebarContentDefaultPreview } from '../components/layout/layout-sidebar-content/preview/preview';
import { LinkDefaultPreview } from '../components/link/preview/preview';
import { MenuDefaultPreview } from '../components/menu/preview/preview';
import { MultiSelectDefaultPreview } from '../components/multi-select/preview/preview';
import { OverflowWrapperDefaultPreview } from '../components/overflow-wrapper/preview/preview';
import { PaginationDefaultPreview } from '../components/pagination/preview/preview';
import { PopoverDefaultPreview } from '../components/popover/preview/preview';
import { SelectListDefaultPreview } from '../components/select-list/preview/preview';
import { SingleSelectDefaultPreview } from '../components/single-select/preview/preview';
import { SkeletonDefaultPreview } from '../components/skeleton/preview/preview';
import { SliderDefaultPreview } from '../components/slider/preview/preview';
import { SwitchDefaultPreview } from '../components/switch/preview/preview';
import { TableDefaultPreview } from '../components/table/preview/preview';
import { TabItemDefaultPreview } from '../components/tabs/tab-item/preview/preview';
import { TabListDefaultPreview } from '../components/tabs/tab-list/preview/preview';
import { TabPanelDefaultPreview } from '../components/tabs/tab-panel/preview/preview';
import { TagDefaultPreview } from '../components/tag/preview/preview';
import { ToastDefaultPreview } from '../components/toast/item/preview/preview';
import { ToastProviderDefaultPreview } from '../components/toast/preview/preview';
import { TooltipDefaultPreview } from '../components/tooltip/preview/preview';
import { TimelineDefaultPreview } from '../components/timeline/preview/preview';
import { TimelineItemDefaultPreview } from '../components/timeline/item/preview/preview';
import { TreeDefaultPreview } from '../components/tree/preview/preview';
import { TreeItemDefaultPreview } from '../components/tree/tree-item/preview/preview';
import { WizardDefaultPreview } from '../components/wizard/preview/preview';
import { WizardItemDefaultPreview } from '../components/wizard/wizard-item/preview/preview';
import { SimpleChartDefaultPreview } from '../components/simple-chart/preview/preview';
import { RadioDefaultPreview } from '../components/radio/preview/preview';
import { ColorPreviewDefaultPreview } from '../components/color-preview/preview/preview';
import { SidebarItemDefaultPreview } from '../components/sidebar/item/preview/preview';
import { SidebarDefaultPreview } from '../components/sidebar/preview/preview';
import { HeaderDefaultPreview } from '../components/header/preview/preview';
import { TabContentDefaultPreview } from '../components/tabs/tab-content/preview/preview';
import { TextDefaultPreview } from '../components/text/preview/preview';
import { DesignbaseComponentExample } from '../utils/preview/preview-types';

export const Previews: Record<
  string,
  DesignbaseComponentExample<unknown> | Array<DesignbaseComponentExample<unknown>>
> = {
  Accordion: AccordionDefaultPreview,
  Avatar: AvatarDefaultPreview,
  Badge: BadgeDefaultPreview,
  Banner: BannerDefaultPreview,
  Button: ButtonDefaultPreview,
  Checkbox: CheckboxDefaultPreview,
  ColorPreview: ColorPreviewDefaultPreview,
  ComboSelect: ComboSelectDefaultPreview,
  Confirmation: ConfirmationDefaultPreview,
  Container: ContainerDefaultPreview,
  ContextMenu: ContextMenuDefaultPreview,
  ControlGroup: ControlGroupDefaultPreview,
  Dialog: DialogDefaultPreview,
  Drawer: DrawerDefaultPreview,
  Field: FieldDefaultPreview,
  Grid: GridDefaultPreview,
  Header: HeaderDefaultPreview,
  InfoDisplay: InfoDisplayDefaultPreview,
  LayoutHeaderContent: LayoutHeaderContentDefaultPreview,
  LayoutSidebarContent: LayoutSidebarContentDefaultPreview,
  Link: LinkDefaultPreview,
  Menu: MenuDefaultPreview,
  MultiSelect: MultiSelectDefaultPreview,
  OverflowWrapper: OverflowWrapperDefaultPreview,
  Pagination: PaginationDefaultPreview,
  Popover: PopoverDefaultPreview,
  Radio: RadioDefaultPreview,
  SelectList: SelectListDefaultPreview,
  Sidebar: SidebarDefaultPreview,
  SidebarItem: SidebarItemDefaultPreview,
  SimpleChart: SimpleChartDefaultPreview,
  SingleSelect: SingleSelectDefaultPreview,
  Skeleton: SkeletonDefaultPreview,
  Slider: SliderDefaultPreview,
  Switch: SwitchDefaultPreview,
  TabContent: TabContentDefaultPreview,
  TabItem: TabItemDefaultPreview,
  Table: TableDefaultPreview,
  TabList: TabListDefaultPreview,
  TabPanel: TabPanelDefaultPreview,
  Tag: TagDefaultPreview,
  Text: TextDefaultPreview,
  Timeline: TimelineDefaultPreview,
  TimelineItem: TimelineItemDefaultPreview,
  Toast: ToastDefaultPreview,
  ToastProvider: ToastProviderDefaultPreview,
  Tooltip: TooltipDefaultPreview,
  Tree: TreeDefaultPreview,
  TreeItem: TreeItemDefaultPreview,
  Wizard: WizardDefaultPreview,
  WizardItem: WizardItemDefaultPreview,
} as const;
