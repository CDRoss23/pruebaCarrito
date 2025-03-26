'use client'
import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return <nav className="flex justify-between items-center w-full bg-blue-800 p-4 text-blue-800">
        <p className="text-xl font-bold text-white">La Tiendona</p>
        <div className="flex items-center space-x-4">
            <Link href="/carrito" className="flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200 ">
                <span>🛒</span>
                <span>Carrito</span>
            </Link>
            <Link href="/historial" className="flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200">
                <span>📃</span>
                <span>Historial</span>
            </Link>
        </div>
    </nav>;
}

export default Navbar;