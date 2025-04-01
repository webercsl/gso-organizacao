"use client";

import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TaskDate } from "./task-date";

import { Task } from "../types";
import { TaskActions } from "./task-actions";

const statusMap: Record<string, string> = {
    BACKLOG: "BACKLOG",
    IN_PROGRESS: "EM ANDAMENTO",
    DONE: "CONCLUÍDO",
    IN_REVIEW: "EM REVISÃO",
    TODO: "A FAZER",
};

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Nome da Tarefa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.original.name;

            return <p className="line-clamp-1">{name}</p>
        }
    },
    {
        accessorKey: "project",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Projeto
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const project = row.original.project;

            return (
                <div className="flex items-center gap-x-2 text-sm font-medium">
                    <ProjectAvatar 
                        className="size-6"
                        name={project.name}
                        image={project.imageUrl}
                    />
                    <p className="line-clamp-1">{project.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "assignee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Colaborador
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const assignee = row.original.assignee;

            return (
                <div className="flex items-center gap-x-2 text-sm font-medium">
                    <MemberAvatar 
                        className="size-6"
                        name={assignee.name}
                    />
                    <p className="line-clamp-1">{assignee.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Data de Entrega
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dueDate = row.original.dueDate;

            return <TaskDate value={dueDate} />
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            const displayStatus = statusMap[status] || status;

            return <Badge variant={status}>{displayStatus}</Badge>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.original.$id;
            const projectId = row.original.projectId;

            return (
                <TaskActions id={id} projectId={projectId}>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreVertical className="size-4" />
                    </Button>
                </TaskActions>
            )
        }
    }
];