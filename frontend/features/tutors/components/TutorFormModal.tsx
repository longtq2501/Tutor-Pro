import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Tutor, TutorRequest } from '../../../lib/services/tutor';

interface TutorFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedTutor: Tutor | null;
    onSubmit: (data: TutorRequest) => void;
    isLoading: boolean;
}

export const TutorFormModal = ({ open, onOpenChange, selectedTutor, onSubmit, isLoading }: TutorFormModalProps) => {
    const form = useForm<TutorRequest>({
        defaultValues: { fullName: '', email: '', phone: '', subscriptionPlan: 'BASIC', subscriptionStatus: 'ACTIVE' }
    });

    useEffect(() => {
        if (selectedTutor && open) {
            form.reset({
                fullName: selectedTutor.fullName,
                email: selectedTutor.email,
                phone: selectedTutor.phone,
                subscriptionPlan: selectedTutor.subscriptionPlan,
                subscriptionStatus: selectedTutor.subscriptionStatus,
            });
        } else if (open) {
            form.reset({ fullName: '', email: '', password: '', phone: '', subscriptionPlan: 'BASIC', subscriptionStatus: 'ACTIVE' });
        }
    }, [selectedTutor, form, open]);

    const handleSubmit = (data: TutorRequest) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader><DialogTitle>{selectedTutor ? 'Edit Tutor' : 'Add Tutor'}</DialogTitle></DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        {!selectedTutor && (
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}

                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="subscriptionPlan" render={({ field }) => (
                                <FormItem><FormLabel>Plan</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="BASIC">Basic</SelectItem><SelectItem value="PREMIUM">Premium</SelectItem></SelectContent></Select>
                                    <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="subscriptionStatus" render={({ field }) => (
                                <FormItem><FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="EXPIRED">Expired</SelectItem></SelectContent></Select>
                                    <FormMessage /></FormItem>
                            )} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
