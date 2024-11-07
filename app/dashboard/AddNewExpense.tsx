import { AiFillCloseCircle } from "react-icons/ai"
import React, { FormEventHandler, useState } from "react"
import { addExpense } from "@/utils"

interface Props {
    setAddNew: any
}

export default function AddNewExpense({ setAddNew }: Props) { 
    const [expenseName, setExpenseName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [value, setValue] = useState<number>(0)

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        addExpense(expenseName, description, value)
        setAddNew(false)
    }

    return (
        <div className="w-full md:p-auto p-4 h-full dim absolute top-0 left-0 z-40 flex items-center justify-center">
            <div className="bg-white md:w-2/3 w-full p-6 rounded-lg shadow-lg overflow-y-auto">
                <section className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-800">Record Expense</h3>
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold">{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        <AiFillCloseCircle className="text-3xl cursor-pointer text-[#D64979]" onClick={() => setAddNew(false)} />
                    </div>
                </section>
                
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="w-full flex items-center space-x-4 mb-6">
                        <div className="w-1/2 flex flex-col">
                            <label htmlFor="expenseName" className="text-sm">Expense Name</label>
                            <input 
                                type="text" 
                                className="border-[1px] px-4 py-2 rounded text-sm" 
                                name="expenseName" 
                                id="expenseName" 
                                required 
                                value={expenseName} 
                                onChange={e => setExpenseName(e.target.value)} 
                            />
                        </div>
                        <div className="w-1/2 flex flex-col">
                            <label htmlFor="description" className="text-sm">Description</label>
                            <input 
                                type="text" 
                                className="border-[1px] px-4 py-2 rounded text-sm" 
                                name="description" 
                                id="description" 
                                required 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="w-full flex items-center space-x-4 mb-6">
                        <div className="w-1/2 flex flex-col">
                            <label htmlFor="value" className="text-sm">Value</label>
                            <input 
                                type="number" 
                                className="border-[1px] px-4 py-2 rounded text-sm" 
                                name="value" 
                                id="value" 
                                required 
                                value={value} 
                                onChange={e => setValue(parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    <button className="bg-blue-500 rounded text-white py-2 px-4">RECORD</button>
                </form>
            </div>
        </div>
    )
}
