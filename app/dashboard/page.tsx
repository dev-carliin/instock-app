"use client";
import React, { useState, useCallback, useEffect } from 'react';
import AddNew from './AddNew';
import AddNewExpense from './AddNewExpense';
import SideNav from './SideNav';
import Link from 'next/link';
import Header from './Header';
import { auth } from '@/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Loading from './Loading';
import { Sales, getCategories, getProducts, getSales, getTotalSales, getExpenses, getTotalExpenses, User } from '@/utils';

export default function Dashboard() {
    const [addNew, setAddNew] = useState<boolean>(false);
    const [addNewExpense, setAddNewExpense] = useState<boolean>(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalSales, setTotalSales] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [sales, setSales] = useState<Sales[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]); // Ajuste o tipo conforme necessário
    const [totalReceivable, setTotalReceivable] = useState<number>(0);
    const openModal = () => setAddNew(true);
    const openExpenseModal = () => setAddNewExpense(true);
    const [user, setUser] = useState<User>();
    const router = useRouter();

    const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser({ email: user.email, uid: user.uid });
                const promises = [
                    getProducts(setProducts),
                    getCategories(setCategories),
                    getTotalSales(setTotalSales),
                    getTotalExpenses(setTotalExpenses),
                    getSales(setSales),
                    getExpenses(setExpenses)
                ];
                await Promise.all(promises);
            } else {
                router.push("/");
            }
        });
    }, [router]);

    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);

    useEffect(() => {
        const calculateReceivable = () => {
            const receivable = (sales || []).reduce((total, sale) => {
                return total + (sale.items || []).reduce((sum: number, item: { paid: any; price: any; quantity: any; }) => {
                    return !item.paid ? sum + Number(item.price) * Number(item.quantity) : sum;
                }, 0);
            }, 0);
            setTotalReceivable(receivable);
        };

        if (sales.length > 0) {
            calculateReceivable();
        }
    }, [sales]);

    if (!user?.email) return <Loading />;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const netIncome = totalSales - totalExpenses;


    const sortedSales = [...sales].sort((a, b) => {
        const aTimestamp = a.timestamp?.seconds ?? 0; 
        const bTimestamp = b.timestamp?.seconds ?? 0; 
        return bTimestamp - aTimestamp;
    });

    const sortedExpenses = [...expenses].sort((a, b) => {
        const aTimestamp = a.timestamp?.seconds ?? 0; // Usa 0 se timestamp for null ou undefined
        const bTimestamp = b.timestamp?.seconds ?? 0; // Usa 0 se timestamp for null ou undefined
        return bTimestamp - aTimestamp;
    });

    return (
        <main className='flex w-full min-h-[100vh] relative'>
            <SideNav />

            <div className='md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]'>
                <Header title='Dashboard' />

                <div className='flex items-center md:flex-row flex-col justify-between w-full md:space-x-4 mb-8'>
                    <div className='bg-white md:w-1/4 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Vendas totais</h3>
                        <h2 className='text-center font-bold text-3xl text-[#60A9CD]'>{formatCurrency(totalSales)}</h2>
                    </div>
                    <div className='bg-white md:w-1/4 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Total despesas</h3>
                        <h2 className='text-center font-bold text-3xl text-red-300'>{formatCurrency(totalExpenses)}</h2>
                    </div>
                    <div className='bg-white md:w-1/4 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Total a receber</h3>
                        <h2 className='text-center font-bold text-3xl text-orange-500'>{formatCurrency(totalReceivable)}</h2>
                    </div>
                    <div className='bg-white md:w-1/4 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Resultado líquido</h3>
                        <h2 className='text-center font-bold text-3xl text-[#8FCA37]'>{formatCurrency(netIncome)}</h2>
                    </div>
                </div>

                <div className='w-full min-h-[30vh]'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='text-xl'>Vendas e Despesas Recentes</h3>
                        <div className='flex space-x-4'>
                            <button className='px-4 py-2 bg-emerald-500 text-white rounded' onClick={openModal}>Adicionar vendas</button>
                            <button className='px-4 py-2 bg-red-800 text-white rounded' onClick={openExpenseModal}>Adicionar despesas</button>
                        </div>
                    </div>
                    <div>
                        {sortedSales.length > 0 && sortedSales.map((sale: Sales) => (
                            <div className='w-full bg-white p-3 flex items-center justify-between rounded my-3' key={sale.id}>
                                <p className='md:text-md text-sm'>Order{" "}
                                    <span className='text-blue-300'>
                                        #{sale.id}
                                    </span>
                                </p>
                                <Link href="/sales" className='px-4 py-2 bg-[#D64979] text-white text-sm rounded'>Detalhes</Link>
                            </div>
                        ))}
                        {sortedExpenses.length > 0 && sortedExpenses.map((expense: any) => (
                            <div className='w-full bg-white p-3 flex items-center justify-between rounded my-3' key={expense.id}>
                                <p className='md:text-md text-sm'>Expense{" "}
                                    <span className='text-red-300'>
                                        #{expense.id}
                                    </span>
                                </p>
                                <Link href="/expenses" className='px-4 py-2 bg-[#D64979] text-white text-sm rounded'>Detalhes</Link>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            {addNew && <AddNew setAddNew={setAddNew} productsArray={products} />}
            {addNewExpense && <AddNewExpense setAddNew={setAddNewExpense} />}
        </main>
    );
}
