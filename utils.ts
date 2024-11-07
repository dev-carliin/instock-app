import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { doc, deleteDoc, onSnapshot, collection, addDoc, query, where, serverTimestamp, orderBy, Timestamp, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { Key } from "react";

// Definindo as interfaces
export interface Items {
  [key: string]: any,
  name: string,
  quantity: string,
  price: string,
  amount: string
}

export interface Item {
  name: string,
  id: string,
  number_of_products: number
}

export interface User {
  email: string | null,
  uid: string | null
}

export interface Product {
  id: string,
  category: string,
  price: number,
  quantity: string,
  name: string
}

export interface ProductItem {
  price: number,
  amount: string,
  quantity: string,
  name: string,
}

export interface Sales {
  items: any;
  customerEmail: string,
  customerName: string,
  id: string,
  totalAmount: number,
  timestamp: {
    seconds: number;
    nanoseconds: number;
  },
  products: ProductItem[]
}

export interface Expense {
  id: Key | null | undefined;
  name: string,
  description: string,
  value: number,
  timestamp: {
    seconds: number;
    nanoseconds: number;
  }
}

// Funções utilitárias
export function calculateTotalAmount(objectsArray: Items[]) {
  let totalAmount = 0;

  for (let i = 0; i < objectsArray.length; i++) {
    const stringAmount = objectsArray[i].amount.replace(/[^\d,]/g, '').replace(',', '.'); // Convert to number format
    const amount = parseFloat(stringAmount);
    totalAmount += amount;
  }

  return totalAmount;
}

export const successMessage = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const errorMessage = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const LoginUser = (email: string, password: string, router: AppRouterInstance) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      successMessage("Authentication successful 🎉");
      router.push("/dashboard");
    })
    .catch((error) => {
      console.error(error);
      errorMessage("Incorrect Email/Password ❌");
    });
};

export const LogOut = (router: AppRouterInstance) => {
  signOut(auth)
    .then(() => {
      successMessage("Logout successful! 🎉");
      router.push("/");
    })
    .catch((error) => {
      errorMessage("Couldn't sign out ❌");
    });
};

// Funções relacionadas a categorias e produtos
export const getCategories = async (setCategories: any) => {
  try {
    const unsub = onSnapshot(collection(db, "categories"), (doc) => {
      const docs: any = [];
      doc.forEach((d: any) => {
        docs.push({ ...d.data(), id: d.id });
      });
      setCategories(docs);
    });
  } catch (err) {
    console.error(err);
    setCategories([]);
  }
};

export const deleteCategory = async (id: string, name: string) => {
  try {
    await deleteDoc(doc(db, "categories", id));
    const q = query(collection(db, "products"), where("category", "==", name));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((document) => {
        deleteDoc(doc(db, "products", document.id));
      });
    });
    successMessage(`${name} category deleted 🎉`);
  } catch (err) {
    errorMessage("Encountered an error ❌");
    console.log(err);
  }
};

