// @ts-nocheck
import CustomInput from "@/app/autocomplete/customInput";
import axios from "axios";
import MentionExample from "@/app/components/mentions";
import {FormulaSelector} from "@/app/components/autosuggest";
export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/*<MentionExample/>*/}
            <FormulaSelector/>
        </main>
    );
}
