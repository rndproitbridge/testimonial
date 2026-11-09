/**
 * PROITBRIDGE Success Stories: Google Sheet helper.
 *
 * Install (once): Extensions → Apps Script → delete any code there → paste this
 * whole file → Save → choose "setupSheet" in the toolbar → Run → allow access.
 * After that, the sheet has a "Success Stories" menu to re-run it any time.
 *
 * What it does:
 *  - creates a "Lists" tab holding every dropdown's options
 *  - adds dropdowns to Publish, Type, Category, Featured, Masked, Stars,
 *    Source, Mentor (Stories tab) and Where (Stats tab)
 *  - Package (LPA): numbers only. Offer date: real dates with a date picker.
 *  - greys out rows where Publish = No, styles the header, adds column tips
 * Safe to run again: it never deletes stories, and it keeps the mentors /
 * sources / tags your team added to the Lists tab.
 */

// Fixed lists: the website only understands these exact values.
var FIXED = {
  'Type': ['Offer', 'Review', 'Video', 'Voice', 'Quote', 'Proof'],
  'Category': ['College Student', 'Fresher', 'Career Gap', 'Non-IT → AI', 'IT → AI Switch', 'IT Upskill'],
  'Yes / No': ['Yes', 'No'],
  'Stars': ['5', '4', '3', '2', '1'],
  'Where (Stats tab)': ['band', 'trust', 'company']
};
// Editable lists: starting values only. Add more rows in the Lists tab any time.
var EDITABLE = {
  'Source': ['Google', "Mentors' channel", 'WhatsApp', 'LinkedIn', 'Instagram', 'YouTube', 'Email'],
  'Mentor': ['Arivazhagi', 'Diya', 'Jagadeeshwari', 'Navin Prabhu', 'Priya V', 'Rakshitha V R', 'Roshan S', 'Silpa'],
  'Tags': ['Salary hike', 'Career switch', 'Internal move', 'Abroad', 'Campus offer', 'Promotion', 'Real message', 'Referral', 'Vertical']
};

var TIPS = {
  'Publish': 'Yes = show on the website. No = hidden (drafts, waiting for consent).',
  'Type': 'Offer, Review, Video, Voice, Quote (photo + words) or Proof (recruiter / referral message).',
  'Category': 'Where the learner started. Leave empty to show under "All stories" only.',
  'Tags': 'Optional labels, comma-separated, e.g. "Abroad, Salary hike". They become filter buttons.',
  'Featured': 'Yes = pinned first. The first featured Video becomes the big video at the top.',
  'Masked': 'Yes = hide name, company, city, package, photo, batch and mentor. Also leave those cells EMPTY here: this sheet is public.',
  'Photo': 'Headshot: an image file in assets/, a Google Drive link, or any direct image link (public).',
  'Package (LPA)': 'Number only, e.g. 6.5. No "LPA" text.',
  'Offer date': 'Double-click for a date picker. Offers from the last 45 days get a "New" badge.',
  'Headline': 'Big text when there is no package / review label / video title. **word** = highlighted.',
  'Text': 'Review or quote words. **phrase** = highlighted. Never start with "=".',
  'Media': 'Any viewable link: Google Drive, YouTube, Vimeo, Loom, Instagram, LinkedIn or Facebook post, SoundCloud, Dropbox, a direct image / video / audio / PDF link, or a file in assets/. Other links open in a new tab. Make sure the link is public.',
  'Poster': 'Video thumbnail image (optional: YouTube and Drive thumbnails are found automatically).',
  'Duration': 'Video or voice length, e.g. 02:17.'
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Success Stories')
    .addItem('Set up / refresh dropdowns', 'setupSheet')
    .addItem('Link media from a Drive folder', 'linkMediaFromDrive')
    .addToUi();
}

/**
 * Replaces every local path (assets/…/file.jpg) in Photo, Media and Poster with the
 * Google Drive link of the file with the same name inside a Drive folder you choose.
 * Upload the website's "assets" folder to Drive first (subfolders are searched too).
 * Each matched file is also set to "Anyone with the link can view" so the website can show it.
 */
