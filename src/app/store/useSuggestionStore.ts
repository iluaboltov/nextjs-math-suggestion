import {create} from "zustand";
import {CustomSuggestions} from "@/app/types/customSuggestions";

const setErrorValue = () => 'Error Invalid Value'
const parseFormula = (suggestStore: SuggestionStore) => {
    try {
        const OPERATORS_REGEX = /.*[-+*/^].*/
        let valueAfterMap: string| number = 0;
        const calculateValue = (operand: string, value1: number, value2: number) => {
            switch (operand) {
                case '+': return value1 + value2;
                case '-': return value1 - value2;
                case '*': return value1 * value2;
                case '/': return value1 / value2;
                case '^': return Math.pow(value1, value2);
            }
        };
        const mapSeleceted = () => {
            let tempOperand = '';
            let tempValue: number = 0;
            suggestStore.selected.map((arg, i)=>{
                if(typeof(tempValue) === 'string' && tempValue !== 'NO VALUE') {
                    return tempValue;
                }
                const argValue = arg.valueNumber
                if (typeof(argValue) === 'number') {
                    // @ts-ignore
                    if(suggestStore.selected.indexOf(argValue) === 0) {
                        tempValue = argValue
                        return;
                    }
                    if (OPERATORS_REGEX.test(tempOperand)) {
                        // @ts-ignore
                        const value = calculateValue(tempOperand, tempValue, argValue)
                        tempOperand = ''
                        // @ts-ignore
                        tempValue = value;
                        return;
                    } else {
                        tempValue = argValue;
                        return;
                    }
                }
                else{
                    // @ts-ignore
                    if (suggestStore.selected.indexOf(arg) !== suggestStore.selected.length - 1 && typeof(suggestStore.selected[i+1])=== 'string') {
                        const nextNumber = suggestStore.selected[i+1].valueNumber
                        if(typeof(nextNumber)=== 'string' && nextNumber.length === 1){
                            throw new Error(setErrorValue())
                        }
                    }
                    if (argValue.length === 1) {
                        // @ts-ignore
                        if(suggestStore.selected.indexOf(arg) === 0) {
                            throw new Error(setErrorValue())
                        }
                        // @ts-ignore
                        if(suggestStore.selected.indexOf(arg) !== suggestStore.selected.length - 1){
                            let elementNext = suggestStore.selected[i+1].valueNumber

                            if (OPERATORS_REGEX.test(argValue) && (typeof(elementNext) === 'number' || (typeof(elementNext) === 'string' && elementNext.length >= 3))) {
                                tempOperand = argValue;
                                return;
                            }
                            if (OPERATORS_REGEX.test(tempOperand) && typeof(elementNext) === 'string' && elementNext.length !== 3) {
                                throw new Error(setErrorValue())
                            }
                        }
                    }
                    else {
                        const [value1, operator, value2] = argValue.split(/\s+/);
                        let combinedValue = calculateValue(operator, parseInt(value1), parseInt(value2))
                        // @ts-ignore
                        if (suggestStore.selected.indexOf(arg) === 0) {
                            // @ts-ignore
                            tempValue = combinedValue
                            return;
                        }

                        if (OPERATORS_REGEX.test(tempOperand)){
                            // @ts-ignore
                            tempValue = calculateValue(tempOperand, tempValue, combinedValue)
                            tempOperand = ''
                            return;

                        }
                        if(!tempValue) {
                            // @ts-ignore
                            tempValue = combinedValue
                            return;
                        }
                    }
                }
            })
            return tempValue;
        }

        if (suggestStore.selected.length === 0) {
            return 0;
        }
        if(suggestStore.selected.length === 1 && typeof(suggestStore.selected[0].valueNumber) === 'number') {
            return suggestStore.selected[0].valueNumber
        }
        if (typeof(suggestStore.selected[0].valueNumber) === 'string' && suggestStore.selected.length === 3){
            const [value1, operator, value2] = suggestStore.selected[0].valueNumber.split(/\s+/);
            // @ts-ignore
            return calculateValue(operator, parseInt(value1), parseInt(value2))
        }
        if (suggestStore.selected.length === 1 && typeof(suggestStore.selected[0].valueNumber) === 'string') {
            if (suggestStore.selected[0].valueNumber.length === 1) {
                throw new Error(setErrorValue())
            }
        }
        if (typeof(suggestStore.parsedValue)=== 'string') {
            valueAfterMap = mapSeleceted()
            if (typeof(valueAfterMap) === "string") {
                throw new Error(setErrorValue())
            }
            return valueAfterMap;
        }
        valueAfterMap = mapSeleceted()
        return valueAfterMap;
    } catch (e) {
        if (e instanceof Error) {
            return e.message
        }
    }
}


type SuggestionStore = {
    suggestions: CustomSuggestions[] | [],
    selected: CustomSuggestions[] | [];
    parsedValue: number | string;
    setSelected: (newSelected: CustomSuggestions[]) => void;
    removeSelected: (indexSelected: number) => void;
    setParsedValue: (value: number) => void;
    parseValue: () => void;
    setSuggestions: (data: CustomSuggestions[]) => void;
}
// <SuggestionStore>
export const useSuggestionStore = create<SuggestionStore>(
    (set) => ({
        suggestions: [],
        selected: [],
        parsedValue: 0,
        setSelected : (newSelected) =>
            set((state) => ({
                ...state,
                selected: newSelected,
            })),
        removeSelected: (indexSelected) =>
            set((state) => ({
                ...state,
                selected: state.selected.filter((_, i) => i !== indexSelected),
            })),
        setParsedValue: (value) =>
            set((state) => ({
                ...state,
                parsedValue: value
            })),
        parseValue: () => set((state) => ({
            ...state,
            parsedValue: parseFormula(state)
        })),
        setSuggestions : (data) => set((state) => ({
            ...state,
            suggestions: data
        })),
})
)