const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'src/app/features/admin/dealer-management/dealer-products/dealer-products.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace strings
html = html.replace(/Dealer Products/g, "{{ 'DEALER_PRODUCTS.TITLE' | translate }}");
html = html.replace(/\{\{\s*isFilterOpen\s*\?\s*'Close Filters'\s*:\s*'Search'\s*\}\}/g, "{{ isFilterOpen ? ('DEALER_PRODUCTS.CLOSE_FILTERS' | translate) : ('DEALER_PRODUCTS.SEARCH' | translate) }}");
html = html.replace(/Add Product/g, "{{ 'DEALER_PRODUCTS.ADD_PRODUCT' | translate }}");
html = html.replace(/placeholder="Search by name, category\.\.\."/g, "[placeholder]=\"'DEALER_PRODUCTS.SEARCH_PLACEHOLDER' | translate\"");
html = html.replace(/Apply/g, "{{ 'DEALER_PRODUCTS.APPLY' | translate }}");
html = html.replace(/>\s*Reset\s*</g, ">{{ 'DEALER_PRODUCTS.RESET' | translate }}<");
html = html.replace(/\[title\]="'Products'"/g, "[title]=\"'DEALER_PRODUCTS.PRODUCTS_TABLE_TITLE' | translate\"");
html = html.replace(/\{\{\s*editingProduct\s*\?\s*'Edit Product'\s*:\s*'Add Product'\s*\}\}/g, "{{ editingProduct ? ('DEALER_PRODUCTS.MODAL_TITLE_EDIT' | translate) : ('DEALER_PRODUCTS.MODAL_TITLE_NEW' | translate) }}");
html = html.replace(/placeholder="e\.g\. A4 Paper Bundle"/g, "[placeholder]=\"'DEALER_PRODUCTS.PLACEHOLDER_NAME' | translate\"");
html = html.replace(/placeholder="e\.g\. Stationery"/g, "[placeholder]=\"'DEALER_PRODUCTS.PLACEHOLDER_CATEGORY' | translate\"");
html = html.replace(/>Base Price \(INR\)<\/label>/g, ">{{ 'DEALER_PRODUCTS.BASE_PRICE' | translate }}</label>");
html = html.replace(/placeholder="Base Price\.\.\."/g, "[placeholder]=\"'DEALER_PRODUCTS.PLACEHOLDER_PRICE' | translate\"");
html = html.replace(/>Description<\/label>/g, ">{{ 'DEALER_PRODUCTS.DESCRIPTION' | translate }}</label>");
html = html.replace(/placeholder="Enter product description\.\.\."/g, "[placeholder]=\"'DEALER_PRODUCTS.PLACEHOLDER_DESCRIPTION' | translate\"");
html = html.replace(/>Is Active<\/span>/g, ">{{ 'DEALER_PRODUCTS.IS_ACTIVE' | translate }}</span>");
html = html.replace(/\{\{\s*isSaving\s*\?\s*'Saving\.\.\.'\s*:\s*'Save Product'\s*\}\}/g, "{{ isSaving ? ('DEALER_PRODUCTS.SAVING' | translate) : ('DEALER_PRODUCTS.SAVE_PRODUCT' | translate) }}");

fs.writeFileSync(htmlPath, html, 'utf8');

// Now TypeScript Headers
const tsPath = path.join(__dirname, 'src/app/features/admin/dealer-management/dealer-products/dealer-products.component.ts');
let ts = fs.readFileSync(tsPath, 'utf8');

// Inject TranslateService
if (!ts.includes('private translate: TranslateService')) {
  ts = ts.replace(/import \{ Component, OnInit \} from '@angular\/core';/, "import { Component, OnInit } from '@angular/core';\nimport { TranslateService } from '@ngx-translate/core';");
  
  if(ts.includes('constructor(private api: ApiService, private toast: ToastService) {}')) {
      ts = ts.replace(/constructor\(private api: ApiService, private toast: ToastService\) \{\}/, "constructor(private api: ApiService, private toast: ToastService, private translate: TranslateService) {\n    this.initHeaders();\n  }\n\n  initHeaders() {\n    this.translate.onLangChange.subscribe(() => {\n      this.headers = [\n        { key: 'name', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_PRODUCT_NAME') },\n        { key: 'category', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_CATEGORY') },\n        { key: 'basePrice', label: this.translate.instant('DEALER_PRODUCTS.BASE_PRICE') },\n        { key: 'active', label: this.translate.instant('COMMON.STATUS'), type: 'status' },\n        { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'actions' }\n      ];\n    });\n  }");
  }

  // Replace headers initial assignment
  ts = ts.replace(/headers: any\[\] = \[\s*\{\s*key:\s*'name'[\s\S]*?\];/m, "headers: any[] = [\n    { key: 'name', label: 'Product Name' },\n    { key: 'category', label: 'Category' },\n    { key: 'basePrice', label: 'Base Price' },\n    { key: 'active', label: 'Status', type: 'status' },\n    { key: 'actions', label: 'Actions', type: 'actions' }\n  ];");
  
  ts = ts.replace(/ngOnInit\(\): void \{/, "ngOnInit(): void {\n    this.headers = [\n      { key: 'name', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_PRODUCT_NAME') },\n      { key: 'category', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_CATEGORY') },\n      { key: 'basePrice', label: this.translate.instant('DEALER_PRODUCTS.BASE_PRICE') },\n      { key: 'active', label: this.translate.instant('COMMON.STATUS'), type: 'status' },\n      { key: 'actions', label: this.translate.instant('COMMON.ACTION'), type: 'actions' }\n    ];\n");
}

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('Product Component replaced');
