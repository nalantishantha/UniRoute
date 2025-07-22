import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, Mail, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function StudentProfile() {
  const { studentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const studentName = state?.studentName || "Student";

  const handleMessage = () => {
    navigate(`/uni-student/chat/${studentId}`, {
      state: { studentName },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{studentName}'s Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{studentName}</h2>
              <p className="text-neutral-grey">Student ID: {studentId}</p>
            </div>
            {/* <Button onClick={handleMessage}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Contact Information</h3>
              <div className="space-y-2 text-sm text-neutral-grey">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>student@university.edu</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Academic Information</h3>
              <div className="space-y-2 text-sm text-neutral-grey">
                <p>Major: Computer Science</p>
                <p>Year: 3rd Year</p>
                <p>GPA: 3.8/4.0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
