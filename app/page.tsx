'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import {useCartStore} from './store/carrito'
import Navbar from "./components/navbar";



export default function Home() {
  interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    name: string;
    quantity: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCartStore();
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };
    getProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      name: product.title,
      quantity: 1
    });
  };

  return (
    <>
      <Navbar />
      <h2 className="text-center font-bold text-6xl">La Tiendona</h2>
      <div className="flex flex-row space-x-4 justify-center items-center">
        {products.length > 0 ? (
          <ul className="flex flex-wrap gap-4 justify-center items-center p-4">
            {products.map((product) => (
                <li key={product.id} className="bg-white rounded-lg shadow-md p-4 w-64 hover:shadow-xl transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-green-600 font-bold">${product.price}</p>
                <div className="flex items-center gap-2 mt-4">
                  <input 
                  type="number" 
                  min="1"
                  defaultValue="1"
                  className="w-20 p-2 border rounded"
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    handleAddToCart({...product, quantity: newQuantity});
                  }}
                  />
                  <button 
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => handleAddToCart({...product, quantity: 1})}
                  >
                  Add to Cart
                  </button>
                </div>
                </li>
            ))}
          </ul>
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
    </>
  );
}