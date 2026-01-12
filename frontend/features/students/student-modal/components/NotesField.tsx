interface NotesFieldProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * NotesField Component
 * Renders a labeled textarea for student notes.
 */
export function NotesField({ value, onChange }: NotesFieldProps) {
    return (
        <div className="md:col-span-2">
            <label className="block text-sm font-bold text-card-foreground mb-2">
                Ghi chú thêm
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:border-ring focus:ring-1 focus:ring-ring outline-none resize-none placeholder:text-muted-foreground text-foreground transition-all"
                placeholder="Ví dụ: Học sinh cần chú ý phần ngữ pháp..."
                rows={3}
            />
        </div>
    );
}
