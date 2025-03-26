'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import { useCartStore } from './store/carrito'
import Navbar from "./components/navbar";
import { ShoppingCart, AlertTriangle, RefreshCw } from 'lucide-react';

export default function Home() {
  interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    name: string;
    quantity: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();

  // Format currency consistently
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setError('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addItem({
      ...product,
      name: product.title,
      quantity: quantity
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-xl text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Carga</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Recargar Página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-center font-bold text-4xl md:text-6xl mb-8 text-gray-800">
          <ShoppingCart className="inline-block mr-4 text-green-800" />
          La Tiendona
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-64 flex items-center justify-center p-4 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-green-600 font-bold text-xl mb-2">
                  {formatCurrency(product.price)}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                    <input 
                    type="number"
                    defaultValue="1"
                    min="1"
                    className="w-20 p-2 border rounded"
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      handleAddToCart(product, newQuantity);
                    }}
                    />
                  <button 
                    className="flex-1 bg-green-800 text-white py-2 rounded-md hover:bg-green-900 transition-colors flex items-center justify-center"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}