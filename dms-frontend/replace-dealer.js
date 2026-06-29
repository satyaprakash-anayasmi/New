const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'src/app/features/admin/dealer-management/dealer-assignment/dealer-assignment.component.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace strings
html = html.replace(/Distribution Assignments/g, "{{ 'DEALER_ASSIGNMENT.TITLE' | translate }}");
html = html.replace(/\{\{\s*isFilterOpen\s*\?\s*'Close'\s*:\s*'Search'\s*\}\}/g, "{{ isFilterOpen ? ('DEALER_ASSIGNMENT.CLOSE' | translate) : ('DEALER_ASSIGNMENT.SEARCH' | translate) }}");
html = html.replace(/\{\{\s*isExporting\s*\?\s*'Exporting\.\.\.'\s*:\s*'Download Excel'\s*\}\}/g, "{{ isExporting ? ('DEALER_ASSIGNMENT.EXPORTING' | translate) : ('DEALER_ASSIGNMENT.DOWNLOAD_EXCEL' | translate) }}");
html = html.replace(/Assign Area/g, "{{ 'DEALER_ASSIGNMENT.ASSIGN_AREA' | translate }}");
html = html.replace(/Search All<\/label>/g, "{{ 'DEALER_ASSIGNMENT.SEARCH_ALL' | translate }}</label>");
html = html.replace(/placeholder="Search\.\.\."/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SEARCH' | translate\"");
html = html.replace(/Dealer Name<\/label>/g, "{{ 'DEALER_ASSIGNMENT.DEALER_NAME' | translate }}</label>");
html = html.replace(/placeholder="Dealer Name"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.DEALER_NAME' | translate\"");
html = html.replace(/>Area<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.AREA' | translate }}</label>");
html = html.replace(/placeholder="Area"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.AREA' | translate\"");
html = html.replace(/>Product<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.PRODUCT_LABEL' | translate }}</label>");
html = html.replace(/placeholder="Product Name"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.PRODUCT_NAME' | translate\"");
html = html.replace(/>Status<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.STATUS' | translate }}</label>");
html = html.replace(/\[placeholder\]="'All Statuses'"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.ALL_STATUSES' | translate\"");
html = html.replace(/Apply Filters/g, "{{ 'DEALER_ASSIGNMENT.APPLY_FILTERS' | translate }}");
html = html.replace(/Reset/g, "{{ 'DEALER_ASSIGNMENT.RESET' | translate }}");
html = html.replace(/\{\{\s*editingAssignment\s*\?\s*'Edit Assignment'\s*:\s*'New Assignment'\s*\}\}/g, "{{ editingAssignment ? ('DEALER_ASSIGNMENT.MODAL_TITLE_EDIT' | translate) : ('DEALER_ASSIGNMENT.MODAL_TITLE_NEW' | translate) }}");
html = html.replace(/<strong>Email:<\/strong>\s*<span/g, "<strong>{{ 'DEALER_ASSIGNMENT.EMAIL' | translate }}:</strong> <span");
html = html.replace(/<strong>Area:<\/strong>\s*<span/g, "<strong>{{ 'DEALER_ASSIGNMENT.AREA' | translate }}:</strong> <span");
html = html.replace(/Loading metrics\.\.\./g, "{{ 'DEALER_ASSIGNMENT.LOADING_METRICS' | translate }}");
html = html.replace(/Distributions<\/div>/g, "{{ 'DEALER_ASSIGNMENT.DISTRIBUTIONS' | translate }}</div>");
html = html.replace(/Success Rate<\/div>/g, "{{ 'DEALER_ASSIGNMENT.SUCCESS_RATE' | translate }}</div>");

// Select labels and placeholders
html = html.replace(/>State<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.STATE' | translate }}</label>");
html = html.replace(/\[placeholder\]="'Select State'"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SELECT_STATE' | translate\"");
html = html.replace(/>District<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.DISTRICT' | translate }}</label>");
html = html.replace(/\[placeholder\]="'Select District'"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SELECT_DISTRICT' | translate\"");
html = html.replace(/>Block<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.BLOCK' | translate }}</label>");
html = html.replace(/\[placeholder\]="'Select Block'"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SELECT_BLOCK' | translate\"");
html = html.replace(/>PIN Code<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.PIN_CODE' | translate }}</label>");
html = html.replace(/\[placeholder\]="'Select PIN Code'"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SELECT_PIN_CODE' | translate\"");
html = html.replace(/>Select Users to Assign<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.SELECT_USERS' | translate }}</label>");
html = html.replace(/placeholder="Select Users"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.SELECT_USERS_PLACEHOLDER' | translate\"");
html = html.replace(/>Select Products<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.SELECT_PRODUCTS' | translate }}</label>");
html = html.replace(/>Target Quantity<\/label>/g, ">{{ 'DEALER_ASSIGNMENT.TARGET_QUANTITY' | translate }}</label>");
html = html.replace(/placeholder="Enter target quantity"/g, "[placeholder]=\"'DEALER_ASSIGNMENT.TARGET_QUANTITY' | translate\"");

fs.writeFileSync(htmlPath, html, 'utf8');

// Now TypeScript Headers
const tsPath = path.join(__dirname, 'src/app/features/admin/dealer-management/dealer-assignment/dealer-assignment.component.ts');
let ts = fs.readFileSync(tsPath, 'utf8');

// The headers in ts are hardcoded
ts = ts.replace(/headers = \['Dealer', 'Area', 'Products', 'Assigned Users', 'Target Qty', 'Status', 'Date', 'Actions'\];/g, "headers = [\n    this.translate.instant('DEALER_ASSIGNMENT.DEALER_NAME'),\n    this.translate.instant('DEALER_ASSIGNMENT.AREA'),\n    this.translate.instant('DEALER_ASSIGNMENT.SELECT_PRODUCTS'),\n    this.translate.instant('DEALER_ASSIGNMENT.SELECT_USERS_PLACEHOLDER'),\n    this.translate.instant('DEALER_ASSIGNMENT.TARGET_QUANTITY'),\n    this.translate.instant('DEALER_ASSIGNMENT.STATUS'),\n    'Date',\n    this.translate.instant('COMMON.ACTION')\n  ];");

fs.writeFileSync(tsPath, ts, 'utf8');
console.log('Component replaced');
