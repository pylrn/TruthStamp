import VerificationResultCard from "../components/verificationResultCard";
import { mockVerification } from "@/lib/mockData";

export default function ResultPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <VerificationResultCard result={mockVerification} />
    </div>
  );
}
