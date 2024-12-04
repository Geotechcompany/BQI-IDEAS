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
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Heart,

} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { EditIdeaDialog } from "./edit-idea-dialog";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CommentSection } from "./comment-section";
import { IdeaNotes } from "./idea-notes";

interface IdeasGridProps {
  department?: string;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  author_id: string;
  category: string;
  status: string;
  created_at: string;
  department: string;
  likes_by: Array<{ user_id: string }>;
  comments: Comment[];
  _count: { likes_by: number };
  notes?: string;
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
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden border-2 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-indigo-900 font-bold">
                      {idea.title}
                    </CardTitle>
                    <p className="text-sm text-indigo-600 mt-1">
                      Posted by {idea.author_id === user?.id ? "You" : "User"}
                    </p>
                  </div>
                  {user?.id === idea.author_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingIdea(idea.id)}
                        >
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
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <p className="text-gray-600 leading-relaxed">
                  {idea.description}
                </p>

                <div className="mt-6">
                  <IdeaNotes
                    ideaId={idea.id}
                    initialNotes={idea.notes}
                    onNotesChange={async (notes) => {
                      try {
                        await fetch(`/api/ideas/${idea.id}/notes`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ notes }),
                        });
                        mutate();
                      } catch (error) {
                        toast.error("Failed to update notes");
                      }
                    }}
                  />
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(idea.category)} px-3 py-1`}
                    >
                      {idea.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 px-3 py-1"
                    >
                      {idea.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-600 px-3 py-1"
                    >
                      {idea.department}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div className="flex justify-between w-full">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(idea.id)}
                      className={`hover:text-red-500 transition-colors ${
                        idea.likes_by.some((like) => like.user_id === user?.id)
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${
                          idea.likes_by.some(
                            (like) => like.user_id === user?.id
                          )
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {idea._count.likes_by}
                    </Button>

                    <CommentSection
                      ideaId={idea.id}
                      comments={idea.comments}
                      onCommentAdded={() => mutate()}
                      onCommentDeleted={() => mutate()}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <EditIdeaDialog
        ideaId={editingIdea}
        open={!!editingIdea}
        onOpenChange={(open) => {
          if (!open) setEditingIdea(null);
        }}
        onSave={() => {
          mutate(); // Refresh the ideas list after saving
          setEditingIdea(null);
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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    feature: "border-blue-500 text-blue-600 bg-blue-50",
    bug: "border-red-500 text-red-600 bg-red-50",
    improvement: "border-green-500 text-green-600 bg-green-50",
    default: "border-gray-500 text-gray-600 bg-gray-50",
  };

  return colors[category.toLowerCase()] || colors.default;
}
