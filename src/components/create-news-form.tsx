"use client";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Loader } from "@/components/loader";
import { Button } from "@material-tailwind/react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { uploadNewsImage } from "@/utils/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  main_image_url: string;
  is_published: boolean;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const newsValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .min(3, "Slug must be at least 3 characters"),
  excerpt: Yup.string().nullable(),
  content: Yup.string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters"),
  main_image_url: Yup.string().url("Invalid URL").nullable(),
  is_published: Yup.boolean(),
});

export const CreateNewsForm = () => {
  const [disabled, setDisabled] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const formik = useFormik<NewsFormData>({
    initialValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      main_image_url: "",
      is_published: false,
    },
    validationSchema: newsValidationSchema,
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        // Check if slug already exists
        const { data: existingNews } = await supabase
          .from("news")
          .select("id")
          .eq("slug", values.slug)
          .single();

        if (existingNews) {
          toast.error(
            "A news article with this slug already exists. Please use a different slug."
          );
          setDisabled(false);
          return;
        }

        const newsData = {
          title: values.title,
          slug: values.slug,
          excerpt: values.excerpt || null,
          content: values.content,
          main_image_url: values.main_image_url || null,
          published_at: values.is_published ? new Date().toISOString() : null,
          is_published: values.is_published,
          created_by: user?.id || null,
        };

        const { error } = await supabase.from("news").insert(newsData);

        if (error) {
          // Provide more helpful error messages
          if (
            error.message?.includes("row-level security") ||
            error.code === "42501"
          ) {
            toast.error(
              "Permission denied. Please ensure you have admin privileges and the RLS policies are correctly configured."
            );
            console.error("RLS Error:", error);
          } else {
            toast.error(error.message || "Failed to create news article");
          }
        } else {
          toast.success("News article created successfully!");
          router.push("/news");
        }
      } catch (err: any) {
        toast.error("An unexpected error occurred");
        console.error(err);
      } finally {
        setDisabled(false);
      }
    },
  });

  // Auto-generate slug from title (only if slug hasn't been manually edited)
  useEffect(() => {
    if (formik.values.title && !slugManuallyEdited) {
      const generatedSlug = generateSlug(formik.values.title);
      formik.setFieldValue("slug", generatedSlug, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (!slugManuallyEdited) {
      const generatedSlug = generateSlug(e.target.value);
      formik.setFieldValue("slug", generatedSlug, false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    formik.handleChange(e);
  };

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <section className="container mx-auto px-4 py-6 md:py-12 min-h-screen">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="mb-2 md:mb-4 leter-spacing-1 text-3xl md:text-5xl font-bold">
          Create New News Article
        </h1>
        <p className="leter-spacing-1 text-base md:text-xl max-w-3xl mx-auto px-2">
          Add a new news article to the website
        </p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-full md:min-w-[700px] bg-white rounded-lg shadow-lg p-4 md:p-8"
        >
          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.title && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="title"
              type="text"
              name="title"
              placeholder="News article title"
              value={formik.values.title}
              onChange={handleTitleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.title && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.title}
              </p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="slug"
            >
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border ${
                formik.errors.slug && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="slug"
              type="text"
              name="slug"
              placeholder="url-friendly-slug"
              value={formik.values.slug}
              onChange={handleSlugChange}
              onBlur={formik.handleBlur}
            />
            <p className="text-gray-500 text-xs mt-1">
              URL-friendly identifier. Auto-generated from title, but you can
              edit it.
            </p>
            {formik.errors.slug && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.slug}
              </p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="excerpt"
            >
              Excerpt
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline"
              id="excerpt"
              name="excerpt"
              rows={3}
              placeholder="Short summary or excerpt (optional)"
              value={formik.values.excerpt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <p className="text-gray-500 text-xs mt-1">
              A brief summary that will appear on the news listing page.
            </p>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="content"
              >
                Content (Markdown) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-[#37007d] hover:text-[#5a00b8] font-medium"
              >
                {showPreview ? "Show Editor" : "Show Preview"}
              </button>
            </div>

            {showPreview ? (
              <div className="min-h-[400px] border border-gray-300 rounded p-4 bg-white overflow-y-auto">
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#37007d] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-l-[#37007d] prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-lg prose-img:shadow-md">
                  {formik.values.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formik.values.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 italic">
                      Start typing to see preview...
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                className={`shadow appearance-none border ${
                  formik.errors.content && "border-red-500"
                } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline font-mono`}
                id="content"
                name="content"
                rows={15}
                placeholder="Write your news article content in Markdown format..."
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            )}
            <p className="text-gray-500 text-xs mt-1">
              Use Markdown syntax for formatting (headers, bold, lists, links,
              etc.)
            </p>
            {formik.errors.content && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.content}
              </p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="main_image_url"
            >
              Main Image
            </label>

            {/* Image Preview */}
            {(formik.values.main_image_url || imagePreview) && (
              <div className="mb-4 relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={imagePreview || formik.values.main_image_url}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
            )}

            {/* File Upload */}
            <div className="mb-3">
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingImage}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!user) {
                    toast.error("You must be logged in to upload images");
                    return;
                  }

                  // Validate file size (max 10MB)
                  if (file.size > 10 * 1024 * 1024) {
                    toast.error("Image size must be less than 10MB");
                    return;
                  }

                  // Validate file type
                  if (!file.type.startsWith("image/")) {
                    toast.error("Please select a valid image file");
                    return;
                  }

                  setUploadingImage(true);
                  try {
                    // Cleanup old preview URL if exists
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                    }

                    const publicUrl = await uploadNewsImage(file, user.id);
                    if (publicUrl) {
                      formik.setFieldValue("main_image_url", publicUrl);
                      // Create preview URL for local file
                      const previewUrl = URL.createObjectURL(file);
                      setImagePreview(previewUrl);
                      toast.success("Image uploaded successfully!");
                    }
                  } catch (err: any) {
                    toast.error(err.message || "Failed to upload image");
                  } finally {
                    setUploadingImage(false);
                  }
                }}
              />
            </div>

            {/* URL Input (Alternative) */}
            <div className="text-sm text-gray-600 mb-2">
              Or enter image URL:
            </div>
            <input
              className={`shadow appearance-none border ${
                formik.errors.main_image_url && "border-red-500"
              } rounded w-full py-2 px-3 text-gray-700 text-sm md:text-base leading-tight focus:outline-none focus:shadow-outline`}
              id="main_image_url"
              type="url"
              name="main_image_url"
              placeholder="https://example.com/image.jpg"
              value={formik.values.main_image_url}
              onChange={(e) => {
                formik.handleChange(e);
                // Cleanup preview URL when manually entering URL
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                }
              }}
              onBlur={formik.handleBlur}
            />
            {formik.errors.main_image_url && (
              <p className="text-red-500 text-xs italic mt-1">
                {formik.errors.main_image_url}
              </p>
            )}
          </div>

          <div className="mb-4 md:mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={formik.values.is_published}
                onChange={formik.handleChange}
                className="mr-2 w-5 h-5 text-[#37007d] border-gray-300 rounded focus:ring-[#37007d]"
              />
              <span className="text-gray-700 text-sm font-bold">
                Publish and show on website
              </span>
            </label>
            <p className="text-gray-500 text-xs mt-1 ml-7">
              Uncheck to save as draft (hidden from public)
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6 md:mt-8">
            <Button
              type="button"
              variant="outlined"
              placeholder={""}
              color="gray"
              onClick={() => router.push("/news")}
              disabled={disabled}
              className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ background: "#37007d" }}
              placeholder={""}
              color="gray"
              disabled={disabled}
              className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
            >
              {disabled ? <Loader /> : "Create News Article"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
