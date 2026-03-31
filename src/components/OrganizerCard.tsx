
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrganizerCardProps {
  organizer: any;
  variant?: 'default' | 'compact' | 'featured';
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer, variant = 'default' }) => {
  const navigate = useNavigate();

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      business: 'bg-[#1da1f2]/20 text-[#1da1f2]',
      food: 'bg-[#ff6f00]/20 text-[#ff6f00]',
      social: 'bg-[#ff6f00]/20 text-[#ff6f00]',
      wedding: 'bg-[#c385ff]/20 text-[#c385ff]',
      other: 'bg-white/10 text-white/60',
    };
    return colors[specialty] || colors.other;
  };

  const safeNumber = (num: any) => {
    return num ? Number(num).toLocaleString() : "0";
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/organizers/${organizer._id}`)}
        className="glass-card rounded-xl overflow-hidden cursor-pointer card-hover group p-4"
      >
        <div className="flex items-center gap-4">
          <img
            src={organizer.image}
            alt={organizer.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold">{organizer.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/80 text-sm">{organizer.rating}</span>
              <span className="text-white/40 text-sm">({organizer.reviews})</span>
            </div>
            <div className="text-white/50 text-sm mt-1">
              {organizer.location}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        onClick={() => navigate(`/organizers/${organizer._id}`)}
        className="glass-card rounded-2xl overflow-hidden cursor-pointer card-hover group"
      >
        <div className="p-6">
          <img
            src={organizer.image}
            alt={organizer.name}
            className="w-24 h-24 rounded-full mx-auto"
          />

          <h3 className="text-xl text-white text-center mt-3">{organizer.name}</h3>

          <div className="text-center text-white/60 text-sm">
            {organizer.description}
          </div>

          <div className="flex justify-center gap-2 mt-3">
            {organizer.specialties?.slice(0, 3).map((s: string) => (
              <Badge key={s} className={getSpecialtyColor(s)}>
                {s}
              </Badge>
            ))}
          </div>

          <div className="text-center mt-4 text-white">
            ₹{safeNumber(organizer.price)}
          </div>

          <Button
            className="w-full mt-4"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/organizers/${organizer._id}/book`);
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/organizers/${organizer._id}`)}
      className="glass-card rounded-xl p-5 cursor-pointer"
    >
      <div className="flex gap-4">
        <img
          src={organizer.image}
          alt={organizer.name}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="text-white text-lg">{organizer.name}</h3>

          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white">{organizer.rating}</span>
            <span className="text-white/40">({organizer.reviews})</span>
          </div>

          <div className="text-white/50 text-sm mt-1">
            {organizer.location}
          </div>
        </div>
      </div>

      <p className="text-white/60 mt-3">
        {organizer.description}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {organizer.specialties?.slice(0, 3).map((s: string) => (
          <Badge key={s} className={getSpecialtyColor(s)}>
            {s}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-white">
          ₹{safeNumber(organizer.price)}
        </span>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/organizers/${organizer._id}/book`);
          }}
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default OrganizerCard;