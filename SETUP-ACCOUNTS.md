# Turning on accounts

Accounts let people sign in (Google or email and password) and keep their progress on any device.
They use Firebase, which is free at this scale. One-time setup, about ten minutes:

1. Go to <https://console.firebase.google.com>, choose **Add project**, and follow the steps
   (Google Analytics is not needed).
2. **Build → Authentication → Get started.** Under *Sign-in method*, enable **Email/Password**
   and **Google**.
3. Still in Authentication, open **Settings → Authorized domains** and add your Pages domain,
   `ostriched.github.io` (and your custom domain too, if you add one later).
4. **Build → Firestore Database → Create database** (production mode, any location).
   Open the **Rules** tab, replace the contents with the contents of `firestore.rules`
   from this repository, and click **Publish**.
5. **Project settings** (gear icon) → *Your apps* → the **Web** icon (`</>`) → register an app
   (no hosting needed). Copy the `firebaseConfig` object it shows.
6. In this repository, edit `firebase-config.js` and replace `null` with that object:
   `window.KIOKU_FIREBASE = { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." };`
   Commit the change. A **Sign in** button then appears in the top bar.

These config values identify your project and are safe to publish; access is controlled
by the rules in step 4, which let each person read and write only their own progress.

### How saved progress behaves

- Signing in to a **new** account moves what you did in this browser into the account.
- Signing in to an account that **already has progress** loads that progress instead.
- **Signing out** removes progress from this browser; it stays saved in the account.
