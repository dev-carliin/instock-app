import Link from "next/link";
import { RiDashboardFill } from "react-icons/ri"
import { BsCashCoin, BsFillBarChartFill, BsPersonFillLock } from "react-icons/bs"
import { MdShoppingCart, MdCategory } from "react-icons/md"
import { LogOut } from "@/utils";
import { useRouter } from "next/navigation";

export default function SideNav() { 
     const router = useRouter()
    return (
         <div className='w-[15%] md:block hidden'>
            <nav className='w-[15%] fixed flex flex-col left-0 h-[100vh] bg-[#4c0742] p-4 space-y-8'>
                <Link href="/" className='hover:text-white mt-4 mb-8 font-bold text-xl text-gray-300'>InStock</Link>
                <div className="w-full flex items-center">
                      <RiDashboardFill className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/dashboard" className="text-[#9AA8BD] hover:text-white">Inicio</Link>
                </div>
               
                <div className="w-full flex items-center">
                      <BsFillBarChartFill className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/sales" className="text-[#9AA8BD] hover:text-white">Vendas</Link>
                </div>
                <div className="w-full flex items-center">
                      <BsCashCoin  className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/expenses" className="text-[#9AA8BD] hover:text-white">Despesas</Link>
                </div>
                
                  <div className="w-full flex items-center">
                      <MdShoppingCart className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/products" className="text-[#9AA8BD] hover:text-white">Produtos</Link>
                </div>

                 <div className="w-full flex items-center">
                      <MdCategory className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/categories" className="text-[#9AA8BD] hover:text-white">Categorias</Link>
                </div>

                  <div className="w-full flex items-center">
                      <BsPersonFillLock className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/" className="text-[#9AA8BD] hover:text-white" onClick={() => LogOut(router)}>Log out</Link>
                </div>
                
            </nav>
            </div>
    )
}