import { HistoryItemProps } from "@/types";
import FadeInUp from "./animations/FadeInUp";

const HistoryItem: React.FC<HistoryItemProps> = ({ item, isSelected, onClick }) => (
    <FadeInUp key={item.id} delay={100}>
        <div
            onClick={onClick}
            className={`group backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500 ${isSelected ? 'ring-2 ring-orange-500 bg-black/40' : ''
                }`}
            tabIndex={0}
            role="button"
            aria-label={`View creation: ${item.prompt.substring(0, 30)}...`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden mb-4 shadow-inner">
                <img
                    src={item.imageUrl}
                    alt="Generated artwork"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="space-y-2">
                <p className="text-white font-medium truncate">
                    {item.prompt.substring(0, 60)}{item.prompt.length > 60 ? '...' : ''}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-orange-400 text-sm font-medium capitalize">
                        {item.style}
                    </span>
                    <span className="text-white/60 text-sm">
                        {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    </FadeInUp>
);

export default HistoryItem;