import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

                    {/* Brand Col */}
                    <div className="col-span-2 md:col-span-2 lg:col-span-1">
                        <Link href="/" className="text-xl font-sans font-bold tracking-wider text-white mb-6 block">
                            SHAANO<span className="text-primary">SHAUKAT</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                            Curating luxury living spaces with exquisite home decor, botanical accents, and timeless elegance.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-colors">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.042-3.441.217-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" /></svg>
                            </a>
                            <a href="#" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-colors">
                                <Facebook className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            <li><Link href="/shop/home-decor" className="text-gray-400 hover:text-primary transition-colors text-sm">Home Decor</Link></li>
                            <li><Link href="/shop/kitchen-dining" className="text-gray-400 hover:text-primary transition-colors text-sm">Kitchen & Dining</Link></li>
                            <li><Link href="/shop/home-textile" className="text-gray-400 hover:text-primary transition-colors text-sm">Textiles</Link></li>
                            <li><Link href="/shop/gift-collection" className="text-gray-400 hover:text-primary transition-colors text-sm">Gifts</Link></li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Help</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">Contact</Link></li>
                            <li><Link href="/shipping" className="text-gray-400 hover:text-primary transition-colors text-sm">Shipping</Link></li>
                            <li><Link href="/returns" className="text-gray-400 hover:text-primary transition-colors text-sm">Returns</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-primary transition-colors text-sm">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">About</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-primary transition-colors text-sm">Blog</Link></li>
                            <li><Link href="/careers" className="text-gray-400 hover:text-primary transition-colors text-sm">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">Design District, New Delhi</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">hello@shaanoshaukat.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} ShaanoShaukat. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
