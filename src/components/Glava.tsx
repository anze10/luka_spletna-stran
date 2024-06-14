"use client"
import React, { useState } from 'react';
import { Button, Card, Divider, TextField } from '@mui/material';
import { test } from 'src/server/posli';  // Ensure this path is correct

type MenuItem = {
    id: number;
    name: string;
    price: number;
    quantity?: number;
};

const menuItems: MenuItem[] = [
    { id: 1, name: 'PIVO 0,3L', price: 3.0 },
    { id: 2, name: 'ŠPRICAR 0,2L', price: 2.5 },
    { id: 3, name: 'VINO 0,1L', price: 2.0 },
    { id: 4, name: 'VINO 1L', price: 10.0 },
    { id: 5, name: 'RADENSKA 1L', price: 5.0 },
    { id: 6, name: 'JAGERMAISTER 0,03L', price: 3.0 },
    { id: 7, name: 'GIN-TONIC', price: 4.0 },
    { id: 8, name: 'VODA NAVADNA 0,5L', price: 2.5 },
    { id: 9, name: 'VODA Z OKUSOM 0,5L', price: 2.5 },
    { id: 10, name: 'COCA COLA 0,5L', price: 2.5 },
    { id: 11, name: 'LEDENI ČAJ BRESKEV 0,5L', price: 2.5 },
    { id: 12, name: 'BOROVNIČKE 0,03L', price: 3.0 },
];

export default function Component() {
    const [order, setOrder] = useState<MenuItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [completedOrder, setCompletedOrder] = useState<MenuItem[]>([]);
    const [payment, setPayment] = useState<string | number>('');
    const [change, setChange] = useState(0);

    const addToOrder = (item: MenuItem) => {
        const existingItem = order.find((orderItem) => orderItem.id === item.id);
        let updatedOrder: MenuItem[];

        if (existingItem) {
            updatedOrder = order.map((orderItem) =>
                orderItem.id === item.id
                    ? { ...orderItem, quantity: (orderItem.quantity ?? 0) + 1 }
                    : orderItem
            );
        } else {
            updatedOrder = [...order, { ...item, quantity: 1 }];
        }

        setOrder(updatedOrder);
        setTotalPrice(totalPrice + item.price);
    };

    const removeFromOrder = (item: MenuItem) => {
        const existingItem = order.find((orderItem) => orderItem.id === item.id);
        let updatedOrder: MenuItem[];

        if (existingItem && existingItem.quantity === 1) {
            updatedOrder = order.filter((orderItem) => orderItem.id !== item.id);
        } else {
            updatedOrder = order.map((orderItem) =>
                orderItem.id === item.id
                    ? { ...orderItem, quantity: (orderItem.quantity ?? 0) - 1 }
                    : orderItem
            );
        }

        setOrder(updatedOrder);
        setTotalPrice(totalPrice - item.price);
    };

    const completeOrder = async () => {
        const orderString = order.map(item => `${item.name}(${item.quantity})`).join('_');
        const total = Number(totalPrice);

        //await test(orderString, total);

        setCompletedOrder(order);
        setOrder([]);
        setTotalPrice(0);
        setChange(0);
        setPayment('');
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const paymentValue = parseFloat(e.target.value);
        if (!isNaN(paymentValue)) {
            setPayment(paymentValue);
            setChange(paymentValue - totalPrice);
        } else {
            setPayment('');
            setChange(0);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <main className="flex-1 grid grid-cols-1 gap-4 p-4">
                <div className="bg-gray-100 rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Meni</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {menuItems.map((item) => (
                            <Card
                                key={item.id}
                                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => addToOrder(item)}
                            >
                                <div>{item.name}</div>
                                <div>€{item.price.toFixed(2)}</div>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-4">Naročilo</h2>
                    <div className="grid gap-4">
                        {order.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4"
                            >
                                <div>{item.name}</div>
                                <div>€{(item.price * (item.quantity ?? 0)).toFixed(2)}</div>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => removeFromOrder(item)}
                                >
                                    <MinusIcon className="w-4 h-4" />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => addToOrder(item)}
                                >
                                    <PlusIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Divider />
                        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                            <div>
                                <h3 className="text-base font-medium">Skupaj</h3>
                            </div>
                            <div>
                                <span className="text-base font-medium">
                                    €{totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <TextField
                            label="Znesek, ki ga je dala stranka"
                            variant="outlined"
                            fullWidth
                            value={payment}
                            onChange={handlePaymentChange}
                        />
                        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                            <div>
                                <h3 className="text-base font-medium">Denar za vrnitev stranki</h3>
                            </div>
                            <div>
                                <span className="text-base font-medium">
                                    €{change >= 0 ? change.toFixed(2) : 0}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={completeOrder}
                        >
                            Zaključi naročilo
                        </Button>
                    </div>
                </div>
            </main>
            <aside className="bg-gray-100 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-4">Zadnje naročilo</h2>
                <div className="grid gap-4">
                    {completedOrder.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4"
                        >
                            <div>{item.name}</div>
                            <div>€{(item.price * (item.quantity ?? 0)).toFixed(2)}</div>
                            <div>Količina: {item.quantity}</div>
                        </div>
                    ))}
                    <Divider />
                    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                        <div>
                            <h3 className="text-base font-medium">Skupaj</h3>
                        </div>
                        <div>
                            <span className="text-base font-medium">
                                €{completedOrder.reduce((acc, item) => acc + item.price * (item.quantity ?? 0), 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
        </svg>
    );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
