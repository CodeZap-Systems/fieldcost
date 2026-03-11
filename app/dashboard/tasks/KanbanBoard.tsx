"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

interface Task {
  id: number;
  name: string;
  status: string;
  seconds: number;
}

const STATUSES = ["todo", "in-progress", "done"];

export default function KanbanBoard({ tasks, onStatusChange }: { tasks: Task[]; onStatusChange: (id: number, status: string) => void }) {
  const [columns, setColumns] = useState<Record<string, Task[]>>(() => {
    const grouped: Record<string, Task[]> = { todo: [], "in-progress": [], done: [] };
    tasks.forEach(t => grouped[t.status]?.push(t));
    return grouped;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- rebuild columns when upstream tasks array changes
    setColumns(() => {
      const next: Record<string, Task[]> = { todo: [], "in-progress": [], done: [] };
      tasks.forEach(t => next[t.status]?.push(t));
      return next;
    });
  }, [tasks]);

  function handleDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    const fromCol = source.droppableId;
    const toCol = destination.droppableId;
    
    // Always update local state for immediate UI feedback
    setColumns(prev => {
      const fromTasks = [...prev[fromCol]];
      const toTasks = [...prev[toCol]];
      const [movedTask] = fromTasks.splice(source.index, 1);
      toTasks.splice(destination.index, 0, movedTask);
      
      return {
        ...prev,
        [fromCol]: fromTasks,
        [toCol]: toTasks,
      };
    });
    
    // Then persist the change to the backend
    if (fromCol !== toCol) {
      const task = columns[fromCol][source.index];
      if (task) {
        onStatusChange(task.id, toCol);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 w-full">
        {STATUSES.map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 bg-gray-100 rounded p-2 min-h-[300px]">
                <h2 className="font-bold mb-2 capitalize">{status.replace("-", " ")}</h2>
                {columns[status].map((task, idx) => (
                  <Draggable draggableId={task.id.toString()} index={idx} key={task.id}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-white rounded shadow p-2 mb-2">
                        <div className="font-semibold">{task.name}</div>
                        <div className="text-xs text-gray-500">{Math.floor(task.seconds / 60)}:{(task.seconds % 60).toString().padStart(2, "0")} min</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
