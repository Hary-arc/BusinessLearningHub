// components/course/pricing-section.tsx
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";

export function PricingSection({ course }: { course: Course }) {
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const originalPrice = course.originalPrice ?? course.price * 2;
  const isDiscounted = course.price < originalPrice;
  const discountPercentage = Math.round(
    ((originalPrice - course.price) / originalPrice) * 100
  );

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.currency || "USD",
  }).format(course.price);

  const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.currency || "USD",
  }).format(originalPrice);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-primary">{formattedPrice}</div>
        {isDiscounted && (
          <div className="text-gray-500 line-through text-lg">
            {formattedOriginalPrice}
          </div>
        )}
        {isDiscounted && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save {discountPercentage}%
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          disabled={referralApplied}
          className="max-w-xs"
        />
        <Button
          onClick={() => setReferralApplied(true)}
          disabled={referralApplied || referralCode.length < 3}
        >
          {referralApplied ? "Applied" : "Apply"}
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        {referralApplied && (
          <span>
            🎉 Referral code <strong>{referralCode}</strong> applied successfully!
          </span>
        )}
      </div>

      <Badge className="bg-red-100 text-red-700">🔥 Limited time offer</Badge>
    </div>
  );
}
