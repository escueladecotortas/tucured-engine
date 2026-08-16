// Archivo: frontend/src/hooks/useAdminActions.js
import { doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export const useAdminActions = (currentUser, users) => {
  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser.uid) return toast.error("Cannot change your own role.");
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole, updatedAt: serverTimestamp() });
      toast.success(`Updated role to ${newRole}`);
    } catch (error) { toast.error("Failed to update role"); }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.uid) return toast.error("Cannot delete yourself.");
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success("User deleted.");
    } catch (error) { toast.error("Failed to delete user"); }
  };

  const handleInviteUser = async (email, role) => {
    try {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        await updateDoc(doc(db, 'users', existingUser.id), { role });
        return { success: true, message: "User updated" };
      }
      await addDoc(collection(db, 'invites'), {
        email: email.toLowerCase(),
        role,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      return { success: true, message: `Invited ${email}` };
    } catch (error) { return { success: false, message: "Failed to send invite" }; }
  };

  const handleDeleteInvite = async (inviteId) => {
    if (!window.confirm("Revoke this invite?")) return;
    await deleteDoc(doc(db, 'invites', inviteId));
    toast.success("Invite revoked");
  };

  const handleCreateRole = async (name, color) => {
    try {
      const roleId = name.toLowerCase().replace(/\s+/g, '_');
      await setDoc(doc(db, 'roles', roleId), { name, color, createdAt: serverTimestamp() });
      toast.success(`Role ${name} created`);
      return true;
    } catch (error) { toast.error("Failed to create role"); return false; }
  };

  const handleDeleteRole = async (roleId) => {
    if (['admin', 'viewer'].includes(roleId)) return toast.error("Cannot delete system roles.");
    if (!window.confirm("Delete this role?")) return;
    try {
      await deleteDoc(doc(db, 'roles', roleId));
      toast.success("Role deleted");
    } catch (error) { toast.error("Failed to delete role"); }
  };

  return { handleRoleChange, handleDeleteUser, handleInviteUser, handleDeleteInvite, handleCreateRole, handleDeleteRole };
};
