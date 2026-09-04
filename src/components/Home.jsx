import { Link } from 'react-router-dom';
import {
  IconCar,
  IconEngine,
  IconSteeringWheel,
  IconTruck,
  IconMountain,
  IconTruckDelivery,
  IconShieldCheck,
  IconRefresh,
  IconHeadset,
  IconArrowRight,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

function Home() {
  return (
    <div className="bg-white">

    <section className="relative px-8 py-24 flex items-center min-h-[420px] overflow-hidden">
  {/* Background image */}
  <img
    src="/images/RC-bg.png"
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Content */}
  <div className="relative z-10 max-w-lg">
    <p className="text-orange-600 text-xs font-medium tracking-widest mb-3">
      1:8 SCALE // OFF-ROAD BUGGY
    </p>
    <h1 className="text-4xl md:text-5xl font-medium leading-tight text-gray-900 mb-4">
      Built<br />
      <span className="text-orange-600">to run.</span>
    </h1>
    <p className="text-gray-700 text-sm max-w-xs mb-6 leading-relaxed">
      Engineered for serious performance. Race-proven, adventure-ready.
    </p>
    <Link
      to="/products"
      className="inline-flex items-center gap-2 bg-orange-600 text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-orange-700 transition"
    >
      Shop RC cars <IconArrowRight size={16} />
    </Link>
  </div>
</section>

      {/* Shop by grade */}
      <section className="px-8 pb-6">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Shop by grade</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            to="/products?grade=toy"
            className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-orange-300 transition"
          >
            <IconCar size={30} className="text-orange-600" stroke={1.5} />
            <div>
              <p className="text-gray-900 font-medium mb-0.5">Toy grade</p>
              <p className="text-gray-500 text-xs">Ready to run, beginner friendly</p>
            </div>
          </Link>
          <Link
            to="/products?grade=hobby"
            className="border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:border-orange-300 transition"
          >
            <IconEngine size={30} className="text-orange-600" stroke={1.5} />
            <div>
              <p className="text-gray-900 font-medium mb-0.5">Hobby grade</p>
              <p className="text-gray-500 text-xs">Upgradeable, built for speed</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Shop by type */}
      <section className="px-8 pb-10">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Shop by type</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/products?category=Off-Road Buggy"
            className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition"
          >
            <IconCar size={24} className="text-gray-600 mx-auto mb-2" stroke={1.5} />
            <p className="text-gray-900 text-xs font-medium">Off-road buggy</p>
          </Link>
          <Link
            to="/products?category=Drift car"
            className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition"
          >
            <IconSteeringWheel size={24} className="text-gray-600 mx-auto mb-2" stroke={1.5} />
            <p className="text-gray-900 text-xs font-medium">Drift car</p>
          </Link>
          <Link
            to="/products?category=Monster Truck"
            className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition"
          >
            <IconTruck size={24} className="text-gray-600 mx-auto mb-2" stroke={1.5} />
            <p className="text-gray-900 text-xs font-medium">Monster truck</p>
          </Link>
          <Link
            to="/products?category=Rock Crawler"
            className="border border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition"
          >
            <IconMountain size={24} className="text-gray-600 mx-auto mb-2" stroke={1.5} />
            <p className="text-gray-900 text-xs font-medium">Rock crawler</p>
          </Link>
        </div>
      </section>

      {/* Grade comparison table */}
      <section className="px-8 pb-10">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Side by side</p>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Which grade is right for you?</h2>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-3 py-3">
            <div className="text-gray-400 text-xs uppercase tracking-wide">Feature</div>
            <div className="text-center text-gray-900 text-sm font-medium border-b-2 border-orange-600 pb-1 mx-auto">
              Toy grade
            </div>
            <div className="text-center text-gray-900 text-sm font-medium border-b-2 border-orange-600 pb-1 mx-auto">
              Hobby grade
            </div>
          </div>

          <div className="grid grid-cols-3 py-3 border-t border-gray-200 items-center">
            <div className="text-gray-400 text-xs uppercase">Price range</div>
            <div className="text-center text-gray-700 text-sm">$39 – $149</div>
            <div className="text-center text-gray-700 text-sm">$159 – $220+</div>
          </div>

          <div className="grid grid-cols-3 py-3 border-t border-gray-200 items-center">
            <div className="text-gray-400 text-xs uppercase">Top speed</div>
            <div className="text-center text-gray-700 text-sm">15 – 42 km/h</div>
            <div className="text-center text-gray-700 text-sm">45 – 70 km/h</div>
          </div>

          <div className="grid grid-cols-3 py-3 border-t border-gray-200 items-center">
            <div className="text-gray-400 text-xs uppercase">Drive type</div>
            <div className="text-center text-gray-700 text-sm">RWD / AWD</div>
            <div className="text-center text-gray-700 text-sm">4WD</div>
          </div>

          <div className="grid grid-cols-3 py-3 border-t border-gray-200 items-center">
            <div className="text-gray-400 text-xs uppercase">Upgradeable parts</div>
            <div className="flex justify-center">
              <IconX size={16} className="text-gray-300" />
            </div>
            <div className="flex justify-center">
              <IconCheck size={16} className="text-green-600" />
            </div>
          </div>

          <div className="grid grid-cols-3 py-3 border-t border-b border-gray-200 items-center">
            <div className="text-gray-400 text-xs uppercase">Battery</div>
            <div className="text-center text-gray-700 text-sm">3.7V – 7.4V LiPo</div>
            <div className="text-center text-gray-700 text-sm">7.4V – 11.1V LiPo</div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 px-8 py-8 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <IconTruckDelivery size={22} className="text-gray-600" stroke={1.5} />
          <div>
            <p className="text-gray-900 text-xs font-medium">Free shipping</p>
            <p className="text-gray-500 text-[11px]">On orders over $150</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconShieldCheck size={22} className="text-gray-600" stroke={1.5} />
          <div>
            <p className="text-gray-900 text-xs font-medium">Secure payments</p>
            <p className="text-gray-500 text-[11px]">Protected checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconRefresh size={22} className="text-gray-600" stroke={1.5} />
          <div>
            <p className="text-gray-900 text-xs font-medium">Easy returns</p>
            <p className="text-gray-500 text-[11px]">30-day hassle free</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconHeadset size={22} className="text-gray-600" stroke={1.5} />
          <div>
            <p className="text-gray-900 text-xs font-medium">Expert support</p>
            <p className="text-gray-500 text-[11px]">We're here to help</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;