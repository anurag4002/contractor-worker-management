import { useState, useEffect, useCallback } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks = [];

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (scriptLoaded) {
      resolve();
      return;
    }

    loadCallbacks.push({ resolve, reject });

    if (scriptLoading) return;
    scriptLoading = true;

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      loadCallbacks.forEach(({ resolve: res }) => res());
      loadCallbacks.length = 0;
    };

    script.onerror = () => {
      scriptLoading = false;
      loadCallbacks.forEach(({ reject: rej }) => rej(new Error("Failed to load Razorpay")));
      loadCallbacks.length = 0;
    };

    document.body.appendChild(script);
  });

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(scriptLoaded);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (scriptLoaded) {
      setIsLoaded(true);
      return;
    }

    loadRazorpayScript()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err.message));
  }, []);

  const openCheckout = useCallback(
    (options) =>
      new Promise((resolve, reject) => {
        if (!window.Razorpay) {
          reject(new Error("Razorpay not loaded"));
          return;
        }

        const rzp = new window.Razorpay({
          ...options,
          handler: (response) => resolve(response),
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });

        rzp.on("payment.failed", (response) => {
          reject(new Error(response.error?.description || "Payment failed"));
        });

        rzp.open();
      }),
    []
  );

  return { isLoaded, error, openCheckout };
};

export default useRazorpay;
