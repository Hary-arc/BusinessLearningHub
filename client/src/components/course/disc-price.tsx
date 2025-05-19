// components/course/pricing-section.tsx
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";

export function PricingSection({ course }: { course: Course }) {
  const [referralCode, setReferralCode] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [referralError, setReferralError] = useState("");

  const validReferralCode = "SAVE05";
  const discountRate = 0.05; // 20%

  const originalPrice = course.originalPrice ?? course.price * 2;
  const isBaseDiscounted = course.price < originalPrice;

  const applyReferralCode = () => {
    if (referralCode.trim().toUpperCase() === validReferralCode) {
      const discounted = course.price * (1 - discountRate);
      setDiscountedPrice(discounted);
      setReferralApplied(true);
      setReferralError("");
    } else {
      setReferralApplied(false);
      setDiscountedPrice(null);
      setReferralError("❌ Invalid referral code.");
    }
  };

  const displayPrice = discountedPrice ?? course.price;
  const displayFormattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.currency || "USD",
  }).format(displayPrice);

  const formattedOriginalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: course.currency || "USD",
  }).format(originalPrice);

  const totalDiscountPercent = Math.round(
    ((originalPrice - displayPrice) / originalPrice) * 100
  );

  return (
    <div className="space-y-4">
      {/* Pricing Display */}
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-primary">{displayFormattedPrice}</div>
        {displayPrice < originalPrice && (
          <>
            <div className="text-gray-500 line-through text-lg">
              {formattedOriginalPrice}
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save {totalDiscountPercent}%
            </Badge>
          </>
        )}
      </div>

      {/* Referral Input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          disabled={referralApplied}
          className="max-w-xs"
        />
        <Button
          onClick={applyReferralCode}
          disabled={referralApplied || referralCode.trim().length < 3}
        >
          {referralApplied ? "Applied" : "Apply"}
        </Button>
      </div>

      {/* Feedback Message */}
      <div className="text-sm text-gray-500">
        {referralApplied && (
          <span>
            🎉 Referral code <strong>{referralCode}</strong> applied successfully!
          </span>
        )}
        {!referralApplied && referralError && (
          <span className="text-red-600">{referralError}</span>
        )}
      </div>

      {/* Promo Badge */}
      <Badge className="bg-red-100 text-red-700">🔥 Limited time offer</Badge>
    </div>
  );
}
