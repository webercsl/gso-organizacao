import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.logout["$post"]>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.auth.logout["$post"]();

            if (!response.ok) {
                throw new Error("Falha ao sair");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Saiu com sucesso");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["current"] });
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};