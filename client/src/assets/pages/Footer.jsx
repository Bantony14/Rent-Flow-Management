function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-cyan-500/30">
                R
              </div>

              <div>
                <h1 className="text-2xl font-black leading-none">
                  Rent<span className="text-cyan-400">Flow</span>
                </h1>

                <p className="text-xs text-zinc-400 uppercase tracking-widest">
                  Property Management
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              Simplifying rent management with secure payments, tenant records,
              and a seamless experience for property owners.
            </p>
          </div>

          {/* Vision */}
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Our Vision
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center w-full max-w-md">
              <p className="text-zinc-300 italic leading-relaxed text-sm">
                "Managing properties shouldn't be complicated. RentFlow helps
                owners and tenants stay organized, transparent, and
                stress-free."
              </p>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 text-center lg:text-left">
              Why RentFlow?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center">
                <h3 className="text-xl font-bold text-cyan-400">100%</h3>
                <p className="text-xs text-zinc-400 mt-1">Digital Records</p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center">
                <h3 className="text-xl font-bold text-cyan-400">24/7</h3>
                <p className="text-xs text-zinc-400 mt-1">Access Anytime</p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center">
                <h3 className="text-xl font-bold text-cyan-400">Secure</h3>
                <p className="text-xs text-zinc-400 mt-1">Payment Tracking</p>
              </div>

              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 text-center">
                <h3 className="text-xl font-bold text-cyan-400">Easy</h3>
                <p className="text-xs text-zinc-400 mt-1">Tenant Management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            © 2026 RentFlow. Built to simplify property management.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