function linkMediaFromDrive() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Link media from Google Drive',
    'Paste the link of the Drive folder you uploaded the "assets" folder to:', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  var text = resp.getResponseText().trim();
  var m = text.match(/folders\/([\w-]{10,})/) || text.match(/[?&]id=([\w-]{10,})/) || text.match(/^([\w-]{20,})$/);
  if (!m) { ui.alert('That is not a Google Drive folder link. In Drive, right-click the folder → Share → Copy link.'); return; }
  var folder;
  try { folder = DriveApp.getFolderById(m[1]); } catch (e) { ui.alert('Could not open that folder. Make sure you are signed in with the account that owns it.'); return; }

  var files = {}; collectFiles_(folder, files);
  var sh = SpreadsheetApp.getActive().getSheetByName('Stories');
  if (!sh) { ui.alert('There is no tab named "Stories".'); return; }
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var last = sh.getLastRow(); if (last < 2) { ui.alert('The Stories tab has no rows yet.'); return; }

  var changed = 0, shared = 0, missing = [];
  ['Photo', 'Media', 'Poster'].forEach(function (name) {
    var c = head.indexOf(name) + 1; if (!c) return;
    var range = sh.getRange(2, c, last - 1, 1), vals = range.getValues();
    vals.forEach(function (row, i) {
      var v = String(row[0]).trim();
      if (!v || /^https?:\/\//i.test(v)) return;            // empty or already a web link
      var f = files[v.split('/').pop().toLowerCase()];
      if (!f) { missing.push('Row ' + (i + 2) + ' · ' + name + ': ' + v); return; }
      try { f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); shared++; } catch (e) {}
      row[0] = 'https://drive.google.com/file/d/' + f.getId() + '/view';
      changed++;
    });
    range.setValues(vals);
  });
  ui.alert('Done ✓\n\n' + changed + ' cells now point to Google Drive (' + shared + ' files set to "Anyone with the link").' +
    (missing.length ? '\n\nNot found in that folder (upload these, then run this again):\n' + missing.join('\n') : '\n\nEvery local path was replaced.'));
}

function collectFiles_(folder, out) {
  var it = folder.getFiles();
  while (it.hasNext()) { var f = it.next(); out[f.getName().toLowerCase()] = f; }
  var sub = folder.getFolders();
  while (sub.hasNext()) collectFiles_(sub.next(), out);
}

