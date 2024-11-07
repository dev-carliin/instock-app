"use client"
import SideNav from "../dashboard/SideNav";
import { BsFillPrinterFill, BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../dashboard/Header";
import React, { useState, useCallback, useEffect } from "react";
import { auth } from '@/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Loading from "../dashboard/Loading";
import type { Expense } from "@/utils";
import { getExpenses, getExpensesForDay } from "@/utils";
import { Collapse } from "react-collapse";

interface User {
  email: string | null,
  uid: string | null
}

export default function Expenses() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [clicked, setClicked] = useState<number | null>(null);

  const toggleClick = (index: number) => {
    setClicked(clicked === index ? null : index);
  };

  const isUserLoggedIn = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getExpenses(setExpenses);
        setUser({ email: user.email, uid: user.uid });
      } else {
        router.push("/");
      }
    });
  }, [router]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (selectedDate) {
      getExpensesForDay(selectedDate, setExpenses);
    }
  }, [selectedDate]);

  if (!user?.email) return <Loading />;

  return (
    <main className="flex w-full min-h-[100vh] relative">
      <SideNav />

      <div className="md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]">
        <Header title="Despesas" />

        <section className="flex items-center justify-between mb-8">
          <h3 className="text-lg">Despesas</h3>
          <div className="flex items-center justify-between space-x-6">
            <DatePicker
              selectsEnd={true}
              selected={selectedDate}
              required
              onChange={(date) => {
                setSelectedDate(date);
                getExpensesForDay(date, setExpenses);
              }}
              endDate={selectedDate}
              maxDate={date}
              className="border-[1px] w-full py-2 px-4 rounded-md"
            />
          </div>
        </section>

        <div>
          {expenses.map((expense: Expense, index: number) => (
            <div className="w-full my-3 cursor-pointer" key={expense.id} onClick={() => toggleClick(index)}>
              <div className="w-full bg-white py-3 px-6 flex items-center justify-between rounded border-b-[1px] border-b-gray-200">
                <p className="md:text-md text-sm">Despesa <span className="text-blue-300">#{expense.id}</span></p>
                <button className="px-4 py-2 bg-[#D64979] text-white text-sm rounded">
                  {clicked === index ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
                </button>
              </div>
              <Collapse isOpened={clicked === index}>
                <div className="min-h-[200px] w-full bg-white py-4 flex flex-col space-y-2 px-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Nome: {expense.name}</p>
                    <p className="text-sm text-gray-500">Descrição: {expense.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-800">
                        {expense.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </h1>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
          ))}

          {expenses.length === 0 && <p className="text-sm text-red-600">Não houve despesas neste dia 😪</p>}
        </div>
      </div>
    </main>
  );
}
