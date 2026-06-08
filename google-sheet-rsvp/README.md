# Google Sheet RSVP Setup

This folder contains the Apps Script starter for the standalone RSVP form in:

`rsvp-form.html`

## What it does

It accepts form submissions from the GitHub Pages site and appends them to the Google Sheet with ID:

`1fz17c8mhUFwvqRCTHK8sQZNZM08kE5mn9bHzCAo052I`

It writes into a tab named:

`RSVP Responses`

## Setup steps

1. Open [script.google.com](https://script.google.com/).
2. Create a `New project`.
3. Delete the sample code in the editor.
4. Paste in the code from `Code.gs`.
5. Save the project.
6. If you want a different tab name, change the `SHEET_NAME` constant.
7. Make sure the Google account you use has edit access to the target sheet.
8. Click `Deploy -> New deployment`.
9. Choose `Web app`.
10. Set:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
11. Copy the deployment URL.
12. If the URL changes, update `GOOGLE_SHEET_WEB_APP_URL` inside `rsvp-form.html`.

Important:

- For a public GitHub Pages RSVP form, do not use `Anyone with a Google account`.
- Use `Anyone` so guests can submit without Google sign-in problems.

## Expected columns

If the target tab is empty, the script writes these headers automatically:

- `Timestamp`
- `Full Name`
- `Contact Number`
- `Attendance`
- `Guest Count`
- `Venues`
- `Gift Choice`
- `Wishlist Category`
- `Message to the Celebrant`
- `Source`

## Test

After you deploy the Apps Script and push the page, submit one test RSVP from `rsvp-form.html` and confirm the row appears in your sheet.
