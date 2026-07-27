"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, MoreVertical, Copy, Trash2 } from "lucide-react";
import { Form, Question } from "@/types";
import { getQuestionTypeConfig, CATEGORY_COLORS } from "@/lib/questionTypes";
import clsx from "clsx";

type Selection = { type: "question"; id: number } | { type: "ending" };

interface Props {
  form: Form;
  selection: Selection;
  onSelect: (s: Selection) => void;
  onReorder: (result: DropResult) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  onAddContent: () => void;
}

export default function PagesSidebar({ form, selection, onSelect, onReorder, onDuplicate, onDelete, onAddContent }: Props) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  return (
    <aside className="w-[280px] shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 mb-6 flex items-center justify-between cursor-not-allowed">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="w-5 h-5 flex items-center justify-center border border-gray-300 rounded text-xs">=</span>
          Universal mode
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      <p className="text-sm font-semibold text-gray-800 mb-2">Pages</p>

      <div className="bg-white border border-transparent shadow-sm rounded-2xl p-2 mb-4">
        <DragDropContext onDragEnd={onReorder}>
          <Droppable droppableId="pages">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {form.questions.map((q, index) => {
                  const config = getQuestionTypeConfig(q.type);
                  const Icon = config.icon;
                  const isSelected = selection.type === "question" && selection.id === q.id;

                  return (
                    <Draggable key={q.id} draggableId={String(q.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.9 : 1 }}
                          className={clsx(
                            "group relative flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer mb-1",
                            isSelected ? "bg-gray-100 border-2 border-gray-800" : "bg-white border-2 border-transparent hover:bg-gray-50"
                          )}
                          onClick={() => onSelect({ type: "question", id: q.id })}
                        >
                          <span className={clsx("w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0", CATEGORY_COLORS[config.category])}>
                            {index + 1}
                          </span>
                          <Icon size={14} className="text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700 truncate flex-1">
                            {q.label || "Untitled question"}
                          </span>

                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === q.id ? null : q.id); }}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 shrink-0"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {menuOpenId === q.id && (
                            <div
                              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => { onDuplicate(q.id); setMenuOpenId(null); }}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy size={13} /> Duplicate
                              </button>
                              <button
                                onClick={() => { onDelete(q.id); setMenuOpenId(null); }}
                                className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={onAddContent}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 py-2 mt-1 border-t border-gray-100"
        >
          <Plus size={14} /> Add content
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-800">Endings</p>
        <button className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 cursor-not-allowed">
          <Plus size={14} />
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-2">
        <div
          onClick={() => onSelect({ type: "ending" })}
          className={clsx(
            "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-sm text-gray-700",
            selection.type === "ending" ? "bg-amber-50" : "hover:bg-gray-50"
          )}
        >
          <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs">✓</span>
          Thank you screen
        </div>
      </div>
    </aside>
  );
}