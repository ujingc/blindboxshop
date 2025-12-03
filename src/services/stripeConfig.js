// stripeConfig.js (or wherever you define stripePromise)
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_API_KEY}`);

export default stripePromise;