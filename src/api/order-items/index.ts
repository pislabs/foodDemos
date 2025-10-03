import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { InsertTables } from "@/types";

export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    async mutationFn(items: InsertTables<"order_items">[]) {
      const { error, data: newOrderItems } = await supabase
        .from("order_items")
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      console.log("newOrderItems -------->", newOrderItems);

      return newOrderItems;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["order_items"],
      });
    },
  });
};
