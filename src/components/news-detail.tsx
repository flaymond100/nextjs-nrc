"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { News } from "@/utils/types";
import Image from "next/image";
import { format } from "date-fns";
import { NavigationLink } from "./navigation-link";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import toast from "react-hot-toast";
import { ConfirmModal } from "./confirm-modal";
import { Loader } from "./loader";

interface NewsDetailProps {
  article: News;
}

export function NewsDetail({ article }: NewsDetailProps) {
  const publishedDate = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : null;
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Redirect non-admins away from draft articles
  // Note: This is a client-side check. With static export, the content is in the HTML,
  // but this prevents non-admins from seeing it in the browser.
  useEffect(() => {
    if (!article.is_published && !isAdmin) {
      router.push("/news");
    }
  }, [article.is_published, isAdmin, router]);

  // Don't render draft articles for non-admins
  if (!article.is_published && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("news")
        .delete()
        .eq("id", article.id);

      if (deleteError) {
        toast.error(deleteError.message || "Failed to delete news article");
        console.error("Error deleting news:", deleteError);
        setShowDeleteModal(false);
      } else {
        toast.success("News article deleted successfully!");
        setShowDeleteModal(false);
        // Redirect to news list after a short delay
        setTimeout(() => {
          router.push("/news");
        }, 1000);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
      console.error("Unexpected error:", err);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <article className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
      {/* Back Navigation and Admin Actions */}
      <div className="mb-6 flex items-center justify-between">
        <NavigationLink
          href="/news"
          className="inline-flex items-center text-[#37007d] hover:text-[#5a00b8] transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="font-medium">Back to News</span>
        </NavigationLink>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <NavigationLink href={`/news/${article.slug}/edit`}>
              <Button
                variant="outlined"
                placeholder={""}
                color="gray"
                size="sm"
                className="flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </Button>
            </NavigationLink>
            <Button
              variant="outlined"
              placeholder={""}
              color="red"
              size="sm"
              onClick={handleDeleteClick}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              {deleting ? (
                <Loader />
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="mb-6 md:mb-8">
        {publishedDate && (
          <p className="text-sm md:text-base text-gray-500 mb-4">
            {publishedDate}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg md:text-xl text-gray-600 italic">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Main Image */}
      {article.main_image_url && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-8 md:mb-12 rounded-lg overflow-hidden">
          <Image
            src={article.main_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#37007d] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-l-[#37007d] prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Published on {publishedDate || "Unknown date"}
        </p>
      </footer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete News Article"
        message={`Are you sure you want to delete "${article.title}"? This action cannot be undone and all associated data will be permanently removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
        loading={deleting}
      />
    </article>
  );
}
