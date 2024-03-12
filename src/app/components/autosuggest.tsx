"use client"
import React, {useCallback, useEffect} from 'react'
import {useFetchSuggestions} from "@/app/hooks/getAutoComplete";
import {CustomSuggestions} from "@/app/types/customSuggestions";
import {ReactTags} from "@/app/components/reactAutosuggestTag";
import {useSuggestionStore} from "@/app/store/useSuggestionStore";


export function FormulaSelector() {
    const fetcedData = useFetchSuggestions().data
    const suggestStore = useSuggestionStore(state => state)

    const suggestions = useSuggestionStore(state => state.suggestions)
    const selected = useSuggestionStore(state => state.selected)
    const parsedValue = useSuggestionStore(state => state.parsedValue)
    const removeSelected = useSuggestionStore(state => state.removeSelected)
    const setSelected = useSuggestionStore( state => state.setSelected)
    const parseValue = useSuggestionStore( state => state.parseValue)
    const setSuggestions = useSuggestionStore( state => state.setSuggestions)

    useEffect(() => {
        if (fetcedData) {
            setSuggestions(fetcedData)
        }
    }, [fetcedData]);

    useEffect(() => {
        const unsub = useSuggestionStore.subscribe((state, prevState) => {
            if (state.selected !== prevState.selected) {
                parseValue()
            }
        })

        return unsub;
    }, []);

    const onAdd = useCallback(
        (newTag: CustomSuggestions) => {
            setSelected([...selected, newTag])
        },
        [selected]
    )
    const onDelete = useCallback(
        (tagIndex: number) => {
            removeSelected(tagIndex)
        },
        [selected]
    )
    const onShouldExpand = (value:string) => {
        return value.length > 1
    }
    const CustomInput = ({ ...inputProps }) => {
        return <input className={'w-full drop-shadow-lg mx-auto h-6 text-black p-4'} {...inputProps} />
    }
    // @ts-ignore
    const CustomTag = ({tag, ...tagProps }) => {
        return (
            <button type="button" className={'flex flex-row text-black pl-2 pr-2 pb-1 pt-1 bg-[#e5e7ea] border-[1px] rounded-md hover:bg-gray-300 transition-colors ease-in-out'} {...tagProps}>
                <span className={'text-black'}>{tag.label}</span>
            </button>
        )
    }
    // @ts-ignore
    function CustomListBox({ children, ...listBoxProps }) {
        return (
            <div className={'text-black p-2 mt-1 shadow-xl rounded-b-md'} {...listBoxProps}>
                {children}
            </div>
        )
    }
    // @ts-ignore
    function CustomOption({ children, classNames, option, ...optionProps }) {
        const classes = [
            classNames.option,
            option.active ? 'is-active' : '',
            option.selected ? 'is-selected' : '',
        ]

        return (
            <div className={'hover:bg-[#a9e1ff] transition-colors ease-in-out pb-2 pt-2 pl-1 rounded-md duration-200'} {...optionProps}>
                {children}
            </div>
        )
    }
    // @ts-ignore
    const CustomHighlight = ({ text }) => {
        return <span className={'text-black'}>{text}</span>
    }

    return (
        <div className={'absolute left-1/2 top-1/2 w-1/2 h-24 bg-white rounded-md border-[1px] border-b-0 rounded-b-none -translate-x-1/2 -translate-y-[80%]'}>
            <div className={'w-full h-10 bg-[#e5e7ea] p-2'}></div>
            <div className={'w-full h-10 bg-[#f5f8fa] p-2 text-black  text-3xl'}>{suggestStore.parsedValue}</div>
            <div className={'w-[100%] h-auto p-4 border-t-0 border-[1px]'}>
                {
                    fetcedData && suggestions ?
                        <ReactTags
                            labelText="Select formula"
                            selected={selected}
                            suggestions={suggestions}
                            // @ts-ignore
                            onAdd={onAdd}
                            onDelete={onDelete}
                            noOptionsText="No matching"
                            allowNew={true}
                            allowResize={false}
                            activateFirstOption={true}
                            onShouldExpand={onShouldExpand}
                            renderInput={CustomInput}
                            renderTag={CustomTag}
                            renderListBox={CustomListBox}
                            renderHighlight={CustomHighlight}
                            renderOption={CustomOption}
                        /> :
                        <div>Loading...</div>
                }
            </div>
        </div>
    )
}
