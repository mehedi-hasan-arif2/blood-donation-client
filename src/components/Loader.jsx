const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">

      {/* SPINNER LOGO */}
      <div className="relative flex items-center justify-center">

        {/* outer glow ring */}
        <div className="absolute w-28 h-28 rounded-full bg-red-200 blur-2xl animate-pulse"></div>

        {/* rotating ring */}
        <div className="w-24 h-24 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>

        {/* logo in center */}
        <img
          src="/assets/logo.png"
          alt="loader logo"
          className="w-12 h-12 absolute animate-pulse"
        />
      </div>

      {/* TEXT */}
      <p className="mt-5 text-red-500 font-semibold tracking-wide animate-pulse">
        Loading SafeDonor...
      </p>

    </div>
  );
};

export default Loader;