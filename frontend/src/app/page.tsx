"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { formsApi } from "@/lib/forms";
import { FormListItem } from "@/types";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import WorkspaceToolbar, { SortOption} from "@/components/dashboard/WorkspaceToolbar";
import FormListRow from "@/components/dashboard/FormListRow";
import FormGridCard from "@/components/dashboard/FormGridCard";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<SortOption>("created");

  const loadForms = async () => {
    try {
      setForms(await formsApi.list());
    } catch {
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreate = async () => {
    try {
      const form = await formsApi.create("New form");
      toast.success("Form created");
      router.push(`/builder/${form.id}`);
    } catch {
      toast.error("Failed to create form");
    }
  };

  const handleRename = async (id: number, title: string) => {
    try {
      await formsApi.update(id, { title });
      toast.success("Form renamed");
      loadForms();
    } catch {
      toast.error("Failed to rename form");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await formsApi.duplicate(id);
      toast.success("Form duplicated");
      loadForms();
    } catch {
      toast.error("Failed to duplicate form");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    try {
      await formsApi.remove(id);
      toast.success("Form deleted");
      loadForms();
    } catch {
      toast.error("Failed to delete form");
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === "published") {
        await formsApi.unpublish(id);
        toast.success("Form unpublished");
      } else {
        await formsApi.publish(id);
        toast.success("Form published");
      }
      loadForms();
    } catch {
      toast.error("Action failed");
    }
  };

  const sortedForms = [...forms].sort((a, b) => {
    if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
    if (sortBy === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="h-screen flex flex-col bg-canvas">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCreate={handleCreate} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <WorkspaceToolbar view={view} onViewChange={setView} sortBy={sortBy} onSortChange={setSortBy} />

            {loading ? (
              <div className="py-24 text-center text-gray-400">Loading...</div>
            ) : forms.length === 0 ? (
              <EmptyState onCreate={handleCreate} />
            ) : view === "list" ? (
              <div className="bg-white border border-gray-200 rounded-xl relative">
                <div className="flex items-center gap-4 px-5 py-3 text-xs font-medium text-gray-400 border-b border-gray-100 rounded-t-xl bg-white">
                  <div className="w-9" />
                  <span className="flex-1" />
                  <span className="w-20 text-center">Responses</span>
                  <span className="w-20 text-center">Completed</span>
                  <span className="w-28 text-center">Updated</span>
                  <span className="w-24 text-left">Integrations</span>
                  <div className="w-8" />
                </div>
                {sortedForms.map((form) => (
                  <FormListRow
                    key={form.id}
                    form={form}
                    onOpen={(id) => router.push(`/builder/${id}`)}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedForms.map((form) => (
                  <FormGridCard
                    key={form.id}
                    form={form}
                    onOpen={(id) => router.push(`/builder/${id}`)}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}