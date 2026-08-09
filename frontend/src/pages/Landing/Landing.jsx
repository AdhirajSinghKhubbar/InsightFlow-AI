import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

export default function Landing() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Landing Page */}
      <div className="min-h-screen bg-gray-100">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">

          <h1 className="text-5xl md:text-7xl font-bold text-blue-600">
            InsightFlow AI
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 font-semibold mt-6">
            AI Powered Business Intelligence Platform
          </p>

          <p className="text-lg md:text-xl text-gray-500 mt-5">
            Upload • Analyze • Forecast • Generate Reports
          </p>

          {/* Main CTA Buttons */}
          <div className="flex justify-center gap-5 mt-10">

            <Link
              to="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-md"
            >
              Get Started
            </Link>

            <Link
              to="/dashboard"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              View Dashboard
            </Link>

          </div>

        </section>


        {/* Feature Cards */}
        <section className="max-w-7xl mx-auto px-6 pb-20">

          <div className="grid md:grid-cols-3 gap-8">

            {/* Analytics Dashboard */}
            <Link
              to="/dashboard"
              className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              <div className="text-5xl mb-6">
                📊
              </div>

              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition">
                Analytics Dashboard
              </h2>

              <p className="text-gray-600 text-lg mt-4">
                Visualize your business data with interactive dashboards,
                KPIs, charts and sales analytics.
              </p>

              <div className="mt-6 text-blue-600 font-semibold">
                Open Dashboard →
              </div>

            </Link>


            {/* AI Insights */}
            <Link
              to="/uploads"
              className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              <div className="text-5xl mb-6">
                🤖
              </div>

              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition">
                AI Insights
              </h2>

              <p className="text-gray-600 text-lg mt-4">
                Get intelligent insights and analysis from your uploaded
                datasets using AI.
              </p>

              <div className="mt-6 text-blue-600 font-semibold">
                Choose Dataset →
              </div>

            </Link>


            {/* Reports */}
            <Link
              to="/reports"
              className="group bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >

              <div className="text-5xl mb-6">
                📄
              </div>

              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition">
                Smart Reports
              </h2>

              <p className="text-gray-600 text-lg mt-4">
                View AI-generated reports and access your previous
                analysis results.
              </p>

              <div className="mt-6 text-blue-600 font-semibold">
                View Reports →
              </div>

            </Link>

          </div>

        </section>


        {/* How It Works */}
        <section className="bg-white py-20">

          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-4xl font-bold text-center mb-14">
              How InsightFlow AI Works
            </h2>

            <div className="grid md:grid-cols-4 gap-8">

              {/* Step 1 */}
              <div className="text-center">

                <div className="text-4xl mb-4">
                  📂
                </div>

                <h3 className="text-xl font-bold">
                  1. Upload
                </h3>

                <p className="text-gray-500 mt-2">
                  Upload your CSV dataset.
                </p>

              </div>


              {/* Step 2 */}
              <div className="text-center">

                <div className="text-4xl mb-4">
                  📊
                </div>

                <h3 className="text-xl font-bold">
                  2. Analyze
                </h3>

                <p className="text-gray-500 mt-2">
                  Explore KPIs, charts and analytics.
                </p>

              </div>


              {/* Step 3 */}
              <div className="text-center">

                <div className="text-4xl mb-4">
                  🤖
                </div>

                <h3 className="text-xl font-bold">
                  3. AI Insights
                </h3>

                <p className="text-gray-500 mt-2">
                  Let AI analyze your business data.
                </p>

              </div>


              {/* Step 4 */}
              <div className="text-center">

                <div className="text-4xl mb-4">
                  📄
                </div>

                <h3 className="text-xl font-bold">
                  4. Reports
                </h3>

                <p className="text-gray-500 mt-2">
                  View and manage generated reports.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* Bottom CTA */}
        <section className="bg-blue-600 py-16 text-center text-white">

          <h2 className="text-4xl font-bold">
            Ready to Analyze Your Data?
          </h2>

          <p className="text-blue-100 text-lg mt-4">
            Upload a dataset and start generating insights.
          </p>

          <Link
            to="/upload"
            className="inline-block mt-8 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition"
          >
            Upload Dataset →
          </Link>

        </section>

      </div>
    </>
  );
}