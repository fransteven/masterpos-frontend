import React, { useEffect, useState } from 'react';
import { CirclePlus } from 'lucide-react';
import type { Stock } from '../../types';
import { formatCurrency } from '../../utils';
import { useStore } from '../../store';
import { toast } from 'react-toastify';

type CarItemRowProps = {
    stockRecord:Stock
}

export default function CarItemRow({stockRecord}:CarItemRowProps) {
    const {addToCart, updateTotals} = useStore()
    const [error, setError] = useState('')
    
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[error])

    const [modifiedPrice, setModifiedPrice] = useState(stockRecord.product.sale_price);
    const [priceInput, setPriceInput] = useState(modifiedPrice.toFixed(2));
    const [quantityInput, setQuantityInput] = useState('1');

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceInput(e.target.value);
    };

    const commitPrice = () => {
        const parsed = parseFloat(priceInput);
        if (!isNaN(parsed) && parsed >= 0) {
            setModifiedPrice(parsed);
        } else {
            setPriceInput(modifiedPrice.toFixed(2));
        }
    };

    const handlePriceKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            commitPrice();
            e.currentTarget.blur();
        }
    };

    const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value.replace(/[^0-9]/g, '');
        setQuantityInput(next);
    };

    const handleAddToCart = ()=>{
        if(stockRecord.quantity < +quantityInput){
            setError(`Stock insuficiente. Disponible: ${stockRecord.quantity}`)
            return
        }
        const data = {
            product:{
                id:stockRecord.product.id,
                name:stockRecord.product.name,
            },
            location:{
                id:stockRecord.location.id,
                name:stockRecord.location.name,
            },
            quantity:+quantityInput,
            unitPrice:+priceInput,
        }
        addToCart(data)
        updateTotals()
    }

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-4 py-4 align-middle">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm truncate">{stockRecord.product.name}</span>
                    <span className="text-xs text-gray-500">ID: {stockRecord.product.id}</span>
                </div>
            </td>
            <td className="px-4 py-4 align-middle text-gray-700 text-sm">
                <span className="truncate block">{stockRecord.location.name}</span>
            </td>
            <td className="px-4 py-4 align-middle font-medium text-gray-800 text-sm">
                {formatCurrency(stockRecord.product.sale_price.toString())}
            </td>
            <td className="px-4 py-4 align-middle">
                <div className="flex items-center">
                    <input
                        type="text"
                        defaultValue={stockRecord.product.sale_price}
                        onChange={handlePriceChange}
                        onBlur={commitPrice}
                        onKeyDown={handlePriceKey}
                        className="w-full min-w-[80px] text-center border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        aria-label="Precio ajustado"
                        placeholder="0.00"
                    />
                </div>
            </td>
            <td className="px-4 py-4 align-middle">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantityInput}
                    onChange={onQuantityChange}
                    className="w-full min-w-[60px] text-center border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    aria-label="Cantidad del producto"
                    placeholder="1"
                />
            </td>
            <td className="px-4 py-4 align-middle text-center">
                <button
                    onClick={handleAddToCart}
                    className="p-2 rounded-full text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-150"
                    aria-label="Añadir producto"
                >
                    <CirclePlus className="w-5 h-5" />
                </button>
            </td>
        </tr>
    );
}
