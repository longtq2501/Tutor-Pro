// 📁 lesson-detail-view/components/ImagesTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { Lesson } from '@/lib/types';

interface ImagesTabProps {
  images: Lesson['images'];
}

export function ImagesTab({ images = [] }: ImagesTabProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {!images || images.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p>Chưa có hình ảnh nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(image => (
              <div key={image.id} className="space-y-2">
                <div className="relative aspect-video bg-gray-100 dark:bg-black rounded-lg overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || 'Lesson image'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                {image.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}