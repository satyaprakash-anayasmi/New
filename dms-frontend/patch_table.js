const fs = require('fs');
const file = 'c:/Users/DELL/OneDrive - ARYAN INFO SERVICES/My Workplace/New/dms-frontend/src/app/shared/components/data-table/data-table.component.html';
let content = fs.readFileSync(file, 'utf8');

const svgs = {
  open: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`,
  edit: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
  delete: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`,
  approve: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`,
  reject: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`,
  recover: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`,
  archive: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`,
  block: `<svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
};

content = content.replace(/(>\s*)({{\s*'TABLE\.OPEN'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.open}$2$3`);
content = content.replace(/(>\s*)({{\s*'TABLE\.DELETE'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.delete}$2$3`);
content = content.replace(/(>\s*)({{\s*'TABLE\.APPROVE'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.approve}$2$3`);
content = content.replace(/(>\s*)({{\s*'TABLE\.REJECT'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.reject}$2$3`);
content = content.replace(/(>\s*)({{\s*'TABLE\.RESTORE_TO_ACTIVE'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.recover}$2$3`);
content = content.replace(/(>\s*)({{\s*'TABLE\.ARCHIVE'\s*\|\s*localize\s*}})(\s*<\/button>)/g, `$1${svgs.archive}$2$3`);

// Non-localized strings
content = content.replace(/(>\s*)(View)(\s*<\/button>)/g, `$1${svgs.open}$2$3`);
content = content.replace(/(>\s*)(Edit)(\s*<\/button>)/g, `$1${svgs.edit}$2$3`);
content = content.replace(/(>\s*)(Delete)(\s*<\/button>)/g, `$1${svgs.delete}$2$3`);
content = content.replace(/(>\s*)(Block)(\s*<\/button>)/g, `$1${svgs.block}$2$3`);
content = content.replace(/(>\s*)(Recover)(\s*<\/button>)/g, `$1${svgs.recover}$2$3`);
content = content.replace(/(>\s*)(Perm\. Delete)(\s*<\/button>)/g, `$1${svgs.delete}$2$3`);
content = content.replace(/(>\s*)(Deactivate)(\s*<\/button>)/g, `$1${svgs.block}$2$3`);
content = content.replace(/(>\s*)(Approve)(\s*<\/button>)/g, `$1${svgs.approve}$2$3`);
content = content.replace(/(>\s*)(Reject)(\s*<\/button>)/g, `$1${svgs.reject}$2$3`);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched');
