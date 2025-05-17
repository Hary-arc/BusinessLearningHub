
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

interface BatchViewProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timeSlot: string;
  venue: {
    name: string;
    address: string[];
    googleMapsUrl: string;
  };
  price: number;
  seatsLeft: number;
  prerequisites: string;
  coursesCount: number;
  timezone: string;
  onManageBatch?: () => void;
}

export function BatchView({
  title,
  description,
  startDate,
  endDate,
  timeSlot,
  venue,
  price,
  seatsLeft,
  prerequisites,
  coursesCount,
  timezone,
  onManageBatch
}: BatchViewProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{title}</CardTitle>
              <p className="text-sm text-gray-600">Join us for the in-person training.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">₹{price.toLocaleString()}</p>
              <p className="text-sm text-green-600">{seatsLeft} Seats Left</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {startDate} - {endDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {timeSlot}
            </div>
            <div className="text-gray-500">
              {timezone}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Venue</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-1" />
              <div>
                {venue.address.map((line, i) => (
                  <p key={i} className="text-sm">{line}</p>
                ))}
                <a
                  href={venue.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-1 inline-block"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">About {title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Prerequisites</h3>
            <p className="text-sm text-gray-600">{prerequisites}</p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">
              {coursesCount} {coursesCount === 1 ? 'Course' : 'Courses'}
            </div>
            {onManageBatch && (
              <div className="space-x-2">
                <Button variant="outline">Edit</Button>
                <Button onClick={onManageBatch}>Manage Batch</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
