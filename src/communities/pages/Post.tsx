import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ChevronRight,
  Home,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton } from "../components/ui/skeleton";
import { safeFetch } from "../utils/safeFetch";

interface PostSummary {
  id: string;
  title: string;
  content: string | null;
  community_id: string | null;
  community_name: string | null;
  created_by: string | null;
  created_at: string;
  author_username: string | null;
  author_avatar: string | null;
  helpful_count: number | null;
  insightful_count: number | null;
  comment_count: number | null;
  tags: string[] | null;
  status: "active" | "flagged" | "deleted";
}

const LoadingState = () => (
  <div className="max-w-3xl mx-auto">
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="max-w-3xl mx-auto">
    <Card className="border-red-200 bg-red-50/60">
      <CardContent className="py-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{message}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = async () => {
    if (!id) {
      setError("Post identifier is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const query = supabase
      .from("posts_with_reactions")
      .select(
        "id, title, content, community_id, community_name, created_by, created_at, author_username, author_avatar, helpful_count, insightful_count, comment_count, tags, status"
      )
      .eq("id", id)
      .maybeSingle();

    const [data, fetchError] = await safeFetch<PostSummary | null>(query);

    if (fetchError) {
      setError("Failed to load this post. Please try again.");
      setPost(null);
    } else if (!data) {
      setError("We could not find that post. It may have been removed.");
      setPost(null);
    } else {
      setPost(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <MainLayout hidePageLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/community"
                  className="inline-flex items-center hover:text-gray-900"
                >
                  <Home size={16} className="mr-1" />
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <Link
                    to="/feed"
                    className="ml-1 text-gray-500 hover:text-gray-900 md:ml-2"
                  >
                    Community Feed
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="ml-1 font-medium text-gray-700 md:ml-2">
                    Post
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {loading && <LoadingState />}

          {!loading && error && <ErrorState message={error} onRetry={loadPost} />}

          {!loading && !error && post && (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {post.community_name ? (
                    <Link
                      to={`/community/${post.community_id}`}
                      className="inline-flex items-center rounded-full bg-dq-navy/10 px-3 py-1 text-xs font-medium text-dq-navy hover:bg-dq-navy/20"
                    >
                      {post.community_name}
                    </Link>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Community
                    </Badge>
                  )}

                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </span>

                  {post.status !== "active" && (
                    <>
                      <span>•</span>
                      <Badge variant="destructive" className="text-xs">
                        {post.status}
                      </Badge>
                    </>
                  )}
                </div>

                <CardTitle className="text-2xl sm:text-3xl text-gray-900">
                  {post.title}
                </CardTitle>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Avatar className="h-9 w-9 border border-gray-200">
                    <AvatarImage src={post.author_avatar || undefined} />
                    <AvatarFallback>
                      {post.author_username?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {post.author_username || "Community member"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Shared{" "}
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs font-medium"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-base leading-relaxed text-gray-700">
                  {post.content
                    ? post.content.length > 600
                      ? `${post.content.slice(0, 600)}…`
                      : post.content
                    : "No description was provided for this post."}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
                    <ThumbsUp className="h-4 w-4 text-dq-navy" />
                    <span className="font-medium text-gray-900">
                      {post.helpful_count ?? 0}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Helpful
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-gray-900">
                      {post.insightful_count ?? 0}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Insightful
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-gray-900">
                      {post.comment_count ?? 0}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Comments
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link to={`/post/${post.id}`}>View full discussion</Link>
                  </Button>
                  {post.community_id && (
                    <Button asChild variant="outline">
                      <Link to={`/community/${post.community_id}`}>
                        Browse community
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}