"use client";

import { useState } from 'react';
import { useTutors } from './hooks/useTutors';
import { TutorTable } from './components/TutorTable';
import { TutorFormModal } from './components/TutorFormModal';
import { TutorDetailModal } from './components/TutorDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import type { Tutor, TutorRequest } from '../../lib/services/tutor';
import { DashboardHeader } from '@/contexts/UIContext';

export default function TutorsFeature() {
    const {
        tutors, page, pageSize, search, status, totalPages, isLoading,
        setPage, setSearch, setStatus, createTutor, updateTutor, deleteTutor, isCreating, isUpdating
    } = useTutors();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

    const handleCreate = () => {
        setSelectedTutor(null);
        setIsFormModalOpen(true);
    };

    const handleView = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsViewModalOpen(true);
    };

    const handleEdit = (tutor: Tutor) => {
        setSelectedTutor(tutor);
        setIsFormModalOpen(true);
    };

    const handleEditFromView = () => {
        setIsViewModalOpen(false);
        setIsFormModalOpen(true);
    };

    const handleSubmit = (data: TutorRequest) => {
        if (selectedTutor) {
            updateTutor({ id: selectedTutor.id, data }, { onSuccess: () => setIsFormModalOpen(false) });
        } else {
            createTutor(data, { onSuccess: () => setIsFormModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tutor?')) {
            deleteTutor(id);
        }
    };

    return (
        <div className="space-y-6 p-6 w-full">
            <DashboardHeader
                title="Gia sư"
                subtitle="Quản lý danh sách gia sư trong hệ thống"
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Thêm gia sư
                    </Button>
                }
            />

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tutors..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <TutorTable
                        tutors={tutors}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Simple Pagination */}
                    <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
                        <div className="text-sm font-medium">Page {page + 1} of {totalPages || 1}</div>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= (totalPages - 1)}>Next</Button>
                    </div>
                </>
            )}

            <TutorFormModal
                open={isFormModalOpen}
                onOpenChange={setIsFormModalOpen}
                selectedTutor={selectedTutor}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />

            <TutorDetailModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                tutor={selectedTutor}
                onEdit={handleEditFromView}
            />
        </div>
    );
}
