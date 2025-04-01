import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type RequestType = InferRequestType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.login["$post"]({ json });

            if (!response.ok) {
                throw new Error("Falha ao fazer login");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Login efetuado com sucesso");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["current"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return mutation;
};