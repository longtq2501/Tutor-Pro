import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import type { Tutor } from '../../../lib/services/tutor';

interface TutorTableProps {
    tutors: Tutor[];
    onView: (tutor: Tutor) => void;
    onEdit: (tutor: Tutor) => void;
    onDelete: (id: number) => void;
}

export const TutorTable = ({ tutors, onView, onEdit, onDelete }: TutorTableProps) => {
    return (
        <>
            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
                {tutors.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                        No tutors found.
                    </div>
                ) : (
                    tutors.map((tutor) => (
                        <div key={tutor.id} className="border rounded-lg p-4 bg-card shadow-sm space-y-3" onClick={() => onView(tutor)}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{tutor.fullName}</div>
                                    <div className="text-sm text-muted-foreground">{tutor.email}</div>
                                </div>
                                <Badge variant={tutor.subscriptionStatus === 'ACTIVE' ? 'default' : 'destructive'}>
                                    {tutor.subscriptionStatus}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground block text-xs">Phone</span>
                                    {tutor.phone}
                                </div>
                                <div>
                                    <span className="text-muted-foreground block text-xs">Plan</span>
                                    <Badge variant="outline" className="text-xs">{tutor.subscriptionPlan}</Badge>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t gap-2">
                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(tutor); }}>
                                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(tutor.id); }}>
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tutors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No tutors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tutors.map((tutor) => (
                                <TableRow key={tutor.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(tutor)}>
                                    <TableCell className="font-medium">{tutor.fullName}</TableCell>
                                    <TableCell>{tutor.email}</TableCell>
                                    <TableCell>{tutor.phone}</TableCell>
                                    <TableCell><Badge variant="outline">{tutor.subscriptionPlan}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={tutor.subscriptionStatus === 'ACTIVE' ? 'default' : 'destructive'}>
                                            {tutor.subscriptionStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(tutor); }}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); onDelete(tutor.id); }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};
