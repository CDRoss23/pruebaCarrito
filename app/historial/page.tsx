"use client";

import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/carrito'; // Adjust import path as needed

const PurchaseHistoryPage: React.FC = () => {
    // Use a client-side state to ensure this only renders on the client
    const [isMounted, setIsMounted] = React.useState(false);
    const { purchaseHistory } = useCartStore();

    // Ensure component only renders on client
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    // Helper function to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Prevent hydration errors
    if (!isMounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="w-8 h-8 text-blue-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Historial de Compras
                            </h1>
                        </div>
                        <Link 
                            href="/carrito" 
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6 mr-2" />
                            Ir al Carrito
                        </Link>
                    </div>

                    {purchaseHistory.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-500">
                                Aún no has realizado ninguna compra
                            </p>
                            <Link 
                                href="/" 
                                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Ir a Productos
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {purchaseHistory.map((purchase) => (
                                <div 
                                    key={purchase.id} 
                                    className="px-6 py-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-lg font-semibold text-gray-700">
                                                Compra #{purchase.id.split('-')[1]}
                                            </span>
                                            <span className="ml-4 text-sm text-gray-500">
                                                {formatDate(purchase.date)}
                                            </span>
                                        </div>
                                        <span className="font-bold text-green-600 text-xl">
                                            {formatCurrency(purchase.totalAmount)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {purchase.items.map((item) => (
                                            <div 
                                                key={item.id} 
                                                className="bg-gray-100 rounded-md p-3 flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {item.quantity} x {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                                <span className="font-semibold text-gray-700">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistoryPage;