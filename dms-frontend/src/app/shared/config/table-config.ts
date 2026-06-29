/**
 * Central Table Configuration System
 *
 * This file is the single source of truth for ALL data tables in the application.
 * To modify a table's columns, actions, layout, or mobile limits — edit it here.
 */

// ─── Action Type Constants ─────────────────────────────────────────────────
export const ACTION_TYPES = {
  USER_ACTIVE_ACTIONS: 'user_active_actions',
  USER_INACTIVE_ACTIONS: 'user_inactive_actions',
  REGISTRATION_ACTIONS: 'registration_actions',
  ARCHIVED_ACTIONS: 'archived_actions',
  PAYMENT_ACTIONS: 'payment_actions',
  MASTER_DETAIL_ACTIONS: 'master_detail_actions',
  INACTIVE_ACTION: 'inactive_action',
} as const;

// ─── Column Type Constants ─────────────────────────────────────────────────
export const COL_TYPES = {
  USER: 'user',
  STATUS: 'status',
  DATE: 'date',
  CURRENCY: 'currency',
  PAYMENT_STATUS: 'payment_status',
  ROLES: 'roles',
  PAYMENT_USER: 'payment_user',
  ACTION: 'action',
} as const;

// ─── Table Configuration Interface ────────────────────────────────────────
export interface TableColumnConfig {
  key: string;
  label: string;
  type?: string;
  /** Icon class string for desktop header (FontAwesome) */
  icon?: string;
  /** Whether this column shows on mobile (up to mobileHeaderLimit columns show) */
  mobile?: boolean;
  /** If set, indicates that the filter should be a dropdown populated dynamically using this MasterHeader name */
  dynamicDropdownKey?: string;
}

export interface TableConfiguration {
  tableId: string;
  title: string;
  dataKey: string;
  /** Column config list defines order, label, key, type, icon */
  columns: TableColumnConfig[];
  /** Max number of data columns shown on mobile (excludes action column) */
  mobileHeaderLimit: number;
  /** Whether the table supports backend-side filtering */
  backendFiltering: boolean;
  /** Whether to disable local/frontend filtering */
  disableLocalFiltering: boolean;
  /** Column types map (key → type) used by data-table to derive display format */
  columnTypes: Record<string, string>;
  /** Icon map (key → icon class) for header icons */
  iconToHeader?: Record<string, string>;
}

// ─── Helper: build desktopColumns from columns ─────────────────────────────
function buildDesktopColumns(columns: TableColumnConfig[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of columns) {
    result[col.key] = col.label;
  }
  return result;
}

// ─── Helper: build columnTypes from columns ────────────────────────────────
function buildColumnTypes(columns: TableColumnConfig[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of columns) {
    if (col.type) result[col.key] = col.type;
  }
  return result;
}

// ─── Helper: build iconToHeader from columns ───────────────────────────────
function buildIconToHeader(columns: TableColumnConfig[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of columns) {
    if (col.icon) result[col.key] = col.icon;
  }
  return result;
}

// ─── Helper: build dynamicDropdownKeys from columns ────────────────────────
function buildDynamicDropdownKeys(columns: TableColumnConfig[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of columns) {
    if (col.dynamicDropdownKey) result[col.key] = col.dynamicDropdownKey;
  }
  return result;
}

// ─── Utility to convert TableConfiguration to legacy data-table format ─────
export function toLegacyConfig(config: TableConfiguration): any {
  return {
    tableId: config.tableId,
    dataKey: config.dataKey,
    desktopColumns: buildDesktopColumns(config.columns),
    columnTypes: buildColumnTypes(config.columns),
    iconToHeader: buildIconToHeader(config.columns),
    dynamicDropdownKeys: buildDynamicDropdownKeys(config.columns),
  };
}

// ════════════════════════════════════════════════════════════════════════════
//  TABLE CONFIGURATIONS — Edit this section to control ALL tables globally
// ════════════════════════════════════════════════════════════════════════════

