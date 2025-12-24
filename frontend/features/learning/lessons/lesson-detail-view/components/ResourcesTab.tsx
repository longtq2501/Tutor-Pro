// 📁 lesson-detail-view/components/ResourcesTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface ResourcesTabProps {
  resources: Lesson['resources'];
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  const getResourceColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-600/20';
      case 'LINK': return 'bg-blue-600/20';
      case 'VIDEO': return 'bg-purple-600/20';
      default: return 'bg-green-600/20';
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardContent className="pt-6">
        {resources.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p>Chưa có tài liệu nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map(resource => (
              <a
                key={resource.id}
                href={resource.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="bg-[#0A0A0A] border-[#2A2A2A] hover:border-blue-500/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`p-3 rounded-lg ${getResourceColor(resource.resourceType)}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white">{resource.title}</h4>
                      {resource.description && (
                        <p className="text-sm text-gray-400 line-clamp-1">{resource.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{resource.resourceType}</Badge>
                        {resource.fileSize && (
                          <span className="text-xs text-gray-500">{resource.formattedFileSize}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}