import { AiFillCloseCircle } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import React, { FormEventHandler, useState, ChangeEvent } from "react";
import { addSales, Items, Product, calculateTotalAmount } from "@/utils";

interface Props {
    setAddNew: any;
    productsArray: any;
}

export default function AddNew({ setAddNew, productsArray }: Props) {
    const [customerName, setCustomerName] = useState<string>("");
    const [customerEmail, setCustomerEmail] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState<number>(0);
    
    const [products, setProducts] = useState<Items[]>([{
        name: "", quantity: "1", price: "", amount: "", paid: false
    }]);

    const addProduct = () => setProducts([...products, { name: "", quantity: "1", price: "", amount: "", paid: false }]);
    
    const removeProduct = (index: number) => {
        const list = [...products];
        list.splice(index, 1);
        setProducts(list);
        setTotalAmount(calculateTotalAmount(list));
    }

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>, i: number) => {
        const { name, value } = e.target;
        const list = [...products];
        if (value !== "select") {
            const result = productsArray.filter((item: Product) => item.name === value);
            list[i]["price"] = result[0].price;
            list[i]["amount"] = (Number(result[0].price) * Number(list[i].quantity)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        list[i][name] = value;
        setProducts(list);
        setTotalAmount(calculateTotalAmount(list));
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        const { name, value } = e.target;
        const list = [...products];
        list[i][name] = value;
        if (list[i].name !== "select") {
            const amount = Number(list[i].price) * Number(value);
            list[i]["amount"] = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        setProducts(list);
        setTotalAmount(calculateTotalAmount(list));
    }

    const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
        const list = [...products];
        list[i]["paid"] = e.target.checked;
        setProducts(list);
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        addSales(customerName, customerEmail, products, totalAmount, setAddNew);
    }

    return (
        <div className="w-full md:p-auto p-4 h-full dim absolute top-0 left-0 z-40 flex items-center justify-center">
            <div className="bg-white md:w-2/3 w-full p-6 rounded-lg shadow-lg overflow-y-auto">
                <section className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-800">Nova venda</h3>
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold">{totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
                        <AiFillCloseCircle className="text-3xl cursor-pointer text-[#D64979]" onClick={() => setAddNew(false)} />
                    </div>
                </section>
                
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="w-full flex items-center space-x-4 mb-6">
                        <div className="w-1/2 flex flex-col">
                            <label htmlFor="customerName" className="text-sm">Name</label>
                            <input 
                                type="text" 
                                className="border-[1px] px-4 py-2 rounded text-sm" 
                                name="customerName" 
                                id="customerName" 
                                required 
                                value={customerName} 
                                onChange={e => setCustomerName(e.target.value)} 
                            />
                        </div>
                        <div className="w-1/2 flex flex-col">
                            <label htmlFor="customerEmail" className="text-sm">Email</label>
                            <input 
                                type="text" 
                                className="border-[1px] px-4 py-2 rounded text-sm" 
                                name="customerEmail" 
                                id="customerEmail" 
                                value={customerEmail} 
                                onChange={e => setCustomerEmail(e.target.value)} 
                            />
                        </div>
                    </div>

                    <h3 className="mb-2 font-bold">Items</h3>
                    {products.map((product, index) => (
                        <div key={index}>
                            <div className="w-full flex sm:flex-row flex-col md:space-x-4 mb-2">
                                <div className="w-full sm:mb-0 mb-2 mr-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="name" className="text-sm">Product</label>
                                        <select 
                                            className="border-[1px] p-2 rounded text-sm mb-2" 
                                            name="name" 
                                            id="name" 
                                            required 
                                            value={product.name} 
                                            onChange={e => handleProductChange(e, index)}
                                        >
                                            <option value="select">Select</option>
                                            {productsArray.map((item: Product) => (
                                                <option value={item.name} key={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="quantity" className="text-sm">Quantity</label>
                                        <input 
                                            type="number" 
                                            name="quantity" 
                                            id="quantity" 
                                            className="border-[1px] py-2 px-4 rounded text-sm mb-2" 
                                            required 
                                            value={product.quantity} 
                                            onChange={e => handleQuantityChange(e, index)} 
                                        />
                                    </div>
                                </div>

                                <div className="w-full mb-2">
                                    <div className="flex flex-col mb-2">
                                        <p className="text-sm">Price</p>
                                        <p className="border-[1px] py-2 px-4 rounded text-sm">{Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <p className="text-sm">Amount</p>
                                        <p className="border-[1px] py-2 px-4 rounded text-sm bg-gray-100">{product.amount}</p>
                                    </div>
                                    <div className="flex flex-col mb-2">
                                        <label htmlFor={`paid-${index}`} className="text-sm">Paid</label>
                                        <input 
                                            type="checkbox" 
                                            name="paid" 
                                            id={`paid-${index}`} 
                                            className="border-[1px] py-2 px-4 rounded text-sm" 
                                            checked={product.paid} 
                                            onChange={e => handlePaidChange(e, index)} 
                                        />
                                    </div>
                                </div>

                                {products.length > 1 && (
                                    <div className="w-1/4 flex flex-col px-4">
                                        <p className="text-sm">Action</p>
                                        <div className="flex items-center space-x-6">
                                            <MdDeleteForever
                                                className="text-3xl text-red-500 cursor-pointer"
                                                onClick={() => removeProduct(index)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {products.length - 1 === index && (
                                <IoMdAddCircle className="text-green-500 rounded bg-white text-3xl cursor-pointer mb-8" onClick={addProduct} />
                            )}
                        </div>
                    ))}
                    <button className="bg-blue-500 rounded text-white py-2 px-4">RECORD</button>
                </form>
            </div>
        </div>
    );
}