export const addCategory = async (name: string) => {
  try {
    await addDoc(collection(db, "categories"), {
      name,
    });
    successMessage(`${name} category added! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};

export const addProduct = async (name: string, price: number, category: string) => {
  try {
    await addDoc(collection(db, "products"), {
      name, price, category
    });
    successMessage(`${name} product added! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};

export const getProducts = async (setProducts: any) => {
  try {
    const unsub = onSnapshot(collection(db, "products"), (doc) => {
      const docs: any = [];
      doc.forEach((d: any) => {
        docs.unshift({ ...d.data(), id: d.id });
      });
      setProducts(docs);
    });
  } catch (err) {
    console.error(err);
    setProducts([]);
  }
};

export const deleteProduct = async (id: string, name: string) => {
  try {
    await deleteDoc(doc(db, "products", id));
    successMessage(`${name} deleted 🎉`);
  } catch (err) {
    errorMessage("Encountered an error ❌");
    console.log(err);
  }
};

// Funções relacionadas a vendas
export const addSales = async (customerName: string, customerEmail: string, products: Items[], totalAmount: number, setAddNew: any) => {
  try {
    await addDoc(collection(db, "sales"), {
      customerName, customerEmail, products, totalAmount, timestamp: serverTimestamp(),
    });
    successMessage("Sales recorded! 🎉");
    setAddNew(false);
  } catch (err) {
    console.error(err);
    errorMessage("Error! Try again ❌");
  }
};

export const getSales = async (setSales: any) => {
  try {
    const docRef = collection(db, "sales");
    const q = query(docRef, orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      const docs: any = [];
      snapshot.forEach((d: any) => {
        docs.unshift({ ...d.data(), id: d.id });
      });
      setSales(docs);
    });
  } catch (err) {
    console.error(err);
    setSales([]);
  }
};

export const getTotalSales = async (setTotalSales: any) => {
  try {
    const unsub = onSnapshot(collection(db, "sales"), (doc) => {
      let totalSales: number = 0;
      doc.forEach((d: any) => {
        totalSales += d.data().totalAmount;
      });
      setTotalSales(totalSales);
    });
  } catch (err) {
    console.error(err);
  }
};

export const getSalesForDay = async (date: Date | null, setSales: any) => {
  try {
    const day = date?.getDate();
    const month = date?.getMonth();
    const year: number | undefined = date?.getFullYear();

    if (day !== undefined && month !== undefined && year !== undefined) {
      const startDate = new Date(year, month, day, 0, 0, 0);
      const endDate = new Date(year, month, day, 23, 59, 59);

      const docRef = collection(db, "sales");
      const q = query(docRef, orderBy("timestamp"), where("timestamp", ">=", Timestamp.fromDate(startDate)), where("timestamp", "<=", Timestamp.fromDate(endDate)));

      onSnapshot(q, (snapshot) => {
        const docs: any = [];
        snapshot.forEach((d: any) => {
          docs.unshift({ ...d.data(), id: d.id });
        });
        setSales(docs);
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Funções relacionadas a despesas
export const addExpense = async (name: string, description: string, value: number) => {
  try {
    await addDoc(collection(db, "expenses"), {
      name, description, value, timestamp: serverTimestamp(),
    });
    successMessage(`${name} expense added! 🎉`);
  } catch (err) {
    errorMessage("Error! ❌");
    console.error(err);
  }
};

export const getExpenses = async (setExpenses: (expenses: Expense[]) => void) => {
  try {
    const q = query(collection(db, "expenses"));
    const querySnapshot = await getDocs(q);
    const expensesData: Expense[] = [];
    querySnapshot.forEach((doc) => {
      expensesData.push({ id: doc.id, ...doc.data() } as unknown as Expense);
    });
    setExpenses(expensesData);
  } catch (error) {
    console.error("Erro ao obter despesas: ", error);
  }
};

export const getTotalExpenses = async (setTotalExpenses: (total: number) => void) => {
  try {
    const q = query(collection(db, "expenses"));
    const querySnapshot = await getDocs(q);
    let total = 0;
    querySnapshot.forEach((doc) => {
      total += doc.data().value;
    });
    setTotalExpenses(total);
  } catch (error) {
    console.error("Erro ao obter total de despesas: ", error);
  }
};

// Função para obter despesas de um dia específico
export const getExpensesForDay = async (date: Date | null, setExpenses: (expenses: Expense[]) => void) => {
  try {
    const day = date?.getDate();
    const month = date?.getMonth();
    const year: number | undefined = date?.getFullYear();

    if (day !== undefined && month !== undefined && year !== undefined) {
      const startDate = new Date(year, month, day, 0, 0, 0);
      const endDate = new Date(year, month, day, 23, 59, 59);

      const docRef = collection(db, "expenses");
      const q = query(docRef, where("timestamp", ">=", Timestamp.fromDate(startDate)), where("timestamp", "<=", Timestamp.fromDate(endDate)));

      onSnapshot(q, (snapshot) => {
        const docs: Expense[] = [];
        snapshot.forEach((d) => {
          docs.unshift({ ...d.data(), id: d.id } as Expense);
        });
        setExpenses(docs);
      });
    }
  } catch (err) {
    console.error("Erro ao obter despesas do dia: ", err);
  }
};
