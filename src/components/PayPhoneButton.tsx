"use client";

import { useEffect, useRef } from 'react';

interface PayPhoneButtonProps {
    token: string;
    amount: number; // Total amount in cents (e.g., $1.00 = 100)
    amountWithoutTax: number; // Amount without tax in cents
    tax: number; // Tax amount in cents
    clientTransactionId: string;
    storeId: string;
    reference: string;
    email?: string;
    phoneNumber?: string;
    documentId?: string;
}

declare global {
    interface Window {
        PPaymentButtonBox: any;
        ppb: any;
    }
}

export default function PayPhoneButton({
    token,
    amount,
    amountWithoutTax,
    tax,
    clientTransactionId,
    storeId,
    reference,
    email,
    phoneNumber,
    documentId
}: PayPhoneButtonProps) {
    const initialized = useRef(false);

    useEffect(() => {
        // Function to potentialy cleanup or manage sdk loading
        const loadSdk = () => {
            if (document.querySelector('script[src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"]')) {
                initPayPhone();
                return;
            }

            const script = document.createElement('script');
            script.src = "https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js";
            script.type = "module";
            script.onload = () => initPayPhone();
            document.head.appendChild(script);
        };

        const initPayPhone = () => {
            // Avoid double initialization for same transaction if possible, 
            // but here we might need to re-render if props change. 
            // Ideally we just render once per unique transaction ID.

            // We need to wait a tick to ensure PPaymentButtonBox is available if just loaded
            setTimeout(() => {
                if (window.PPaymentButtonBox) {
                    try {
                        window.ppb = new window.PPaymentButtonBox({
                            token: token,
                            clientTransactionId: clientTransactionId,
                            amount: amount,
                            amountWithoutTax: amountWithoutTax,
                            amountWithTax: 0, // Assuming 0 for now as per simple use case, adjust if needed
                            tax: tax,
                            service: 0,
                            tip: 0,
                            currency: "USD",
                            storeId: storeId,
                            reference: reference,
                            email: email || "user@example.com", // Fallbacks or required
                            phoneNumber: phoneNumber || "0999999999",
                            documentId: documentId || "0000000000",
                            identificationType: 1,
                            lang: "es"
                        }).render('pp-button');
                    } catch (error) {
                        console.error("Error initializing PayPhone:", error);
                    }
                }
            }, 500);
        };

        loadSdk();

    }, [token, amount, clientTransactionId, storeId, reference]); // Re-run if transaction details change

    return (
        <div className="w-full flex justify-center p-4 bg-white rounded-lg">
            <div id="pp-button" style={{ width: '100%' }}></div>
        </div>
    );
}
