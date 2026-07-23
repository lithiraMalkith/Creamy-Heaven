'use client'

import { useState, useMemo } from 'react'
import type { Product, Customer } from '@/types'

export function OrderForm({ 
  products, 
  customers 
}: { 
  products: Product[]
  customers: Customer[] 
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' })
  
  const [items, setItems] = useState<Array<{
    productId: string
    productName: string
    sku: string
    price: number
    quantity: number
  }>>([])

  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedCustomer(val)
    if (val) {
      const c = customers.find(x => x.id === val)
      if (c) {
        setCustomerInfo({ name: c.name, email: c.email, phone: c.phone })
      }
    } else {
      setCustomerInfo({ name: '', email: '', phone: '' })
    }
  }

  const handleAddProduct = () => {
    if (!selectedProduct || quantity < 1) return
    const p = products.find(x => x.id === selectedProduct)
    if (!p) return
    
    setItems(prev => {
      const existing = prev.find(i => i.productId === p.id)
      if (existing) {
        return prev.map(i => i.productId === p.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        price: p.price,
        quantity: quantity
      }]
    })
    
    setSelectedProduct('')
    setQuantity(1)
  }

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.productId !== id))
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items])

  return (
    <div className="bg-brand-white rounded-xl border border-brand-border p-6 space-y-8">
      {/* Hidden inputs to send state to server action */}
      <input type="hidden" name="customer" value={JSON.stringify(customerInfo)} />
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="total" value={total} />

      {/* Customer Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-brand-black">Customer Details</h3>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1">Select Existing Customer (Optional)</label>
          <select value={selectedCustomer} onChange={handleCustomerChange} className="form-select">
            <option value="">-- Manual Entry --</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Name *</label>
            <input 
              required 
              value={customerInfo.name}
              onChange={e => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
              className="form-input" 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Email *</label>
            <input 
              required 
              type="email" 
              value={customerInfo.email}
              onChange={e => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
              className="form-input" 
              placeholder="john@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Phone *</label>
            <input 
              required 
              value={customerInfo.phone}
              onChange={e => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
              className="form-input" 
              placeholder="0771234567" 
            />
          </div>
        </div>
      </div>

      {/* Order Items Section */}
      <div className="space-y-4 border-t border-brand-border pt-6">
        <h3 className="text-lg font-semibold text-brand-black">Order Items</h3>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-brand-black mb-1">Product</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="form-select">
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - LKR {p.price.toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-brand-black mb-1">Qty</label>
            <input 
              type="number" 
              min="1" 
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              className="form-input" 
            />
          </div>
          <button 
            type="button" 
            onClick={handleAddProduct}
            className="btn-hover px-4 py-2 bg-brand-black text-brand-white rounded-lg font-medium h-[42px]"
          >
            Add
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border border-brand-border rounded-lg overflow-hidden mt-4">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream border-b border-brand-border text-brand-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Price</th>
                  <th className="px-4 py-2 font-medium">Qty</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {items.map(item => (
                  <tr key={item.productId} className="group hover:bg-brand-cream/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-brand-black">{item.productName}</div>
                      <div className="text-xs text-brand-muted">SKU: {item.sku}</div>
                    </td>
                    <td className="px-4 py-3 font-body tabular-nums text-brand-black">LKR {item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 font-body tabular-nums text-brand-black">{item.quantity}</td>
                    <td className="px-4 py-3 font-body tabular-nums font-medium text-brand-black">LKR {(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-brand-danger hover:underline text-xs font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-brand-cream border-t border-brand-border">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium text-brand-black">Total:</td>
                  <td colSpan={2} className="px-4 py-3 font-body tabular-nums font-bold text-brand-black text-lg">
                    LKR {total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-brand-border rounded-lg text-brand-muted text-sm">
            No items added yet.
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="space-y-4 border-t border-brand-border pt-6">
        <h3 className="text-lg font-semibold text-brand-black">Fulfillment & Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Fulfillment Type *</label>
            <select name="fulfilmentType" required className="form-select">
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-1">Payment Method *</label>
            <select name="paymentMethod" required className="form-select">
              <option value="cod">Cash / Pay on Pickup (COD)</option>
              <option value="payhere">Online Payment (PayHere)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border pt-6 flex items-center gap-3">
        <button 
          type="submit" 
          disabled={items.length === 0 || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
          className="btn-hover px-6 py-2.5 bg-brand-black text-brand-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Order
        </button>
        <a href="/admin/orders" className="px-4 py-2.5 text-sm text-brand-muted hover:text-brand-black">
          Cancel
        </a>
      </div>
    </div>
  )
}