const DASHBOARD_ACTIVE_COLUMNS: TableColumnConfig[] = [
  { key: 'username',     label: 'User',          type: COL_TYPES.USER,           icon: 'fa-solid fa-user-circle text-indigo-500',        mobile: true  },
  { key: 'fullName',     label: 'Full Name',                                      icon: 'fa-solid fa-id-card text-blue-500',              mobile: true  },
  { key: 'referralCode', label: 'Referral Code',                                  icon: 'fa-solid fa-link text-emerald-500',              mobile: false },
  { key: 'country',      label: 'Country',                                        icon: 'fa-solid fa-globe text-blue-400',                mobile: false, dynamicDropdownKey: 'COUNTRY' },
  { key: 'state',        label: 'State / UT',                                     icon: 'fa-solid fa-map text-red-500',                   mobile: false, dynamicDropdownKey: 'STATE' },
  { key: 'district',     label: 'District',                                       icon: 'fa-solid fa-map-pin text-teal-500',              mobile: false, dynamicDropdownKey: 'DISTRICT' },
  { key: 'town',         label: 'Sub-District (Tehsil)',                          icon: 'fa-solid fa-tree-city text-purple-400',          mobile: false, dynamicDropdownKey: 'SUB_DISTRICT' },
  { key: 'block',        label: 'Block',                                          icon: 'fa-solid fa-cubes text-yellow-500',              mobile: false, dynamicDropdownKey: 'BLOCK' },
  { key: 'village',      label: 'Village',                                        icon: 'fa-solid fa-house-chimney text-amber-500',       mobile: false, dynamicDropdownKey: 'VILLAGE' },
  { key: 'isPaid',       label: 'Payment',       type: COL_TYPES.PAYMENT_STATUS, icon: 'fa-solid fa-indian-rupee-sign text-emerald-600', mobile: true  },
  { key: 'createdAt',    label: 'Joined',        type: COL_TYPES.DATE,           icon: 'fa-solid fa-calendar-day text-blue-400',         mobile: false },
  { key: 'actions',      label: 'Actions',       type: ACTION_TYPES.USER_ACTIVE_ACTIONS, mobile: false },
];

const DASHBOARD_INACTIVE_COLUMNS: TableColumnConfig[] = [
  { key: 'username',     label: 'User',          type: COL_TYPES.USER,           icon: 'fa-solid fa-user-circle text-indigo-500',        mobile: true  },
  { key: 'fullName',     label: 'Full Name',                                      icon: 'fa-solid fa-id-card text-blue-500',              mobile: true  },
  { key: 'referralCode', label: 'Referral Code',                                  icon: 'fa-solid fa-link text-emerald-500',              mobile: false },
  { key: 'country',      label: 'Country',                                        icon: 'fa-solid fa-globe text-blue-400',                mobile: false, dynamicDropdownKey: 'COUNTRY' },
  { key: 'state',        label: 'State / UT',                                     icon: 'fa-solid fa-map text-red-500',                   mobile: false, dynamicDropdownKey: 'STATE' },
  { key: 'district',     label: 'District',                                       icon: 'fa-solid fa-map-pin text-teal-500',              mobile: false, dynamicDropdownKey: 'DISTRICT' },
  { key: 'town',         label: 'Sub-District (Tehsil)',                          icon: 'fa-solid fa-tree-city text-purple-400',          mobile: false, dynamicDropdownKey: 'SUB_DISTRICT' },
  { key: 'block',        label: 'Block',                                          icon: 'fa-solid fa-cubes text-yellow-500',              mobile: false, dynamicDropdownKey: 'BLOCK' },
  { key: 'village',      label: 'Village',                                        icon: 'fa-solid fa-house-chimney text-amber-500',       mobile: false, dynamicDropdownKey: 'VILLAGE' },
  { key: 'createdAt',    label: 'Joined',        type: COL_TYPES.DATE,           icon: 'fa-solid fa-calendar-day text-blue-400',         mobile: false },
  { key: 'actions',      label: 'Actions',       type: ACTION_TYPES.USER_INACTIVE_ACTIONS, mobile: false },
];

