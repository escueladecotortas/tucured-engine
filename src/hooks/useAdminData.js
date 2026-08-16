// Archivo: frontend/src/hooks/useAdminData.js
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useAdminData = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), orderBy('lastLogin', 'desc'));
    const unsubscribeUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qRoles = query(collection(db, 'roles'), orderBy('name'));
    const unsubscribeRoles = onSnapshot(qRoles, (snap) => {
      setRoles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qInvites = query(collection(db, 'invites'), orderBy('createdAt', 'desc'));
    const unsubscribeInvites = onSnapshot(qInvites, (snap) => {
      setInvites(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false);
    return () => {
      unsubscribeUsers();
      unsubscribeRoles();
      unsubscribeInvites();
    };
  }, []);

  return { users, roles, invites, loading };
};
