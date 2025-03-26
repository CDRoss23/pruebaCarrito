'use client'
import { useCartStore } from '../store/carrito'
import Link from 'next/link'
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react'

export default function CarritoCompras() {
    const { 
        items,
        pagar, 
        removeItem, 
        clearCart, 
        updateQuantity,
        totalItems,
        totalAmount
    } = useCartStore()

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handlePagar = async () => {
        if (items.length === 0) return;

        try {
            pagar();
            // Optional: Replace with a more sophisticated notification
            alert('¡Pago realizado con éxito!');
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago');
        }
    };

    // Format currency consistently
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    return(
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center w-full bg-blue-800 p-4 text-blue-800">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200 "
                >
                    <ShoppingCart className="mr-2" /> Volver a la tienda
                </Link>
                <Link 
                    href="/historial" 
                    className="flex items-center gap-2 font-bold bg-white px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200 "
                >
                    Historial de Compras
                </Link>
            </div>

            <h2 className="text-3xl font-bold mb-6 flex items-center">
                <ShoppingCart className="mr-3 text-blue-600" /> Carrito de Compras
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="md:col-span-2 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-xl text-gray-500">El carrito está vacío</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                            >
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-green-600 font-medium">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border rounded-full overflow-hidden">
                                        <button 
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-3 py-1 min-w-[40px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button 
                                            className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    {items.length > 0 && (
                        <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
                            <h3 className="text-xl font-semibold mb-4">Resumen de Compra</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Total de Items:</span>
                                    <span>{totalItems()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total a Pagar:</span>
                                    <span>{formatCurrency(totalAmount())}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <button 
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                    onClick={handlePagar}
                                    disabled={items.length === 0}
                                >
                                    Finalizar Compra
                                </button>
                                <button 
                                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400"
                                    onClick={clearCart}
                                    disabled={items.length === 0}
                                >
                                    Limpiar Carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}