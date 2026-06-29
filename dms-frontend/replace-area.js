const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'src/app/features/admin/dealer-area-assignment/dealer-area-assignment.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace strings
html = html.replace(/\{\{\s*isFilterOpen\s*\?\s*'Close Filters'\s*:\s*'Search'\s*\}\}/g, "{{ isFilterOpen ? ('DEALER_AREA_ASSIGNMENT.CLOSE_FILTERS' | translate) : ('DEALER_AREA_ASSIGNMENT.SEARCH' | translate) }}");
html = html.replace(/placeholder="Search dealers by name, email, or area\.\.\."/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.SEARCH_PLACEHOLDER' | translate\"");
html = html.replace(/>\s*Apply\s*</g, ">{{ 'DEALER_AREA_ASSIGNMENT.APPLY' | translate }}<");
html = html.replace(/>\s*Reset\s*</g, ">{{ 'DEALER_AREA_ASSIGNMENT.RESET' | translate }}<");
html = html.replace(/\[title\]="'Dealers Territory'"/g, "[title]=\"'DEALER_AREA_ASSIGNMENT.TABLE_TITLE' | translate\"");

html = html.replace(/>State<\/label>/g, ">{{ 'DEALER_AREA_ASSIGNMENT.STATE' | translate }}</label>");
html = html.replace(/placeholder="e\.g\. Maharashtra"/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.PLACEHOLDER_STATE' | translate\"");
html = html.replace(/>District<\/label>/g, ">{{ 'DEALER_AREA_ASSIGNMENT.DISTRICT' | translate }}</label>");
html = html.replace(/placeholder="e\.g\. Pune"/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.PLACEHOLDER_DISTRICT' | translate\"");
html = html.replace(/>Area<\/label>/g, ">{{ 'DEALER_AREA_ASSIGNMENT.AREA' | translate }}</label>");
html = html.replace(/placeholder="e\.g\. Shivaji Nagar"/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.PLACEHOLDER_AREA' | translate\"");
html = html.replace(/>Block<\/label>/g, ">{{ 'DEALER_AREA_ASSIGNMENT.BLOCK' | translate }}</label>");
html = html.replace(/placeholder="e\.g\. Haveli"/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.PLACEHOLDER_BLOCK' | translate\"");
html = html.replace(/>PIN Code<\/label>/g, ">{{ 'DEALER_AREA_ASSIGNMENT.PIN_CODE' | translate }}</label>");
html = html.replace(/placeholder="e\.g\. 411005"/g, "[placeholder]=\"'DEALER_AREA_ASSIGNMENT.PLACEHOLDER_PIN_CODE' | translate\"");

html = html.replace(/\{\{\s*isSaving\s*\?\s*'Saving\.\.\.'\s*:\s*'Save Assignment'\s*\}\}/g, "{{ isSaving ? ('DEALER_AREA_ASSIGNMENT.SAVING' | translate) : ('DEALER_AREA_ASSIGNMENT.SAVE' | translate) }}");

fs.writeFileSync(htmlPath, html, 'utf8');

// Now TypeScript Headers
const tsPath = path.join(__dirname, 'src/app/features/admin/dealer-area-assignment/dealer-area-assignment.component.ts');
let ts = fs.readFileSync(tsPath, 'utf8');

// Inject TranslateService
if (!ts.includes('private translate: TranslateService')) {
  ts = ts.replace(/import \{ Component, OnInit \} from '@angular\/core';/, "import { Component, OnInit } from '@angular/core';\nimport { TranslateService } from '@ngx-translate/core';");
  
  if(ts.includes('constructor(private api: ApiService, private toast: ToastService) {}')) {
      ts = ts.replace(/constructor\(private api: ApiService, private toast: ToastService\) \{\}/, "constructor(private api: ApiService, private toast: ToastService, private translate: TranslateService) {\n    this.initHeaders();\n  }\n\n  initHeaders() {\n    this.translate.onLangChange.subscribe(() => {\n      this.headers = [\n        { key: 'username', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_DEALER') },\n        { key: 'email', label: this.translate.instant('AUTH.REGISTER.EMAIL_LABEL') },\n        { key: 'area', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.AREA') },\n        { key: 'state', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.STATE') },\n        { key: 'district', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.DISTRICT') },\n        { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'actions' }\n      ];\n    });\n  }");
  } else {
      ts = ts.replace(/constructor\((.*?)\)\s*\{/g, "constructor($1, private translate: TranslateService) {\n    this.initHeaders();");
      ts = ts.replace(/ngOnInit\(\): void \{/, "initHeaders() {\n    this.translate.onLangChange.subscribe(() => {\n      this.headers = [\n        { key: 'username', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_DEALER') },\n        { key: 'email', label: this.translate.instant('AUTH.REGISTER.EMAIL_LABEL') },\n        { key: 'area', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.AREA') },\n        { key: 'state', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.STATE') },\n        { key: 'district', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.DISTRICT') },\n        { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'actions' }\n      ];\n    });\n  }\n\n  ngOnInit(): void {");
  }

  // Replace headers initial assignment
  ts = ts.replace(/headers: any\[\] = \[\s*\{\s*key:\s*'username'[\s\S]*?\];/m, "headers: any[] = [\n    { key: 'username', label: 'Dealer' },\n    { key: 'email', label: 'Email' },\n    { key: 'area', label: 'Area' },\n    { key: 'state', label: 'State' },\n    { key: 'district', label: 'District' },\n    { key: 'actions', label: 'Actions', type: 'actions' }\n  ];");
  
  ts = ts.replace(/ngOnInit\(\): void \{/, "ngOnInit(): void {\n    this.headers = [\n      { key: 'username', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_DEALER') },\n      { key: 'email', label: this.translate.instant('AUTH.REGISTER.EMAIL_LABEL') },\n      { key: 'area', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.AREA') },\n      { key: 'state', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.STATE') },\n      { key: 'district', label: this.translate.instant('DEALER_AREA_ASSIGNMENT.DISTRICT') },\n      { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'actions' }\n    ];\n");
}

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('Area Assignment Component replaced');
