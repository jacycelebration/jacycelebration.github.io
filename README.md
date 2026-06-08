# Event Page Starter

This folder is a ready-to-publish static site for a combined birthday and christening page on GitHub Pages.

## What to edit first

1. Open `script.js`.
2. Replace the placeholder values in `eventConfig`:
   - `eventTitle`
   - `eventDateIso`
   - `dateText`
   - `timeText`
   - `venueText`
   - `venueAddress`
   - `rsvpDeadlineText`
   - `rsvpUrl`
   - `mapUrl`
   - `googleSheetScriptUrl`
   - `hostLine`
   - `schedule`
3. Replace the sample notes for dress code, contact person, and hashtag.

## What is already on the page

- The invitation note from Mommy Kaye is now built into the site.
- The RSVP form now includes:
  - `Full Name`
  - `Can you attend?`
  - `Message to the Celebrant`
- The form is designed for GitHub Pages and can post into a Google Sheet through Apps Script.

## Replace the photos

- Swap `assets/images/cover-placeholder.svg` with your main photo.
- Swap `assets/images/gallery-01.svg`, `gallery-02.svg`, and `gallery-03.svg` with real images.
- Keep the same filenames if you want the page to work without editing the HTML.

## Connect the RSVP form to Google Sheets

Use the Apps Script starter in:

`google-sheet-rsvp/Code.gs`

### Recommended setup

1. Open [script.google.com](https://script.google.com/).
2. Create a new Apps Script project using the same Google account that can edit your sheet.
3. Replace the default script with the contents of `google-sheet-rsvp/Code.gs`.
4. The script already points to your sheet ID:
   - `1fz17c8mhUFwvqRCTHK8sQZNZM08kE5mn9bHzCAo052I`
5. If needed, change `SHEET_NAME` inside the script.
6. Click `Deploy -> New deployment`.
7. Choose `Web app`.
8. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
9. Deploy and copy the Web App URL.
10. Paste that URL into `googleSheetScriptUrl` in `script.js`.

After that, the form on the site can send responses into your Google Sheet.

Important:

- For a public GitHub Pages site, `Anyone with a Google account` is usually not enough.
- Use `Anyone`, otherwise guests may fail to submit unless they are already signed in to Google, and the site cannot reliably show that error because the request is sent from static frontend code.

### Suggested sheet columns

The script will create a header row if the target tab is empty:

- `Timestamp`
- `Full Name`
- `Attendance`
- `Message to the Celebrant`
- `Source`

## Publish on GitHub Pages

If you want the cleanest setup, create a new GitHub repository and upload the contents of this `event-page` folder.

### Option A: upload using the GitHub website

1. Create a new repository on GitHub.
2. Open that repository.
3. Upload the files from inside this folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
   - `.nojekyll`
   - `assets/`
   - `google-sheet-rsvp/`
4. Go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select branch `main` and folder `/(root)`.
7. Save and wait for the site to deploy.

Your site URL will usually be:

`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

If your repository is named exactly `YOUR-USERNAME.github.io`, then the site URL becomes:

`https://YOUR-USERNAME.github.io/`

### Option B: push with Git

```bash
git init
git add .
git commit -m "Initial event page"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
git push -u origin main
```

Then enable GitHub Pages in the repository settings using branch `main` and folder `/(root)`.

## Notes

- This is a static site, so forms do not save responses by themselves.
- This starter uses a Google Apps Script endpoint so the site can write RSVP responses into a Google Sheet.
- The client-side form uses a `no-cors` request because GitHub Pages is static. You won't get a detailed success response in the browser, so test once after deployment.
- The site includes `noindex` meta tags and a `robots.txt` file to ask search engines not to index it, but this is a best-effort privacy measure, not a hard access control.
- If you prefer the simplest route, you can also embed a Google Form that is already linked to your sheet.
