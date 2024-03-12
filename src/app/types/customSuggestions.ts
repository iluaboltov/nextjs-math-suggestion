import {Tag} from "@/app/components/reactAutosuggestTag/sharedTypes";

export type CustomSuggestions = Tag & {
    label: string,
    category: string,
    valueNumber: string | number,
    value: number
}