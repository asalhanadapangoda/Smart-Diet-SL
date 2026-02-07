import FarmerSidebar from './FarmerSidebar';

const FarmerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <FarmerSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default FarmerLayout;
