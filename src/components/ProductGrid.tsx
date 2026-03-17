import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
    return (
        <section id="products" className="py-24 bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-sans text-white mb-4">
                            Curated <span className="italic text-primary">Collections</span>
                        </h2>
                        <p className="text-gray-400">
                            Explore our handpicked selection of premium decor designed to transform your living spaces into elegant sanctuaries.
                        </p>
                    </div>
                    <button className="hidden md:inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors border-b border-primary pb-1 self-end uppercase text-sm tracking-wider">
                        View All Products
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="inline-flex items-center font-medium text-primary hover:text-primary-dark transition-colors border-b border-primary pb-1 uppercase text-sm tracking-wider">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
}