const PENDING_REGISTRATIONS_COLUMNS: TableColumnConfig[] = [
  { key: 'username',            label: 'User Details',    type: COL_TYPES.USER,    mobile: true  },
  { key: 'requestedRole',       label: 'Requested Role',                            mobile: true  },
  { key: 'createdAt',           label: 'Applied On',      type: COL_TYPES.DATE,    mobile: false },
  { key: 'registrationStatus',  label: 'Status',          type: COL_TYPES.STATUS,  mobile: true  },
  { key: 'actions',             label: 'Actions',         type: ACTION_TYPES.REGISTRATION_ACTIONS, mobile: false },
];

const ARCHIVED_REGISTRATIONS_COLUMNS: TableColumnConfig[] = [
  { key: 'username',            label: 'User Details',    type: COL_TYPES.USER,    mobile: true  },
  { key: 'requestedRole',       label: 'Requested Role',                            mobile: true  },
  { key: 'createdAt',           label: 'Applied On',      type: COL_TYPES.DATE,    mobile: false },
  { key: 'registrationStatus',  label: 'Status',          type: COL_TYPES.STATUS,  mobile: true  },
  { key: 'actions',             label: 'Actions',         type: ACTION_TYPES.ARCHIVED_ACTIONS, mobile: false },
];

const APPROVED_USERS_COLUMNS: TableColumnConfig[] = [
  { key: 'username',   label: 'User Details',      type: COL_TYPES.USER,  mobile: true  },
  { key: 'email',      label: 'Email Address',                             mobile: false },
  { key: 'roles',      label: 'Active Role',        type: COL_TYPES.ROLES, mobile: true  },
  { key: 'createdAt',  label: 'Account Created',   type: COL_TYPES.DATE,  mobile: false },
];

const ADMIN_PAYMENTS_COLUMNS: TableColumnConfig[] = [
  { key: 'username',      label: 'User Details',  type: COL_TYPES.PAYMENT_USER,    mobile: true  },
  { key: 'planName',      label: 'Plan',                                            mobile: true  },
  { key: 'amount',        label: 'Amount',        type: COL_TYPES.CURRENCY,        mobile: true  },
  { key: 'paymentMethod', label: 'Method',                                          mobile: false },
  { key: 'submittedAt',   label: 'Submitted',     type: COL_TYPES.DATE,            mobile: false },
  { key: 'status',        label: 'Status',        type: COL_TYPES.STATUS,          mobile: false },
  { key: 'actions',       label: 'Actions',       type: ACTION_TYPES.PAYMENT_ACTIONS, mobile: false },
];

const MASTER_DETAIL_COLUMNS: TableColumnConfig[] = [
  { key: 'displayName',   label: 'Name',           mobile: true  },
  { key: 'parentPath',    label: 'Hierarchy Path', mobile: true  },
  { key: 'status',        label: 'Status',  type: COL_TYPES.STATUS, mobile: true  },
  { key: 'actions',       label: 'Actions', type: ACTION_TYPES.MASTER_DETAIL_ACTIONS, mobile: false },
];

// Note: inactive details use the same columns — action buttons are rendered
// conditionally in the template based on item.status from the backend API.
const MASTER_INACTIVE_DETAIL_COLUMNS: TableColumnConfig[] = [
  { key: 'displayName',   label: 'Name',           mobile: true  },
  { key: 'parentPath',    label: 'Hierarchy Path', mobile: true  },
  { key: 'status',        label: 'Status',  type: COL_TYPES.STATUS, mobile: true  },
  { key: 'actions',       label: 'Actions', type: ACTION_TYPES.MASTER_DETAIL_ACTIONS, mobile: false },
];

const SCREEN_ASSIGNMENT_COLUMNS: TableColumnConfig[] = [
  { key: 'sno',      label: '#',             icon: 'fa-solid fa-hashtag text-slate-400',            mobile: true  },
  { key: 'username', label: 'User Name',     icon: 'fa-solid fa-user text-indigo-400',              mobile: true  },
  { key: 'roles',    label: 'Assigned Role', icon: 'fa-solid fa-user-tag text-emerald-400',         mobile: true  },
  { key: 'screens',  label: 'Screen Access', icon: 'fa-solid fa-desktop text-violet-400',           mobile: false },
  { key: 'actions',  label: 'Actions',       type: 'screen_actions',                                mobile: false },
];

