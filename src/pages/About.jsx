import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="px-8 py-20 bg-gray-50 text-center">
        <p className="text-sm font-medium text-orange-600 uppercase tracking-widest mb-3">
          About TORQUE
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-5">
          Built for the thrill.
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
          TORQUE brings performance-focused RC cars to enthusiasts who want
          more than just a toy. From high-speed machines to capable
          off-roaders, we make it easier to find the right RC car for your
          next adventure.
        </p>
      </section>


      {/* About */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              More than just RC cars.
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4">
              We believe RC cars are about the experience — the speed,
              control, precision and excitement that comes with every run.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Whether you're getting started with your first RC car or
              looking for something more serious, TORQUE gives you a simple
              place to explore and choose your next machine.
            </p>
          </div>

          <div className=" rounded-xl p-10 ">
            <img className='h-80' src="/images/Logo.png" alt="" />
          </div>

        </div>
      </section>


      {/* What we offer */}
      <section className="px-8 py-16 bg-gray-50">

        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-900">
              What we offer
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Find the right machine for the way you drive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-600 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Performance
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Explore RC cars designed for speed, control and an
                exciting driving experience.
              </p>
            </div>

            <div className="bg-white border border-gray-200 hover:border-orange-600 rounded-xl p-6 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Adventure
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Take on different terrain with off-road buggies,
                monster trucks and rock crawlers.
              </p>
            </div>

            <div className="bg-white border border-gray-200 hover:border-orange-600 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Choice
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Choose between toy-grade and hobby-grade RC cars
                based on your experience and needs.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="px-8 py-16 text-center">

        <h2 className="text-3xl font-medium text-gray-900 mb-3">
          Ready to chase the adrenaline?
        </h2>

        <p className="text-gray-500 mb-6">
          Find your next RC machine at TORQUE.
        </p>

        <Link
          to="/products"
          className="inline-block bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition"
        >
          Shop RC Cars →
        </Link>

      </section>

    </div>
  );
}

export default About;