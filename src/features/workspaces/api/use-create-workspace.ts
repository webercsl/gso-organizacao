import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type RequestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form }) => {
            const response = await client.api.workspaces["$post"]({ form });

            if (!response.ok) {
                throw new Error("Falha ao criar Workspace");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Workspace criado com sucesso");

            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};