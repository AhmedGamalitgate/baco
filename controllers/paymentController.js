const Stripe = require('stripe');

exports.processPayment = async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ msg: "Stripe Key missing in server" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // تجهيز المنتجات بتنسيق Stripe
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'egp', // أو usd حسب رغبتك
        product_data: {
          name: item.name,
          // التأكد من أن رابط الصورة كامل لكي يظهر في صفحة استرايب
          images: [item.image.startsWith('http') ? item.image : `https://it-gate-academy.up.railway.app${item.image}`],
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: 1,
    }));

    // إنشاء جلسة الدفع
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      // استبدل localhost برابط موقعك على Railway عند الرفع
      success_url: `${req.headers.origin}/#/?status=success`, 
      cancel_url: `${req.headers.origin}/#/cart`,
      metadata: { 
        userId: req.user._id.toString() 
      }
    });

    res.status(200).json({
      success: true,
      url: session.url // هذا هو الرابط الذي سنوجه إليه المستخدم
    });

  } catch (error) {
    console.error("Stripe Error: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};