const Stripe = require('stripe');


exports.processPayment = async (req, res) => {
  try {
    const { amount, cartItems } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("Missing Stripe Secret Key in .env file");
      return res.status(500).json({ msg: "Server configuration error (Stripe Key)" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: 'usd',
      metadata: { 
        userId: req.user.id ? req.user.id.toString() : 'guest', 
        integration_check: 'accept_a_payment' 
      },
      description: `Purchase from Ecommerce Store`
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Error: ", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error in Payment", 
      error: error.message 
    });
  }
};