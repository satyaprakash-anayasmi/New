const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, 'src/app/features/admin/dealer-management/dealer-assignment/dealer-assignment.component.ts');
let ts = fs.readFileSync(tsPath, 'utf8');

// Inject TranslateService
if (!ts.includes('private translate: TranslateService')) {
  ts = ts.replace(/import \{ ToastService \} from '\.\.\/\.\.\/\.\.\/\.\.\/core\/services\/toast\.service';/, "import { ToastService } from '../../../../core/services/toast.service';\nimport { TranslateService } from '@ngx-translate/core';");
  ts = ts.replace(/constructor\(private api: ApiService, private toast: ToastService\) \{\}/, "constructor(private api: ApiService, private toast: ToastService, private translate: TranslateService) {\n    this.initHeaders();\n  }\n\n  initHeaders() {\n    this.translate.onLangChange.subscribe(() => {\n      this.headers = [\n        { key: 'dealerUsername', label: this.translate.instant('DEALER_ASSIGNMENT.DEALER_NAME') },\n        { key: 'state', label: this.translate.instant('DEALER_ASSIGNMENT.STATE') },\n        { key: 'district', label: this.translate.instant('DEALER_ASSIGNMENT.DISTRICT') },\n        { key: 'block', label: this.translate.instant('DEALER_ASSIGNMENT.BLOCK') },\n        { key: 'pinCode', label: this.translate.instant('DEALER_ASSIGNMENT.PIN_CODE') },\n        { key: 'assignedUsersCount', label: this.translate.instant('DEALER_ASSIGNMENT.ASSIGNED_USERS') },\n        { key: 'status', label: this.translate.instant('DEALER_ASSIGNMENT.STATUS'), type: 'status' },\n        { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'master_detail_actions' }\n      ];\n    });\n  }");
  
  // Replace headers initial assignment
  ts = ts.replace(/headers: any\[\] = \[\s*\{\s*key:\s*'dealerUsername'[\s\S]*?\];/m, "headers: any[] = [\n    { key: 'dealerUsername', label: 'Dealer' },\n    { key: 'state', label: 'State' },\n    { key: 'district', label: 'District' },\n    { key: 'block', label: 'Block' },\n    { key: 'pinCode', label: 'Pin Code' },\n    { key: 'assignedUsersCount', label: 'Assigned Users' },\n    { key: 'status', label: 'Status', type: 'status' },\n    { key: 'actions', label: 'Actions', type: 'master_detail_actions' }\n  ];");
  
  // Also call initHeaders inside ngOnInit just to be safe
  ts = ts.replace(/ngOnInit\(\): void \{/, "ngOnInit(): void {\n    // trigger immediately if needed\n    this.headers = [\n      { key: 'dealerUsername', label: this.translate.instant('DEALER_ASSIGNMENT.DEALER_NAME') },\n      { key: 'state', label: this.translate.instant('DEALER_ASSIGNMENT.STATE') },\n      { key: 'district', label: this.translate.instant('DEALER_ASSIGNMENT.DISTRICT') },\n      { key: 'block', label: this.translate.instant('DEALER_ASSIGNMENT.BLOCK') },\n      { key: 'pinCode', label: this.translate.instant('DEALER_ASSIGNMENT.PIN_CODE') },\n      { key: 'assignedUsersCount', label: this.translate.instant('DEALER_ASSIGNMENT.ASSIGNED_USERS') || 'Assigned Users' },\n      { key: 'status', label: this.translate.instant('DEALER_ASSIGNMENT.STATUS'), type: 'status' },\n      { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'master_detail_actions' }\n    ];\n");
}

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('TS Component replaced');
