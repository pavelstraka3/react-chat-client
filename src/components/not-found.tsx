import { Link } from "@tanstack/react-router";

      const NotFound = () => {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              <h1 className="text-9xl font-bold text-gray-200">404</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
              <p className="text-gray-600 mt-2 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Go to Chat
              </Link>
            </div>
          </div>
        );
      };

      export default NotFound;