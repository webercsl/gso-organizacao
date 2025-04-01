import { PencilIcon } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";

import { TaskDate } from "./task-date";
import { OverviewProperty } from "./overview-property";

import { Task, TaskStatus } from "../types";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskOverviewProps {
    task: Task;
}

const statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "Backlog",
    [TaskStatus.TODO]: "À Fazer",
    [TaskStatus.IN_PROGRESS]: "Em Andamento",
    [TaskStatus.IN_REVIEW]: "Em Revisão",
    [TaskStatus.DONE]: "Concluído",
};

export const TaskOverview = ({
    task
}: TaskOverviewProps) => {
    const { open } = useEditTaskModal();

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Visão Geral</p>
                    <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
                        <PencilIcon className="size-4 mr-2" />
                        Editar
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <div className="flex flex-col gap-y-4">
                    <OverviewProperty label="Colaborador">
                        <MemberAvatar 
                            name={task.assignee.name}
                            className="size-6"
                        />
                        <p className="text-sm font-medium">{task.assignee.name}</p>
                    </OverviewProperty>
                    <OverviewProperty label="Data de Entrega">
                        <TaskDate value={task.dueDate} className="text-sm font-medium" />
                    </OverviewProperty>
                    <OverviewProperty label="Status">
                        <Badge variant={task.status}>
                            {statusLabels[task.status]}
                        </Badge>
                    </OverviewProperty>
                </div>
            </div>
        </div>
    );
};