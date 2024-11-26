"use client";

import { useUser } from "@clerk/nextjs"
import { useIdeas } from "@/hooks/use-ideas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { EditIdeaDialog } from "./edit-idea-dialog";

interface IdeasGridProps {
  department?: string;
}

export function IdeasGrid({ department }: IdeasGridProps) {
  const { user } = useUser();
  const { ideas, isLoading, isError, mutate } = useIdeas(department);
  const [editingIdea, setEditingIdea] = useState<number | null>(null);

  if (isLoading) return <IdeasGridSkeleton />;
  if (isError) return <div>Failed to load ideas</div>;
  if (!ideas?.length) return <div>No ideas found</div>;

  const handleDelete = async (ideaId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete idea');
      mutate(); // Refresh the ideas list
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {ideas.map((idea) => (
          <Card key={idea.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle>{idea.title}</CardTitle>
              {user?.id === idea.author_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingIdea(idea.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(idea.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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

      <EditIdeaDialog
        ideaId={editingIdea}
        open={!!editingIdea}
        onOpenChange={(open) => !open && setEditingIdea(null)}
        onSave={() => {
          setEditingIdea(null)
          mutate()
        }}
      />
    </>
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
