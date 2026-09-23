import { Link } from 'react-router-dom';
import {
  IconCar,
  IconEngine,
  IconSteeringWheel,
  IconTruck,
  IconMountain,
  IconArrowRight,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productServices';
import ProductCard from './ProductCard';

function Home() {
  const {data: products = []} = useQuery({
    queryKey : ['products'],
    queryFn : getProducts
  });

  const featuredProducts = [...products]
    .sort((a,b)=>b.rating - a.rating)
    .slice(0,8);

  return (
    <div className="bg-white">

      {/* HERO */}
      <section className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center px-5 sm:px-8 lg:px-12 py-16 sm:py-20 overflow-hidden">

        {/* Background image */}
        <img
          src="/images/RC-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-gray-900 mb-4">
            Chase<br />
            <span className="text-orange-600">the adrenaline</span>
          </h1>

          <p className="text-gray-700 text-sm sm:text-base max-w-xs sm:max-w-sm mb-6 leading-relaxed">
            Engineered for serious performance. Race-proven, adventure-ready.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-orange-600 text-white text-sm font-medium px-5 sm:px-6 py-3 rounded-md hover:bg-orange-700 transition"
          >
            Shop RC cars
            <IconArrowRight size={16} />
          </Link>

        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">

        <div className="flex items-end justify-between gap-3 sm:gap-4 mb-6">

          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900">
              Featured products
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top picks from our collection
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 whitespace-nowrap"
          >
            View all
          </Link>

        </div>

        <div
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{scrollbarWidth: 'none'}}
        >
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[190px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px] flex-shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </section>

      {/* SHOP BY GRADE */}
      <section className="px-5 sm:px-8 lg:px-12 pb-8 sm:pb-10">

        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
          Shop by grade
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Link
            to="/products?grade=toy"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-orange-300 transition"
          >
            <IconCar
              size={28}
              className="text-orange-600 shrink-0 sm:w-[30px] sm:h-[30px]"
              stroke={1.5}
            />

            <div className="min-w-0">
              <p className="text-gray-900 font-medium mb-0.5">
                Toy grade
              </p>

              <p className="text-gray-500 text-xs leading-relaxed">
                Ready to run, beginner friendly
              </p>
            </div>
          </Link>

          <Link
            to="/products?grade=hobby"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-orange-300 transition"
          >
            <IconEngine
              size={28}
              className="text-orange-600 shrink-0 sm:w-[30px] sm:h-[30px]"
              stroke={1.5}
            />

            <div className="min-w-0">
              <p className="text-gray-900 font-medium mb-0.5">
                Hobby grade
              </p>

              <p className="text-gray-500 text-xs leading-relaxed">
                Upgradeable, built for speed
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* SHOP BY TYPE */}
      <section className="px-5 sm:px-8 lg:px-12 pb-10">

        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
          Shop by type
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <Link
            to="/products?category=Off-Road Buggy"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 text-center hover:border-orange-300 transition"
          >
            <IconCar
              size={24}
              className="text-gray-600 mx-auto mb-2"
              stroke={1.5}
            />

            <p className="text-gray-900 text-xs sm:text-sm font-medium">
              Off-road buggy
            </p>
          </Link>

          <Link
            to="/products?category=Drift car"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 text-center hover:border-orange-300 transition"
          >
            <IconSteeringWheel
              size={24}
              className="text-gray-600 mx-auto mb-2"
              stroke={1.5}
            />

            <p className="text-gray-900 text-xs sm:text-sm font-medium">
              Drift car
            </p>
          </Link>

          <Link
            to="/products?category=Monster Truck"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 text-center hover:border-orange-300 transition"
          >
            <IconTruck
              size={24}
              className="text-gray-600 mx-auto mb-2"
              stroke={1.5}
            />

            <p className="text-gray-900 text-xs sm:text-sm font-medium">
              Monster truck
            </p>
          </Link>

          <Link
            to="/products?category=Rock Crawler"
            className="border border-gray-200 rounded-xl p-4 sm:p-5 text-center hover:border-orange-300 transition"
          >
            <IconMountain
              size={24}
              className="text-gray-600 mx-auto mb-2"
              stroke={1.5}
            />

            <p className="text-gray-900 text-xs sm:text-sm font-medium">
              Rock crawler
            </p>
          </Link>

        </div>
      </section>

      {/* GRADE COMPARISON TABLE */}
      <section className="px-5 sm:px-8 lg:px-12 pb-10">

        <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-4">
          Which grade is right for you?
        </h2>

        <div className="border border-gray-200 rounded-xl overflow-x-auto">

          <div className="min-w-[600px]">

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3">

              <div className="text-gray-700 text-xs uppercase tracking-wide">
                Feature
              </div>

              <div className="text-center text-gray-900 text-sm font-medium border-b-2 border-orange-600 pb-1 mx-auto">
                Toy grade
              </div>

              <div className="text-center text-gray-900 text-sm font-medium border-b-2 border-orange-600 pb-1 mx-auto">
                Hobby grade
              </div>

            </div>

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3 border-t border-gray-200 items-center">

              <div className="text-gray-700 text-xs uppercase">
                Price range
              </div>

              <div className="text-center text-gray-700 text-sm">
                ₹499 – ₹2999
              </div>

              <div className="text-center text-gray-700 text-sm">
                ₹3999 – ₹50000+
              </div>

            </div>

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3 border-t border-gray-200 items-center">

              <div className="text-gray-700 text-xs uppercase">
                Top speed
              </div>

              <div className="text-center text-gray-700 text-sm">
                15 – 42 km/h
              </div>

              <div className="text-center text-gray-700 text-sm">
                45 – 70 km/h
              </div>

            </div>

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3 border-t border-gray-200 items-center">

              <div className="text-gray-700 text-xs uppercase">
                Drive type
              </div>

              <div className="text-center text-gray-700 text-sm">
                2WD
              </div>

              <div className="text-center text-gray-700 text-sm">
                4WD/AWD
              </div>

            </div>

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3 border-t border-gray-200 items-center">

              <div className="text-gray-700 text-xs uppercase">
                Upgradeable parts
              </div>

              <div className="flex justify-center">
                <IconX size={16} className="text-red-500" />
              </div>

              <div className="flex justify-center">
                <IconCheck size={17} className="text-green-600" />
              </div>

            </div>

            <div className="grid grid-cols-3 py-3 px-2 sm:px-3 border-t border-b border-gray-200 items-center">

              <div className="text-gray-700 text-xs uppercase">
                Battery
              </div>

              <div className="text-center text-gray-700 text-sm">
                3.7V – 7.4V LiPo
              </div>

              <div className="text-center text-gray-700 text-sm">
                7.4V – 11.1V LiPo
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
