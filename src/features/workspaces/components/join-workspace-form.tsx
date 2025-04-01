"use client";

import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "@/components/ui/card";

import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    };
};

export const JoinWorkspaceForm = ({
    initialValues,
}: JoinWorkspaceFormProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const { mutate, isPending} = useJoinWorkspace();

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode },
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            },
        });
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Entrar na Workspace
                </CardTitle>
                <CardDescription>
                    Você foi convidado para entrar na Workspace <strong>{initialValues.name}</strong>.
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                    <Button
                        variant="secondary"
                        type="button"
                        asChild
                        size="lg"
                        className="w-full lg:w-fit"
                        disabled={isPending}
                    >
                        <Link href="/">
                            Cancelar
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        className="w-full lg:w-fit"
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        Entrar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}