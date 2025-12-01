const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Load Stripe secret key from environment config
const stripeClient = stripe(functions.config().stripe.secretkey);

/**
 * Creates a new order in Firestore and attempts to process a Stripe payment.
 * This function is an HTTPS Callable function, making it easy
 * to call from client apps.
 * It expects an authenticated user.
 */
exports.processStripePayment =
  functions.https.onCall(async (data, context) => {
  // 1. Authenticate the caller:
  // Ensure only YOUR authenticated app can access this.
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "The function must be called while authenticated.",
      );
    }

    // 2. Validate input data
    const {
      paymentMethodId, amount, currency, orderItems, shippingInfo,
    } = data;
    const errorMessage = "The function must be called with 'paymentMethodId'," +
    "'amount', 'currency', 'orderItems', and 'shippingInfo'.";
    if (!paymentMethodId || !amount || !currency ||
      !orderItems || !shippingInfo) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          errorMessage,
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "'amount' must be a positive number.",
      );
    }
    // Stripe expects amount in cents/lowest currency unit,
    // so ensure client sends it correctly or convert here:
    const stripeAmount = Math.round(amount * 100);

    let orderRef;
    try {
    // 3. Create a pending order in Firestore BEFORE processing payment
    // This helps in case the payment fails later,
    // you have a record of the attempt.
      const orderData = {
        userId: context.auth.uid,
        orderItems,
        shippingInfo,
        amount,
        currency,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentStatus: "pending", // Initial status
        stripePaymentIntentId: null,
        error: null,
      };
      orderRef = await admin.firestore().collection("orders").add(orderData);
      const orderId = orderRef.id;

      // 4. Create a PaymentIntent with Stripe
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: stripeAmount,
        currency,
        payment_method: paymentMethodId,
        confirm: true, // Confirm the payment immediately
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never", // No redirects for popup flow
        },
        metadata: {
          order_id: orderId, // Link PaymentIntent to your Firestore order
          userId: context.auth.uid,
        },
        description: `Order ${orderId} by user ${context.auth.uid}`,
      // Optionally add customer details, shipping, etc.
      });

      // 5. Update the order in Firestore with payment result
      if (paymentIntent.status === "succeeded") {
        await orderRef.update({
          paymentStatus: "paid",
          stripePaymentIntentId: paymentIntent.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, orderId, paymentIntentId: paymentIntent.id };
      }
      // Handle other statuses like 'requires_action',
      // 'requires_confirmation', etc.
      // For simplicity, we'll treat anything not 'succeeded' as a failure here.
      const errorMsg = `Stripe PaymentIntent status: ${paymentIntent.status}`;
      await orderRef.update({
        paymentStatus: "failed",
        error: errorMsg,
        stripePaymentIntentId: paymentIntent.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      throw new functions.https.HttpsError("internal", errorMsg);
    } catch (error) {
      console.error("Payment processing error:", error);
      // If orderRef exists, update it with the error
      if (orderRef) {
        await orderRef.update({
          paymentStatus: "failed",
          error: error.message || "Unknown error during payment processing.",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      // Re-throw as an HttpsError for client to handle
      if (error.type === "StripeCardError") {
        throw new functions.https.HttpsError("invalid-argument", error.message);
      } else if (error.code === "resource_missing") {
        // eslint-disable-next-line no-use-before-define
        throw new functions.https.HttpsError("not-found",
            "Payment method or other resource not found.");
      }
      throw new functions.https.HttpsError(
          "internal",
          error.message || "An unexpected error occurred during payment.",
      );
    }
  });


  exports.lowercaseProductName = functions.firestore.document('/products/{documentId}')
      .onCreate((snap, context) => {
          const name = snap.data().name;
  
          functions.logger.log('Lowercasing product name', context.params.documentId, name);
  
          const lowercaseName = name.toLowerCase();
  
          return snap.ref.set({ name_lower: lowercaseName }, { merge: true });
      });
  
