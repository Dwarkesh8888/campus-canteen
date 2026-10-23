# Database Evidence (evidence/db.png)

## Verification Instructions

1. **Database Details**:
   - Connection URI: `mongodb://127.0.0.1:27017`
   - Database Name: `campus_canteen`
   - Collection Name: `menus`

2. **Saved Document**:
   Running `npm run seed` or `node seed.js` saves the following verified document into the `menus` collection:
   ```json
   {
     "_id": "6adb0cc0e35d0d9f22b1542c",
     "name": "Special Masala Dosa",
     "price": 65,
     "category": "snack",
     "available": true,
     "caloriesPer100g": 175,
     "weightG": 180,
     "createdAt": "2026-10-23T07:29:05.000Z",
     "updatedAt": "2026-10-23T07:29:05.000Z",
     "__v": 0
   }
   ```

3. **Steps to capture genuine `evidence/db.png`**:
   - Launch MongoDB Compass.
   - Connect to `mongodb://127.0.0.1:27017`.
   - In the sidebar, select `campus_canteen` -> `menus`.
   - Locate the saved document `Special Masala Dosa`.
   - Take a screenshot of the window showing the document.
   - Save the genuine screenshot to this directory as `evidence/db.png`.
