"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";
import { DataFilters } from "./data-filters";
import { DataCalendar } from "./data-calendar";

import { TaskStatus } from "../types";
import { useGetTasks } from "../api/use-get-tasks";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
};

export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
    const [{
        status,
        assigneeId,
        projectId,
        dueDate,
    }] = useTaskFilters();

    const [view, setView] = useQueryState("task-view", {
        defaultValue: "table",
    })

    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();
    const { open } = useCreateTaskModal();

    const { mutate: bulkUpdate } = useBulkUpdateTasks();

    const {
        data: tasks,
        isLoading: isLoadingTasks
    } = useGetTasks({ 
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate,
    });

    const onKanbanChange = useCallback((
        tasks: { $id: string; status: TaskStatus; position: number; }[]
    ) => {
        bulkUpdate({
            json: { tasks },
        });
    }, [bulkUpdate]);

    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="table"
                        >
                            Tabela
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto"
                            value="kanban"
                        >
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger
                            className="h-8 w-full lg:w-auto hidden sm:block"
                            value="calendar"
                        >
                            Calendário
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        onClick={open}
                        size="sm"
                        className="w-full lg:w-auto"
                    >
                        <PlusIcon className="size-4 mr-0" />
                        Nova Tarefa
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <DataFilters hideProjectFilter={hideProjectFilter} />
                <DottedSeparator className="my-4" />
                {isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table" className="mt-0">
                            <DataTable columns={columns} data={tasks?.documents ?? []} />
                        </TabsContent>
                        <TabsContent value="kanban" className="mt-0">
                            <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []} />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-0">
                            <DataCalendar data={tasks?.documents ?? []} />
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};