import { BasicInfoFields } from './BasicInfoFields';
import { ParentSelector } from './ParentSelector';
import { StatusToggle } from './StatusToggle';
import { StartMonthField } from './StartMonthField';
import { NotesField } from './NotesField';
import type { StudentRequest, Parent } from '@/lib/types';

interface StudentFormFieldsProps {
    formData: StudentRequest;
    parents: Parent[];
    loadingParents: boolean;
    updateField: <K extends keyof StudentRequest>(field: K, value: StudentRequest[K]) => void;
}

/**
 * StudentFormFields Component
 * Orchestrates the full form layout for student information.
 */
export function StudentFormFields({
    formData,
    parents,
    loadingParents,
    updateField
}: StudentFormFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <BasicInfoFields
                name={formData.name}
                phone={formData.phone || ''}
                schedule={formData.schedule}
                pricePerHour={formData.pricePerHour}
                onChange={updateField}
            />

            {/* Right Column */}
            <div className="space-y-6">
                <ParentSelector
                    parentId={formData.parentId}
                    parents={parents}
                    loading={loadingParents}
                    onChange={(parentId) => updateField('parentId', parentId)}
                />

                <StartMonthField
                    value={formData.startMonth || ''}
                    onChange={(val) => updateField('startMonth', val)}
                />

                <StatusToggle
                    active={formData.active ?? true}
                    onChange={(active: boolean) => updateField('active', active)}
                />
            </div>

            {/* Full Width Footer Section */}
            <NotesField
                value={formData.notes || ''}
                onChange={(val) => updateField('notes', val)}
            />
        </div>
    );
}
