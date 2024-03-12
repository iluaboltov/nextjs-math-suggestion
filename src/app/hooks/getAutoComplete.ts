import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {CustomSuggestions} from "@/app/types/customSuggestions";

export const useFetchSuggestions = () => {
    return useQuery({queryKey: ['autocompleteJson'],
        queryFn:(): Promise<CustomSuggestions[]>  => axios.get(`/autocomplete.json`).then((response)=>  response.data)})
};