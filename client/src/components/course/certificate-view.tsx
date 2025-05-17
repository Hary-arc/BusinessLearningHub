
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface CertificateViewProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  evaluatedBy: string;
  issuedBy: string;
  certificateId: string;
  onDownload: () => void;
  onShare: () => void;
}

export function CertificateView({
  studentName,
  courseName,
  completionDate,
  evaluatedBy,
  issuedBy,
  certificateId,
  onDownload,
  onShare
}: CertificateViewProps) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="relative overflow-hidden bg-white">
        <CardContent className="p-8">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>

          <div className="flex items-center mb-8">
            <img
              src="/your-logo.png"
              alt="School Logo"
              className="h-12 w-auto"
            />
            <div className="ml-auto">
              <img
                src="/certificate-badge.png"
                alt="Certificate Badge"
                className="h-16 w-auto"
              />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-6">Certificate of Completion</h1>
            <p className="text-lg mb-4">This is to certify that</p>
            <h2 className="text-2xl font-bold mb-4">{studentName}</h2>
            <p className="text-lg">
              has successfully completed the mandatory requirements prescribed by
              <br />
              {issuedBy} for the course <span className="font-semibold">{courseName}</span>
              <br />
              on {completionDate}
            </p>
          </div>

          <div className="flex justify-between mt-16 pt-8 border-t">
            <div>
              <p className="text-sm text-gray-600">Evaluated By</p>
              <p className="font-semibold">{evaluatedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Issued By</p>
              <p className="font-semibold">{issuedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Certificate ID</p>
              <p className="font-mono text-sm">{certificateId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
