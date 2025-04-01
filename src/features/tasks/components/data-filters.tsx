import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DatePicker } from "@/components/date-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListChecksIcon, UserIcon, XIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import { Button } from "@/components/ui/button";

interface DataFiltersProps {
    hideProjectFilter?: boolean;
};

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();

    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name,
    }));

    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name,
    }));

    const [{
        status,
        assigneeId,
        projectId,
        dueDate,
    }, setFilters] = useTaskFilters();

    const onStatusChange = (value: string) => {
        setFilters({ status: value === "all" ? null : value as TaskStatus });
    };

    const onAssigneeChange = (value: string) => {
        setFilters({ assigneeId: value === "all" ? null : value as string });
    };

    const onProjectChange = (value: string) => {
        setFilters({ projectId: value === "all" ? null : value as string });
    };

    const clearFilters = () => {
        setFilters({ status: null, assigneeId: null, projectId: null, dueDate: null });
    };

    if (isLoading) return null;

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-2">
            <div className="flex flex-col lg:flex-row gap-2">
                <Select
                    defaultValue={status ?? undefined}
                    onValueChange={(value) => onStatusChange(value)}
                >
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <ListChecksIcon className="size-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectSeparator />
                        <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                        <SelectItem value={TaskStatus.TODO}>À Fazer</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>Em Andamento</SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>Em Revisão</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Concluído</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    defaultValue={assigneeId ?? undefined}
                    onValueChange={(value) => onAssigneeChange(value)}
                >
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <UserIcon className="size-4 mr-2" />
                            <SelectValue placeholder="Todos Colaboradores" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos Colaboradores</SelectItem>
                        <SelectSeparator />
                        {memberOptions?.map((member) => (
                            <SelectItem key={member.value} value={member.value}>
                                {member.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {!hideProjectFilter && (
                    <Select
                    defaultValue={projectId ?? undefined}
                    onValueChange={(value) => onProjectChange(value)}
                    >
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <FolderIcon className="size-4 mr-2" />
                            <SelectValue placeholder="Todos projetos" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos projetos</SelectItem>
                        <SelectSeparator />
                        {projectOptions?.map((project) => (
                            <SelectItem key={project.value} value={project.value}>
                                {project.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                )}
                <div className="flex items-center gap-2">
                    <DatePicker
                        placeholder="Data de Entrega"
                        className="h-8 w-full lg:w-auto text-black"
                        value={dueDate ? new Date(dueDate) : undefined}
                        onChange={(date) => {
                            setFilters({ dueDate: date ? date.toISOString() : null })
                        }}
                    />
                    {dueDate && (
                        <Button variant="secondary" className="h-8 px-2" onClick={() => setFilters({ dueDate: null })}>
                            <XIcon className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
            <Button variant="secondary" className="h-8 px-4 hover:text-black hover:bg-neutral-300" onClick={clearFilters}>
                <XIcon className="size-4 mr-0" />
                Limpar Filtros
            </Button>
        </div>
    );
};