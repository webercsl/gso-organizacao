import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.projects[":projectId"]["$patch"]>;

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.projects[":projectId"]["$patch"]({ form, param });

            if (!response.ok) {
                throw new Error("Falha ao atualizar projeto");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Projeto atualizado com sucesso");

            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};