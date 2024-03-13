"use client"
import React, {useCallback, useEffect, useState} from 'react'
import {useFetchSuggestions} from "@/app/hooks/getAutoComplete";
import {CustomSuggestions} from "@/app/types/customSuggestions";
import {ReactTags} from "@/app/components/reactAutosuggestTag";
import {useSuggestionStore} from "@/app/store/useSuggestionStore";
import {
    HighlightRenderer,
    type LabelRenderer, ListBoxRenderer, OptionRenderer,
    RootRenderer, TagRenderer
} from "@/app/components/reactAutosuggestTag/components";


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
    const onShouldExpand = (value:string) => {
        return value.length > 1
    }
    const onDelete = useCallback(
        (tagIndex: number) => {
            removeSelected(tagIndex)
        },
        [selected]
    )
    const CustomInput = ({ ...inputProps }) => {
        return <input className={'flex-1 h-6 text-black p-4 m-1'} {...inputProps}/>
    }
    // @ts-ignore
    const CustomTag: TagRenderer = ({tag, ...tagProps }) => {
        const [active, setActive] = useState(false)
        const [originalValue, setOriginalValue] = useState<string>('')
        const [customValue, setCustomValue] = useState<number>()
        const [currentSelected, setActiveCurrentSelect] = useState(false)
        const changeValue = (value: number) => {
            tag.valueNumber = value;
            return;
        }
        const checkValidation = (value: string) => {
            const REGEX = /\d+/
            if(REGEX.test(value)){
                changeValue(parseInt(value));
                setCustomValue(parseInt(value))
            }
            setActive(!active)
        }
        useEffect(() => {
            if(typeof(tag.valueNumber) === 'string'){
                setOriginalValue(tag.valueNumber)
            }
        }, []);
        //after:blink-animation
        return (
            <button type="button" className={'relative flex items-center justify-between relative text-gray-500 p-1 bg-[#e5e7ea] border-[1px] rounded-md min-h-8'} {...tagProps} onClick={() => onDelete}>
                <span className={`text-black ${typeof(originalValue) === 'string' && originalValue.length > 1 ? 'mr-2' : 'mr-0'}`}>{tag.label}</span>
                {
                    (typeof(originalValue) === 'string' && originalValue.length > 1) ?
                        <>
                            <span className={'h-5 w-[1px] ml-2 mr-2 bg-gray-500 flex'}></span>
                            <span className={'text-gray-500 hover:text-black transition-colors ease-in-out duration-200'} onClick={() =>setActive(true)}>
                                {
                                    active ?
                                        <input
                                            value={customValue}
                                            type="text"
                                            onBlur={(e) => {
                                                checkValidation(e.currentTarget.value)
                                            }}/> :
                                        '[x]'
                                }</span>
                        </> :
                        null
                }
            </button>
        )
    }

    const CustomListBox: ListBoxRenderer = ({children, ...listBoxProps}) => {
        return (
            <div className={'absolute top-99 opacity-100 z-100 bg-white w-full left-0 text-black p-2 mt-1 shadow-xl rounded-b-md'} {...listBoxProps}>
                {children}
            </div>
        )
    }
    const CustomOption: OptionRenderer = ({ children, option, ...optionProps }) => {


        return (
            <div className={`hover:bg-[#a9e1ff] transition-colors ease-in-out pb-2 pt-2 pl-1 rounded-md duration-200 ${option.active ? 'bg-[#a9e1ff]' : ''}`} {...optionProps}>
                {children}
            </div>
        )
    }
    const CustomHighlight: HighlightRenderer = ({ text }) => {
        return <span className={'text-black'}>{text}</span>
    }
    const CustomRoot:RootRenderer = ({ children, isActive, isDisabled, isInvalid, ...rootProps }) =>{
        return (
            <div className={'flex flex-wrap relative w-full min-h-[4rem] h-auto p-4 border-[1px] text-black'} {...rootProps}>
                {children}
            </div>
        )
    }

    const CustomLabel: LabelRenderer = ({ children, ...labelProps }) => {
        return (
            <div className={''} {...labelProps}>
                {children}
            </div>
        )
    }

    return (
        <>
            <p className={'absolute top-0 left-1/2 -translate-x-1/2 text-black'}>Edit Tag Value is For Name 34 and 33</p>
            <div className={'absolute left-1/2 top-1/2 w-1/2 h-24 bg-white rounded-md border-[1px] border-b-0 rounded-b-none -translate-x-1/2 -translate-y-[80%]'}>
                <div className={'w-full h-10 bg-[#e5e7ea] p-2'}></div>
                <div className={'w-full h-10 bg-[#f5f8fa] p-2 text-black  text-3xl'}>{suggestStore.parsedValue}</div>
                {
                    fetcedData && suggestions ?
                        <div className={'w-full min-h-[4rem] h-auto border-t-0 p-4 border-[1px]'}>
                            <ReactTags
                                labelText=""
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
                                renderRoot={CustomRoot}
                                renderLabel={CustomLabel}
                            />
                        </div> :
                        <div>Loading...</div>
                }
            </div>
        </>
    )
}
