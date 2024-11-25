"use client";

import { useIdeas } from "@/hooks/use-ideas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface IdeasGridProps {
  department?: string;
}

export function IdeasGrid({ department }: IdeasGridProps) {
  const { ideas, isLoading, isError } = useIdeas(department);

  if (isLoading) return <IdeasGridSkeleton />;
  if (isError) return <div>Failed to load ideas</div>;
  if (!ideas?.length) return <div>No ideas found</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {ideas.map((idea) => (
        <Card key={idea.id}>
          <CardHeader>
            <CardTitle>{idea.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{idea.description}</p>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div className="flex gap-2">
                <Badge variant="secondary">{idea.category}</Badge>
                <Badge variant="outline">{idea._count.likes_by} likes</Badge>
                <Badge variant="outline">{idea._count.comments} comments</Badge>
                
              </div>
              <span>{new Date(idea.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IdeasGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
            <div className="mt-4 flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