function setupSheet() {
  var ss = SpreadsheetApp.getActive();
  var stories = ss.getSheetByName('Stories');
  if (!stories) throw new Error('There is no tab named "Stories". Rename your stories tab to Stories and run again.');
  var lists = buildLists_(ss);

  // ----- Stories tab -----
  var head = stories.getRange(1, 1, 1, stories.getLastColumn()).getValues()[0].map(String);
  var rows = Math.max(stories.getMaxRows() - 1, 1000);
  if (stories.getMaxRows() < rows + 1) stories.insertRowsAfter(stories.getMaxRows(), rows + 1 - stories.getMaxRows());
  function col(name) { return head.indexOf(name) + 1; }
  function body(name) { var c = col(name); return c ? stories.getRange(2, c, rows, 1) : null; }
  function dropdown(name, listName, strict, help) {
    var r = body(name); if (!r) return;
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(lists[listName], true)
      .setAllowInvalid(!strict)
      .setHelpText(help || TIPS[name] || '')
      .build();
    r.setDataValidation(rule);
  }
  dropdown('Publish', 'Yes / No', true);
  dropdown('Type', 'Type', true);
  dropdown('Category', 'Category', true);
  dropdown('Featured', 'Yes / No', true);
  dropdown('Masked', 'Yes / No', true);
  dropdown('Stars', 'Stars', true, 'Google star rating, 1 to 5 (reviews only).');
  dropdown('Source', 'Source', false, 'Pick one, or add a new source to the Lists tab.');
  dropdown('Mentor', 'Mentor', false, 'Pick a mentor, or add a new name to the Lists tab.');

  // Package: numbers only (converts existing "33" text to the number 33)
  var pk = body('Package (LPA)');
  if (pk) {
    var pv = pk.getValues().map(function (r) { var v = r[0]; return [typeof v === 'string' && /^\s*\d+(\.\d+)?\s*$/.test(v) ? Number(v) : v]; });
    pk.setValues(pv).setNumberFormat('General');
    pk.setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(0, 500).setAllowInvalid(false).setHelpText(TIPS['Package (LPA)']).build());
  }
  // Stars stored as numbers too
  var sr = body('Stars');
  if (sr) sr.setValues(sr.getValues().map(function (r) { var v = r[0]; return [typeof v === 'string' && /^\s*[1-5]\s*$/.test(v) ? Number(v) : v]; }));
  // Offer date: real dates shown as yyyy-mm-dd, with a date picker
  var dt = body('Offer date');
  if (dt) {
    dt.setNumberFormat('yyyy-mm-dd');
    dt.setValues(dt.getValues());   // re-enter text like "2026-08-24" so Sheets turns it into a real date
    dt.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).setHelpText(TIPS['Offer date']).build());
  }
  // Long text wraps
  ['Text', 'Program', 'Modules'].forEach(function (n) { var r = body(n); if (r) r.setWrap(true); });

  // Header: style, freeze, tips
  var hr = stories.getRange(1, 1, 1, head.length);
  hr.setFontWeight('bold').setBackground('#0a1f44').setFontColor('#ffffff').setVerticalAlignment('middle');
  stories.setFrozenRows(1);
  head.forEach(function (h, i) { if (TIPS[h]) stories.getRange(1, i + 1).setNote(TIPS[h]); });

  // Grey out rows that are not published
  var pc = col('Publish');
  if (pc) {
    var letter = colLetter_(pc);
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$' + letter + '2="No"')
      .setFontColor('#9aa5b4').setBackground('#f1f4f8')
      .setRanges([stories.getRange(2, 1, rows, head.length)])
      .build();
    stories.setConditionalFormatRules([rule]);
  }

  // ----- Stats tab -----
  var stats = ss.getSheetByName('Stats');
  if (stats) {
    var sh = stats.getRange(1, 1, 1, Math.max(stats.getLastColumn(), 1)).getValues()[0].map(String);
    var w = sh.indexOf('Where') + 1;
    if (w) {
      stats.getRange(2, w, Math.max(stats.getMaxRows() - 1, 100), 1).setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInRange(lists['Where (Stats tab)'], true).setAllowInvalid(false)
          .setHelpText('band = big number boxes · trust = small line under the hero buttons · company = add a name to the company strip').build());
    }
    stats.getRange(1, 1, 1, sh.length).setFontWeight('bold').setBackground('#0a1f44').setFontColor('#ffffff');
    stats.setFrozenRows(1);
  }

  ss.setActiveSheet(stories);
  SpreadsheetApp.getUi().alert('Done ✓\n\nDropdowns are on: Publish, Type, Category, Featured, Masked, Stars, Source, Mentor (Stories) and Where (Stats).\n\nTo add a mentor, source or tag, type it at the bottom of its column in the "Lists" tab.\n\nCells with a small red triangle hold a value that is not allowed. Hover to see why.');
}

// Builds (or refreshes) the Lists tab and returns {listName: range}
function buildLists_(ss) {
  var sh = ss.getSheetByName('Lists') || ss.insertSheet('Lists');
  var names = Object.keys(FIXED).concat(Object.keys(EDITABLE));
  var existing = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String) : [];
  var out = {};
  names.forEach(function (name, i) {
    var c = i + 1;
    var isFixed = Object.prototype.hasOwnProperty.call(FIXED, name);
    var current = [];
    var oldCol = existing.indexOf(name) + 1;
    if (!isFixed && oldCol && sh.getLastRow() > 1) {
      current = sh.getRange(2, oldCol, sh.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).trim(); }).filter(String);
    }
    var values = isFixed ? FIXED[name] : (current.length ? current : EDITABLE[name]);
    sh.getRange(1, c, Math.max(sh.getMaxRows(), 200), 1).clearContent();
    sh.getRange(1, c).setValue(name);
    sh.getRange(2, c, values.length, 1).setValues(values.map(function (v) { return [v]; }));
    if (isFixed) sh.getRange(2, c, 1, 1).setNote('Fixed list: the website only understands these values. Do not edit.');
    out[name] = sh.getRange(2, c, Math.max(sh.getMaxRows(), 200) - 1, 1);   // open-ended: new rows are picked up
  });
  sh.getRange(1, 1, 1, names.length).setFontWeight('bold').setBackground('#0a1f44').setFontColor('#ffffff');
  sh.getRange(2, 1, Math.max(sh.getMaxRows(), 200) - 1, Object.keys(FIXED).length).setBackground('#f1f4f8');
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, names.length);
  return out;
}

function colLetter_(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
