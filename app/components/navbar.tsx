'use client'
import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
    return <nav className="flex justify-between items-center w-full bg-gray-800 p-4 text-white">
        <p className="text-xl font-bold">La Tiendona</p>
        <div className="flex items-center space-x-4">
            <p className="hover:text-gray-300 cursor-pointer">
                <Link href="/carrito">🛒 Buscar</Link>
            </p>
            <p className="hover:text-gray-300 cursor-pointer">
                <Link href="/historial">📃 Historial</Link>
            </p>
        </div>
    </nav>;
}

export default Navbar;