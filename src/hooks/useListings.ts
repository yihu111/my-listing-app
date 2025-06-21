
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
}

export const useListings = () => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      console.log('Fetching listings from Supabase...');
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }

      console.log('Fetched listings:', data);
      return data as Listing[];
    },
  });
};
