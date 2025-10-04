import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables, UpdateTables } from "@/types";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  console.log("useAdminOrderList statuses ------>", statuses);

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      console.log("orders -------->", data);

      return data;
    },
  });
};

export const useMyOrderList = () => {
  const { session } = useAuth();

  const userId = session?.user.id;

  return useQuery({
    queryKey: ["orders", { userId }],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      console.log("orders -------->", data);

      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      console.log("orders -------->", data);

      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: Omit<InsertTables<"orders">, "user_id">) {
      const { error, data: newOrder } = await supabase
        .from("orders")
        .insert({ ...data, user_id: userId! })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      console.log("newOrder -------->", newOrder);

      return newOrder;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      console.log("updatedOrder -------->", updatedOrder);

      return updatedOrder;
    },

    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orders", id],
      });
    },
  });
};
