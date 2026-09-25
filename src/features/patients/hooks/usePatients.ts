import React, { useState, useMemo } from 'react';
import { usePatientStore } from '../../../stores/patientStore';
import { Patient } from '../../../types';
import { showConfirm, showAlert } from '../../../stores/dialogStore';

export function usePatients() {
  const { patients, addPatient, deletePatient, editPatient } = usePatientStore();
  const [filterText, setFilterText] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states inside new patient builder
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newStatus, setNewStatus] = useState<Patient['status']>('Normal');

  // Form states inside edit patient builder
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState<number | ''>('');
  const [editGender, setEditGender] = useState<'L' | 'P'>('L');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState<Patient['status']>('Normal');

  // Filter patients based on query
  const filtered = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()) ||
        p.id.toLowerCase().includes(filterText.toLowerCase()) ||
        (p.phone && p.phone.toLowerCase().includes(filterText.toLowerCase())) ||
        (p.address && p.address.toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [patients, filterText]);

  // Pagination calculations
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  }, [filtered.length, itemsPerPage]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage]);

  const paginated = useMemo(() => {
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, startIndex, itemsPerPage]);

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAge) {
      await showAlert({
        title: 'Data Belum Lengkap',
        message: 'Nama Lengkap dan Usia wajib diisi untuk menambahkan pasien baru.',
        variant: 'warning',
      });
      return;
    }

    await addPatient({
      name: newName,
      age: Number(newAge),
      gender: newGender,
      phone: newPhone || '',
      email: newEmail || '',
      address: newAddress || '',
      status: newStatus,
    });
    setIsAddOpen(false);

    // Reset Form
    setNewName('');
    setNewAge('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewStatus('Normal');
  };

  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setEditName(patient.name);
    setEditAge(patient.age);
    setEditGender(patient.gender);
    setEditPhone(patient.phone || '');
    setEditEmail(patient.email || '');
    setEditAddress(patient.address || '');
    setEditStatus(patient.status);
    setIsEditOpen(true);
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    if (!editName.trim() || !editAge) {
      await showAlert({
        title: 'Data Belum Lengkap',
        message: 'Nama Lengkap dan Usia wajib diisi untuk memperbarui data pasien.',
        variant: 'warning',
      });
      return;
    }

    await editPatient({
      ...editingPatient,
      name: editName,
      age: Number(editAge),
      gender: editGender,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
      status: editStatus,
    });

    // Also update selectedPatient if currently viewed
    if (selectedPatient?.id === editingPatient.id) {
      setSelectedPatient({
        ...selectedPatient,
        name: editName,
        age: Number(editAge),
        gender: editGender,
        phone: editPhone,
        email: editEmail,
        address: editAddress,
        status: editStatus,
      });
    }

    setIsEditOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Hapus Data Pasien',
      message: 'Apakah Anda yakin ingin menghapus data pasien ini secara permanen dari sistem? Data yang terhapus tidak dapat dikembalikan.',
      confirmText: 'Hapus Pasien',
      cancelText: 'Batal',
      variant: 'danger',
    });

    if (confirmed) {
      deletePatient(id);
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return {
    patients,
    filterText,
    setFilterText: (val: string) => {
      setFilterText(val);
      setCurrentPage(1);
    },
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
    paginated,
    filtered,

    // Add modal
    isAddOpen,
    setIsAddOpen,
    newName,
    setNewName,
    newAge,
    setNewAge,
    newGender,
    setNewGender,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newStatus,
    setNewStatus,
    handleCreatePatient,

    // Edit modal
    isEditOpen,
    setIsEditOpen,
    editingPatient,
    editName,
    setEditName,
    editAge,
    setEditAge,
    editGender,
    setEditGender,
    editPhone,
    setEditPhone,
    editEmail,
    setEditEmail,
    editAddress,
    setEditAddress,
    editStatus,
    setEditStatus,
    handleOpenEdit,
    handleUpdatePatient,

    // Detail & delete
    selectedPatient,
    setSelectedPatient,
    handleDeletePatient,
  };
}