// ─── Master Table Configuration Map ────────────────────────────────────────
export const TABLE_CONFIG_MAP: Record<string, TableConfiguration> = {

  DASHBOARD_ACTIVE: {
    tableId: 'DASHBOARD_ACTIVE',
    title: 'Active Members',
    dataKey: 'id',
    columns: DASHBOARD_ACTIVE_COLUMNS,
    mobileHeaderLimit: 3,
    backendFiltering: true,
    disableLocalFiltering: true,
    columnTypes: buildColumnTypes(DASHBOARD_ACTIVE_COLUMNS),
    iconToHeader: buildIconToHeader(DASHBOARD_ACTIVE_COLUMNS),
  },

  DASHBOARD_INACTIVE: {
    tableId: 'DASHBOARD_INACTIVE',
    title: 'Inactive Members',
    dataKey: 'id',
    columns: DASHBOARD_INACTIVE_COLUMNS,
    mobileHeaderLimit: 3,
    backendFiltering: true,
    disableLocalFiltering: true,
    columnTypes: buildColumnTypes(DASHBOARD_INACTIVE_COLUMNS),
    iconToHeader: buildIconToHeader(DASHBOARD_INACTIVE_COLUMNS),
  },

  PENDING_REGISTRATIONS: {
    tableId: 'PENDING_REGISTRATIONS',
    title: 'Pending Registration Requests',
    dataKey: 'id',
    columns: PENDING_REGISTRATIONS_COLUMNS,
    mobileHeaderLimit: 2,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(PENDING_REGISTRATIONS_COLUMNS),
  },

  ARCHIVED_REGISTRATIONS: {
    tableId: 'ARCHIVED_REGISTRATIONS',
    title: 'Archived / Rejected Registrations',
    dataKey: 'id',
    columns: ARCHIVED_REGISTRATIONS_COLUMNS,
    mobileHeaderLimit: 2,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(ARCHIVED_REGISTRATIONS_COLUMNS),
  },

  APPROVED_USERS: {
    tableId: 'APPROVED_USERS',
    title: 'System User Access Ledger',
    dataKey: 'id',
    columns: APPROVED_USERS_COLUMNS,
    mobileHeaderLimit: 2,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(APPROVED_USERS_COLUMNS),
  },

  ADMIN_PAYMENTS: {
    tableId: 'ADMIN_PAYMENTS',
    title: 'Member Payments Review Ledger',
    dataKey: 'id',
    columns: ADMIN_PAYMENTS_COLUMNS,
    mobileHeaderLimit: 3,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(ADMIN_PAYMENTS_COLUMNS),
  },

  MASTER_DETAIL: {
    tableId: 'MASTER_DETAIL',
    title: 'Master Data Options',
    dataKey: 'id',
    columns: MASTER_DETAIL_COLUMNS,
    mobileHeaderLimit: 2,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(MASTER_DETAIL_COLUMNS),
  },

  MASTER_INACTIVE_DETAIL: {
    tableId: 'MASTER_INACTIVE_DETAIL',
    title: 'Inactive Options',
    dataKey: 'id',
    columns: MASTER_INACTIVE_DETAIL_COLUMNS,
    mobileHeaderLimit: 2,
    backendFiltering: false,
    disableLocalFiltering: false,
    columnTypes: buildColumnTypes(MASTER_INACTIVE_DETAIL_COLUMNS),
  },

  SCREEN_ASSIGNMENT: {
    tableId: 'SCREEN_ASSIGNMENT',
    title: 'User Screen Access Ledger',
    dataKey: 'id',
    columns: SCREEN_ASSIGNMENT_COLUMNS,
    mobileHeaderLimit: 3,
    backendFiltering: true,
    disableLocalFiltering: true,
    columnTypes: buildColumnTypes(SCREEN_ASSIGNMENT_COLUMNS),
    iconToHeader: buildIconToHeader(SCREEN_ASSIGNMENT_COLUMNS),
  },
};

// ─── Legacy TABLE_CONFIG alias (for backward compatibility) ────────────────
export const TABLE_CONFIG: Record<string, any> = Object.fromEntries(
  Object.entries(TABLE_CONFIG_MAP).map(([key, config]) => [
    key,
    toLegacyConfig(config)
  ])
);
