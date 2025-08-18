import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AvailabilityManager from "../../components/MentorAvailability/AvailabilityManager";
import AvailableSlotBooking from "../../components/MentorAvailability/AvailableSlotBooking";
import { Users, Calendar } from "lucide-react";

const MentorAvailabilityTest = () => {
  const [activeView, setActiveView] = useState("mentor"); // "mentor" or "student"
  const [selectedMentorId] = useState(1); // Mock mentor ID for testing

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-neutral-black">
          Mentor Availability System
        </h1>
        <p className="text-neutral-grey">
          Test the new availability-based booking system
        </p>
      </div>

      {/* View Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>View Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={activeView === "mentor" ? "default" : "outline"}
              onClick={() => setActiveView("mentor")}
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Mentor View</span>
            </Button>
            <Button
              variant={activeView === "student" ? "default" : "outline"}
              onClick={() => setActiveView("student")}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Student View</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentor View - Availability Management */}
      {activeView === "mentor" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-900 mb-2">Mentor Dashboard</h2>
            <p className="text-blue-700 text-sm">
              Manage your availability slots. Students will only see and can book from your available time slots.
            </p>
          </div>
          <AvailabilityManager mentorId={selectedMentorId} />
        </div>
      )}

      {/* Student View - Available Slot Booking */}
      {activeView === "student" && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-900 mb-2">Student Booking</h2>
            <p className="text-green-700 text-sm">
              View available time slots and book sessions. Only available slots are shown with 24-hour advance notice required.
            </p>
          </div>
          <AvailableSlotBooking 
            mentorId={selectedMentorId}
            mentorName="Dr. John Smith"
            onBookingSuccess={(data) => {
              console.log("Booking successful:", data);
              alert("Booking request sent successfully!");
            }}
          />
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mentor View:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-grey">
              <li>Add availability slots for different days of the week</li>
              <li>Edit or delete existing slots</li>
              <li>Set recurring weekly availability</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Student View:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-grey">
              <li>View available time slots for the next 2 weeks</li>
              <li>Select a slot and fill out booking form</li>
              <li>Submit booking request (requires mentor approval)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-grey">
              <li>24-hour minimum advance booking</li>
              <li>2-week maximum booking window</li>
              <li>No overlapping availability slots</li>
              <li>Real-time availability updates</li>
              <li>Booking conflicts prevention</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorAvailabilityTest;
