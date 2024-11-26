"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useIdeas } from "@/hooks/use-ideas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Heart,
  MessageSquare,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditIdeaDialog } from "./edit-idea-dialog";
import toast from "react-hot-toast";
import { Idea, Like } from "@/types/ideas";

interface IdeasGridProps {
  department?: string;
}

export function IdeasGrid({ department }: IdeasGridProps) {
  const { user } = useUser();
  const { ideas, isLoading, isError, mutate } = useIdeas(department);
  const [editingIdea, setEditingIdea] = useState<number | null>(null);
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <IdeasGridSkeleton />;
  if (isError) return <div>Failed to load ideas</div>;
  if (!ideas?.length) return <div>No ideas found</div>;

  const handleDelete = async (ideaId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete idea");
      mutate(); // Refresh the ideas list
    } catch (error) {
      console.error("Failed to delete idea:", error);
    }
  };

  const handleLike = async (ideaId: number) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/like`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to like idea");
      mutate();
    } catch (error) {
      toast.error("Failed to like idea");
    }
  };

  const handleComment = async (ideaId: number) => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      if (!response.ok) throw new Error("Failed to add comment");

      setComment("");
      setCommentingOn(null);
      mutate();
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
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
                </div>
                <span>{new Date(idea.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex justify-between w-full">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(idea.id)}
                    className={
                      idea.likes_by.some(like => like.user_id === user?.id)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {idea._count.likes_by}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCommentingOn(commentingOn === idea.id ? null : idea.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {idea._count.comments}
                  </Button>
                </div>
              </div>

              {(commentingOn === idea.id || idea.comments.length > 0) && (
                <div className="w-full space-y-4">
                  {idea.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {comment.user_id === user?.id ? 'You' : 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}

                  {commentingOn === idea.id && (
                    <div className="space-y-2">
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="mb-2"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCommentingOn(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleComment(idea.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <EditIdeaDialog
        ideaId={editingIdea}
        open={!!editingIdea}
        onOpenChange={(open) => !open && setEditingIdea(null)}
        onSave={() => {
          setEditingIdea(null);
          mutate();
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
