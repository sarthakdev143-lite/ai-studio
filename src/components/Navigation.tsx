import { Sparkles } from "lucide-react";
import FadeInUp from "@/components/animations/FadeInUp";

const Navigation: React.FC = () => (
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-lg bg-black/20 border-b border-white/10">
        <FadeInUp>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xl font-bold">AI Studio</span>
            </div>
        </FadeInUp>

        <FadeInUp delay={100}>
            <div className="hidden md:flex items-center gap-8 text-white/80">
                <a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1">Community</a>
                <a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1">Pricing</a>
                <a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1">Enterprise</a>
                <a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1">Learn</a>
                <a href="#" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1">Launched</a>
            </div>
        </FadeInUp>

        <FadeInUp delay={200}>
            <div className="flex items-center gap-4">
                <button
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="My Studio"
                >
                    <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-sm font-bold">
                        M
                    </div>
                </button>
                <span className="text-white/80 hidden md:block">My Studio</span>
            </div>
        </FadeInUp>
    </nav>
);

export default Navigation;