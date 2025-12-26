/*
  firebase-manager.js
  Lightweight wrapper that uses Firebase (compat/global SDK) when available,
  otherwise falls back to the in-browser `securityManager` stub already in the project.

  Usage:
  - Include Firebase SDK scripts (compat) and a `firebase-config.js` (copied from firebase-config.example.js)
    before including this file in your HTML, for example:

  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"></script>
  <script src="firebase-config.js"></script>
  <script src="firebase-manager.js"></script>

  If Firebase is not configured/loaded, this module will call `window.securityManager` as a fallback.
*/

(function (global) {
  const firebaseManager = {
    ready: false,
    useLocal: true,
    init: init,
    authenticate: authenticate,
    signOut: signOut,
    createUser: createUser,
    getUsers: getUsers,
    updateUserRole: updateUserRole,
    assignHostelToAdmin: assignHostelToAdmin,
    hasPermission: hasPermission,
    canAccessHostel: canAccessHostel,
    filterHostelsByRole: filterHostelsByRole,
    filterBookingsByRole: filterBookingsByRole,
    logSecurityEvent: logSecurityEvent
  };

  function init(config) {
    if (!config && typeof global.FIREBASE_CONFIG !== 'undefined') config = global.FIREBASE_CONFIG;
    if (config && global.firebase && global.firebase.initializeApp) {
      try {
        global.firebase.initializeApp(config);
        firebaseManager.auth = global.firebase.auth();
        firebaseManager.db = global.firebase.firestore();
        firebaseManager.useLocal = false;
        firebaseManager.ready = true;
        console.log('firebase-manager: initialized Firebase.');
      } catch (e) {
        console.warn('firebase-manager: Firebase initialization failed, falling back to local manager.', e);
        firebaseManager.useLocal = true;
      }
    } else {
      console.log('firebase-manager: Firebase not found or config missing. Using local securityManager fallback.');
      firebaseManager.useLocal = true;
    }
    return firebaseManager;
  }

  // Auth: returns user object or throws
  async function authenticate(email, password) {
    if (firebaseManager.useLocal) return callLocal('authenticate', email, password);
    const userCred = await firebaseManager.auth.signInWithEmailAndPassword(email, password);
    return mapFirebaseUser(userCred.user);
  }

  async function signOut() {
    if (firebaseManager.useLocal) return callLocal('signOut');
    return firebaseManager.auth.signOut();
  }

  async function createUser(userData, password) {
    if (firebaseManager.useLocal) return callLocal('createUser', userData, password);
    // create auth user then store profile in Firestore
    const uc = await firebaseManager.auth.createUserWithEmailAndPassword(userData.email, password);
    const uid = uc.user.uid;
    const profile = Object.assign({}, userData, { uid, createdAt: new Date().toISOString() });
    await firebaseManager.db.collection('users').doc(uid).set(profile);
    return profile;
  }

  async function getUsers() {
    if (firebaseManager.useLocal) return callLocal('getUsers');
    const snap = await firebaseManager.db.collection('users').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function updateUserRole(uid, role) {
    if (firebaseManager.useLocal) return callLocal('updateUserRole', uid, role);
    await firebaseManager.db.collection('users').doc(uid).update({ role });
    return { uid, role };
  }

  async function assignHostelToAdmin(uid, hostelId) {
    if (firebaseManager.useLocal) return callLocal('assignHostelToAdmin', uid, hostelId);
    const userRef = firebaseManager.db.collection('users').doc(uid);
    await userRef.update({ hostelAssigned: hostelId });
    return { uid, hostelId };
  }

  // Authorization helpers: these mirror the local securityManager API
  async function hasPermission(user, permission) {
    if (firebaseManager.useLocal) return callLocal('hasPermission', user, permission);
    if (!user) return false;
    // permissions stored on user doc as array
    if (user.permissions && Array.isArray(user.permissions)) return user.permissions.includes(permission);
    // fallback to role-based rules: superadmin -> all
    if (user.role === 'superadmin') return true;
    // otherwise, no
    return false;
  }

  async function canAccessHostel(user, hostelId) {
    if (firebaseManager.useLocal) return callLocal('canAccessHostel', user, hostelId);
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (user.hostelAssigned && user.hostelAssigned === hostelId) return true;
    return false;
  }

  async function filterHostelsByRole(user, hostels) {
    if (firebaseManager.useLocal) return callLocal('filterHostelsByRole', user, hostels);
    if (!user) return [];
    if (user.role === 'superadmin') return hostels;
    if (user.role === 'admin' && user.hostelAssigned) return hostels.filter(h => h.id === user.hostelAssigned);
    return hostels.filter(h => h.published);
  }

  async function filterBookingsByRole(user, bookings) {
    if (firebaseManager.useLocal) return callLocal('filterBookingsByRole', user, bookings);
    if (!user) return [];
    if (user.role === 'superadmin') return bookings;
    if (user.role === 'admin' && user.hostelAssigned) return bookings.filter(b => b.hostelId === user.hostelAssigned);
    return bookings.filter(b => b.userId === user.uid);
  }

  async function logSecurityEvent(evt) {
    if (firebaseManager.useLocal) return callLocal('logSecurityEvent', evt);
    try {
      await firebaseManager.db.collection('securityLogs').add(Object.assign({}, evt, { ts: new Date().toISOString() }));
    } catch (e) {
      console.warn('firebase-manager: failed to log event', e);
    }
  }

  // Helpers
  function callLocal(method, ...args) {
    if (global.securityManager && typeof global.securityManager[method] === 'function') {
      return global.securityManager[method](...args);
    }
    return Promise.reject(new Error('Local securityManager or method not available: ' + method));
  }

  function mapFirebaseUser(fbUser) {
    if (!fbUser) return null;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || null,
      phoneNumber: fbUser.phoneNumber || null
    };
  }

  // Expose globally
  global.firebaseManager = firebaseManager;

  // Attempt auto-init if a config object exists on window
  if (typeof global.FIREBASE_CONFIG !== 'undefined') {
    setTimeout(() => {
      try { init(global.FIREBASE_CONFIG); } catch (e) { /* ignore */ }
    }, 10);
  }

})(window);
