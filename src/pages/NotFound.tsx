import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Bug } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 md:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Bug className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">404</h1>
          <p className="text-2xl font-medium mb-3">Page Not Found</p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="gradient-button px-6 py-3 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
