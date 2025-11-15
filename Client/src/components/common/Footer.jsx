const Footer = () => {
  return (
    <footer className="glass-dark text-white py-8 mt-auto backdrop-blur-xl relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-glass bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              Smart Diet SL
            </h3>
            <p className="text-white/80 text-glass">
              Your trusted nutrition advisor for healthy Sri Lankan diets.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-glass">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="/" className="hover:text-white transition-all hover:translate-x-1 inline-block text-glass">
                  Home
                </a>
              </li>
              <li>
                <a href="/diet-plans" className="hover:text-white transition-all hover:translate-x-1 inline-block text-glass">
                  Diet Plans
                </a>
              </li>
              <li>
                <a href="/calculator" className="hover:text-white transition-all hover:translate-x-1 inline-block text-glass">
                  Calculator
                </a>
              </li>
              <li>
                <a href="/sri-lankan-plates" className="hover:text-white transition-all hover:translate-x-1 inline-block text-glass">
                  Generate Plate
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-glass">Contact</h4>
            <p className="text-white/80 text-glass">Email: info@smartdiet.lk</p>
            <p className="text-white/80 text-glass">Phone: +94 11 234 5678</p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-glass">
          <p>&copy; 2024 Smart Diet SL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

