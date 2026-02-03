// 📁 lesson-detail-view/components/ResourcesTab.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface ResourcesTabProps {
  resources: Lesson['resources'];
}

export function ResourcesTab({ resources = [] }: ResourcesTabProps) {
  const getResourceColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-700 dark:bg-red-600/20 dark:text-red-300';
      case 'LINK': return 'bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-300';
      case 'VIDEO': return 'bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-300';
      default: return 'bg-green-100 text-green-700 dark:bg-green-600/20 dark:text-green-300';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {!resources || resources.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
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
                <Card className="
                  bg-gray-50 dark:bg-[#0A0A0A] 
                  border-gray-200 dark:border-[#2A2A2A] 
                  hover:border-blue-300 dark:hover:border-blue-500/50 
                  transition-colors cursor-pointer
                ">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`p-3 rounded-lg ${getResourceColor(resource.resourceType)}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {resource.title}
                      </h4>
                      {resource.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getResourceColor(resource.resourceType)} border-transparent`}
                        >
                          {resource.resourceType}
                        </Badge>
                        {resource.fileSize && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {resource.formattedFileSize}
                          </span>
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