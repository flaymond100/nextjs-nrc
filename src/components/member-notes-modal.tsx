"use client";

import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Loader } from "./loader";
import { Rider } from "@/utils/types";

interface MemberNotesModalProps {
  isOpen: boolean;
  member: Rider | null;
  notes: string;
  loading?: boolean;
  onChangeNotes: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function MemberNotesModal({
  isOpen,
  member,
  notes,
  loading = false,
  onChangeNotes,
  onClose,
  onSave,
}: MemberNotesModalProps) {
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen || !member) return null;

  const fullName = `${member.firstName || ""} ${member.lastName || ""}`.trim();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <dialog
      open={isOpen}
      className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-auto bg-black bg-opacity-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="mx-4 w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <PencilSquareIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Member Notes
                </h3>
                <p className="text-sm text-gray-600">
                  {fullName || member.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <label
              className="text-sm font-bold text-gray-700"
              htmlFor="member-notes"
            >
              Notes (Markdown)
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {showPreview ? "Show Editor" : "Show Preview"}
            </button>
          </div>

          {showPreview ? (
            <div className="mb-6 min-h-[280px] max-h-[420px] overflow-y-auto rounded border border-gray-300 bg-white p-4">
              <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-700">
                {notes.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {notes}
                  </ReactMarkdown>
                ) : (
                  <p className="italic text-gray-400">
                    Start typing to see preview...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <textarea
              id="member-notes"
              rows={12}
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="Write admin notes in Markdown..."
              className="mb-6 w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm text-gray-700 focus:outline-none focus:shadow-outline"
            />
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outlined"
              placeholder={""}
              onClick={onClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              placeholder={""}
              onClick={onSave}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  <span>Saving...</span>
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
